// document.addEventListener("DOMContentLoaded", () => {
//   const tabs = document.querySelectorAll(".tabs a");
//   const container = document.getElementById("dynamicContent");

//   function getMenu(key, getDefault) {
//     const stored = localStorage.getItem(key);
//     if (stored) {
//       try {
//         return JSON.parse(stored);
//       } catch (e) {
//         return getDefault();
//       }
//     }
//     return getDefault();
//   }

//   function getDefaultPizzaMenu() {
//     return [
//       { name: "بيتزا مارجرينا", price: 90, category: "pizza" },
//       { name: "بيتزا ببروني", price: 110, category: "pizza" },
//       { name: "بيتزا خضار", price: 95, category: "pizza" },
//       { name: "وجبة بيتزا فردية", price: 140, category: "meals" },
//       { name: "عرض بيتزا عائلية", price: 250, category: "offers" }
//     ];
//   }

//   function getDefaultBarakaMenu() {
//     return [
//       { name: "وجبة شيش طاووق", price: 140, category: "meals" },
//       { name: "شاورما دجاج عربي", price: 110, category: "dishes" },
//       { name: "عرض العائلة", price: 320, category: "offers" }
//     ];
//   }

//   function withRestaurant(menu, restaurantName) {
//     return menu.map(item => ({
//       ...item,
//       restaurant: item.restaurant || restaurantName
//     }));
//   }

//   const pizzaMenu = withRestaurant(getMenu("menu_pizzaking", getDefaultPizzaMenu), "Pizza King");
//   const barakaMenu = withRestaurant(getMenu("menu_baraka", getDefaultBarakaMenu), "البركة");
//   const allMenu = [...pizzaMenu, ...barakaMenu];

//   const restaurants = [
//     { name: "Pizza King", desc: "بيتزا ومأكولات سريعة", link: "restaurant-pizzaking.html" },
//     { name: "البركة", desc: "مشاوي ووجبات شرقية", link: "restaurant-baraka.html" },
//     { name: "الملكة المصرية", desc: "كشري ومأكولات شعبية", link: "restaurant-malikamisr.html" },
//     { name: "إيطاليانو", desc: "مكرونة وبيتزا", link: "restaurant-italiano.html" },
//     { name: "برجر فاكتوري", desc: "برجر وجبات سريعة", link: "restaurant-burgerfactory.html" },
//     { name: "شاورما هاوس", desc: "شاورما وسندويتشات", link: "restaurant-shawarmahouse.html" }
//   ];

//   function renderRestaurants() {
//     container.innerHTML = "";
//     restaurants.forEach(r => {
//       const link = document.createElement("a");
//       link.href = r.link;
//       link.className = "card-link";

//       const card = document.createElement("div");
//       card.className = "card";

//       const h3 = document.createElement("h3");
//       h3.textContent = r.name;

//       const p = document.createElement("p");
//       p.textContent = r.desc;

//       const btn = document.createElement("button");
//       btn.type = "button";
//       btn.className = "add-to-cart";
//       btn.textContent = "عرض التفاصيل";

//       card.appendChild(h3);
//       card.appendChild(p);
//       card.appendChild(btn);
//       link.appendChild(card);
//       container.appendChild(link);
//     });
//   }

//   function renderCategory(key) {
//     container.innerHTML = "";

//     let filtered = [];
//     if (key === "dishes") {
//       filtered = allMenu.filter(i => i.category === "pizza" || i.category === "dishes");
//     } else if (key === "meals") {
//       filtered = allMenu.filter(i => i.category === "meals");
//     } else if (key === "offers") {
//       filtered = allMenu.filter(i => i.category === "offers");
//     }

//     if (!filtered.length) {
//       const p = document.createElement("p");
//       p.textContent = "لا توجد عناصر حالياً في هذا القسم.";
//       p.style.textAlign = "center";
//       container.appendChild(p);
//       return;
//     }

//     filtered.forEach(item => {
//       const card = document.createElement("div");
//       card.className = "card";
//       card.dataset.restaurant = item.restaurant;
//       card.dataset.name = item.name;
//       card.dataset.price = item.price;

//       const h3 = document.createElement("h3");
//       h3.textContent = item.name;

//       const pRest = document.createElement("p");
//       pRest.textContent = item.restaurant;

//       const pPrice = document.createElement("p");
//       pPrice.textContent = item.price + " ج.م";

//       const btn = document.createElement("button");
//       btn.type = "button";
//       btn.className = "add-to-cart";
//       btn.textContent = "أضف إلى السلة";

//       btn.addEventListener("click", () => {
//         const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//         cart.push({
//           name: item.name,
//           price: item.price,
//           restaurant: item.restaurant
//         });
//         localStorage.setItem("cart", JSON.stringify(cart));
//       });

