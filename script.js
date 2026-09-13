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

// --- Placeholder gallery (swap in real artwork later) ---
const mediums = ["Oil Painting", "Acrylic", "Sketch"];
const galleryGrid = document.getElementById("gallery-grid");

for (let i = 1; i <= 10; i++) {
  const medium = mediums[(i - 1) % mediums.length];
  const card = document.createElement("div");
  card.className = "art-card";
  card.innerHTML = `
    <div class="art-thumb">Artwork photo coming soon</div>
    <div class="art-info">
      <span class="medium-tag">${medium}</span>
      <h4>Untitled #${i}</h4>
    </div>
  `;
  galleryGrid.appendChild(card);
}

document.getElementById("year").textContent = new Date().getFullYear();
