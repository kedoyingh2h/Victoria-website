// --- Product catalog ---
const products = [
  {
    id: "apron-rabbit",
    name: "Studio Apron — Rabbit in the Grass",
    price: 45,
    images: ["images/apron-hanging.jpg", "images/apron-folded.jpg", "images/apron-detail.jpg"],
    description: "The same apron Victoria wears while she paints — heavyweight canvas with genuine leather straps, featuring her piece “Rabbit in the Grass.”",
  },
  {
    id: "pillow-rabbit",
    name: "Throw Pillow — Rabbit in the Grass",
    price: 35,
    images: ["images/pillow-lineup.jpg", "images/pillow-back.jpg", "images/pillow-front.jpg"],
    description: "A soft linen throw pillow printed with Victoria's “Rabbit in the Grass,” with an embroidered fern pattern on the reverse side.",
  },
  {
    id: "betta-jewelry-set",
    name: "The Betta & Lavender Gift Set",
    price: 98,
    images: ["images/jewelry-giftbox.jpg", "images/jewelry-flatlay.jpg", "images/jewelry-detail.jpg", "images/betta-fish-drawing.jpg"],
    description: "Inspired by the colored-pencil betta fish Victoria drew at age 6. This gift set includes a rose gold necklace, matching earrings, a small teacup, and a miniature framed print of the original drawing — all presented in a keepsake box.",
  },
  {
    id: "hand-clutch",
    name: "Sculpted Hand Clutch",
    price: 228,
    images: ["images/clutch-front.jpg", "images/clutch-side.jpg", "images/hand-sketch.jpg"],
    description: "Genuine cowhide leather, hand-sculpted into the shape of Victoria's charcoal study “My Own Hand.” About 28cm × 20cm × 8cm — roomy enough for an iPad or A5 documents.",
  },
];

const shopGrid = document.getElementById("shop-grid");

if (shopGrid) {
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb">
        <img src="${p.images[0]}" alt="${p.name}" class="product-main-img" data-images='${JSON.stringify(p.images)}' data-idx="0">
      </div>
      <div class="product-thumbs">
        ${p.images.map((img, i) => `<img src="${img}" class="product-thumb-dot ${i === 0 ? "active" : ""}" data-src="${img}">`).join("")}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-price">$${p.price}</p>
        <p class="product-desc">${p.description}</p>
        <button class="contact-btn add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    shopGrid.appendChild(card);
  });

  shopGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("product-thumb-dot")) {
      const card = e.target.closest(".product-card");
      const mainImg = card.querySelector(".product-main-img");
      mainImg.src = e.target.dataset.src;
      card.querySelectorAll(".product-thumb-dot").forEach((d) => d.classList.remove("active"));
      e.target.classList.add("active");
    }
    if (e.target.classList.contains("add-to-cart-btn")) {
      addToCart(e.target.dataset.id);
    }
    if (e.target.classList.contains("product-main-img")) {
      openProductLightbox(e.target.src, e.target.alt);
    }
  });
}

// --- Lightbox: click a product photo to view it full-size ---
const productLightbox = document.createElement("div");
productLightbox.className = "lightbox";
productLightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">&times;</button>
  <img class="lightbox-img" src="" alt="">
  <p class="lightbox-caption"></p>
`;
document.body.appendChild(productLightbox);

function openProductLightbox(src, title) {
  productLightbox.querySelector(".lightbox-img").src = src;
  productLightbox.querySelector(".lightbox-img").alt = title;
  productLightbox.querySelector(".lightbox-caption").textContent = title;
  productLightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductLightbox() {
  productLightbox.classList.remove("open");
  document.body.style.overflow = "";
}

productLightbox.addEventListener("click", (e) => {
  if (e.target === productLightbox || e.target.classList.contains("lightbox-close")) {
    closeProductLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProductLightbox();
});

// --- Cart (stored in localStorage) ---
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("victoria-cart") || "{}");
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem("victoria-cart", JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartTotal(cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((p) => p.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById("cart-items");
  const emptyEl = document.getElementById("cart-empty");
  const totalEl = document.getElementById("cart-total");
  const countEl = document.getElementById("cart-count");
  if (!itemsEl) return;

  const entries = Object.entries(cart).filter(([id]) => products.find((p) => p.id === id));
  const totalCount = entries.reduce((sum, [, qty]) => sum + qty, 0);
  countEl.textContent = totalCount;

  if (entries.length === 0) {
    itemsEl.innerHTML = "";
    emptyEl.hidden = false;
  } else {
    emptyEl.hidden = true;
    itemsEl.innerHTML = entries.map(([id, qty]) => {
      const p = products.find((p) => p.id === id);
      return `
        <div class="cart-item">
          <img src="${p.images[0]}" alt="${p.name}">
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">$${p.price} &times; ${qty}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" data-id="${id}" data-delta="-1">&minus;</button>
              <span>${qty}</span>
              <button class="qty-btn" data-id="${id}" data-delta="1">+</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  const total = cartTotal(cart);
  totalEl.textContent = `$${total}`;
  const checkoutTotalEl = document.getElementById("checkout-total");
  if (checkoutTotalEl) checkoutTotalEl.textContent = `$${total}`;
}

// --- Cart panel open/close ---
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartToggle = document.getElementById("cart-toggle");
const cartClose = document.getElementById("cart-close");

function openCart() {
  if (!cartPanel) return;
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
  document.getElementById("cart-view").hidden = false;
  document.getElementById("checkout-view").hidden = true;
  document.getElementById("cart-panel-title").textContent = "Your Cart";
}

function closeCart() {
  if (!cartPanel) return;
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
}

if (cartToggle) {
  cartToggle.addEventListener("click", () => {
    renderCart();
    openCart();
  });
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  document.getElementById("cart-items").addEventListener("click", (e) => {
    if (e.target.classList.contains("qty-btn")) {
      changeQty(e.target.dataset.id, parseInt(e.target.dataset.delta, 10));
    }
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    const cart = getCart();
    if (Object.keys(cart).length === 0) return;
    document.getElementById("cart-view").hidden = true;
    document.getElementById("checkout-view").hidden = false;
    document.getElementById("cart-panel-title").textContent = "Checkout";
  });

  document.getElementById("back-to-cart").addEventListener("click", () => {
    document.getElementById("cart-view").hidden = false;
    document.getElementById("checkout-view").hidden = true;
    document.getElementById("cart-panel-title").textContent = "Your Cart";
  });

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const cart = getCart();
    const entries = Object.entries(cart).filter(([id]) => products.find((p) => p.id === id));
    if (entries.length === 0) return;

    const data = new FormData(e.target);
    const lines = entries.map(([id, qty]) => {
      const p = products.find((p) => p.id === id);
      return `- ${p.name} x${qty} = $${p.price * qty}`;
    });
    const total = cartTotal(cart);

    const body = [
      "New order from the shop:",
      "",
      ...lines,
      `Total: $${total}`,
      "",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Address: ${data.get("address")}, ${data.get("city")}, ${data.get("state")} ${data.get("zip")}`,
      `Zelle confirmation #: ${data.get("zelle")}`,
    ].join("\n");

    const mailto = `mailto:victoriadong1031@gmail.com?subject=${encodeURIComponent("New Shop Order")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    saveCart({});
    renderCart();
  });
}

renderCart();
