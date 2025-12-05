const registerForm = document.getElementById("registerForm");
const registerError = document.getElementById("registerError");

registerForm.addEventListener("submit", e => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!fullName || !email || !password || !confirmPassword) {
    registerError.textContent = "يرجى تعبئة جميع الحقول.";
    return;
  }

  if (password.length < 6) {
    registerError.textContent = "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
    return;
  }

  if (password !== confirmPassword) {
    registerError.textContent = "كلمتا المرور غير متطابقتين.";
    return;
  }

  const userData = {
    name: fullName,
    email: email,
    password: password
  };

  localStorage.setItem("user", JSON.stringify(userData));

  registerError.textContent = "";
  window.location.href = "../index.html";

});
