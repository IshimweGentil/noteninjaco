import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { filterFiles, parseFiles } from "@/utils/fileUtil";
import { IconClearAll, IconFileX } from "@tabler/icons-react";

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
    <div className="border-gray-600">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer flex items-center justify-center h-64 mb-4"
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
        <>
          <button
            className="flex mb-2 mt-4 cursor-pointer border rounded-lg py-1 px-2 border-white hover:opacity-70"
            onClick={(e) => {
              e.preventDefault();
              setFiles([]);
            }}
          >
            <IconClearAll />
            <span className="ml-2">Clear All</span>
          </button>
          <ul className="flex flex-col border border-gray-500 rounded-lg overflow-hidden">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex justify-between items-center border-b border-gray-500 last:border-b-0 p-2"
              >
                <p>{file.name}</p>
                <IconFileX
                  className="cursor-pointer hover:scale-105 hover:opacity-70"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles((files) =>
                      files.filter((f) => f.name !== file.name)
                    );
                  }}
                />
              </li>
            ))}
          </ul>
          <button
            className="mt-4 mb-4 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
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