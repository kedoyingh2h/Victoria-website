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
    img: "images/starry-night-study.jpg",
    title: "Starry Night Study",
    medium: "Oil",
    note: "Painted at age 8 (2023), inspired by Van Gogh's The Starry Night",
  },
  {
    img: "images/self-portrait.jpg",
    title: "Me at Eleven",
    medium: "Acrylic",
    note: "Her first self-portrait",
  },
];

const PLACEHOLDER_SLOTS = 2; // extra "coming soon" cards while more art is added

const galleryGrid = document.getElementById("gallery-grid");

if (galleryGrid) {
  artworks.forEach((art) => {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <div class="art-thumb"><img src="${art.img}" alt="${art.title}" loading="lazy"></div>
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

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
