import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. הגדרות Firebase (השאר כפי שהיה)
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

// 2. הגנה על הדף והתנתקות
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = "login.html";
        });
    });
}

// ----------------------------------------------------
// 3. לוגיקה של מחולל ה-JSON (הקוד החדש)
// ----------------------------------------------------

const generateBtn = document.getElementById('generateBtn');
const jsonResult = document.getElementById('jsonResult');
const jsonOutputArea = document.getElementById('jsonOutputArea');

if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const title = document.getElementById('chapterTitle').value;
        const l1 = document.getElementById('line1').value;
        const l2 = document.getElementById('line2').value;
        const l3 = document.getElementById('line3').value;
        const t2 = document.getElementById('title2').value;

        const jsonObject = {
            "title": title,
            "content": {
                "line1": l1,
                "line2": l2,
                "line3": l3
            },
            "title-2": t2
        };

        // הצגת ה-JSON מעוצב עם פסיק בסוף
        jsonResult.innerText = JSON.stringify(jsonObject, null, 2) + ",";
        jsonOutputArea.style.display = 'block';
    });
}

const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const textToCopy = document.getElementById('jsonResult').innerText;

        // יצירת אלמנט זמני
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;

        // מוודאים שהאלמנט לא ייראה לעין אבל יהיה קיים בדף
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.select();
        textArea.setSelectionRange(0, 99999); // תמיכה במובייל

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert("הקוד הועתק בהצלחה!");
            } else {
                alert("משהו השתבש בהעתקה.");
            }
        } catch (err) {
            console.error('שגיאה:', err);
            alert("הדפדפן חסם את ההעתקה.");
        }

        document.body.removeChild(textArea);
    });
}