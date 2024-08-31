import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploadArea = () => {
  const onDrop = (acceptedFiles: File[]) => {
    // Handle file upload here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="border-2 border-dashed border-gray-600  rounded-lg p-12 text-center cursor-pointer flex items-center justify-center h-64"
     {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default FileUploadArea;

