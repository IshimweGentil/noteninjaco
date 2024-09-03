"use client"

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconFileX, IconClearAll } from "@tabler/icons-react";
import { parsePDFs, filterFiles } from "@/lib/fileUtils";
// import { useFormState, useFormStatus } from "react-dom";


interface FileUploadAreaProps {
  setText: (text: string) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ setText }) => {
  // const FormSubmit = async (prevState: any, formData: any) => {
  //   const res = await fetch('/api/pdf-parser', {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     body: formData,
  //   });
  //   const data = await res.json();
  //   console.log(data);
  //   setText(data.text);
  // }

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  // const [state, FormAction] = useFormState(FormSubmit, '');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  // const { pending } = useFormStatus();

  const handlePDFs = async () => {
    try {
      setError('');
      const pdfs = filterFiles(files, "pdf");
      if (pdfs.length === 0) {
        setError("No PDF files selected.");
        return;
      }

      const texts = await parsePDFs(pdfs);
      console.log(texts);
      setText(texts);
    } catch (error) {
      console.error("Error processing PDFs:", error);
      setError("Failed to process PDFs. Please try again.");
    }
  };

  return (
    <div>
      <form
        // action={FormAction}
        className="max-w-[400px] w-full border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer flex items-center justify-center h-20"
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
            className="mt-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setFiles([]);
            }}
          >
            <IconClearAll />
          </button>
          <ul className="flex flex-col border border-black-500 border-collapse">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex justify-between border border-black-500 p-2"
              >
                <p>{file.name}</p>
                <IconFileX
                  className="cursor-pointer"
                  onClick={(e) => {
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
            className="mt-4 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
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