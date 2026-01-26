/* ========= PRODUCTS DATA ========= */
const products = [
  {
    id: 1,
    name: "Casual T-Shirt",
    price: 29,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
  },
  {
    id: 2,
    name: "Running Sneakers",
    price: 120,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"
  },
  {
    id: 3,
    name: "Gold Necklace",
    price: 240,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 4,
    name: "Luxury Watch",
    price: 310,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 89,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  },
  {
    id: 6,
    name: "Leather Shoes",
    price: 150,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
  },
  {
    id: 7,
    name: "Leather Shoes",
    price: 150,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
  },
  {
    id: 8,
    name: "Leather Shoes",
    price: 150,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
  },
  {
    id: 9,
    name: "Denim Jacket",
    price: 89,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  },
  {
    id: 10,
    name: "Denim Jacket",
    price: 89,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  },
  {
    id: 11,
    name: "Denim Jacket",
    price: 89,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  },
  {
    id: 12,
    name: "Denim Jacket",
    price: 89,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  },
  {
    id: 13,
    name: "Denim Jacket",
    price: 89,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  },
  {
    id: 14,
    name: "Denim Jacket",
    price: 89,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  },
  {
    id: 15,
    name: "Gold Necklace",
    price: 240,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 16,
    name: "Gold Necklace",
    price: 240,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 17,
    name: "Gold Necklace",
    price: 240,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 18,
    name: "Gold Necklace",
    price: 240,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 19,
    name: "Gold Necklace",
    price: 240,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 20,
    name: "Gold Necklace",
    price: 240,
    category: "jewelry",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 21,
    name: "Luxury Watch",
    price: 310,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 22,
    name: "Luxury Watch",
    price: 310,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 23,
    name: "Luxury Watch",
    price: 310,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 24,
    name: "Luxury Watch",
    price: 310,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 25,
    name: "Luxury Watch",
    price: 310,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
  {
    id: 26,
    name: "Luxury Watch",
    price: 310,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  },
];

/* ========= RENDER PRODUCTS ========= */
const grid = document.getElementById("productsGrid");
const filterButtons = document.querySelectorAll(".filter");

function renderProducts(category) {
  grid.innerHTML = "";

  const filtered =
    category === "all"
      ? products
      : products.filter(p => p.category === category);

  if (!filtered.length) {
    grid.innerHTML =
      `<p class="empty-state">No products found in this category.</p>`;
    return;
  }

  filtered.forEach(product => {
    grid.innerHTML += `
      <div class="product-card">
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}">
          <span class="badge">In Stock</span>
        </div>

        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="price">$${product.price}</div>

          <div class="product-actions">
            <input type="number" min="1" value="1" class="qty">
            <button class="add-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}

/* ========= FILTER HANDLING ========= */
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

/* ========= LOAD FROM URL PARAM ========= */
const params = new URLSearchParams(window.location.search);
renderProducts(params.get("category") || "all");
