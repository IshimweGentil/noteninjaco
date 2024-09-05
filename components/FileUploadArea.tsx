import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parsePDFs, filterFiles } from "@/lib/fileUtils";
import { IconClearAll, IconFileX } from "@tabler/icons-react";

interface FileUploadAreaProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ text, setText }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handlePDFs = async () => {
    try {
      setError("");
      const pdfs = filterFiles(files, "pdf");
      if (pdfs.length === 0) {
        setError("No PDF files selected.");
        return;
      }

      const pdfText = await parsePDFs(pdfs);
      console.log(pdfText);
      setText(prevText => prevText + pdfText);
    } catch (error) {
      console.error("Error processing PDFs:", error);
      setError("Failed to process PDFs. Please try again.");
    }
  };

  return (
    <div className="border-gray-600">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer flex items-center justify-center h-64 mb-4"
      >
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>

      {error && (
        <div className="text-red-500 mt-2">
          {error}
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
            {files.map((file) => (
              <li
                key={file.name}
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
            className="mt-4 mb-4 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handlePDFs}
            type="button"
          >
            Process PDFs
          </button>
        </>
      )}
    </div>
  );
};

export default FileUploadArea;
