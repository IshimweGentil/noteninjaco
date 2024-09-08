import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { filterFiles, parseFiles } from "@/lib/fileUtils";

interface FileUploadAreaProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ setText }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setError(null);
    setMessage(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

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
      console.log("Extracted text:", extractedText);
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
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer p-4 text-center ${isDragActive ? 'bg-blue-100' : ''}`}
      >
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop the files here..." : "Drag and drop some files here, or click to select files"}</p>
      </div>

      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}

      {message && (
        <div className="text-green-500 mt-2">
          {message}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Selected Files:</h3>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>{file.name}</li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            onClick={handleFiles}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Process Files"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;