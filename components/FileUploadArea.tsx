import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parsePDFs, filterFiles } from "@/lib/fileUtils";
import { IconClearAll, IconFileX } from "@tabler/icons-react";

interface FileUploadAreaProps {
  text: string;
  setText: (text: string) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ text, setText }) => {
  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
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

      const text = await parsePDFs(pdfs);
      console.log(text);
      setText(text);
    } catch (error) {
      console.error("Error processing PDFs:", error);
      setError("Failed to process PDFs. Please try again.");
    }
  };

  return (
    <div
      className="border-gray-600"
      {...getRootProps()}
    >
<form
        // action={FormAction}
        className="my-4 max-w-[400px] w-full border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer flex items-center justify-center h-20"
        {...getRootProps()}
      >
        <p>Drag and drop some files here, or click to select files</p>
        <input name="file" {...getInputProps()} />
      </form>

      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <>
          <button
            className="flex mb-2 mt-4 cursor-pointer border rounded-lg py-1 px-2 border-white hover:opacity-[70%]"
            onClick={(e) => {
              e.preventDefault();
              setFiles([]);
            }}
          >
            <IconClearAll />
            {"Clear All"}
          </button>
          <ul className="flex flex-col border border-black-500 border-collapse">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex justify-between border border-black-500 p-2"
              >
                <p>{file.name}</p>
                <IconFileX
                  className="cursor-pointer hover:scale-105 hover:opacity-[70%]"
                  onClick={(e) => {
                    console.log("BEEP")
                    e.preventDefault();
                    setFiles((files) =>
                      files.filter((f) => f.name !== file.name)
                    );
                  }}
                />
              </li>
            ))}
          </ul>
          <button
            className="mt-2 mb-4 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handlePDFs}
            type="submit"
          >
            Process PDFs
          </button>
        </>
      )}
    </div>
  );
};

export default FileUploadArea;
