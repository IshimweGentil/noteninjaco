// components/ChatButton.tsx
'use client';

import React from 'react';
import { IconMessages } from '@tabler/icons-react';

interface ChatButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isVisible }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 w-16 h-16 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-md text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition duration-300 z-50 ${
        isVisible ? 'transform translate-y-20' : ''
      }`}
      aria-label="Chat"
    >
      <IconMessages size={28} />
    </button>
  );
};

export default ChatButton;

