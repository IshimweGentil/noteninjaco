// Filter files based on extension
export const filterFiles = (files: File[], fileExtensionName: string): File[] => {
  return files.filter((file) => file.name.toLowerCase().endsWith('.' + fileExtensionName));
}

// Read and parse a file
export const parsePDFs = async (files: File[]): Promise<string[]> => {
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
      const errorText = await response.text();
      throw new Error(`Failed to upload files: ${response.status} ${response.statusText}. Server response: ${errorText}`);
    }

    const result = await response.json();
    console.log('Server response:', result);

    if (!result.texts) {
      throw new Error('Unexpected server response format');
    }

    return result.texts;
  } catch (error) {
    console.error('Error in parsePDFs:', error);
    throw error;
  }
}