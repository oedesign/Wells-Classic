const products = [
  { id: 1, name: "Casual T-Shirt", price: 29, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
  { id: 2, name: "Running Sneakers", price: 120, category: "shoes", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77" },
  { id: 3, name: "Gold Necklace", price: 240, category: "jewelry", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519" },
  { id: 4, name: "Luxury Watch", price: 310, category: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
  { id: 5, name: "Denim Jacket", price: 89, category: "clothing", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246" },
  { id: 6, name: "Leather Shoes", price: 150, category: "shoes", image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6" },
  { id: 7, name: "Silver Ring", price: 90, category: "jewelry", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638" },
  { id: 8, name: "Leather Belt", price: 55, category: "accessories", image: "https://images.unsplash.com/photo-1555529771-7888783a18d3" },
  { id: 9, name: "Classic Hoodie", price: 64, category: "clothing", image: "https://images.unsplash.com/photo-1620799139507-2a5b1d6d8f4f" },
  { id: 10, name: "Street Sneakers", price: 135, category: "shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { id: 11, name: "Pearl Pendant", price: 180, category: "jewelry", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d" },
  { id: 12, name: "Luxury Sunglasses", price: 99, category: "accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083" }
];

const grid = document.getElementById("productsGrid");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.getElementById("productSearch");
const sortSelect = document.getElementById("sortProducts");

let currentCategory = "all";

function getFilteredProducts() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  const sortValue = sortSelect?.value || "featured";

  let filtered =
    currentCategory === "all"
      ? [...products]
      : products.filter((product) => product.category === currentCategory);

  if (query) {
    filtered = filtered.filter((product) => product.name.toLowerCase().includes(query));
  }

  if (sortValue === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sortValue === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
}

function renderProducts() {
  const filtered = getFilteredProducts();
  grid.innerHTML = "";

  if (!filtered.length) {
    grid.innerHTML = `<p class="empty-state">No products match your search.</p>`;
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}">
        <span class="badge">In Stock</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price">$${product.price}</div>
        <p class="product-meta">Free delivery • 2-year warranty</p>
        <div class="product-actions">
          <input type="number" min="1" value="1" class="qty" aria-label="${product.name} quantity">
          <button class="add-cart" data-id="${product.id}">Add to Cart</button>
        </div>
        <a class="buy-now" href="cart.html">Buy Now</a>
      </div>
    `;
    grid.appendChild(card);
  });

  attachCartHandlers();
}

function attachCartHandlers() {
  document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const selectedProduct = products.find((product) => product.id === id);
      if (!selectedProduct) {
        return;
      }
      const qtyInput = button.parentElement.querySelector(".qty");
      const qty = Math.max(1, Number(qtyInput.value) || 1);

      window.WellsStore.addToCart(selectedProduct, qty);
      qtyInput.value = 1;
    });
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((button) => button.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}

if (sortSelect) {
  sortSelect.addEventListener("change", renderProducts);
}

const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("category") || "all";
const matchingBtn = document.querySelector(`.filter[data-category="${categoryFromUrl}"]`);
if (matchingBtn) {
  matchingBtn.click();
} else {
  renderProducts();
}
