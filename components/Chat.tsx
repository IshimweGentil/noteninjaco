"use client";

import { useChat } from 'ai/react';
import { marked } from "marked";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { TextField, IconButton, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  closeChat: () => void;
}

export function Chat({ isVisible, setIsVisible, closeChat }: ChatProps) {
  const [persistentMessages, setPersistentMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am the AI Customer Support Agent at NoteNinja. How can I assist you today?",
    },
  ]);

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: "api/chat",
    onError: (e) => {
      console.log(e);
    },
    onFinish: (message) => {
      setPersistentMessages(prevMessages => [...prevMessages, message]);
    },
  });

  const chatRef = useRef<HTMLDivElement>(null);
  const [chatHeight, setChatHeight] = useState(250);

  useEffect(() => {
    setMessages(persistentMessages);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        closeChat();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.cursor = 'default';
    };
  }, [isVisible, closeChat]);

  useEffect(() => {
    const newHeight = Math.min(250 + persistentMessages.length * 40, 500);
    setChatHeight(newHeight);
  }, [persistentMessages]);

  const handleSubmitWrapper = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    handleSubmit(e as React.FormEvent<HTMLFormElement>);
    setPersistentMessages(prevMessages => [...prevMessages, { id: String(Date.now()), role: "user", content: input }]);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitWrapper();
    }
  };

  return (
    <div
      ref={chatRef}
      className={`fixed bottom-0 right-0 mb-4 mr-4 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-md bg-gray-600/30 border border-gray-900 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-500 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-full pointer-events-none'
      }`}
      style={{ height: `${chatHeight}px`, maxHeight: 'calc(100vh - 5rem)', cursor: 'default' }}
      onMouseEnter={() => { document.body.style.cursor = 'default'; }}
      onMouseLeave={() => { if (isVisible) document.body.style.cursor = 'pointer'; }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3">
          {persistentMessages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={index}
                className={`flex items-start mb-2 ${isUser ? 'justify-end' : 'justify-start'} transition-transform duration-300 hover:scale-105`}
              >
                {!isUser && (
                  <Avatar
                    alt="Assistant"
                    src={``}
                    className="mr-2 w-6 h-6 text-xs"
                  />
                )}
                <div
                  className={`${isUser ? 'bg-blue-500' : 'bg-gray-600'} text-white rounded-lg p-2 max-w-[75%] text-sm`}
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(message.content),
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-600 bg-gray-900 p-2 flex items-center">
          <TextField
            label="Type your message"
            fullWidth
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            className="mr-2 rounded text-sm"
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
          />
          <IconButton color="primary" onClick={() => handleSubmitWrapper()} size="small">
            <SendIcon fontSize="small" style={{ color: 'white' }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}