import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";
import {
  IconNotes,
  IconClockHour4,
  IconFolders,
  IconBrain,
} from "@tabler/icons-react";

const Features = () => {
  const featureItems = [
    {
      title: "Convert Your Notes Effortlessly",
      description: "Upload your documents, PowerPoints, or lecture notes, and let NoteNinja do the rest. We’ll break down your content into easily digestible formats tailored for effective study sessions.",
      icon: <IconNotes className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-2",
    },
    {
      title: "Study Anywhere, Anytime",
      description: "Your study tools are always at your fingertips. Access your personalized flashcards and summaries from any device, and make the most of your study time no matter where you are.",
      icon: <IconClockHour4 className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-1",
    },
    {
      title: "Smart Flashcard Generator",
      description: "Create flashcards automatically from your notes, documents, or transcribed audio. Our AI identifies essential information and formats it into flashcards, making it easier to memorize crucial details.",
      icon: <IconFolders className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-1",
    },
    {
      title: "Voice-to-Notes Transcription",
      description: "No time to jot down notes during lectures? Use our voice transcriber to capture everything. Simply record your lectures or discussions, and NoteNinja will convert them into neatly organized notes, ready for review.",
      icon: <IconBrain className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-2",
    },
  ];

  return (
    <section id="features" className="py-20 mb-10">
      <h2 className="text-3xl font-bold text-blue-100 text-center mb-12">Key Features</h2>
      <BentoGrid className="max-w-4xl mx-auto ">
        {featureItems.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            icon={item.icon}
            className={cn(item.className)}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Features;