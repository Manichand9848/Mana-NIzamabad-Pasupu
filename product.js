let cart = JSON.parse(localStorage.getItem("cart")) || {};

function addToCart(name, price, image, pack) {
    if (cart[name]) {
        cart[name].qty += 1;
    } else {
        cart[name] = {
            name: name,
            price: price,
            qty: 1,
            image: image,
            pack: pack
        };
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart");
}

function updateCartCount() {
    let count = 0;
    for (let key in cart) {
        count += cart[key].qty;
    }
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.innerText = count;
}

updateCartCount();
