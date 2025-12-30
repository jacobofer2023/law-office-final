// 1. הגדרת המשתנים הגלובליים (כדי שהתפריט והניווט יעבדו)
const burger = document.querySelector('.burger'); // וודא שהקלאס ב-HTML הוא burger
const navLinks = document.querySelector('.nav-links'); // וודא שהקלאס ב-HTML הוא nav-links

async function updateContent(sectionId) {
    if (!sectionId) return;

    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("קובץ הנתונים לא נמצא");

        const data = await response.json();
        const sectionData = data[sectionId];

        if (sectionData) {
            document.getElementById('content-title').innerText = sectionData.title;

            const contentHtml = sectionData.content
                .map(text => `<div style="margin-bottom: 15px;">${text}</div>`)
                .join('');

            let imagesHtml = '';
            if (sectionData.images && sectionData.images.length > 0) {
                imagesHtml = '<div class="content-side-images">';
                sectionData.images.forEach(imgData => {
                    imagesHtml += `
                        <img src="${imgData.url}" 
                             alt="${imgData.alt}"
                             title="${imgData.alt}"  // שורה זו גורמת לטקסט להופיע בריחוף עכבר 
                             class="dynamic-img" 
                             onerror="this.style.display='none'">`;
                });
                imagesHtml += '</div>';
            }

            document.getElementById('content-body').innerHTML = `
                <div class="content-wrapper">
                    <div class="content-text">${contentHtml}</div>
                    ${imagesHtml}
                </div>
            `;

            const displayElement = document.getElementById('content-display');
            if (displayElement) {
                displayElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error);
    }
}

// 2. מאזין ללחיצות על כל האתר (מטפל בניווט ובסגירת התפריט)
document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-section]');

    if (link) {
        event.preventDefault();

        const section = link.getAttribute('data-section');
        updateContent(section);

        // סגירת תפריט ההמבורגר בניידים לאחר לחיצה
        if (navLinks && navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            if (burger) burger.classList.remove('toggle');
        }
    }
});

// 3. מאזין לפתיחה/סגירה של ה-Burger
if (burger) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });
}