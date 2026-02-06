// משתנים גלובליים
let score = 0; // המשתנה שיחזיק את הניקוד
let correctIndex = -1;
let currentQuestionIndex = 0; // מתחילים מהשאלה הראשונה
let questionsArray = []; // נשמור כאן את כל השאלות שנטען מה-JSON

// טיימר
let seconds = 0;
let minutes = 0;
let timerInterval;
const display = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');

//כפתור התחל
function playAndStart() {
    const sound = document.getElementById('startSound');
    if (sound) sound.play();
    if (timerInterval) return;

    timerInterval = setInterval(function () {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        // עצירה אחרי 30 שניות (לפי הקוד המקורי שלך)
        if (minutes === 0 && seconds >= 30) {
            clearInterval(timerInterval);
        }

        let displayMins = minutes < 10 ? "0" + minutes : minutes;
        let displaySecs = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = displayMins + ":" + displaySecs;
    }, 1000);
}

// טעינת שאלות מהג'ייסון
async function getQues() {
    try {
        const response = await fetch('questions.json');
        questionsArray = await response.json();
        displayQuestion();

    } catch (err) {
        console.error("שגיאה בטעינת הנתונים:", err);
    }
}

// הצגת השאלות
function displayQuestion() {
    // לוקחים את הנתונים לפי האינדקס הנוכחי
    const data = questionsArray[currentQuestionIndex];
    if (!data) return;
    correctIndex = data.correct;
    // איפוס עיצוב ה-li (חשוב כדי להוריד את הצבע מהשאלה הקודמת)
    const answerIds = ['1', '2', '3', '4'];
    answerIds.forEach(id => {
        const li = document.getElementById(id);
        if (li) {
            li.style.backgroundColor = ""; // מנקים צבע
            li.classList.remove('disabled'); // מוריד את הקלאס
            li.style.pointerEvents = "auto"; // מחזירים אפשרות לחיצה            
        }
    });

    // הזרקת הסיפור והשאלה
    document.getElementById('case-text').textContent = data.case;
    document.getElementById('que').textContent = data.question;

    data.options.forEach((optionText, index) => {
        const li = document.getElementById(answerIds[index]);
        if (li) {
            const processed = optionText.replace(/^(כן|לא)/, (match) => {
                const className = match === "כן" ? "yes-style" : "no-style";
                return `<span class="${className}">${match}</span>`;
            });
            li.innerHTML = processed;
        }
    });
}

// בחירת תשובה על ידי המשתשמ
function userChooseQues(element) {
    const selectedIndex = parseInt(element.id);
    const scoreElement = document.getElementById('span'); // ה-span של הניקוד
    // בדיקת תשובה
    if (selectedIndex == correctIndex) {
        element.style.backgroundColor = "#d4edda"; // ירוק
        score += 1; // מוסיף 10 נקודות
        scoreElement.textContent = score; // מעדכן את המספר שמוצג במסך
    } else {
        element.style.backgroundColor = "#f8d7da"; // אדום
    }

    // --- מניעת לחיצות נוספות ---
    const allAnswers = document.querySelectorAll('#answers li');
    allAnswers.forEach(li => {
        li.classList.add('disabled');
        li.style.pointerEvents = "none"; // חסימה פיזית של העכבר
    });

    //הצגת כפתור שאלה הבאה
    const nextBtn = document.getElementById('next_btn');
}// <--- כאן נגמרת הפונקציה userChooseQues

// פונקציה למעבר שאלה באמצעות לחיצה על הכפתור
function nextQuestion() {
    currentQuestionIndex++; // מקדמים את האינדקס ב-1
    if (currentQuestionIndex < questionsArray.length) {
        displayQuestion();
    } else {
        alert("סיימת את הקוויז! ניקוד סופי: " + score);
    }
}
// הפעלה אוטומטית של טעינת השאלה
getQues();

