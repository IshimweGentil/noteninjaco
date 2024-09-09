import React from "react";
import FileUploadArea from "./FileUploadArea";
import AudioTab from "./AudioTab";

interface TextTabProps {
  text: string;
  setText: (text: string) => void;
  AudioTab: any;
}

const TextTab: React.FC<TextTabProps> = ({ text, setText, AudioTab }) => {
  return (
    <div className="space-y-4 mb-2 relative">
      <div className="relative max-w-[1200px]">
        <textarea
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-64 p-2 border-2 border-gray-600 rounded-md bg-transparent"
          rows={15}
          value={text}
        />
        <AudioTab className="absolute bottom-4 right-4" text={text} setText={setText} />
      </div>
    </div>
  );
};

export default TextTab;
