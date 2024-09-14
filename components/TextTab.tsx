import React from "react";
import AudioTab from "./AudioTab";

interface TextTabProps {
  text: string;
  setText: (text: string) => void;
  AudioTab: any;
}

const TextTab: React.FC<TextTabProps> = ({ text, setText, AudioTab }) => {
  return (
    <div className="space-y-4 mb-2 relative">
      <div className="relative w-full max-w-[1200px]">
        <textarea
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-64 p-2 pb-12 border-2 border-gray-600 rounded-md bg-transparent resize-y"
          rows={15}
          value={text}
        />
        <div className="absolute bottom-2 right-2">
          <AudioTab text={text} setText={setText} />
        </div>
      </div>
    </div>
  );
};

export default TextTab;