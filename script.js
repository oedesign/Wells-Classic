const page = document.body.dataset.page;
const authRequired = document.body.dataset.authRequired === "true";

const getJSON = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const users = getJSON("wc_users", []);
let currentUser = getJSON("wc_current_user", null);
const cartKey = () => `wc_cart_${currentUser?.email || "guest"}`;
const orderKey = () => `wc_orders_${currentUser?.email || "guest"}`;

if (authRequired && !currentUser) {
  window.location.href = "login.html";
}
if ((page === "login" || page === "signup") && currentUser) {
  window.location.href = "index.html";
}

const menu = document.getElementById("menu");
const hamburger = document.getElementById("hamburger");
hamburger?.addEventListener("click", () => menu?.classList.toggle("open"));

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("wc_theme", theme);
}
applyTheme(localStorage.getItem("wc_theme") || "light");
document.getElementById("themeToggle")?.addEventListener("click", () => {
  applyTheme(document.body.classList.contains("dark") ? "light" : "dark");
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("wc_current_user");
  window.location.href = "login.html";
});

const products = [
  { id: 1, name: "Men's Silk Blazer", category: "clothing", section: "male", price: 320, image: "images/images.jpg" },
  { id: 2, name: "Women's Satin Dress", category: "clothing", section: "female", price: 280, image: "images/images.webp" },
  { id: 3, name: "Custom Tailored Set", category: "clothing", section: "custom", price: 450, image: "images/images.jpg" },
  { id: 4, name: "New Arrival Trench", category: "clothing", section: "new", price: 360, image: "images/images.webp" },
  { id: 5, name: "Men's Leather Loafers", category: "shoes", section: "male", price: 210, image: "images/hero-image-shoe.webp" },
  { id: 6, name: "Women's Crystal Heels", category: "shoes", section: "female", price: 265, image: "images/hero-image-shoe1.webp" },
  { id: 7, name: "Custom Monogram Sneakers", category: "shoes", section: "custom", price: 310, image: "images/hero-image-shoe.webp" },
  { id: 8, name: "New Arrival Derby", category: "shoes", section: "new", price: 255, image: "images/hero-image-shoe1.webp" },
  { id: 9, name: "Men's Travel Brief", category: "bags", section: "male", price: 340, image: "images/images.webp" },
  { id: 10, name: "Women's Luxe Tote", category: "bags", section: "female", price: 390, image: "images/images.jpg" },
  { id: 11, name: "Custom Signature Bag", category: "bags", section: "custom", price: 460, image: "images/images.webp" },
  { id: 12, name: "New Arrival Mini Bag", category: "bags", section: "new", price: 330, image: "images/images.jpg" },
  { id: 13, name: "Men's Gold Cuff", category: "jewelry", section: "male", price: 220, image: "images/watch.jpg" },
  { id: 14, name: "Women's Diamond Pendant", category: "jewelry", section: "female", price: 480, image: "images/watch.webp" },
  { id: 15, name: "Custom Name Necklace", category: "jewelry", section: "custom", price: 260, image: "images/watch.jpg" },
  { id: 16, name: "New Arrival Timepiece", category: "jewelry", section: "new", price: 550, image: "images/hero-image-watch.jpg" }
];

function getCart() { return getJSON(cartKey(), []); }
function setCart(value) { setJSON(cartKey(), value); updateCartCount(); }
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("#cartCount").forEach((el) => (el.textContent = count));
}
updateCartCount();

if (page === "home") {
  const slides = document.querySelectorAll(".slide");
  let idx = 0;
  const show = (i) => {
    slides.forEach((s) => s.classList.remove("active"));
    slides[i].classList.add("active");
  };
  document.getElementById("nextSlide")?.addEventListener("click", () => { idx = (idx + 1) % slides.length; show(idx); });
  document.getElementById("prevSlide")?.addEventListener("click", () => { idx = (idx - 1 + slides.length) % slides.length; show(idx); });
  setInterval(() => { idx = (idx + 1) % slides.length; show(idx); }, 4200);
}

