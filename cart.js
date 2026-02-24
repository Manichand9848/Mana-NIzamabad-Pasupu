let cart = JSON.parse(localStorage.getItem("cart")) || {};

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("open");
}

function addToCart(name, price, image, pack) {
  console.log("clicked");

  if (cart[name]) {
    cart[name].qty++;
  } else {
    cart[name] = { name, price, image, pack, qty: 1 };
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateQty(name, change) {
  if (!cart[name]) return;

  cart[name].qty += change;
  if (cart[name].qty <= 0) delete cart[name];

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const subtotalBox = document.getElementById("cartSubtotal");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  let subtotal = 0;
  let count = 0;

Object.values(cart).forEach(item => {
  if (!item || !item.price) return;
    subtotal += item.price * item.qty;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" class="cart-thumb">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <p>₹${item.price}</p>
        </div>
        <div class="cart-qty">
          <button onclick="updateQty('${item.name}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.name}', 1)">+</button>
        </div>
      </div>`;
  });

  cartCount.innerText = count;
  subtotalBox.innerText = subtotal;
}

updateCartUI();
