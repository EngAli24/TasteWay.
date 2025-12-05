document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let orderId = params.get("id");
  if (!orderId) {
    orderId = localStorage.getItem("currentOrderId") || "";
  }

  const idEl = document.getElementById("trackOrderId");
  const restEl = document.getElementById("trackRestaurant");
  const totalEl = document.getElementById("trackTotal");
  const statusText = document.getElementById("trackStatusText");
  const stepsEls = document.querySelectorAll(".track-steps li");
  const advanceBtn = document.getElementById("advanceStatusBtn");
  const confirmBtn = document.getElementById("confirmReceiveBtn");

  if (!orderId) {
    if (statusText) statusText.textContent = "لا يوجد طلب نشط حالياً.";
    return;
  }

  function loadOrder() {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    return orders.find(o => o.id === orderId);
  }

  function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const idx = orders.findIndex(o => o.id === order.id);
    if (idx !== -1) {
      orders[idx] = order;
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }

  function mapStatusToStep(status) {
    if (status === "pending") return 1;
    if (status === "accepted" || status === "preparing") return 2;
    if (status === "ontheway") return 3;
    if (status === "delivered") return 4;
    return 1;
  }

  function render() {
    const order = loadOrder();
    if (!order) {
      if (statusText) statusText.textContent = "لم يتم العثور على الطلب.";
      return;
    }

    if (idEl) idEl.textContent = "رقم الطلب: " + order.id;
    if (restEl) restEl.textContent = "المطعم: " + (order.restaurant || "");
    if (totalEl) totalEl.textContent = "الإجمالي: " + order.total + " ج.م";
    if (statusText) {
      if (order.status === "pending") statusText.textContent = "تم استلام طلبك وسيتم تأكيده من المطعم.";
      else if (order.status === "accepted" || order.status === "preparing") statusText.textContent = "طلبك قيد التحضير.";
      else if (order.status === "ontheway") statusText.textContent = "طلبك في الطريق إليك.";
      else if (order.status === "delivered") statusText.textContent = "تم تسليم الطلب. شكرًا لتعاملك معنا.";
      else if (order.status === "rejected") statusText.textContent = "تم رفض الطلب.";
    }

    const currentStep = mapStatusToStep(order.status);
    stepsEls.forEach(li => {
      const s = parseInt(li.dataset.step, 10);
      li.classList.remove("step-active", "step-done");
      if (s < currentStep) li.classList.add("step-done");
      if (s === currentStep) li.classList.add("step-active");
    });

    if (confirmBtn) {
      confirmBtn.disabled = order.status === "delivered" || order.status === "rejected";
    }
  }

  function advanceStatus() {
    const order = loadOrder();
    if (!order) return;

    if (order.status === "pending") order.status = "preparing";
    else if (order.status === "preparing" || order.status === "accepted") order.status = "ontheway";
    else if (order.status === "ontheway") order.status = "delivered";

    saveOrder(order);
    render();
  }

  function confirmReceive() {
    const order = loadOrder();
    if (!order) return;
    order.status = "delivered";
    saveOrder(order);
    render();
    alert("تم تأكيد استلام الطلب. شكرًا لك.");
  }

  if (advanceBtn) advanceBtn.addEventListener("click", advanceStatus);
  if (confirmBtn) confirmBtn.addEventListener("click", confirmReceive);

  render();
});
