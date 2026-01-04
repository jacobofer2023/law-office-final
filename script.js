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

        // 2. עיבוד תוכן הפסקאות - שימוש ב-innerHTML כדי לשמר את העיצוב מה-JSON
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

        // 5. גלילה חלקה (רק אם זו לחיצה אקטיבית ולא טעינת דף ראשונה)
        const displayElement = document.getElementById("content-display");
        if (displayElement && sectionId !== "about") {
          displayElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.error("שגיאה בטעינת הנתונים:", error);
    }
  }

  // --- קריאה ראשונית: טעינת תוכן ה"אודות" מיד עם פתיחת האתר ---
  updateContent("about");

  // ניהול תפריט המבורגר (הקוד המקורי שלך)
  if (burger) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });
  }

  // מאזין ללחיצות על לינקים וכרטיסי שירות
  document.addEventListener("click", (event) => {
    let link = event.target.closest("a[data-section]");

    if (!link) {
      const card = event.target.closest(".service-card");
      if (card) {
        link = card.querySelector("a[data-section]");
      }
    }

    if (link) {
      event.preventDefault();
      const section = link.getAttribute("data-section");
      updateContent(section);

      if (navLinks && navLinks.classList.contains("nav-active")) {
        navLinks.classList.remove("nav-active");
        if (burger) burger.classList.remove("toggle");
      }
    }
  });
});
