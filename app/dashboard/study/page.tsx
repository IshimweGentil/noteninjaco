'use client'

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { HoverEffect } from '@/components/ui/card-hover-effect';

interface FlashcardSet {
  name: string;
}

const StudyPage: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcardSets(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
      setIsLoading(false);
    }
    getFlashcardSets();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const hoverEffectItems = flashcardSets.map(set => ({
    title: set.name,
    description: `${set.name} flashcard set`,
    link: `/dashboard/study/${encodeURIComponent(set.name)}`
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl">Your Flashcard Sets</h1>
      {flashcardSets.length === 0 ? (
        <p>You don't have any saved flashcard sets yet.</p>
      ) : (
        <HoverEffect items={hoverEffectItems} isLink={true} />
      )}
    </div>
  );
};

export default StudyPage;