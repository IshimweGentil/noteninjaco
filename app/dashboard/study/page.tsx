'use client'

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { HoverEffect, Card, CardTitle, CardDescription } from '@/components/ui/card-hover-effect';
import { Trash2 } from 'lucide-react';


interface FlashcardSet {
  name: string;
  type: string;
}

const StudyPage: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;
  
      try {
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          const collections = data.flashcards || [];
          setFlashcardSets(collections);
        } else {
          await setDoc(docRef, { flashcards: [], temp: null }); // Initialize with `temp`
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting document:", error);
        setIsLoading(false);
      }
    }
  
    getFlashcardSets();
  }, [user]);

  const handleDelete = async (setName: string) => {
    if (!user) return;
    const docRef = doc(collection(db, 'users'), user.id);
    await updateDoc(docRef, {
      flashcards: arrayRemove({ name: setName })
    });
    setFlashcardSets(prev => prev.filter(set => set.name !== setName));
  };

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const hoverEffectItems = flashcardSets.map(set => ({
    id: set.name, // Use the set name as a unique id
    title: set.name,
    description: `${set.name} ${set.type} set`,
    link: `/dashboard/study/${encodeURIComponent(set.name)}`
  }));

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl ">Your Flashcard Sets</h1>
      {flashcardSets.length === 0 ? (
        <p>You don&apos;t have any saved flashcard sets yet.</p>
      ) : (
        <HoverEffect items={hoverEffectItems} isLink={true}>
          {(item, index) => (
            <Card>
              <CardTitle className="flex justify-between items-center">
                <span>{item.title}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(item.title);
                  }}
                  className="p-2 text-blue-100 hover:text-red-700 transition-colors border border-gray-700 rounded-md"
                  aria-label="Delete flashcard set"
                >
                  <Trash2 size={20} />
                </button>
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>

            </Card>
          )}
        </HoverEffect>
      )}
    </div>
  );
};

export default StudyPage;