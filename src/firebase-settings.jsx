// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6WLRg2IFA32JIpSKgJEU9EcSwWNrd5iE",
  authDomain: "chatapp-460d3.firebaseapp.com",
  projectId: "chatapp-460d3",
  storageBucket: "chatapp-460d3.appspot.com",
  messagingSenderId: "889500596154",
  appId: "1:889500596154:web:f348ce9e11486442fecf83",
  measurementId: "G-CSP1Y05X17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const data = getFirestore(app);
