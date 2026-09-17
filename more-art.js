// --- Additional artworks, shown on the "More Artwork" page ---
const moreArtworks = [
  {
    img: "images/betta-fish-drawing.jpg",
    title: "As Vibrant As You",
    medium: "Colored Pencil",
    note: "Completed at age 6",
  },
  {
    img: "images/sketch-portrait.jpg",
    title: "Victoria",
    medium: "Charcoal",
  },
];

const moreGrid = document.getElementById("more-gallery-grid");

if (moreGrid) {
  moreArtworks.forEach((art) => {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <div class="art-thumb"><img src="${art.img}" alt="${art.title}" loading="lazy" data-full="${art.img}" data-title="${art.title}"></div>
      <div class="art-info">
        <span class="medium-tag">${art.medium}</span>
        <h4>${art.title}</h4>
        ${art.note ? `<p class="note">${art.note}</p>` : ""}
      </div>
    `;
    moreGrid.appendChild(card);
  });

  // --- Lightbox: click any artwork thumbnail to view it full-size ---
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

  moreGrid.addEventListener("click", (e) => {
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
