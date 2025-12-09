import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC7aj3cnvSYdaho_upu_TUqpo2XDN4VrqE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "baristaflow-93ac0.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://baristaflow-93ac0-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "baristaflow-93ac0",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "927603988215",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:927603988215:web:e87c5f3fa71c0a470d65f2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VTZSVCQPXH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
