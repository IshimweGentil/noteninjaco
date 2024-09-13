interface PineconeProps {
  user_id: string;
  project_id: string;
  text: string;
}

export const addNotesToPinecone = async ({ user_id, project_id, text }: PineconeProps) => {
  const response = await fetch("/api/add-notes", {
    method: "POST",
    body: JSON.stringify({ user_id, project_id, text }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export const queryNotesFromPinecone = async ({data, project_id} : {data: any, project_id: string;}) => {
  const response = await fetch("/api/query-notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data, project_id }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}