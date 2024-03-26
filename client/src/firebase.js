// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-auth-90f45.firebaseapp.com",
    projectId: "mern-auth-90f45",
    storageBucket: "mern-auth-90f45.appspot.com",
    messagingSenderId: "140372837179",
    appId: "1:140372837179:web:c9c7afccf01edbf085ad1e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//https://console.firebase.google.com/u/0/project/mern-auth-90f45/authentication/settings