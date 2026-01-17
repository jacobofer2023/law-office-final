document.addEventListener("DOMContentLoaded", () => {
  // 1. נשתמש באותו שם מפתח בדיוק בשני המקומות (למשל TEST)
  const POPUP_KEY = "popupShown_TEST";
  // 2. מחיקת המפתח בכל טעינה (למטרת בדיקות בלבד!)
  localStorage.removeItem(POPUP_KEY);

  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  const popupOverlay = document.getElementById("popupOverlay");

  // --- לוגיקת תוכן דינמי (ללא שינוי) ---
  async function updateContent(sectionId) {
    if (!sectionId) return;
    try {
      const response = await fetch("data.json");
      if (!response.ok) throw new Error("קובץ הנתונים לא נמצא");
      const data = await response.json();
      const sectionData = data[sectionId];
      if (sectionData) {
        document.getElementById("content-title").innerText = sectionData.title;
        const contentHtml = sectionData.content
          .map(text => `<div class="content-paragraph" style="margin-bottom: 15px;">${text}</div>`)
          .join("");

        let imagesHtml = "";
        if (sectionData.images && sectionData.images.length > 0) {
          imagesHtml = '<div class="content-side-images">';
          sectionData.images.forEach((imgData) => {
            imagesHtml += `<img src="${imgData.url}" alt="${imgData.alt}" title="${imgData.alt}" width="300" style="height: auto; aspect-ratio: 1/1;" loading="lazy" class="dynamic-img" onerror="this.style.display='none'">`;
          });
          imagesHtml += "</div>";
        }
        document.getElementById("content-body").innerHTML = `<div class="content-wrapper"><div class="content-text">${contentHtml}</div>${imagesHtml}</div>`;
        const displayElement = document.getElementById("content-display");
        if (displayElement && sectionId !== "about") {
          displayElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) { console.error("שגיאה בטעינת הנתונים:", error); }
  }
  updateContent("about");

  // --- פונקציות פופאפ גלובליות ---
  window.openPopup = function () {
    if (popupOverlay) {
      popupOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      console.error("Popup overlay not found in HTML!");
    }
  };

  window.closePopup = function () {
    if (popupOverlay) {
      popupOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  };

  // --- מאזיני לחיצות ---
  if (burger) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });
  }

  document.addEventListener("click", (event) => {
    // סגירת תפריט מובייל
    if (navLinks.classList.contains("nav-active")) {
      if (event.target.closest("#navLinks a") || !event.target.closest("#navLinks") && !event.target.closest("#burger")) {
        navLinks.classList.remove("nav-active");
        if (burger) burger.classList.remove("toggle");
      }
    }

    // סגירת פופאפ בלחיצה על הרקע
    if (popupOverlay && event.target === popupOverlay) {
      closePopup();
    }

    // ניווט דינמי
    let sectionLink = event.target.closest("a[data-section]");
    if (sectionLink) {
      const section = sectionLink.getAttribute("data-section");
      updateContent(section);
      if (sectionLink.getAttribute("href") === "#") event.preventDefault();
    }
  });

  // --- הפעלה אוטומטית (עם איפוס זיכרון לבדיקה) ---
  // שיניתי ל-popupShown_DEBUG כדי שזה יפתח לך בטוח עכשיו
  const hasSeenPopup = localStorage.getItem(POPUP_KEY);

  // אם אתה רוצה שהפופאפ יופיע תמיד בזמן העבודה, פשוט מחק את ה-IF
  if (!hasSeenPopup) {
    setTimeout(() => {
      openPopup();
      localStorage.setItem(POPUP_KEY, "true");
      console.log("Popup opened and key saved.");
    }, 5000); // 2 שניות כדי שלא תצטרך לחכות הרבה
  }
});