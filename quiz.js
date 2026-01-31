// --- ניהול הטיימר ---
let seconds = 0;
let minutes = 0;
let timerInterval;

const display = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');

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

// --- טעינת השאלות מה-JSON ---
async function getQues() {
    try {
        const response = await fetch('questions.json');
        const questionsArray = await response.json();

        // לוקחים את השאלה הראשונה מהמערך
        const data = questionsArray[0];

        // הזרקת הסיפור והשאלה
        const caseField = document.getElementById('case-text');
        const quesField = document.getElementById('que');

        if (caseField) caseField.textContent = data.case;
        if (quesField) quesField.textContent = data.question;

        // הזרקת התשובות מהמערך "options"
        const answerIds = ['ans1', 'ans2', 'ans3', 'ans4'];

        data.options.forEach((optionText, index) => {
            const li = document.getElementById(answerIds[index]);
            if (li) {
                // עיבוד ה"כן/לא" לעיצוב ה-span
                const processed = optionText.replace(/^(כן|לא)/, (match) => {
                    const className = match === "כן" ? "yes-style" : "no-style";
                    return `<span class="${className}">${match}</span>`;
                });
                li.innerHTML = processed;
            }
        });

    } catch (err) {
        console.error("שגיאה בטעינת הנתונים:", err);
    }
}

// הפעלה אוטומטית של טעינת השאלה
getQues();