/**
 * @brief Add notes to the pinecone
 * @param notes {any} - The notes to be added
 * @param metadata {any} - Additional metadata for the notes
 * @return {Promise<jsonObject>} - Response from the server
 */
const handleAddNotes = async ({notes, metadata} : {notes: any, metadata: any}) => {
  try {
    const response = await fetch('/api/add-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes, metadata }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add notes:', error);
    throw error;
  }
};

/**
 * @brief query notes from pinecone
 * @param query {jsonObject} - messages
 * @return {jsonObject}
 */
const handleQueryNotes = async ({input, metadata}: {input: any, metadata: any}) => {
  try {
    const response = await fetch('/api/query-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, metadata }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add notes:', error);
    throw error;
  }
};
