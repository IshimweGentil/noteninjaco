import { useState, useEffect, useRef } from "react";
import { IconMicrophone, IconPlayerPause } from "@tabler/icons-react";

interface FileUploadAreaProps {
  text: string;
  setText: (text: string) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

/**
 * @ref https://www.youtube.com/watch?v=Q0ZqRIRqcGo - implementing SpeechRecognition feature
 */
const TextTab: React.FC<FileUploadAreaProps> = ({ text, setText }) => {
  const [isRecording, setIsRecording] = useState(false);

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  // Function to start recording
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
          setText((prevText) => prevText.concat(transcript));
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current.start();
  };

  // cleans effect when the component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // toggle recording
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="">
      <h1 className="font-bold text-2xl mb-4">Live Audio Recording</h1>
      <button className="mt-4" onClick={handleToggleRecording}>
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

      <div className="my-4">
        <h2>Transcription:</h2>
        <div className="bg-[rgba(204,204,204,0.3)]">
          <textarea
            onChange={(e) => setText(e.target.value)}
            placeholder="Speech to text will be pasted here..."
            className="p-2 text-opacity-100 bg-transparent w-full resize-none"
            rows={15}
            value={text || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default TextTab;