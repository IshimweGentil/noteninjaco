import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconFileX, IconClearAll } from "@tabler/icons-react";

const FileUploadArea = ({setText}) => {
  const [files, setFiles] = useState<File[] | []>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((file) => {
      return [...file, ...acceptedFiles];
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="">
      <div
        className=" max-w-[400px] w-full border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer flex items-center justify-center h-20"
        {...getRootProps()}
      >
        <p>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Drag 'n' drop some files here, or click to select files
        </p>
        <input name="file" {...getInputProps()} />
      </div>

      {files && files.length > 0 ? (
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
                className="flex justify-between border border-black-500"
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
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FileUploadArea;
