document.addEventListener("DOMContentLoaded", () => {
  const POPUP_KEY = "popupShown_TEST";
  localStorage.removeItem(POPUP_KEY); // לאיפוס הפופאפ בכל רענון (לצורכי טסט)

  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  const popupOverlay = document.getElementById("popupOverlay");

  // --- 1. פונקציית הגריד (הריבועים בדף הבית) ---
  function renderServicesGrid(services) {
    const gridContainer = document.querySelector(".service-grid");
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; // ניקוי חובה

    services.forEach((service, index) => {
      const card = document.createElement("div");
      card.className = "service-card";
      card.style.animationDelay = `${index * 0.15}s`;

      card.innerHTML = `
          <div class="service-icon-container">
            <img src="images/${service.icon}" alt="${service.title}" class="service-icon-img">
          </div>
          <h4>${service.title}</h4>
          <p>${service.description}</p>
          <a href="#content-display" data-section="${service.id}">למידע נוסף ←</a>
      `;
      gridContainer.appendChild(card);
    });
  }

  // --- 2. עדכון תוכן דינמי (הלב של האתר) ---
  async function updateContent(sectionId) {
    if (!sectionId) return;
    try {
      const response = await fetch("data.json");
      if (!response.ok) throw new Error("קובץ data.json לא נמצא");
      const data = await response.json();

      const servicesSection = document.getElementById("services");
      const contentDisplay = document.getElementById("content-display");
      const contentBody = document.getElementById("content-body");

      // שלב א': לוגיקת הצגה/הסתרה
      if (sectionId === "about") {
        // בדף הבית מראים גם את האודות וגם את הגריד
        if (servicesSection) servicesSection.style.display = "block";
        if (contentDisplay) contentDisplay.style.display = "block";
        if (data.servicesGrid) renderServicesGrid(data.servicesGrid);
      } else {
        // בדפים פנימיים מסתירים את הגריד כדי שלא יפריע לקריאה
        if (servicesSection) servicesSection.style.display = "none";
        if (contentDisplay) contentDisplay.style.display = "block";
      }

      // שלב ב': רינדור התוכן מה-JSON
      const sectionData = data[sectionId];
      if (sectionData) {
        document.title = sectionData.title + " | טואף-קלפה משרד עורכי דין";

        const titleElem = document.getElementById("content-title");
        if (titleElem) titleElem.innerText = sectionData.title;

        const itemsHtml = sectionData.items.map(item => {
          // תיקון אוטומטי של נתיב התמונה
          const imgUrl = item.image.url.startsWith("image/")
            ? item.image.url.replace("image/", "images/")
            : item.image.url;

          return `
            <div class="content-row">
              <div class="content-text-box">
                ${item.content}
              </div>
              <div class="content-img-box">
                <img src="${imgUrl}" 
                     alt="${item.image.alt}" 
                     class="dynamic-img"
                     onerror="this.style.display='none'">
              </div>
            </div>
          `;
        }).join("");

        if (contentBody) {
          contentBody.innerHTML = `<div class="content-wrapper">${itemsHtml}</div>`;
        }

        window.location.hash = sectionId;

        // גלילה חלקה לתוכן (רק בדפים פנימיים)
        if (sectionId !== "about") {
          contentDisplay.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error("שגיאה במערכת:", error);
    }
  }

  // הפעלה ראשונית של האתר
  updateContent("about");

  // --- 3. פונקציות פופאפ (popup.json) ---
  window.openPopup = async function () {
    if (!popupOverlay) return;
    try {
      const res = await fetch("popup.json");
      const arr = await res.json();
      const item = arr[Math.floor(Math.random() * arr.length)];

      const title1 = document.getElementById("popupTitle");
      const title2 = document.getElementById("popupTitle2");
      const list = document.getElementById("popupList");

      if (title1) title1.innerText = item.title;
      if (title2) title2.innerText = item["title-2"];
      if (list) {
        list.innerHTML = '';
        Object.values(item.content).forEach(t => {
          const li = document.createElement('li');
          li.innerText = t;
          list.appendChild(li);
        });
      }
    } catch (e) { console.error("שגיאה בטעינת פופאפ:", e); }

    popupOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closePopup = () => {
    if (popupOverlay) {
      popupOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  // --- 4. מאזיני אירועים (בורגר וניווט) ---
  if (burger) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("nav-active");
      burger.classList.toggle("toggle");
    });
  }

  document.addEventListener("click", (e) => {
    // סגירת תפריט מובייל
    if (navLinks && navLinks.classList.contains("nav-active")) {
      if (e.target.closest("#navLinks a") || (!e.target.closest("#navLinks") && !e.target.closest("#burger"))) {
        navLinks.classList.remove("nav-active");
        if (burger) burger.classList.remove("toggle");
      }
    }

    // סגירת פופאפ בלחיצה על הרקע
    if (e.target === popupOverlay) closePopup();

    // ניווט דינמי (טיפול בלחיצה על קישורים עם data-section)
    let link = e.target.closest("a");
    if (link) {
      const section = link.getAttribute("data-section");
      const href = link.getAttribute("href");

      if (section) {
        updateContent(section);
        e.preventDefault();
      } else if (href && href.startsWith("#")) {
        const isCurrentlyInSubpage = window.location.hash !== "" && window.location.hash !== "#about" && window.location.hash !== "#services" && window.location.hash !== "#contact";

        if (href === "#services" && isCurrentlyInSubpage) {
          updateContent("about");
        }
      }
    }
  });

  // הצגת פופאפ אוטומטית אחרי 5 שניות (רק פעם אחת)
  setTimeout(() => {
    if (!localStorage.getItem(POPUP_KEY)) {
      openPopup();
      localStorage.setItem(POPUP_KEY, "true");
    }
  }, 5000);
});