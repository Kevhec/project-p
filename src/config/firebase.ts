// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrH6nqTzyuYU0LDLTmdBnisbMqdAiZoy4",
  authDomain: "project-p-k.firebaseapp.com",
  projectId: "project-p-k",
  storageBucket: "project-p-k.firebasestorage.app",
  messagingSenderId: "963041889345",
  appId: "1:963041889345:web:e5b6660fa8038fa3460ac0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Setup auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginPopUp = () => signInWithPopup(auth, provider);

export {
  app,
  auth,
  provider,
  loginPopUp
};