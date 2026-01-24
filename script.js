document.addEventListener("DOMContentLoaded", () => {
  const POPUP_KEY = "popupShown_TEST";
  localStorage.removeItem(POPUP_KEY); // מוחק כל פעם לצורך בדיקות

  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  const popupOverlay = document.getElementById("popupOverlay");

  // --- 1. טעינת תוכן האתר (data.json) ---
  async function updateContent(sectionId) {
    if (!sectionId) return;
    try {
      const response = await fetch("data.json");
      if (!response.ok) throw new Error("קובץ data.json לא נמצא");
      const data = await response.json();
      const sectionData = data[sectionId];
      if (sectionData) {
        // --- הוספת שורה לעדכון הכותרת ---
        document.title = sectionData.title + " | טואף-קלפה משרד עורכי דין";
        // ----------------------------------------
        document.getElementById("content-title").innerText = sectionData.title;
        const contentHtml = sectionData.content
          .map(text => `<div class="content-paragraph" style="margin-bottom: 15px;">${text}</div>`)
          .join("");

        let imagesHtml = "";
        if (sectionData.images && sectionData.images.length > 0) {
          imagesHtml = '<div class="content-side-images">';
          sectionData.images.forEach((imgData) => {
            imagesHtml += `<img src="${imgData.url}" alt="${imgData.alt}" title="${imgData.alt}" width="300" style="height: auto; aspect-ratio: 1/1;" class="dynamic-img" onerror="this.style.display='none'">`;
          });
          imagesHtml += "</div>";
        }
        document.getElementById("content-body").innerHTML = `<div class="content-wrapper"><div class="content-text">${contentHtml}</div>${imagesHtml}</div>`;
      }
    } catch (error) { console.error("שגיאה ב-updateContent:", error); }
  }
  updateContent("about");

  // --- 2. פונקציות הפופאפ (popup.json) ---
  window.openPopup = async function () {
    if (!popupOverlay) return;

    try {
      const response = await fetch("popup.json");
      const popupsArray = await response.json();

      // הגרלת אובייקט מהמערך
      const randomIndex = Math.floor(Math.random() * popupsArray.length);
      const item = popupsArray[randomIndex];

      // עדכון ה-HTML עם התוכן הרנדומלי
      const titleElem = document.getElementById("popupTitle");
      const title2Elem = document.getElementById("popupTitle2");
      const listContainer = document.getElementById("popupList");

      if (titleElem) titleElem.innerText = item.title;
      if (title2Elem) title2Elem.innerText = item["title-2"];

      if (listContainer) {
        // מוחק את ה-<li> שכתבת ידנית ב-HTML ומכניס חדשים
        listContainer.innerHTML = '';
        Object.values(item.content).forEach(text => {
          const li = document.createElement('li');
          li.innerText = text;
          listContainer.appendChild(li);
        });
      }
    } catch (error) {
      console.error("שגיאה בטעינת נתוני JSON לפופאפ:", error);
      // אם יש שגיאה, ה-Popup יציג את תוכן ברירת המחדל מה-HTML
    }

    // הצגת הפופאפ
    popupOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closePopup = function () {
    if (popupOverlay) {
      popupOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  // --- 3. מאזיני אירועים (בורגר וניווט) ---
  if (burger) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });
  }

  document.addEventListener("click", (event) => {
    // סגירת בורגר
    if (navLinks.classList.contains("nav-active")) {
      if (event.target.closest("#navLinks a") || (!event.target.closest("#navLinks") && !event.target.closest("#burger"))) {
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

  // --- 4. הפעלה אוטומטית ---
  const hasSeenPopup = localStorage.getItem(POPUP_KEY);
  if (!hasSeenPopup) {
    setTimeout(() => {
      openPopup();
      localStorage.setItem(POPUP_KEY, "true");
    }, 5000);
  }
});