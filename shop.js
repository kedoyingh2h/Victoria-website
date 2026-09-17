// --- Product catalog ---
const products = [
  {
    id: "apron-rabbit",
    name: "Studio Apron — Rabbit in the Grass",
    price: 45,
    images: ["images/apron-hanging.jpg", "images/apron-folded.jpg", "images/apron-detail.jpg"],
    description: "The same apron Victoria wears while she paints — heavyweight canvas with genuine leather straps, featuring her piece “Rabbit in the Grass.”",
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
  });
}

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
