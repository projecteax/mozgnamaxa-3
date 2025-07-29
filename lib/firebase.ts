// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmgtFvYhSlBYOxryMGYzl_sQkEhx1A-S8",
  authDomain: "edusan-c0888.firebaseapp.com",
  projectId: "edusan-c0888",
  storageBucket: "edusan-c0888.firebasestorage.app",
  messagingSenderId: "1013167609315",
  appId: "1:1013167609315:web:5b0f8c85b3e00acd1efcd6",
  measurementId: "G-PXSJGM59W9",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
