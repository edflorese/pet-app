// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adopt-59ac0.firebaseapp.com",
  projectId: "pet-adopt-59ac0",
  storageBucket: "pet-adopt-59ac0.firebasestorage.app",
  messagingSenderId: "271102880462",
  appId: "1:271102880462:web:bc540b2de049684158be9f",
  measurementId: "G-F0S1K6FE34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
//const analytics = getAnalytics(app);