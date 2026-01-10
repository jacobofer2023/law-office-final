document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  async function updateContent(sectionId) {
    if (!sectionId) return;

    try {
      const response = await fetch("data.json");
      if (!response.ok) throw new Error("קובץ הנתונים לא נמצא");

      const data = await response.json();
      const sectionData = data[sectionId];

      if (sectionData) {
        // 1. עדכון הכותרת
        document.getElementById("content-title").innerText = sectionData.title;

        // 2. עיבוד תוכן הפסקאות
        const contentHtml = sectionData.content
          .map(
            (text) =>
              `<div class="content-paragraph" style="margin-bottom: 15px;">${text}</div>`
          )
          .join("");

        // 3. טיפול בתמונות
        let imagesHtml = "";
        if (sectionData.images && sectionData.images.length > 0) {
          imagesHtml = '<div class="content-side-images">';
          sectionData.images.forEach((imgData) => {
            imagesHtml += `
                            <img src="${imgData.url}" 
                                 alt="${imgData.alt}"
                                 title="${imgData.alt}"
                                 width="${imgData.width || 300}"
                                 height="${imgData.height || 300}"
                                 loading="lazy" 
                                 class="dynamic-img" 
                                 onerror="this.style.display='none'">`;
          });
          imagesHtml += "</div>";
        }

        // 4. הזרקה לתוך ה-HTML
        document.getElementById("content-body").innerHTML = `
                    <div class="content-wrapper">
                        <div class="content-text">${contentHtml}</div>
                        ${imagesHtml}
                    </div>
                `;

        // 5. גלילה חלקה
        const displayElement = document.getElementById("content-display");
        if (displayElement && sectionId !== "about") {
          displayElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.error("שגיאה בטעינת הנתונים:", error);
    }
  }

  // טעינה ראשונית
  updateContent("about");

  // --- ניהול תפריט המבורגר (פתיחה/סגירה בלחיצה על האייקון) ---
  if (burger) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation(); // מונע מהלחיצה על ההמבורגר להיחשב כלחיצה "מחוץ לתפריט"
      navLinks.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });
  }

  // --- מאזין לחיצות גלובלי (לקישורים וסגירת תפריט) ---
  document.addEventListener("click", (event) => {

    // א. זיהוי אם נלחץ קישור לתוכן (data-section)
    let sectionLink = event.target.closest("a[data-section]");
    if (!sectionLink) {
      const card = event.target.closest(".service-card");
      if (card) sectionLink = card.querySelector("a[data-section]");
    }

    if (sectionLink) {
      const section = sectionLink.getAttribute("data-section");
      updateContent(section);
      // אם הקישור הוא רק לעדכון תוכן ולא גלילה, אפשר למנוע דיפולט
      if (sectionLink.getAttribute("href") === "#") {
        event.preventDefault();
      }
    }

    // ב. סגירת התפריט במובייל
    const isNavLink = event.target.closest("#navLinks a");
    const isInsideMenu = event.target.closest("#navLinks");
    const menuIsOpen = navLinks.classList.contains("nav-active");

    // סגור אם: לחצו על קישור בתפריט או לחצו מחוץ לתפריט (ולא על ההמבורגר)
    if (menuIsOpen && (isNavLink || !isInsideMenu)) {
      navLinks.classList.remove("nav-active");
      if (burger) burger.classList.remove("toggle");
    }
  });
});