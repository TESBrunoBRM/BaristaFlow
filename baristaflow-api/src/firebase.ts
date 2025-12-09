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
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyC7aj3cnvSYdaho_upu_TUqpo2XDN4VrqE",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "baristaflow-93ac0.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://baristaflow-93ac0-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "baristaflow-93ac0",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "927603988215",
    appId: process.env.FIREBASE_APP_ID || "1:927603988215:web:e87c5f3fa71c0a470d65f2",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-VTZSVCQPXH"
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