//       card.appendChild(h3);
//       card.appendChild(pRest);
//       card.appendChild(pPrice);
//       card.appendChild(btn);
//       container.appendChild(card);
//     });
//   }

//   tabs.forEach(tab => {
//     tab.addEventListener("click", e => {
//       e.preventDefault();
//       tabs.forEach(t => t.classList.remove("active"));
//       tab.classList.add("active");

//       const key = tab.dataset.tab;
//       if (key === "restaurants") {
//         renderRestaurants();
//       } else {
//         renderCategory(key);
//       }
//     });
//   });

//   renderRestaurants();
// });
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabs a");
  const container = document.getElementById("dynamicContent");

  function getMenu(key, getDefault) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return getDefault();
      }
    }
    return getDefault();
  }

  function getDefaultPizzaMenu() {
    return [
      { name: "بيتزا مارجرينا", price: 90, category: "pizza" },
      { name: "بيتزا ببروني", price: 110, category: "pizza" },
      { name: "بيتزا خضار", price: 95, category: "pizza" },
      { name: "وجبة بيتزا فردية", price: 140, category: "meals" },
      { name: "عرض بيتزا عائلية", price: 250, category: "offers" }
    ];
  }

  function getDefaultBarakaMenu() {
    return [
      { name: "وجبة شيش طاووق", price: 140, category: "meals" },
      { name: "شاورما دجاج عربي", price: 110, category: "dishes" },
      { name: "عرض العائلة", price: 320, category: "offers" }
    ];
  }

  function withRestaurant(menu, restaurantName) {
    return menu.map(item => ({
      ...item,
      restaurant: item.restaurant || restaurantName
    }));
  }

  const pizzaMenu = withRestaurant(getMenu("menu_pizzaking", getDefaultPizzaMenu), "Pizza King");
  const barakaMenu = withRestaurant(getMenu("menu_baraka", getDefaultBarakaMenu), "البركة");
  const allMenu = [...pizzaMenu, ...barakaMenu];

  const restaurants = [
    { name: "Pizza King", desc: "بيتزا ومأكولات سريعة", link: "restaurant-pizzaking.html" },
    { name: "البركة", desc: "مشاوي ووجبات شرقية", link: "restaurant-baraka.html" },
    { name: "الملكة المصرية", desc: "كشري ومأكولات شعبية", link: "restaurant-malikamisr.html" },
    { name: "إيطاليانو", desc: "مكرونة وبيتزا", link: "restaurant-italiano.html" },
    { name: "برجر فاكتوري", desc: "برجر وجبات سريعة", link: "restaurant-burgerfactory.html" },
    { name: "شاورما هاوس", desc: "شاورما وسندويتشات", link: "restaurant-shawarmahouse.html" }
  ];

  function renderRestaurants() {
    container.innerHTML = "";
    restaurants.forEach(r => {
      const link = document.createElement("a");
      link.href = r.link;
      link.className = "card-link";

      const card = document.createElement("div");
      card.className = "card";

      const h3 = document.createElement("h3");
      h3.textContent = r.name;

      const p = document.createElement("p");
      p.textContent = r.desc;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "add-to-cart";
      btn.textContent = "عرض التفاصيل";

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(btn);
      link.appendChild(card);
      container.appendChild(link);
    });
  }

  function renderCategory(key) {
    container.innerHTML = "";

    let filtered = [];
    if (key === "dishes") {
      filtered = allMenu.filter(i => i.category === "pizza" || i.category === "dishes");
    } else if (key === "meals") {
      filtered = allMenu.filter(i => i.category === "meals");
    } else if (key === "offers") {
      filtered = allMenu.filter(i => i.category === "offers");
    }

    if (!filtered.length) {
      const p = document.createElement("p");
      p.textContent = "لا توجد عناصر حالياً في هذا القسم.";
      p.style.textAlign = "center";
      container.appendChild(p);
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.restaurant = item.restaurant;
      card.dataset.name = item.name;
      card.dataset.price = item.price;

      const h3 = document.createElement("h3");
      h3.textContent = item.name;

      const pRest = document.createElement("p");
      pRest.textContent = item.restaurant;

      const pPrice = document.createElement("p");
      pPrice.textContent = item.price + " ج.م";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "add-to-cart";
      btn.textContent = "أضف إلى المشتريات";

      btn.addEventListener("click", () => {
        if (typeof addToCart === "function") {
          addToCart({
            name: item.name,
            price: item.price,
            restaurant: item.restaurant
          });
        }
      });

      card.appendChild(h3);
      card.appendChild(pRest);
      card.appendChild(pPrice);
      card.appendChild(btn);
      container.appendChild(card);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const key = tab.dataset.tab;
      if (key === "restaurants") {
        renderRestaurants();
      } else {
        renderCategory(key);
      }
    });
  });

  renderRestaurants();
});
