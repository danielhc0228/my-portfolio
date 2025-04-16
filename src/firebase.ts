// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEj66kwv8jXcnML2LZ6OkJYtGKfeKzUGY",
    authDomain: "dchungs-portfolio.firebaseapp.com",
    projectId: "dchungs-portfolio",
    storageBucket: "dchungs-portfolio.firebasestorage.app",
    messagingSenderId: "824610893862",
    appId: "1:824610893862:web:a7e10362fcc0178ef7b6e7",
    measurementId: "G-KZCL9Q0ZW5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
