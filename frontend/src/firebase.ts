import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgKAL-qBfDDxqpasvxY1m8-wegPlD_tAE",
  authDomain: "research-chain.firebaseapp.com",
  projectId: "research-chain",
  storageBucket: "research-chain.firebasestorage.app",
  messagingSenderId: "195459638505",
  appId: "1:195459638505:web:a9e0e5f3fa7f95335cfc78",
  measurementId: "G-NY3SLF4B0B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
