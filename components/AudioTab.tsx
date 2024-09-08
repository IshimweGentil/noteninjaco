import React, { useState, useEffect, useRef } from 'react';
import { IconMicrophone, IconPlayerPause } from "@tabler/icons-react";

interface AudioTabProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const AudioTab: React.FC<AudioTabProps> = ({ text, setText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isFirst, setIsFirst] = useState(true);

  const startRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript: string = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setText(prevText => prevText + transcript);
        } else {
          interimTranscript += + (!isFirst ? '. ' : '') + transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
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
      if (!isFirst) setText(text + '. ');
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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Live Audio Recording</h3>
        <button className="mt-2" onClick={handleToggleRecording}>
          {isRecording ? (
            <IconPlayerPause
              className="bg-green-400 hover:bg-red-400 border rounded-full border-black p-2 w-[3rem] h-[3rem]"
            />
          ) : (
            <IconMicrophone
              className="hover:bg-[#d6d6d6] border rounded-full bg-[rgba(204,204,204,0.3)] p-2 w-[3rem] h-[3rem]"
            />
          )}
          {isRecording ? "Stop" : "Start"}
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Transcription:</h3>
        <textarea
          onChange={(e) => setText(e.target.value)}
          placeholder="Speech to text will be pasted here..."
          className="w-full h-64 p-2 border-2 border-gray-600 border-dashed rounded-md bg-transparent"
          value={text}
        />
      </div>
      <div className="text-xs">NoteNinja may make mistakes.</div>
    </div>
  )
}

export default AudioTab;