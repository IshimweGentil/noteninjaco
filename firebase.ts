import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAMo2HF6JzwfUlIqpZ3qicHovKoU_G5m9U",
  authDomain: "notenin-28a89.firebaseapp.com",
  projectId: "notenin-28a89",
  storageBucket: "notenin-28a89.appspot.com",
  messagingSenderId: "528481083965",
  appId: "1:528481083965:web:734c649ef3495be62e8054",
  measurementId: "G-S2THECP7XG"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }