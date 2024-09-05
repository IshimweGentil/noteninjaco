import React from "react";

interface TextTabProps {
  text: string;
  setText: (text: string) => void;
}

const TextTab: React.FC<TextTabProps> = ({ text, setText }) => {
  return (
    <div className="space-y-4 mb-2">
      <div>
        <textarea
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-64 p-2 border-2 border-gray-600 border-dashed rounded-md bg-transparent"
          rows={15}
          value={text}
        />
      </div>
    </div>
  );
};

export default TextTab;