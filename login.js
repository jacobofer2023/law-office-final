import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const auth = getAuth();

window.login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // אם הצלחנו, נעבור לדף החישובים
        window.location.href = "admin-calc.html";
    } catch (error) {
        errorMsg.style.display = 'block';
        console.error(error.message);
    }
};