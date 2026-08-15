// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "orchestraai-238aa.firebaseapp.com",
  projectId: "orchestraai-238aa",
  storageBucket: "orchestraai-238aa.firebasestorage.app",
  messagingSenderId: "142289888732",
  appId: "1:142289888732:web:c088ee04c6433683e19b19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()