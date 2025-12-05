document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".restaurant-tab");
  const list = document.getElementById("restaurantItems");

  function getDefaultMenu() {
    return [
      { name: "شاورما دجاج عربي", desc: "شاورما دجاج مع خبز عربي وبطاطس", price: 110, category: "dishes" },
      { name: "وجبة شيش طاووق", desc: "قطع دجاج مشوي مع أرز وخبز وسلطة", price: 140, category: "meals" },
      { name: "وجبة كباب وكفتة", desc: "كباب وكفتة مشوية مع أرز وبطاطس", price: 180, category: "meals" },
      { name: "عرض العائلة", desc: "٤ وجبات متنوعة + مشروبات", price: 320, category: "offers" }
    ];
  }

  function getMenu() {
    const key = "menu_baraka";
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
      card.dataset.restaurant = "مطعم البركة";
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
            restaurant: "مطعم البركة"
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

  renderCategory("dishes");
});
