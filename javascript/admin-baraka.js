document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "menu_baraka";

  const tabs = document.querySelectorAll(".restaurant-tab");
  const tableBody = document.getElementById("adminMenuBody");
  const form = document.getElementById("adminItemForm");
  const indexInput = document.getElementById("itemIndex");
  const nameInput = document.getElementById("itemName");
  const descInput = document.getElementById("itemDesc");
  const priceInput = document.getElementById("itemPrice");
  const catSelect = document.getElementById("itemCategory");
  const errorP = document.getElementById("adminError");
  const successP = document.getElementById("adminSuccess");

  function getDefaultMenu() {
    return [
      { name: "شاورما دجاج عربي", desc: "شاورما دجاج مع خبز عربي وبطاطس", price: 110, category: "dishes" },
      { name: "وجبة شيش طاووق", desc: "قطع دجاج مشوي مع أرز وخبز وسلطة", price: 140, category: "meals" },
      { name: "وجبة كباب وكفتة", desc: "كباب وكفتة مشوية مع أرز وبطاطس", price: 180, category: "meals" },
      { name: "عرض العائلة", desc: "٤ وجبات متنوعة + مشروبات", price: 320, category: "offers" }
    ];
    
  }

  function getMenu() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) return arr;
      } catch (e) {}
    }
    const def = getDefaultMenu();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
    return def;
  }

  function saveMenu(menu) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
  }

  function getActiveCategory() {
    const activeTab = document.querySelector(".restaurant-tab.active");
    return activeTab ? activeTab.dataset.cat : "dishes";
  }

  function renderTable() {
    const menu = getMenu();
    const cat = getActiveCategory();
    tableBody.innerHTML = "";

    const filtered = menu.filter(i => i.category === cat);
    if (!filtered.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "لا توجد أصناف في هذا القسم حالياً.";
      td.style.textAlign = "center";
      tr.appendChild(td);
      tableBody.appendChild(tr);
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = item.name;

      const tdDesc = document.createElement("td");
      tdDesc.textContent = item.desc || "";

      const tdPrice = document.createElement("td");
      tdPrice.textContent = item.price;

      const tdActions = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.textContent = "تعديل";
      editBtn.className = "admin-action-btn edit-btn";

      const delBtn = document.createElement("button");
      delBtn.textContent = "حذف";
      delBtn.className = "admin-action-btn delete-btn";

      editBtn.addEventListener("click", () => {
        const fullMenu = getMenu();
        const index = fullMenu.findIndex(
          m => m.name === item.name && m.category === item.category && m.price === item.price
        );
        if (index === -1) return;
        indexInput.value = index;
        nameInput.value = fullMenu[index].name;
        descInput.value = fullMenu[index].desc || "";
        priceInput.value = fullMenu[index].price;
        catSelect.value = fullMenu[index].category;
        window.scrollTo({ top: form.offsetTop - 80, behavior: "smooth" });
      });

      delBtn.addEventListener("click", () => {
        const fullMenu = getMenu();
        const index = fullMenu.findIndex(
          m => m.name === item.name && m.category === item.category && m.price === item.price
        );
        if (index === -1) return;
        fullMenu.splice(index, 1);
        saveMenu(fullMenu);
        renderTable();
      });

      tdActions.appendChild(editBtn);
      tdActions.appendChild(delBtn);

      tr.appendChild(tdName);
      tr.appendChild(tdDesc);
      tr.appendChild(tdPrice);
      tr.appendChild(tdActions);

      tableBody.appendChild(tr);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderTable();
      catSelect.value = tab.dataset.cat;
    });
  });

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const desc = descInput.value.trim();
      const price = Number(priceInput.value);
      const category = catSelect.value;

      if (!name || !price || !category) {
        if (successP) successP.textContent = "";
        if (errorP) errorP.textContent = "الاسم والسعر والقسم مطلوبة";
        return;
      }

      const menu = getMenu();
      const idx = parseInt(indexInput.value, 10);

      if (!isNaN(idx) && idx >= 0 && idx < menu.length) {
        menu[idx].name = name;
        menu[idx].desc = desc;
        menu[idx].price = price;
        menu[idx].category = category;
      } else {
        menu.push({ name, desc, price, category });
      }

      saveMenu(menu);
      indexInput.value = "-1";
      nameInput.value = "";
      descInput.value = "";
      priceInput.value = "";
      catSelect.value = getActiveCategory();

      if (errorP) errorP.textContent = "";
      if (successP) successP.textContent = "تم حفظ الصنف";

      renderTable();
    });
  }

  renderTable();
  catSelect.value = getActiveCategory();
});
