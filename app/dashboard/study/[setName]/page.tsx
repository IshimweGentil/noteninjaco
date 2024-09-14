'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/firebase';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BackIcon from '@/components/ui/BackIcon';
import { HoverEffect, Card, CardTitle, CardDescription } from '@/components/ui/card-hover-effect';
import ChatButton from '@/components/ChatButton';
import { Chat } from '@/components/Chat';


interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex items-center justify-start h-10 border-b border-slate-700">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`py-2 px-4 focus:outline-none transition-colors duration-200 text-left ${
          activeTab === tab.id
            ? 'text-blue-100 border-b-2 border-blue-100'
            : 'text-gray-600 hover:text-blue-100'
        }`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface Summary {
  content: string;
}

const StudySetPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const params = useParams();
  const router = useRouter();
  const setName = decodeURIComponent(params.setName as string);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [setType, setSetType] = useState<'flashcards' | 'summary'>('flashcards');
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prevState => !prevState);
  }, []);
  
  const closeChat = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    async function getStudySet() {
      if (!user || !setName) return;
      try {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        const setInfo = userData?.flashcards.find((set: any) => set.name === setName);
        setSetType(setInfo?.type || 'flashcards');

        const colRef = collection(userDocRef, setName);
        if (setInfo?.type === 'summary') {
          const summaryDocRef = doc(colRef, 'summary');
          const summaryDocSnap = await getDoc(summaryDocRef);
          setSummary(summaryDocSnap.data() as Summary);
        } else {
          const docs = await getDocs(colRef);
          const fetchedFlashcards: Flashcard[] = docs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Flashcard));
          setFlashcards(fetchedFlashcards);
        }
      } catch (error) {
        console.error("Error fetching study set:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    }
    getStudySet();
  }, [user, setName]);

  const handleCardClick = useCallback((id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleNextCard = useCallback(() => {
    setCurrentCardIndex(prevIndex => (prevIndex + 1) % flashcards.length);
    setFlipped({});
  }, [flashcards.length]);

  const handlePrevCard = useCallback(() => {
    setCurrentCardIndex(prevIndex => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setFlipped({});
  }, [flashcards.length]);

  const formatSummary = (text: string) => {
    // Replace [important] tags with styled spans
    let formattedText = text.replace(
      /\[important\](.*?)\[\/important\]/g, 
      '<span class="bg-blue-100 text-black px-1 rounded font-semibold">$1</span>'
    );
  
    // Convert markdown-style headings to HTML headings with classes
    formattedText = formattedText.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-3 mb-1 text-blue-400">$1</h3>');
    formattedText = formattedText.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-blue-300">$1</h2>');
    formattedText = formattedText.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-5 mb-2 text-blue-200">$1</h1>');
  
    // Convert **bold** to <strong> tags
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
  
    // Convert line breaks to <br> tags
    formattedText = formattedText.replace(/\n/g, '<br>');
  
    return formattedText;
  };

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const tabs: Tab[] = setType === 'flashcards' 
    ? [
        { id: 'single', label: 'Single Card View' },
        { id: 'grid', label: 'Grid View' },
      ]
    : [];

  const renderGridView = () => {
    const hoverEffectItems = flashcards.map(flashcard => ({
      title: flashcard.front,
      description: flashcard.back,
      link: '#',
    }));

    

    return (
      <HoverEffect 
        items={hoverEffectItems} 
        className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        isLink={false}
      >
        {(item, index) => (
          <div 
            key={flashcards[index].id}
            onClick={() => handleCardClick(flashcards[index].id)}
            className="h-full w-full transition-transform duration-200 transform hover:scale-105 active:scale-95"
          >
            <Card className="h-full flex flex-col justify-between transition-all duration-300 ease-in-out cursor-pointer">
              <CardTitle className="flex-grow flex items-center text-center justify-center p-4">
                <span className={`transition-opacity duration-300 ${flipped[flashcards[index].id] ? 'opacity-0' : 'opacity-100'}`}>
                  {item.title}
                </span>
                <span className={`absolute transition-opacity duration-300 ${flipped[flashcards[index].id] ? 'opacity-100' : 'opacity-0'}`}>
                  {item.description}
                </span>
              </CardTitle>
              <CardDescription className="mt-4 text-center">
                {flipped[flashcards[index].id] ? "Click to see front" : "Click to see back"}
              </CardDescription>
            </Card>
          </div>
        )}
      </HoverEffect>
    );
  };

  const renderSingleCardView = () => (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-full max-w-md h-60 md:h-80 lg:h-72 cursor-pointer transition-transform duration-200 transform hover:scale-105 active:scale-95"
        onClick={() => handleCardClick(flashcards[currentCardIndex].id)}
      >
        <div className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${flipped[flashcards[currentCardIndex].id] ? '[transform:rotateY(180deg)]' : ''}`}>
          <div className="absolute w-full h-full [backface-visibility:hidden] border-2 border-gray-700 rounded-lg p-4 flex items-center justify-center">
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-center">
              {flashcards[currentCardIndex].front}
            </p>
          </div>
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-gray-700 rounded-lg p-4 flex items-center justify-center">
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-center">
              {flashcards[currentCardIndex].back}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full max-w-md mt-4">
        <button 
          onClick={handlePrevCard}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-900 transition-colors duration-200"
        >
          Previous
        </button>
        <span className="flex items-center">
          {currentCardIndex + 1} / {flashcards.length}
        </span>
        <button 
          onClick={handleNextCard}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-900 transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderSummaryView = () => (
    <div className="w-full mx-auto">
      <Card className="p-6">
        <CardTitle className="text-2xl font-bold mb-4">Summary</CardTitle>
        <CardDescription className="text-lg prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatSummary(summary?.content || '') }} />
        </CardDescription>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      {setType === 'flashcards' && (
        <div className="mb-2">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}
      <h1 className="text-2xl mt-4 font-bold mb-6">Studying: {setName}</h1>
      <div className="mt-6">
        {setType === 'flashcards' 
          ? (activeTab === 'grid' ? renderGridView() : renderSingleCardView())
          : renderSummaryView()
        }
      </div>
      <div className="mt-6">
        <div 
          className="text-blue-100 hover:underline flex items-center cursor-pointer transition-colors duration-200"
          onClick={() => router.push('/dashboard/study')}
        >
          <BackIcon className="h-5 w-5 mr-2" />
          Back to Flashcard Sets
        </div>
      </div>
      {/* <ChatButton onClick={toggleVisibility} isVisible={isVisible} />
      {isVisible && <Chat isVisible={isVisible} setIsVisible={setIsVisible} closeChat={closeChat} />} */}
    </div>
  );
};

export default StudySetPage;