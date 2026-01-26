// 1. הגדרת המשתנים להתחלה ב-0
let seconds = 0;
let minutes = 0;
let timerInterval;

const display = document.getElementById('timerDisplay');
const button = document.getElementById('startBtn');

button.addEventListener('click', function () {
    // מונע מהטיימר להאיץ אם לוחצים פעמיים על הכפתור
    if (timerInterval) return;

    // 2. הפעלת הפונקציה בכל שנייה (1000 מילישניות)
    timerInterval = setInterval(function () {
        seconds++; // מקדם את השניות

        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        // השעון יפסיק בתוך 30 שניות
        setTimeout(() => {
            clearInterval(timerInterval); // זה מפסיק את ה-setInterval
            console.log("עברו 30 שניות - האינטרוול הופסק!");
        }, 29000); // 30,000 מילישניות = 30 שניות


        // 3. עיצוב התצוגה: הוספת "0" לפני מספרים קטנים מ-10
        let displayMins = minutes < 10 ? "0" + minutes : minutes;
        let displaySecs = seconds < 10 ? "0" + seconds : seconds;

        // עדכון הטקסט על המסך
        display.textContent = displayMins + ":" + displaySecs;
    }, 1000);
});

function playAndStart() {
    // 1. השמעת הצליל
    const sound = document.getElementById('startSound');
    sound.play();
    console.log("השעון התחיל והצליל הושמע!");
}