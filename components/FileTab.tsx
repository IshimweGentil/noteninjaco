import React from 'react';
import FileUploadArea from '@/components/FileUploadArea';

interface FileUploadAreaProps {
  text: string;
  setText: (text: string) => void;
}

const FileTab: React.FC<FileUploadAreaProps> = ({text, setText}) => {
  return (
    <FileUploadArea text={text} setText={setText} />
  );
};

export default FileTab;