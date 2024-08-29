// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmB57Mxpn-iafP0V4YclNU79oDlFVEQ_M",
  authDomain: "noten-2e49f.firebaseapp.com",
  projectId: "noten-2e49f",
  storageBucket: "noten-2e49f.appspot.com",
  messagingSenderId: "691513418906",
  appId: "1:691513418906:web:43ad7027840d0d65b96b23",
  measurementId: "G-F4178CS7VQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);