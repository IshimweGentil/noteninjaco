import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

interface MessageProps {
  content: string | Promise<string>;
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ content, isUser }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const loadContent = async () => {
      if (typeof content === 'string') {
        setHtmlContent(content);
      } else {
        const resolvedContent = await content;
        setHtmlContent(resolvedContent);
      }
    };

    loadContent();
  }, [content]);

  return (
    <Box
      component="div"
      bgcolor={isUser ? "grey.500" : "grey.800"}
      color="white"
      borderRadius={16}
      p={2}
      maxWidth="80%"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default Message;
