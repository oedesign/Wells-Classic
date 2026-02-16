const cartList = document.getElementById("cartItems");
const subtotalNode = document.getElementById("subtotal");
const shippingNode = document.getElementById("shipping");
const totalNode = document.getElementById("total");
const checkoutForm = document.getElementById("checkoutForm");
const clearCartBtn = document.getElementById("clearCartBtn");
const emptyState = document.getElementById("emptyCart");

function currency(value) {
  return `$${value.toFixed(2)}`;
}

function renderCart() {
  const cart = window.WellsStore.getCart();
  cartList.innerHTML = "";

  if (!cart.length) {
    emptyState.hidden = false;
    subtotalNode.textContent = "$0.00";
    shippingNode.textContent = "$0.00";
    totalNode.textContent = "$0.00";
    return;
  }

  emptyState.hidden = true;

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${currency(item.price)} × ${item.qty}</p>
      </div>
      <button class="remove-item" data-id="${item.id}">Remove</button>
    `;
    cartList.appendChild(row);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;

  subtotalNode.textContent = currency(subtotal);
  shippingNode.textContent = shipping === 0 ? "Free" : currency(shipping);
  totalNode.textContent = currency(total);

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      window.WellsStore.removeFromCart(Number(button.dataset.id));
      renderCart();
    });
  });
}

clearCartBtn.addEventListener("click", () => {
  window.WellsStore.clearCart();
  renderCart();
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cart = window.WellsStore.getCart();

  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerEmail = document.getElementById("customerEmail").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const deliveryAddress = document.getElementById("deliveryAddress").value.trim();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;
  const orderRef = `WC-${Date.now().toString().slice(-8)}`;

  const items = cart.map(
    (item) => `- ${item.name} x${item.qty} ($${(item.price * item.qty).toFixed(2)})`
  );

  const body = [
    `New order from Wells Classic website`,
    `Order Reference: ${orderRef}`,
    `Order Date: ${new Date().toLocaleString()}`,
    ``,
    `Customer Name: ${customerName}`,
    `Email: ${customerEmail}`,
    `Phone: ${customerPhone}`,
    `Delivery Address: ${deliveryAddress}`,
    ``,
    `Items:`,
    ...items,
    ``,
    `Subtotal: $${subtotal.toFixed(2)}`,
    `Shipping: ${shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}`,
    `Order Total: $${total.toFixed(2)}`,
  ].join("\n");

  const subject = encodeURIComponent(`New Wells Classic Order - ${customerName}`);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(window.WellsStore.ADMIN_EMAIL)}&su=${subject}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, "_blank");

  window.WellsStore.clearCart();
  renderCart();
  checkoutForm.reset();
  window.scrollTo({ top: 0, behavior: "smooth" });
  alert("Order drafted in Gmail for admin. Please send it to complete.");
});

renderCart();
