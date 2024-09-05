"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Tabs from "@/components/Tabs";
import FileTab from "@/components/FileTab";
import TextTab from "@/components/TextTab";
import AudioTab from "@/components/AudioTab";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { db } from '@/firebase';
import { writeBatch, doc, getDoc, collection } from 'firebase/firestore';
import MagicButton from '@/components/ui/MagicButton';
import { ArrowRight, Loader2 } from 'lucide-react';
import PreviewModal from '@/components/PreviewModal';

interface Flashcard {
  front: string;
  back: string;
}

const GeneratePage = () => {
  const [text, setText] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("file");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: "file", label: "Files" },
    { id: "text", label: "Text" },
    { id: "audio", label: "Audio" },
  ];

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
    <div className="flex flex-col min-h-screen">
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-4">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
      <div className="flex-grow container mx-auto px-4 py-6">
        <h1 className="mb-2">Welcome, {user.firstName || "User"}!</h1>
        <div className="mt-2">
          {activeTab === "file" && <FileTab text={text} setText={setText} />}
          {activeTab === "text" && <TextTab text={text} setText={setText} />}
          {activeTab === "audio" && <AudioTab text={text} setText={setText} />}
        </div>
        <div>
          <div className="flex justify-start">
            <MagicButton
              title={isLoading ? "Generating..." : "Generate"}
              icon={
                isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <ArrowRight size={16} />
                )
              }
              position="right"
              onClick={handleGenerate}
              disabled={isLoading || text.trim() === ""}
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
      </div>
    </div>
  );
};

export default GeneratePage;
