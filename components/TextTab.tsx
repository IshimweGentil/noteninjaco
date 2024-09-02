import React from 'react';
import MagicButton from './ui/MagicButton';
import { ArrowRight } from 'lucide-react';

const TextTab = () => {
  const handleGenerate = () => {
    // Add your generation logic here
    console.log("Generate button clicked");
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-64 p-2 border-2 border-gray-600 border-dashed rounded-md bg-transparent"
        placeholder="Enter your text here..."
      />
      <div className="flex justify-start">
        <MagicButton
          title="Generate"
          icon={<ArrowRight size={16} />}
          position="right"
          onClick={handleGenerate}
        />
      </div>
    </div>
  );
};

export default TextTab;