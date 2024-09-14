import React, { useState, useEffect, useRef } from "react";
import { IconMicrophone, IconPlayerPause } from "@tabler/icons-react";

interface AudioTabProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const AudioTab: React.FC<AudioTabProps> = ({ text, setText, className }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isFirst, setIsFirst] = useState(true);

  const startRecording = () => {
    if (text === "") setIsFirst(true);
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript: string = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setText((prevText) => prevText + transcript);
        } else {
          interimTranscript += +(!isFirst ? ". " : "") + transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (isFirst) setIsFirst(false);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (text) setText(text + ". ");
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <button className={`${className} mt-2`} onClick={handleToggleRecording}>
      {isRecording ? (
        <IconPlayerPause className="bg-green-400 hover:bg-red-400 border rounded-full border-black p-2 w-[3rem] h-[3rem]" />
      ) : (
        <IconMicrophone className="hover:bg-slate-900 border border-slate-500 rounded-full bg-slate-950/50 backdrop-blur-md p-2 w-[3rem] h-[3rem]" />
      )}
    </button>
  );
};

export default AudioTab;
