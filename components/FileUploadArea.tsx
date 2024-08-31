import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploadArea = () => {
  const onDrop = (acceptedFiles) => {
    // Handle file upload here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div 
      {...getRootProps()} 
      className="border-2 border-dashed border-gray-600  rounded-lg p-12 text-center cursor-pointer flex items-center justify-center h-64"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Click to add or drop file</p>
      )}
    </div>
  );
};

export default FileUploadArea;

const acceptedFIles = []