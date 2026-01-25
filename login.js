// בראש הקובץ login.js או admin-logic.js
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// אין צורך יותר ב-firebaseConfig או ב-initializeApp כאן!

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