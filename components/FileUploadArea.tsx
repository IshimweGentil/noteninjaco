import React, { useState, useRef } from "react";
import { filterFiles, parseFiles } from "@/utils/fileUtil";
import { IconClearAll, IconFileX, IconFile } from "@tabler/icons-react";

interface FileUploadAreaProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ setText, className }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files!)]);
      setError(null);
      setMessage(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = async () => {
    setError(null);
    setMessage(null);
    setIsLoading(true);
    
    try {
      const supportedFiles = filterFiles(files, ["pdf", "docx"]);
      if (supportedFiles.length === 0) {
        setError("No supported files selected. Please upload PDF or DOCX files.");
        return;
      }

      const extractedText = await parseFiles(supportedFiles);
      if (extractedText === 'No text could be extracted from the file(s).') {
        setMessage(extractedText);
      } else {
        setText(prevText => prevText + extractedText);
        setMessage("Text successfully extracted and added.");
      }
      setFiles([]);  // Clear the files after processing
    } catch (error) {
      console.error("Error processing files:", error);
      if (error instanceof Error) {
        setError(`Failed to process files: ${error.message}`);
      } else {
        setError('An unknown error occurred while processing files');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`border-gray-600 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        multiple
        className="hidden"
      />
      <button
        onClick={handleUploadClick}
        className="inline-flex h-12 w-full sm:w-60 items-center justify-center rounded-lg border border-gray-600 text-sm font-medium text-white gap-2 hover:bg-gray-800 transition-colors"
      >
        Upload File
        <IconFile size={24} strokeWidth={1} />
      </button>

      {error && (
        <div className="text-red-500 mt-2 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="text-green-500 mt-2 text-sm">
          {message}
        </div>
      )}

      {files.length > 0 && (
        <>
          <button
            className="flex mb-2 mt-4 cursor-pointer border rounded-lg py-1 px-2 border-gray-700 hover:bg-gray-900 text-xs"
            onClick={() => setFiles([])}
          >
            <IconClearAll size={16} />
            <span className="ml-2">Clear All</span>
          </button>
          <ul className="flex flex-col border border-gray-600 bg-gray-800 rounded-lg overflow-hidden">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex justify-between items-center border-b border-gray-500 last:border-b-0 p-2"
              >
                <p className="text-sm truncate">{file.name}</p>
                <IconFileX
                  className="cursor-pointer hover:scale-105 hover:opacity-70"
                  size={16}
                  onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
                />
              </li>
            ))}
          </ul>
          <button
            className="mt-4 mb-4 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 text-sm w-full sm:w-auto"
            onClick={handleFiles}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Process Files"}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUploadArea;