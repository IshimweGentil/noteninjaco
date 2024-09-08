export const filterFiles = (files: File[], allowedExtensions: string[]): File[] => {
  return files.filter((file) => 
    allowedExtensions.some(ext => file.name.toLowerCase().endsWith(`.${ext}`))
  );
};

export const parseFiles = async (files: File[]): Promise<string> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file-${index}`, file);
  });

  try {
    const response = await fetch('/api/pdf-parser', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.text === undefined) {
      console.error('Unexpected server response:', result);
      throw new Error('Unexpected server response format');
    }

    if (result.text === '') {
      console.warn('Server returned empty text');
      return 'No text could be extracted from the file(s).';
    }

    return result.text;
  } catch (error) {
    console.error('Error in parseFiles:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to parse files: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while parsing files');
    }
  }
};