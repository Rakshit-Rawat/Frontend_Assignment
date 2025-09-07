// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDms4WPJZwXGTPYwlK9NgrVIw_jx1Kl-0A",
  authDomain: "web-dev-730c9.firebaseapp.com",
  projectId: "web-dev-730c9",
  storageBucket: "web-dev-730c9.firebasestorage.app",
  messagingSenderId: "902176345951",
  appId: "1:902176345951:web:4a76c0d174f6603b1f70ea",
  measurementId: "G-YV9ZQWXVVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);