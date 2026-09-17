// --- Gallery: real artworks, plus placeholders for pieces not uploaded yet ---
const artworks = [
  {
    img: "images/swan.jpg",
    title: "November",
    medium: "Digital Painting",
    award: "High Merit Winner, Celebrating Art Contest · Published Artist of 2025 — featured in the Celebrating Art magazine",
  },
  { img: "images/rabbit.jpg", title: "Rabbit in the Grass", medium: "Digital Painting" },
  { img: "images/protect-ocean.jpg", title: "Protect Our Ocean", medium: "Digital Painting" },
  {
    img: "images/goose.jpg",
    title: "Guardian of the Lake",
    medium: "Digital Painting",
    award: "First Place · State Winner",
  },
  {
    img: "images/salute.jpg",
    title: "Little Salute, Big Respect",
    medium: "Acrylic",
    award: "First Place at both the Post and State levels, Illustrating America",
  },
  {
    img: "images/crystal-ball-sanctuary.jpg",
    title: "A Sanctuary in a Crystal Ball",
    medium: "Acrylic",
    award: "Honorary title “Young Ambassador of Art Exchange,” The 6th UWEE International Art Exhibition at Luv (Theme: One World · One Future) · Certificate No. CN-0010-054-192 · 2024",
  },
  {
    img: "images/hand-sketch.jpg",
    title: "My Own Hand",
    medium: "Charcoal",
    note: "Drawn at age 10, a study of her own hand",
  },
  {
    img: "images/self-portrait.jpg",
    title: "Me at Eleven",
    medium: "Acrylic",
    note: "Her first self-portrait",
  },
];

const PLACEHOLDER_SLOTS = 0; // extra "coming soon" cards while more art is added

const galleryGrid = document.getElementById("gallery-grid");

if (galleryGrid) {
  artworks.forEach((art) => {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <div class="art-thumb"><img src="${art.img}" alt="${art.title}" loading="lazy" data-full="${art.img}" data-title="${art.title}"></div>
      <div class="art-info">
        <span class="medium-tag">${art.medium}</span>
        <h4>${art.title}</h4>
        ${art.award ? `<p class="award">🏆 ${art.award}</p>` : ""}
        ${art.note ? `<p class="note">${art.note}</p>` : ""}
      </div>
    `;
    galleryGrid.appendChild(card);
  });

  for (let i = 1; i <= PLACEHOLDER_SLOTS; i++) {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <div class="art-thumb">More artwork coming soon</div>
      <div class="art-info">
        <h4>&nbsp;</h4>
      </div>
    `;
    galleryGrid.appendChild(card);
  }
}

// --- Lightbox: click any artwork thumbnail to view it full-size ---
if (galleryGrid) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <img class="lightbox-img" src="" alt="">
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  galleryGrid.addEventListener("click", (e) => {
    const img = e.target.closest(".art-thumb img");
    if (img) openLightbox(img.dataset.full, img.dataset.title);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
