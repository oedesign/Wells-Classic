const CART_STORAGE_KEY = "wellsClassicCart";
const ADMIN_EMAIL = "wellsclassicshop@gmail.com";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function setCart(cartItems) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  updateCartCount();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  setCart(cart);
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
}

function clearCart() {
  setCart([]);
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = count;
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("visible"));

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

window.WellsStore = {
  ADMIN_EMAIL,
  getCart,
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
};

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

const themeToggle = document.getElementById("themeToggle");
const themeToggleMobile = document.getElementById("themeToggleMobile");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener("click", toggleTheme);
}

applyTheme(localStorage.getItem("theme") || "light");

const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  if (slides[index]) {
    slides[index].classList.add("active");
  }
}

if (slides.length && nextBtn && prevBtn) {
  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
}

updateCartCount();
