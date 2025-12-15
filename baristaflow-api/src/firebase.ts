const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const { getAuth } = require('firebase/auth');
const dotenv = require('dotenv');

// Polyfill XMLHttpRequest for Firebase Client SDK in Node.js
global.XMLHttpRequest = require('xhr2');
const fetch = require('node-fetch');
if (!global.fetch) {
    global.fetch = fetch;
    global.Headers = fetch.Headers;
    global.Request = fetch.Request;
    global.Response = fetch.Response;
}

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
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