if (page === "shop") {
  const grid = document.getElementById("productsGrid");
  const params = new URLSearchParams(window.location.search);
  let filter = params.get("category") || "all";

  const renderProducts = () => {
    const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);
    grid.innerHTML = filtered.map((p) => `
      <article class="product-card">
        <img src="${p.image}" alt="${p.name}" />
        <div class="product-body">
          <h3>${p.name}</h3>
          <div class="meta"><span>${p.category} • ${p.section}</span><strong>$${p.price}</strong></div>
          <div class="product-actions">
            <input type="number" value="1" min="1" data-id="${p.id}" />
            <button class="btn primary add-btn" data-id="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `).join("");
  };

  document.querySelectorAll(".chip").forEach((chip) => {
    if (chip.dataset.filter === filter) chip.classList.add("active");
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      filter = chip.dataset.filter;
      renderProducts();
    });
  });

  grid.addEventListener("click", (e) => {
    const button = e.target.closest(".add-btn");
    if (!button) return;
    const id = Number(button.dataset.id);
    const qtyInput = grid.querySelector(`input[data-id='${id}']`);
    const qty = Math.max(1, Number(qtyInput?.value || 1));
    const selected = products.find((p) => p.id === id);
    const cart = getCart();
    const existing = cart.find((c) => c.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ ...selected, qty });
    setCart(cart);
    button.textContent = "Added";
    setTimeout(() => (button.textContent = "Add to cart"), 700);
  });

  renderProducts();
}

if (page === "cart") {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const renderCart = () => {
    const cart = getCart();
    if (!cart.length) {
      container.innerHTML = "<p>Your cart is empty. Start shopping now.</p>";
      totalEl.textContent = "$0";
      return;
    }
    container.innerHTML = cart.map((item, i) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div><h3>${item.name}</h3><p>$${item.price} × ${item.qty}</p></div>
        <button class="btn ghost remove-item" data-index="${i}">Remove</button>
      </article>
    `).join("");
    totalEl.textContent = `$${cart.reduce((sum, item) => sum + item.price * item.qty, 0)}`;
  };

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-item");
    if (!btn) return;
    const cart = getCart();
    cart.splice(Number(btn.dataset.index), 1);
    setCart(cart);
    renderCart();
  });

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const trackingId = `WC-${Date.now().toString().slice(-6)}`;
    const orders = getJSON(orderKey(), []);
    orders.unshift({ trackingId, items: cart, total, date: new Date().toLocaleString(), status: "Processing" });
    setJSON(orderKey(), orders);
    setCart([]);
    renderCart();
    alert(`Checkout complete. Tracking ID: ${trackingId}`);
  });

  document.getElementById("trackBtn")?.addEventListener("click", () => {
    const id = document.getElementById("trackingInput").value.trim();
    const order = getJSON(orderKey(), []).find((o) => o.trackingId === id);
    document.getElementById("trackingResult").textContent = order
      ? `Order ${id}: ${order.status} (${order.date})`
      : "Tracking ID not found.";
  });

  renderCart();
}

if (page === "reels") {
  const reels = [
    { title: "Spring Couture", src: "https://assets.mixkit.co/videos/preview/mixkit-woman-with-shopping-bags-1248-large.mp4" },
    { title: "Signature Shoes", src: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-clapperboard-on-a-red-background-34697-large.mp4" },
    { title: "Elegant Jewelry", src: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-at-a-beach-34376-large.mp4" }
  ];
  document.getElementById("reelsList").innerHTML = reels.map((r) => `<article class="reel-card"><video controls loop muted playsinline src="${r.src}"></video><p>${r.title}</p></article>`).join("");
}

if (page === "dashboard") {
  const orders = getJSON(orderKey(), []);
  document.getElementById("purchaseList").innerHTML = orders.length
    ? orders.flatMap((o) => o.items.map((i) => `<li>${i.name} × ${i.qty}</li>`)).join("")
    : "<li>No purchases yet.</li>";
  document.getElementById("paymentList").innerHTML = orders.length
    ? orders.map((o) => `<li>${o.date}: $${o.total} (${o.trackingId})</li>`).join("")
    : "<li>No payment history yet.</li>";

  const profileKey = `wc_profile_${currentUser.email}`;
  const profile = getJSON(profileKey, { name: currentUser.name || "", phone: "" });
  document.getElementById("accountName").value = profile.name;
  document.getElementById("accountPhone").value = profile.phone;
  document.getElementById("accountForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    setJSON(profileKey, {
      name: document.getElementById("accountName").value,
      phone: document.getElementById("accountPhone").value
    });
    document.getElementById("accountMessage").textContent = "Account details saved.";
  });
}

if (page === "contact") {
  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("contactMessage").textContent = "Thanks! Your message has been received.";
    e.target.reset();
  });
}

if (page === "signup") {
  document.getElementById("signupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    if (users.some((u) => u.email === email)) {
      document.getElementById("signupMessage").textContent = "Email already exists.";
      return;
    }
    users.push({ name, email, password });
    setJSON("wc_users", users);
    setJSON("wc_current_user", { name, email });
    window.location.href = "index.html";
  });
}

if (page === "login") {
  document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      document.getElementById("loginMessage").textContent = "Invalid credentials.";
      return;
    }
    setJSON("wc_current_user", { name: user.name, email: user.email });
    window.location.href = "index.html";
  });
}

document.querySelectorAll("#year").forEach((el) => (el.textContent = new Date().getFullYear()));
