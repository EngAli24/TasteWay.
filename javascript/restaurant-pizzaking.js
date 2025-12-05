document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".restaurant-tab");
  const list = document.getElementById("restaurantItems");

  function getDefaultMenu() {
    return [
      { name: "بيتزا مارجرينا", desc: "جبنة موتزاريلا مع صوص طماطم كلاسيكي", price: 90, category: "pizza" },
      { name: "بيتزا ببروني", desc: "شرائح ببروني حارة مع جبنة", price: 110, category: "pizza" },
      { name: "بيتزا خضار", desc: "فلفل ألوان وزيتون وطماطم وجبنة", price: 95, category: "pizza" },
      { name: "وجبة بيتزا فردية", desc: "بيتزا وسط + بطاطس + مشروب", price: 140, category: "meals" },
      { name: "وجبة لشخصين", desc: "بيتزتان وسط + بطاطس كبيرة + ٢ مشروب", price: 230, category: "meals" },
      { name: "عرض بيتزا عائلية", desc: "بيتزا عائلية كبيرة + بيتزا وسط مجاناً", price: 250, category: "offers" }
    ];
  }

  function getMenu() {
    const key = "menu_pizzaking";
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr) && arr.length) return arr;
      } catch (e) {}
    }
    const def = getDefaultMenu();
    localStorage.setItem(key, JSON.stringify(def));
    return def;
  }

  function renderCategory(cat) {
    list.innerHTML = "";
    const menu = getMenu().filter(item => item.category === cat);

    if (!menu.length) {
      const empty = document.createElement("div");
      empty.textContent = "لا توجد أصناف في هذا القسم حالياً.";
      empty.style.textAlign = "center";
      empty.style.padding = "12px 0";
      list.appendChild(empty);
      return;
    }

    menu.forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-row-card menu-item";
      card.dataset.restaurant = "Pizza King";
      card.dataset.name = item.name;
      card.dataset.price = item.price;

      card.innerHTML = `
        <div class="menu-row-info">
          <div class="menu-row-title">${item.name}</div>
          <div class="menu-row-desc">${item.desc || ""}</div>
          <div class="menu-row-foot">
            <span class="menu-row-price">${item.price} ج</span>
            <button class="add-to-cart">أضف الى المشتريات</button>
          </div>
        </div>
        <div class="menu-row-image">
          <img src="" alt="${item.name}">
        </div>
      `;

      const btn = card.querySelector(".add-to-cart");
      btn.addEventListener("click", () => {
        if (typeof addToCart === "function") {
          addToCart({
            name: item.name,
            price: item.price,
            restaurant: "Pizza King"
          });
        }
      });

      list.appendChild(card);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderCategory(tab.dataset.cat);
    });
  });

  renderCategory("pizza");
});
