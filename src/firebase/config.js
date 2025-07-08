import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5TPBX1bgr-VyE_rSILePnO9IEd9tiBpo",
  authDomain: "bulletbaseai.firebaseapp.com",
  projectId: "bulletbaseai",
  storageBucket: "bulletbaseai.firebasestorage.app",
  messagingSenderId: "169372050748",
  appId: "1:169372050748:web:fb9b5cb0664b5243fc2a39",
  measurementId: "G-WMWWYM1BHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
