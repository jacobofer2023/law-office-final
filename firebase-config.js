// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCMs4kGS3lLScdyTZhD2ZEG-bjmb3nezCI",
    authDomain: "kalfa-toaff-admin.firebaseapp.com",
    projectId: "kalfa-toaff-admin",
    storageBucket: "kalfa-toaff-admin.firebasestorage.app",
    messagingSenderId: "1030816912499",
    appId: "1:1030816912499:web:5de0933ee292793a67c606",
    measurementId: "G-7PW96M5BHW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);