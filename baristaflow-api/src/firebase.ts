const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const { getAuth } = require('firebase/auth');
const dotenv = require('dotenv');

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

let app;
let db;
let auth;

try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app); // Usamos Realtime Database
    auth = getAuth(app);
    console.log("🔥 Firebase Client SDK (Realtime DB) inicializado correctamente en el backend.");
} catch (error) {
    console.error("❌ Error al inicializar Firebase Client SDK:", error);
}

module.exports = { db, auth };
