'use client'

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Flashcard {
  front: string;
  back: string;
}

const StudySetPage: React.FC = () => {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const setName = params.setName as string;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && setName) {
      fetchFlashcards();
    }
  }, [user, setName]);

  const fetchFlashcards = async () => {
    if (!user || !setName) return;

    try {
      const flashcardsRef = collection(doc(collection(db, 'users'), user.id), setName);
      const querySnapshot = await getDocs(flashcardsRef);
      const fetchedFlashcards: Flashcard[] = [];
      querySnapshot.forEach((doc) => {
        fetchedFlashcards.push(doc.data() as Flashcard);
      });
      setFlashcards(fetchedFlashcards);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center mt-8">
        <p>No flashcards found for this set.</p>
        <Link href="/dashboard/study">
          <span className="text-blue-500 hover:underline cursor-pointer">Back to Sets</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Studying: {setName}</h1>
      <div className="mb-4">
        <div
          className="bg-white shadow-md rounded-lg p-8 h-64 flex items-center justify-center cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <p className="text-2xl font-semibold text-center">
            {isFlipped ? flashcards[currentIndex].back : flashcards[currentIndex].front}
          </p>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-lg">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
      <Link href="/dashboard/study">
        <span className="text-blue-500 hover:underline cursor-pointer">Back to Sets</span>
      </Link>
    </div>
  );
};

export default StudySetPage;