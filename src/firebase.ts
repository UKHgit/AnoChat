// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDwcvf8ihZXpiMiB9ZhjDwlRrnKcngyGZI",
  authDomain: "devchat-j88cn.firebaseapp.com",
  databaseURL: "https://devchat-j88cn-default-rtdb.firebaseio.com",
  projectId: "devchat-j88cn",
  storageBucket: "devchat-j88cn.firebasestorage.app",
  messagingSenderId: "468610856969",
  appId: "1:468610856969:web:b33c44828f7a5195c920d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
