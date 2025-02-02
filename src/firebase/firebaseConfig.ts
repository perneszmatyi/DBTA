import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';


const firebaseConfig = {
  apiKey: "AIzaSyAnNcxiRjVOoVpvp296vWdRbsS6Mu-492s",
  authDomain: "szedui.firebaseapp.com",
  projectId: "szedui",
  storageBucket: "szedui.firebasestorage.app",
  messagingSenderId: "235114494776",
  appId: "1:235114494776:web:48885d2af631d9a45fdfcd"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);