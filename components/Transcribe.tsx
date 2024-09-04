// app/page.js

import { useState, useEffect, useRef } from 'react';
import { IconMicrophone } from "@tabler/icons-react"

interface FileUploadAreaProps {
  setText: (text: string) => void;
}

const Transcribe: React.FC<FileUploadAreaProps> = ({ setText }) => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (recording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };
          mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            audioChunksRef.current = [];
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);

            // Send audio to the API
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');
            try {
              const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
              });
              const result = await response.json();
              setTranscription(result.text);
            } catch (error) {
              console.error('Error:', error);
            }
          };
          mediaRecorderRef.current.start();
        })
        .catch(error => console.error('Error accessing media devices.', error));
    } else if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, [recording]);

  return (
    <div className="bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <h1 className="font-bold text-2xl md-4">Live Audio Recording</h1>
      <button className="mt-4" onClick={() => setRecording(!recording)}>
        <IconMicrophone className={`${recording ? "bg-green-400" : ""} hover:bg-[#d6d6d6] border rounded-full border-black p-2 w-[3rem] h-[3rem]`} />
        {recording ? 'Stop' : 'Start'}
      </button>
      {audioURL && (
        <div className="mt-4">
          <button onClick={() => {
            const audio = new Audio(audioURL);
            audio.play();
          }}>
            Play Recording
          </button>
          <audio controls src={audioURL}></audio>
        </div>
      )}
      <div className="my-4">
        <h2>Transcription:</h2>
        <div>
        <textarea placeholder="Speech to text will be pasted here..." className="p-2 text-black bg-[#f1f1f1] w-full resize-none" rows={3}>{transcription}</textarea>
        </div>
      </div>
    </div>
  );
}

export default Transcribe;