import React from 'react';
import FileUploadArea from '@/components/FileUploadArea';

interface FileTabProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const FileTab: React.FC<FileTabProps> = ({text, setText}) => {
  return (
    <FileUploadArea text={text} setText={setText} />
  );
};

export default FileTab;