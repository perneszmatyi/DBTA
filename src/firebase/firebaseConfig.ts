import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';


const firebaseConfig = {
  apiKey: "AIzaSyDtY_0v5-upDj2-Qlcvp9Wga8EFpAIwLqI",
  authDomain: "driver-behavior-test-app.firebaseapp.com",
  projectId: "driver-behavior-test-app",
  storageBucket: "driver-behavior-test-app.firebasestorage.app",
  messagingSenderId: "285918275837",
  appId: "1:285918275837:web:93948cb85ee45c09583694",
  measurementId: "G-7SVP138816"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);