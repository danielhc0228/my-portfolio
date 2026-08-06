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
// ponytail: no App Check, so this config being public means anyone can call the
// AI Logic endpoint on this project. Harmless on the Spark plan (free tier is a
// hard cap, worst case is quota exhaustion). MUST add App Check with a
// reCAPTCHA v3 provider before upgrading to Blaze, where that becomes a bill.
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
