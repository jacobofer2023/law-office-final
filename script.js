// שימוש ב-DOMContentLoaded מבטיח שהקוד ירוץ רק אחרי שהדף נטען במלואו
document.addEventListener('DOMContentLoaded', () => {

    // 1. הגדרת המשתנים
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    // פונקציה לעדכון תוכן דינמי מתוך ה-JSON
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
                                 title="${imgData.alt}"
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

    // 2. טיפול בפתיחה וסגירה של תפריט ההמבורגר בלחיצה עליו
    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // 3. מאזין ללחיצות על כל האתר (ניווט וסגירת תפריט)
    document.addEventListener('click', (event) => {
        // מחפש אם לחצו על לינק עם data-section או על כרטיס שירות
        let link = event.target.closest('a[data-section]');

        if (!link) {
            const card = event.target.closest('.service-card');
            if (card) {
                link = card.querySelector('a[data-section]');
            }
        }

        // אם מצאנו לינק רלוונטי לעדכון תוכן
        if (link) {
            event.preventDefault();
            const section = link.getAttribute('data-section');
            updateContent(section);

            // סגירת תפריט ההמבורגר בנייד
            if (navLinks && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                if (burger) burger.classList.remove('toggle');
            }
        }
        // טיפול בסגירת תפריט כשלוחצים על לינקים רגילים (בית, צור קשר וכו')
        else if (event.target.closest('.nav-links a')) {
            if (navLinks && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                if (burger) burger.classList.remove('toggle');
            }
        }
    });

});