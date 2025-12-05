document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  function filterAllCards() {
    const term = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll("[class*='card']");

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      if (term === "" || text.includes(term)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchInput.addEventListener("input", filterAllCards);
});
