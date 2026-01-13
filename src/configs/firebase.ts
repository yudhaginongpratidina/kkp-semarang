import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCU2sZvTs1QkUZUu8d8Lydy02CLJufJY2s",
    authDomain: "belajar-firebase-519e7.firebaseapp.com",
    projectId: "belajar-firebase-519e7",
    storageBucket: "belajar-firebase-519e7.firebasestorage.app",
    messagingSenderId: "568448456916",
    appId: "1:568448456916:web:c3e9aeadc932bd18914341",
    measurementId: "G-RWG2G1E1KE",
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
