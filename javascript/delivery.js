document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("userRole");
  if (role !== "delivery") {
    window.location.href = "../index.html";
    return;
  }

  const container = document.getElementById("deliveryOrders");

  function loadOrders() {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  }

  function saveOrders(arr) {
    localStorage.setItem("orders", JSON.stringify(arr));
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

  function statusLabel(status) {
    if (status === "pending") return "قيد الانتظار";
    if (status === "accepted") return "جاري التوصيل";
    if (status === "rejected") return "مرفوض";
    if (status === "delivered") return "تم التسليم";
    return status || "";
  }

  function render() {
    const orders = loadOrders();
    container.innerHTML = "";

    if (!orders.length) {
      container.innerHTML = "<p class='cart-empty' style='text-align:center;'>لا توجد طلبات حالياً</p>";
      return;
    }

    const ordered = orders.map((o, i) => ({ o, i })).reverse();

    ordered.forEach(({ o, i }) => {
      const card = document.createElement("div");
      card.className = "order-card";

      const dateStr = formatDate(o.date);
      const statusText = statusLabel(o.status);
      const name = o.customerName || "";
      const restaurant = o.restaurant || "مطعم غير محدد";
      const phone = o.customerPhone || o.phone || "";
      const address = o.customerAddress || o.address || "";
      const payment = o.payment || (o.paymentMethod === "card" ? "بطاقة ائتمان" : "الدفع عند الاستلام");
      const total = o.total || 0;

      let actionsHtml = "";
      if (o.status === "pending") {
        actionsHtml =
          `<button class="order-repeat-btn" data-action="accept" data-index="${i}">قبول</button>` +
          `<button class="order-repeat-btn" data-action="reject" data-index="${i}">رفض</button>`;
      } else if (o.status === "accepted") {
        actionsHtml =
          `<button class="order-repeat-btn" data-action="done" data-index="${i}">تم التسليم</button>`;
      }

      card.innerHTML = `
        <div class="order-top">
          <span class="order-status">${statusText}</span>
        </div>
        <div class="order-main">
          <div>
            <div class="order-name">${restaurant}</div>
            <div class="order-note">العميل: ${name}</div>
            <div class="order-note">الهاتف: ${phone}</div>
            <div class="order-note">العنوان: ${address}</div>
            <div class="order-note">طريقة الدفع: ${payment}</div>
          </div>
          <div class="order-side">
            <div class="order-price">${total} ج.م</div>
            <div class="order-date">${dateStr}</div>
            ${actionsHtml}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  container.addEventListener("click", e => {
    const btn = e.target.closest(".order-repeat-btn");
    if (!btn) return;

    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index, 10);
    if (isNaN(index)) return;

    const orders = loadOrders();
    const order = orders[index];
    if (!order) return;

    if (action === "accept") {
      order.status = "accepted";
    } else if (action === "reject") {
      order.status = "rejected";
    } else if (action === "done") {
      order.status = "delivered";
    }

    saveOrders(orders);
    render();
  });

  render();
});
