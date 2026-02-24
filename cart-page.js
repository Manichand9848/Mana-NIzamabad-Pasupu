let cart = JSON.parse(localStorage.getItem("cart")) || {};

const cartTable = document.getElementById("cartTable");
const subTotalBox = document.getElementById("subTotal");
const grandTotalBox = document.getElementById("grandTotal");


function renderCart() {
  if (!cartTable) return;

  cartTable.innerHTML = "";
  let subtotal = 0;

  Object.values(cart).forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    cartTable.innerHTML += `
      <tr>
        <td class="product-cell">
          <span class="remove" onclick="removeItem('${item.name}')">×</span>
          <img src="${item.image}" class="cart-img">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.pack}</small>
          </div>
        </td>
        <td>₹${item.price}</td>
        <td>
          <div class="qty-box">
            <button onclick="updateQty('${item.name}', -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty('${item.name}', 1)">+</button>
          </div>
        </td>
        <td>₹${itemTotal}</td>
      </tr>`;
  });

  subTotalBox.innerText = "₹" + subtotal;
grandTotalBox.innerText = "₹" + subtotal;

  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateQty(name, change) {
  if (!cart[name]) return;
  cart[name].qty += change;
  if (cart[name].qty <= 0) delete cart[name];
  renderCart();
}

function removeItem(name) {
  delete cart[name];
  renderCart();
}

renderCart();
