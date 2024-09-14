"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AudioTab from "@/components/AudioTab";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { db } from '@/firebase';
import { writeBatch, doc, getDoc, collection } from 'firebase/firestore';
import MagicButton from '@/components/ui/MagicButton';
import { ArrowRight, Loader2 } from 'lucide-react';
import PreviewModal from '@/components/PreviewModal';
import SummaryPreviewModal from '@/components/SummaryPreviewModal';
import FileUploadArea from "@/components/FileUploadArea";
import TextTab from "@/components/TextTab";

interface Flashcard {
  front: string;
  back: string;
}

const GeneratePage = () => {
  const [text, setText] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isFlashcardLoading, setIsFlashcardLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryStreamUrl, setSummaryStreamUrl] = useState<string | null>(null);

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  const generateFlashcards = async () => {
    if (text.trim() === '') return;
    setIsFlashcardLoading(true);
    setError(null);
    console.log("Generating: flashcards");

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received flashcard data:", data);
      setFlashcards(data);
      setIsFlashcardModalOpen(true);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setFlashcards([]);
    } finally {
      setIsFlashcardLoading(false);
    }
  };

  const generateSummary = async () => {
    if (text.trim() === '') return;
    setIsSummaryLoading(true);
    setError(null);
    console.log("Generating: summary");

    try {
      // Instead of fetching the entire summary, we're just initiating the summarization process
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Set the stream URL for the SummaryPreviewModal
      setSummaryStreamUrl('/api/summarize');
      setIsSummaryModalOpen(true);
    } catch (error) {
      console.error("Error initiating summary generation:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setSummaryStreamUrl(null);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleSave = async (name: string, type: "flashcards" | "summary", content: any) => {
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
        alert('Set name already exists');
        return;
      } else {
        collections.push({ name, type });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name, type }] });
    }

    const colRef = collection(userDocRef, name);
    if (type === "flashcards") {
      content.forEach((flashcard: Flashcard) => {
        const cardDocRef = doc(colRef);
        batch.set(cardDocRef, flashcard);
      });
    } else {
      const summaryDocRef = doc(colRef, 'summary');
      batch.set(summaryDocRef, { content });
    }

    try {
      await batch.commit();
      console.log(`${type} saved successfully`);
      if (type === "flashcards") {
        setIsFlashcardModalOpen(false);
      } else {
        setIsSummaryModalOpen(false);
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred while saving');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-2">
        <h1 className="mb-4 font-bold text-xl">Welcome, {user.firstName || "User"}!</h1>
        <div>
          <TextTab text={text} setText={setText} AudioTab={AudioTab} />
          <div className="mt-4">
            <FileUploadArea setText={setText} />
          </div>
          <div className="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
            <MagicButton
              title={isFlashcardLoading ? "Generating..." : "Generate Flashcards"}
              icon={
                isFlashcardLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <ArrowRight size={16} />
                )
              }
              position="right"
              onClick={generateFlashcards}
              disabled={isFlashcardLoading || isSummaryLoading || text.trim() === ""}
              otherClasses="w-full sm:w-auto"
            />
            <MagicButton
              title={isSummaryLoading ? "Generating..." : "Generate Summary"}
              icon={
                isSummaryLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <ArrowRight size={16} />
                )
              }
              position="right"
              onClick={generateSummary}
              disabled={isFlashcardLoading || isSummaryLoading || text.trim() === ""}
              otherClasses="w-full sm:w-auto"
            />
          </div>

          <PreviewModal
            isOpen={isFlashcardModalOpen}
            onClose={() => setIsFlashcardModalOpen(false)}
            items={flashcards}
            onSave={(name) => handleSave(name, "flashcards", flashcards)}
            onRegenerate={generateFlashcards}
            isLoading={isFlashcardLoading}
            title="Flashcard Preview"
          />

          <SummaryPreviewModal
            isOpen={isSummaryModalOpen}
            onClose={() => setIsSummaryModalOpen(false)}
            onSave={(name, summary) => handleSave(name, "summary", summary)}
            onRegenerate={generateSummary}
            isLoading={isSummaryLoading}
            text={text}  // Pass the text to summarize here
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;