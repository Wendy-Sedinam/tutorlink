// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb7eK5XeLyaaAgqLsA2--V5DD-9pSEasI",
  authDomain: "mentorlink-f6lxr.firebaseapp.com",
  projectId: "mentorlink-f6lxr",
  storageBucket: "mentorlink-f6lxr.firebasestorage.app",
  messagingSenderId: "370269393345",
  appId: "1:370269393345:web:e6ee09f31a6c2d90859f40"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export { app };
