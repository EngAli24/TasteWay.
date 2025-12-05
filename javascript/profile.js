document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const nameDisplay = document.getElementById("profileNameDisplay");
  const viewEmail = document.getElementById("viewEmail");
  const viewPhone = document.getElementById("viewPhone");
  const viewAddress = document.getElementById("viewAddress");

  const form = document.getElementById("profileForm");
  const editBtn = document.getElementById("editProfileBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const phoneInput = document.getElementById("profilePhone");
  const addressInput = document.getElementById("profileAddress");

  const errorP = document.getElementById("profileError");
  const successP = document.getElementById("profileSuccess");

  const lastOrderBox = document.getElementById("lastOrderBox");
  const lastOrderSummary = document.getElementById("lastOrderSummary");
  const lastOrderDate = document.getElementById("lastOrderDate");
  const ordersCountP = document.getElementById("ordersCount");

  const ordersSection = document.getElementById("ordersSection");
  const ordersList = document.getElementById("ordersList");
if (editBtn && form) {
    editBtn.addEventListener("click", () => {
      form.style.display = "flex";
      editBtn.style.display = "none";
      if (errorP) errorP.textContent = "";
      if (successP) successP.textContent = "";

      nameInput.value = user.name || "";
      emailInput.value = user.email || "";
      phoneInput.value = user.phone || "";
      addressInput.value = user.address || "";
    });
  }

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const newName = nameInput.value.trim();
      const newEmail = emailInput.value.trim();

      if (!newName || !newEmail) {
        if (successP) successP.textContent = "";
        if (errorP) errorP.textContent = "الاسم والبريد الإلكتروني مطلوبان";
        return;
      }

      user.name = newName;
      user.email = newEmail;
      user.phone = phoneInput.value.trim();
      user.address = addressInput.value.trim();

      localStorage.setItem("user", JSON.stringify(user));

      form.style.display = "none";
      if (editBtn) editBtn.style.display = "inline-block";

      if (errorP) errorP.textContent = "";
      if (successP) successP.textContent = "تم حفظ التعديلات";

      renderUserView();
    });
  }

  if (cancelBtn && form && editBtn) {
    cancelBtn.addEventListener("click", () => {
      form.style.display = "none";
      editBtn.style.display = "inline-block";
      if (errorP) errorP.textContent = "";
      if (successP) successP.textContent = "";
    });
  }
  function renderUserView() {
    if (nameDisplay) nameDisplay.textContent = user.name || "مستخدم";
    if (viewEmail) viewEmail.textContent = "البريد: " + (user.email || "غير مسجل");
    if (viewPhone) viewPhone.textContent = "رقم الهاتف: " + (user.phone || "غير مضاف");
    if (viewAddress) viewAddress.textContent = "العنوان: " + (user.address || "غير مضاف");
  }
  

  function getOrders() {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return day + " / " + month + " / " + year;
  }

  function renderOrders() {
    const orders = getOrders();

    if (!orders.length) {
      if (lastOrderBox) lastOrderBox.style.display = "none";
      if (ordersSection) ordersSection.style.display = "none";
      return;
    }

    const lastOrder = orders[orders.length - 1];
    const lastItemsCount = lastOrder.items ? lastOrder.items.length : 0;
    const lastTotal = lastOrder.total || 0;
    const lastDate = formatDate(lastOrder.date);

    if (lastOrderBox && lastOrderSummary && lastOrderDate && ordersCountP) {
      lastOrderSummary.textContent =
        "عدد الأصناف في آخر طلب: " + lastItemsCount + " • الإجمالي: " + lastTotal + " ج.م";
      lastOrderDate.textContent = lastOrder.date ? "تاريخ الطلب: " + lastDate : "";
      ordersCountP.textContent = "إجمالي عدد الطلبات: " + orders.length;
      lastOrderBox.style.display = "block";
    }

    if (!ordersList || !ordersSection) return;

    ordersList.innerHTML = "";
    ordersSection.style.display = "block";

    orders.forEach((order, index) => {
      const card = document.createElement("div");
      card.className = "order-card";

      const items = order.items || [];
      let title = "طلب رقم " + (index + 1);
      let note = "";

      if (items.length === 1) {
        title = items[0].name || title;
        note = items[0].restaurant || "";
      } else if (items.length > 1) {
        const first = items[0];
        title = items.length + "x " + (first.name || "عنصر");
        note = first.restaurant || "";
      }

      const date = formatDate(order.date);
      const total = order.total || 0;

      const isActive = order.status !== "delivered" && order.status !== "rejected";

      const actionLabel = isActive ? "تتبع الطلب" : "إعادة طلب";
      const actionType = isActive ? "track" : "repeat";

      card.innerHTML = `
        <div class="order-top">
          <span class="order-status">${isActive ? "طلب جاري" : "تم التوصيل"}</span>
        </div>
        <div class="order-main">
          <div>
            <div class="order-name">${title}</div>
            <div class="order-note">${note}</div>
          </div>
          <div class="order-side">
            <div class="order-price">${total} ج.م</div>
            <div class="order-date">${date}</div>
            <button class="order-repeat-btn" data-type="${actionType}" data-id="${order.id}">
              ${actionLabel}
            </button>
          </div>
        </div>
      `;

      ordersList.appendChild(card);
    });

    ordersList.addEventListener("click", e => {
      const btn = e.target.closest(".order-repeat-btn");
      if (!btn) return;

      const type = btn.dataset.type;
      const id = btn.dataset.id;
      if (!id) return;

      const orders = getOrders();
      const order = orders.find(o => o.id === id);
      if (!order) return;

      if (type === "track") {
        localStorage.setItem("currentOrderId", id);
        window.location.href = "order-track.html?id=" + id;
      } else if (type === "repeat") {
        const cart = order.items || [];
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.href = "cart.html";
      }
    });
  }

  renderUserView();
  renderOrders();

  

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("orders");
      window.location.href = "../index.html";
    });
  }
});
