// Filter files based on extension
export const filterFiles = (files: File[], fileExtensionName: string): File[] => {
  return files.filter((file) => file.name.toLowerCase().endsWith('.' + fileExtensionName));
}

// Read and parse a file
export const parsePDFs = async (files: File[]): Promise<string> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file-${index}`, file);
  });

  const response = await fetch('/api/pdf-parser', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload files');
  }

  const result = await response.json();
  const data = result.texts;
  console.log(data);
  return data;
}