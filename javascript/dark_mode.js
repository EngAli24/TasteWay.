const toggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

/* Load saved theme */
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (toggle) toggle.textContent = "☀️";
}

/* Toggle theme */
toggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggle.textContent = isDark ? "☀️" : "🌙";
});