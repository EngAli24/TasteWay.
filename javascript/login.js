document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const errorP = document.getElementById("errorMessage");
  const togglePasswordBtn = document.getElementById("togglePassword");

  if (togglePasswordBtn && passInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passInput.type === "password" ? "text" : "password";
      passInput.type = type;
    });
  }

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    if (!email || !password) {
      errorP.textContent = "من فضلك أدخل البريد الإلكتروني وكلمة المرور";
      return;
    }

    // أدمن Pizza King
    if (email === "pizzaking@admin.com" && password === "pizza123") {
      localStorage.setItem("userRole", "admin-pizzaking");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Pizza King Admin", email, phone: "", address: "" })
      );
      window.location.href = "html/admin-pizzaking.html";
      return;
    }

    // أدمن البركة
    if (email === "baraka@admin.com" && password === "baraka123") {
      localStorage.setItem("userRole", "admin-baraka");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Admin البركة", email, phone: "", address: "" })
      );
      window.location.href = "html/admin-baraka.html";
      return;
    } 
    //دليفري
    if (email === "tasteway@delivery.com" && password === "123456") {
      localStorage.setItem("userRole", "delivery");
      window.location.href = "html/delivery.html";
      return;
    }
    // مستخدم عادي
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
      errorP.textContent = "بيانات الدخول غير صحيحة";
      return;
    }

    localStorage.setItem("userRole", "user");
    errorP.textContent = "";
    window.location.href = "html/home.html";
  });
});
