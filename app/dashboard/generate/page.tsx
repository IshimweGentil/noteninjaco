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

const GeneratePage = () => {
  const [text, setText] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
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
    if (text.trim() === '') return;
    setIsSummaryLoading(true);
    setError(null);
    console.log("Generating: summary");

    try {
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
      setIsSummaryModalOpen(true);
    } catch (error) {
      console.error("Error initiating summary generation:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const generateQuiz = async () => {
    if (text.trim() === "") return;
    setIsQuizLoading(true);
    setError(null);
    console.log("Generating: quiz");

    try {
      const response = await fetch("/api/quiz", {
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
      console.log("Received quiz data:", data);
      console.log(data.quiz);
      if (!data) {
        throw new Error("No quiz received from API");
      }
      setQuiz(data);
      setIsQuizModalOpen(true); // Open the quiz modal
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleSave = async (name: string, type: "flashcards" | "summary" | "quiz", content: any) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    console.log(content);

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
    } else if (type === "summary") {
      const summaryDocRef = doc(colRef, 'summary');
      batch.set(summaryDocRef, { content });
    } else if (type === "quiz") {
      quiz.forEach((question: Question) => {
        const questionDocRef = doc(colRef);
        batch.set(questionDocRef, question);
      });
    }

    try {
      await batch.commit();
      console.log(`${type} saved successfully`);
      if (type === "flashcards") {
        setIsFlashcardModalOpen(false);
      } else if (type === "summary") {
        setIsSummaryModalOpen(false);
      } else if (type === "quiz") {
        setIsQuizModalOpen(false);
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred while saving');
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
              onClick={format === "quiz" ? generateQuiz : format === "summary" ? generateSummary : generateFlashcards}
              disabled={!text || !format || isFlashcardLoading || isSummaryLoading || isQuizLoading || text.trim() === ""}
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
            projectNames={projectNames}
          />

          <SummaryPreviewModal
            isOpen={isSummaryModalOpen}
            onClose={() => setIsSummaryModalOpen(false)}
            onSave={(name, summary) => handleSave(name, "summary", summary)}
            onRegenerate={generateSummary}
            isLoading={isSummaryLoading}
            onLoadingComplete={() => setIsSummaryLoading(false)}
            text={text}
          />

          <QuizPreviewModal
            isOpen={isQuizModalOpen}
            onClose={() => setIsQuizModalOpen(false)}
            quiz={quiz}
            onSave={(name) => handleSave(name, "quiz", quiz)}
            onRegenerate={() => generateQuiz}
            isLoading={isQuizLoading}
            projectNames={projectNames}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;