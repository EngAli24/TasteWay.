const CART_KEY = "cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount(cart);
}

function updateCartCount(cart) {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cart.length;
}

window.addToCart = function (item) {
  const cart = getCart();
  cart.push({
    name: item.name,
    price: Number(item.price),
    restaurant: item.restaurant || "",
    qty: 1
  });
  saveCart(cart);
  alert("تمت الإضافة إلى السلة");
};

function renderCart() {
  const cartWrapper = document.querySelector(".cart-wrapper");
  if (!cartWrapper) return;

  const list = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotalValue");
  const deliveryEl = document.getElementById("deliveryValue");
  const totalEl = document.getElementById("totalValue");

  const cart = getCart();
  const deliveryFee = 20;

  if (!list) return;

  list.innerHTML = "";

  if (!cart.length) {
    list.innerHTML = '<p class="cart-empty">سلة المشتريات فارغة.</p>';
  } else {
    cart.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "cart-item-card";

      card.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-restaurant">${item.restaurant || ""}</div>
          <div class="cart-item-price-line">
            السعر: <span>${item.price} ج.م</span>
          </div>
          <div class="cart-qty">
            <button data-action="dec" data-index="${index}">-</button>
            <span>${item.qty}</span>
            <button data-action="inc" data-index="${index}">+</button>
          </div>
        </div>
        <button class="cart-remove" data-action="remove" data-index="${index}">×</button>
      `;

      list.appendChild(card);
    });
  }

  let subtotal = 0;
  cart.forEach(i => {
    subtotal += Number(i.price) * Number(i.qty);
  });

  if (subtotalEl) subtotalEl.textContent = subtotal + " ج.م";
  if (deliveryEl) deliveryEl.textContent = deliveryFee + " ج.م";
  if (totalEl) totalEl.textContent = subtotal + deliveryFee + " ج.م";

  list.addEventListener("click", handleCartActions, { once: true });
}

function handleCartActions(e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = parseInt(btn.dataset.index, 10);
  if (isNaN(index)) return;

  const cart = getCart();
  const item = cart[index];
  if (!item) return;

  if (action === "inc") {
    item.qty += 1;
  }
  if (action === "dec") {
    if (item.qty > 1) item.qty -= 1;
  }
  if (action === "remove") {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function handleConfirmOrder() {
  const cart = getCart();
  if (!cart.length) {
    alert("سلة المشتريات فارغة");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const phoneInput = document.getElementById("orderPhone");
  const addressInput = document.getElementById("orderAddress");

  const phone = phoneInput ? phoneInput.value.trim() : "";
  const address = addressInput ? addressInput.value.trim() : "";

  if (!phone || !address) {
    alert("من فضلك أدخل رقم الهاتف والعنوان قبل تأكيد الطلب");
    return;
  }

  const paymentInput = document.querySelector('input[name="payment"]:checked');
  const paymentMethod = paymentInput ? paymentInput.value : "cod";

  if (paymentMethod === "card") {
    const cardNumber = document.getElementById("cardNumber");
    const cardName = document.getElementById("cardName");
    const cardExpiry = document.getElementById("cardExpiry");
    const cardCvv = document.getElementById("cardCvv");

    if (
      !cardNumber ||
      !cardName ||
      !cardExpiry ||
      !cardCvv ||
      !cardNumber.value.trim() ||
      !cardName.value.trim() ||
      !cardExpiry.value.trim() ||
      !cardCvv.value.trim()
    ) {
      alert("من فضلك أدخل بيانات البطاقة كاملة");
      return;
    }
  }

  let subtotal = 0;
  cart.forEach(i => {
    subtotal += Number(i.price) * Number(i.qty);
  });
  const deliveryFee = 20;
  const total = subtotal + deliveryFee;

  const orderId = "ORD-" + Date.now();

  const paymentText = paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة ائتمان";

  const order = {
    id: orderId,
    items: cart,
    subtotal,
    deliveryFee,
    total,
    date: new Date().toISOString(),
    status: "pending",
    restaurant: cart[0] ? cart[0].restaurant || "" : "",
    customerName: user ? user.name || "" : "",
    customerEmail: user ? user.email || "" : "",
    customerPhone: phone,
    customerAddress: address,
    phone,
    address,
    paymentMethod,
    payment: paymentText
  };

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("currentOrderId", orderId);

  saveCart([]);
  window.location.href = "order-track.html?id=" + orderId;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount(getCart());

  const cartWrapper = document.querySelector(".cart-wrapper");
  if (cartWrapper) {
    renderCart();
  }

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const phoneInput = document.getElementById("orderPhone");
  const addressInput = document.getElementById("orderAddress");

  if (user) {
    if (phoneInput && user.phone) {
      phoneInput.value = user.phone;
    }
    if (addressInput && user.address) {
      addressInput.value = user.address;
    }
  }

  const confirmBtn = document.getElementById("confirmOrder");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", handleConfirmOrder);
  }

  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById("cardDetails");

  if (paymentRadios && cardDetails) {
    paymentRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.checked && radio.value === "card") {
          cardDetails.style.display = "block";
        } else if (radio.checked && radio.value !== "card") {
          cardDetails.style.display = "none";
        }
      });
    });

    const checked = document.querySelector('input[name="payment"]:checked');
    if (checked && checked.value === "card") {
      cardDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
    }
  }
});
