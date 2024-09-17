"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AudioTab from "@/components/AudioTab";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { db } from "@/firebase";
import { writeBatch, doc, getDoc, collection } from "firebase/firestore";
import MagicButton from "@/components/ui/MagicButton";
import { ArrowRight, Loader2 } from "lucide-react";
import PreviewModal from "@/components/PreviewModal";
import SummaryPreviewModal from "@/components/SummaryPreviewModal";
import QuizPreviewModal from "@/components/QuizPreviewModal";
import { getProjectNames } from '@/utils/firebaseUtil';
import { Question } from '@/types/quiz';
import TextTab from "@/components/TextTab";
import FileUploadArea from "@/components/FileUploadArea";

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
  const [activeTab, setActiveTab] = useState("text");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isFlashcardLoading, setIsFlashcardLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [format, setFormat] = useState('');

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
    };
    getNames();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  const generateContent = async (endpoint: string, setData: React.Dispatch<React.SetStateAction<any>>, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (text.trim() === "") return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(`Error generating content:`, error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (name: string, type: "flashcards" | "summary" | "quiz") => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setProjectTitle(name);

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);

    try {
      const docSnap = await getDoc(userDocRef);

      // Create/merge flashcards
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        collections.push({ name, type });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      } else {
        batch.set(userDocRef, { flashcards: [{ name, type }] });
      }

      // Save flashcards/summary/quiz
      const colRef = collection(userDocRef, name);
      if (type === "flashcards") {
        flashcards.forEach((flashcard: Flashcard) => {
          const cardDocRef = doc(colRef);
          batch.set(cardDocRef, flashcard);
        });
      } else if (type === "summary") {
        const summaryDocRef = doc(colRef, "summary");
        batch.set(summaryDocRef, { content: summary });
      } else if (type === "quiz") {
        quiz.forEach((question: Question) => {
          const questionDocRef = doc(colRef); // Let Firestore generate a unique ID
          batch.set(questionDocRef, question);
        });
      }

      // Commit batch
      await batch.commit();

      // Close modals based on type
      if (type === "flashcards") {
        setIsFlashcardModalOpen(false);
      } else if (type === "summary") {
        setIsSummaryModalOpen(false);
      } else if (type === "quiz") {
        setIsQuizModalOpen(false);
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      setError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving"
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-2">
        <h1 className="mb-4 font-bold text-xl">Welcome, {user.firstName || "User"}!</h1>
        <div>
          <TextTab text={text} setText={setText} AudioTab={AudioTab} />
          <div className="flex flex-col gap-2">
            <label htmlFor="subject-format-select">Study Format:</label>
            <select
              className="p-1 w-fit text-black"
              name="subject-format"
              id="subject-format-select"
              value={format}
              onChange={handleChange}
            >
              <option value="" disabled>--Select format--</option>
              <option value="flashcards">Flashcards</option>
              <option value="summary">Summary</option>
              <option value="quiz">Quiz</option>
            </select>
            <FileUploadArea className="mt-2" setText={setText} />
          </div>
          <div className="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
            <MagicButton
              title={(isQuizLoading || isSummaryLoading || isFlashcardLoading) ? "Generating..." : `Generate ${format && (format[0].toUpperCase() + format.slice(1))}`}
              icon={(isQuizLoading || isSummaryLoading || isFlashcardLoading) ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
              position="right"
              onClick={() => {
                if (format === "quiz") return generateContent("/api/quiz", setQuiz, setIsQuizModalOpen, setIsQuizLoading);
                if (format === "flashcards") return generateContent("/api/generate", setFlashcards, setIsFlashcardModalOpen, setIsFlashcardLoading);
                if (format === "summary") return generateContent("/api/summarize", setSummary, setIsSummaryModalOpen, setIsSummaryLoading);
              }}
              disabled={!text || !format || isFlashcardLoading || isSummaryLoading || isQuizLoading || text.trim() === ""}
            />
          </div>

          <PreviewModal
            isOpen={isFlashcardModalOpen}
            onClose={() => setIsFlashcardModalOpen(false)}
            items={flashcards}
            onSave={(name) => handleSave(name, "flashcards")}
            onRegenerate={() => generateContent("/api/generate", setFlashcards, setIsFlashcardModalOpen, setIsFlashcardLoading)}
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
            onRegenerate={() => generateContent("/api/summarize", setSummary, setIsSummaryModalOpen, setIsSummaryLoading)}
            isLoading={isSummaryLoading}
            projectNames={projectNames}
          />

          <QuizPreviewModal
            isOpen={isQuizModalOpen}
            onClose={() => setIsQuizModalOpen(false)}
            quiz={quiz}
            onSave={(name) => handleSave(name, "quiz")}
            onRegenerate={() => generateContent("/api/quiz", setQuiz, setIsQuizModalOpen, setIsQuizLoading)}
            isLoading={isQuizLoading}
            projectNames={projectNames}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;