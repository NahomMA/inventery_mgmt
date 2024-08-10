// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGyMB0inlRQKiaXHiETaoSfrH5CKzs88s",
  authDomain: "inventory-mgmt-35747.firebaseapp.com",
  projectId: "inventory-mgmt-35747",
  storageBucket: "inventory-mgmt-35747.appspot.com",
  messagingSenderId: "1001229485119",
  appId: "1:1001229485119:web:d9b5ed9b7063f30a19648a",
  measurementId: "G-9L8JXTLK8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db }; // Export the Firestore instance