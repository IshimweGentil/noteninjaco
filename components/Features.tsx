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
      title: "Convert notes to flashcards",
      description: "Transform your notes into interactive flashcards for efficient studying.",
      icon: <IconNotes className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-2",
    },
    {
      title: "Efficient review system",
      description: "Optimize your learning with our spaced repetition review system.",
      icon: <IconClockHour4 className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-1",
    },
    {
      title: "Organize study material",
      description: "Keep your study materials structured and easily accessible.",
      icon: <IconFolders className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-1",
    },
    {
      title: "AI-powered learning insights",
      description: "Gain valuable insights into your study habits and progress with our AI analysis.",
      icon: <IconBrain className="h-4 w-4 text-blue-100" />,
      className: "md:col-span-2",
    },
  ];

  return (
    <section className="py-20 mb-10">
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