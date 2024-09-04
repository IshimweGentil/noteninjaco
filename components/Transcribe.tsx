import { useState, useEffect, useRef } from "react";
import { IconMicrophone } from "@tabler/icons-react";

interface FileUploadAreaProps {
  text: string;
  setText: (text: string) => void;
}

const Transcribe: React.FC<FileUploadAreaProps> = ({ text, setText }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };
          mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/wav",
            });
            audioChunksRef.current = [];
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);

            // send audio to the openai whiser API
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.wav");
            try {
              const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
              });
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const result = await response.json();
              setText(result.text || "Transcription failed");
              setError('');
            } catch (error) {
              console.error("Error:", error);
              setText("Error during transcription");
              setError("Failed to transcribe audio. Please try again.");
            }
          };
          mediaRecorderRef.current.start();
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
          setError(
            "Failed to access media devices. Please check your microphone."
          );
        });
    } else if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    // Cleanup function to stop recording and release resources
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [recording]);

  return (
    <div className="bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <h1 className="font-bold text-2xl mb-4">Live Audio Recording</h1>
      <button className="mt-4" onClick={() => setRecording(!recording)}>
        <IconMicrophone
          className={`${
            recording ? "bg-green-400" : ""
          } hover:bg-[#d6d6d6] border rounded-full border-black p-2 w-[3rem] h-[3rem]`}
        />
        {recording ? "Stop" : "Start"}
      </button>
      {audioURL && (
        <div className="mt-4">
          <button
            onClick={() => {
              const audio = new Audio(audioURL);
              audio.play();
            }}
          >
            Play Recording
          </button>
          <audio controls src={audioURL}></audio>
          {error && (
            <div role="alert" className="my-4 text-red-500">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="my-4">
        <h2>Transcription:</h2>
        <div>
          <textarea
            onChange={(e) => setText(e.target.value)}
            placeholder="Speech to text will be pasted here..."
            className="p-2 text-black bg-[#f1f1f1] w-full resize-none"
            rows={3}
            value={text}
          />
        </div>
      </div>
    </div>
  );
};

export default Transcribe;
