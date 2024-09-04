import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase';
import { writeBatch, doc, getDoc, collection } from 'firebase/firestore';
import MagicButton from './ui/MagicButton';
import { ArrowRight, Loader2 } from 'lucide-react';
import PreviewModal from './PreviewModal';

interface Flashcard {
  front: string;
  back: string;
}

const TextTab: React.FC = () => {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (text.trim() === '') return; // Prevent generation if input is empty
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setFlashcards(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (name: string) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f: any) => f.name === name)) {
        alert('Flashcard set already exists');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard: Flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    try {
      await batch.commit();
      console.log('Flashcards saved successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving flashcards:', error);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-64 p-2 border-2 border-gray-600 border-dashed rounded-md bg-transparent"
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-start">
        <MagicButton
          title={isLoading ? "Generating..." : "Generate"}
          icon={isLoading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
          position="right"
          onClick={handleGenerate}
          disabled={isLoading || text.trim() === ''}
        />
      </div>

      <PreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={flashcards}
        onSave={handleSave}
        onRegenerate={handleGenerate}
        isLoading={isLoading}
        title="Flashcard Preview"
      />
    </div>
  );
};

export default TextTab;