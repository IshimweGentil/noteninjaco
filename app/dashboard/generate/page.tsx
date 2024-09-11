"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Tabs from "@/components/Tabs";
import FileTab from "@/components/FileTab";
import TextTab from "@/components/TextTab";
import AudioTab from "@/components/AudioTab";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { db } from "@/firebase";
import { writeBatch, doc, getDoc, collection } from "firebase/firestore";
import MagicButton from "@/components/ui/MagicButton";
import { ArrowRight, Loader2 } from "lucide-react";
import PreviewModal from "@/components/PreviewModal";
import SummaryPreviewModal from "@/components/SummaryPreviewModal";
import { getProjectNames } from '@/lib/firebaseUtil';
import { addNotesToPinecone } from "@/lib/pineconeUtil";


interface Flashcard {
  front: string;
  back: string;
}

interface Tab {
  id: string;
  label: string;
}

const GeneratePage = () => {
  const [text, setText] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("file");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [summary, setSummary] = useState("");
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isFlashcardLoading, setIsFlashcardLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState('')
  const [error, setError] = useState<string | null>(null);
  const [projectNames, setProjectNames] = useState<string[]>([])


  useEffect(() => {
    const getNames = async () => {
      try {
        if (user) {
          const names = await getProjectNames(user.id);
          setProjectNames(names);
        }
      } catch (error) {
        console.error("Error fetching project names:", error);
      }
    }
    getNames();
  }, []);

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  const tabs: Tab[] = [
    { id: "file", label: "Files" },
    { id: "text", label: "Text" },
    { id: "audio", label: "Audio" },
  ];

  const generateFlashcards = async () => {
    if (text.trim() === "") return;
    setIsFlashcardLoading(true);
    setError(null);
    console.log("Generating: flashcards");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
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
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setFlashcards([]);
    } finally {
      setIsFlashcardLoading(false);
    }
  };

  const generateSummary = async () => {
    if (text.trim() === "") return;
    setIsSummaryLoading(true);
    setError(null);
    console.log("Generating: summary");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received summary data:", data);
      if (!data.summary) {
        throw new Error("No summary received from API");
      }
      setSummary(data.summary);
      setIsSummaryModalOpen(true);
    } catch (error) {
      console.error("Error generating summary:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setSummary("");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleSave = async (name: string, type: "flashcards" | "summary") => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setProjectTitle(name);

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    // create/merge flashcards
    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      collections.push({ name, type });
      batch.set(userDocRef, { flashcards: collections }, { merge: true });
    } else {
      batch.set(userDocRef, { flashcards: [{ name, type }] });
    }

    // save flashcards/summary
    const colRef = collection(userDocRef, name);
    if (type === "flashcards") {
      flashcards.forEach((flashcard: Flashcard) => {
        const cardDocRef = doc(colRef);
        batch.set(cardDocRef, flashcard);
      });
    } else {
      const summaryDocRef = doc(colRef, "summary");
      batch.set(summaryDocRef, { content: summary }); // Save the summary as-is
    }

    try {
      await batch.commit(); // commit changes
      setIsFlashcardModalOpen(false);
      // await addNotesToPinecone({ user_id: user.id, project_id: projectTitle, text }); // add notes to pinecone
      console.log("saved notes into pinecone"); // TEST
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      setError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving"
      );
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
          <div className="flex justify-start space-x-4">
            <MagicButton
              title={
                isFlashcardLoading ? "Generating..." : "Generate Flashcards"
              }
              icon={
                isFlashcardLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <ArrowRight size={16} />
                )
              }
              position="right"
              onClick={generateFlashcards}
              disabled={
                isFlashcardLoading || isSummaryLoading || text.trim() === ""
              }
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
              disabled={
                isFlashcardLoading || isSummaryLoading || text.trim() === ""
              }
            />
          </div>

          <PreviewModal
            isOpen={isFlashcardModalOpen}
            onClose={() => setIsFlashcardModalOpen(false)}
            items={flashcards}
            onSave={(name) => handleSave(name, "flashcards")}
            onRegenerate={generateFlashcards}
            isLoading={isFlashcardLoading}
            title="Flashcard Preview"
            projectNames={projectNames}
          />

          <SummaryPreviewModal
            isOpen={isSummaryModalOpen}
            onClose={() => setIsSummaryModalOpen(false)}
            summary={summary}
            error={error}
            onSave={(name) => handleSave(name, "summary")}
            onRegenerate={generateSummary}
            isLoading={isSummaryLoading}
            projectNames={projectNames}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
