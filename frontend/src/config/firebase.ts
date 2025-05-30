import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Replace with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyBIQUfsp965rGAgKPAWuv19MPRxNKLvHpA",
  authDomain: "research--chain.firebaseapp.com",
  projectId: "research--chain",
  storageBucket: "research--chain.firebasestorage.app",
  messagingSenderId: "524138438256",
  appId: "1:524138438256:web:c2043973926b8d884cdeb5",
  measurementId: "G-1J560E93DG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };