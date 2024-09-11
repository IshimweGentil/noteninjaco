import {db} from "@/firebase";
import { doc, collection, getDoc } from "firebase/firestore";


export const getProjectNames = async (user_id: string) => {
  if (!user_id) {
    throw new Error("User ID is required");
  }
  const userDocRef = doc(collection(db, 'users'), user_id);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const collections = docSnap.data().flashcards || [];
    const names = collections.map((collection: any) => collection.name);
    return names
  }
  return []
};