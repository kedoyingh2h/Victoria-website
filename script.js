// --- Simple password gate (casual privacy, not high security) ---
const SITE_PASSWORD = "victoria2026"; // TODO: change this to whatever password you'd like

const gate = document.getElementById("gate");
const site = document.getElementById("site");
const gateInput = document.getElementById("gate-input");
const gateSubmit = document.getElementById("gate-submit");
const gateError = document.getElementById("gate-error");

function unlockSite() {
  gate.hidden = true;
  site.classList.add("revealed");
}

if (localStorage.getItem("victoria-site-unlocked") === "yes") {
  unlockSite();
}

function tryUnlock() {
  if (gateInput.value === SITE_PASSWORD) {
    localStorage.setItem("victoria-site-unlocked", "yes");
    unlockSite();
  } else {
    gateError.textContent = "That's not quite right — try again.";
  }
}

gateSubmit.addEventListener("click", tryUnlock);
gateInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

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
];

const PLACEHOLDER_SLOTS = 5; // extra "coming soon" cards while more art is added

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
