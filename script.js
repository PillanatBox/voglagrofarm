/* Mini tyúkos és tojásos háttér */

const patternLayer =
  document.getElementById("patternLayer");

const patternSymbols = [
  "🐔",
  "🥚"
];

for (let index = 0; index < 90; index++) {
  const symbol =
    document.createElement("span");

  symbol.className =
    "pattern-symbol";

  symbol.textContent =
    patternSymbols[index % patternSymbols.length];

  symbol.style.left =
    Math.random() * 100 + "%";

  symbol.style.top =
    Math.random() * 100 + "%";

  symbol.style.fontSize =
    11 + Math.random() * 11 + "px";

  symbol.style.opacity =
    0.11 + Math.random() * 0.1;

  symbol.style.transform =
    "rotate(" +
    (-20 + Math.random() * 40) +
    "deg)";

  patternLayer.appendChild(symbol);
}


/* Mobil menü */

const menuButton =
  document.getElementById("menuButton");

const navigation =
  document.getElementById("navigation");

menuButton.addEventListener(
  "click",
  function () {
    navigation.classList.toggle("open");

    const icon =
      menuButton.querySelector("i");

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  }
);

navigation
  .querySelectorAll("a")
  .forEach(function (link) {
    link.addEventListener(
      "click",
      function () {
        navigation.classList.remove("open");

        const icon =
          menuButton.querySelector("i");

        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      }
    );
  });


/* Termékkategóriák megnyitása */

const viewButtons =
  document.querySelectorAll(".view-button");

viewButtons.forEach(function (button) {
  button.addEventListener(
    "click",
    function () {
      const targetId =
        button.dataset.target;

      const targetList =
        document.getElementById(targetId);

      const isAlreadyOpen =
        targetList.classList.contains("open");

      document
        .querySelectorAll(".product-list")
        .forEach(function (list) {
          list.classList.remove("open");
        });

      viewButtons.forEach(function (otherButton) {
        otherButton.classList.remove("active");
      });

      if (!isAlreadyOpen) {
        targetList.classList.add("open");
        button.classList.add("active");

        setTimeout(function () {
          targetList.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 250);
      }
    }
  );
});


/* Kiszállítás megnyitása */

const deliveryToggle =
  document.getElementById("deliveryToggle");

const deliveryContent =
  document.getElementById("deliveryContent");

deliveryToggle.addEventListener(
  "click",
  function () {
    const isOpen =
      deliveryContent.classList.toggle("open");

    deliveryToggle.classList.toggle(
      "active",
      isOpen
    );

    deliveryToggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
  }
);


/* Kosár */

const cart = [];

const openCartButton =
  document.getElementById("openCartButton");

const closeCartButton =
  document.getElementById("closeCartButton");

const cartPanel =
  document.getElementById("cartPanel");

const cartOverlay =
  document.getElementById("cartOverlay");

const cartItems =
  document.getElementById("cartItems");

const cartCount =
  document.getElementById("cartCount");

const cartTotal =
  document.getElementById("cartTotal");

const orderButton =
  document.getElementById("orderButton");


function formatPrice(price) {
  return new Intl.NumberFormat(
    "hu-HU"
  ).format(price) + " Ft";
}


function openCart() {
  cartPanel.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.classList.add("cart-open");
}


function closeCart() {
  cartPanel.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.classList.remove("cart-open");
}


openCartButton.addEventListener(
  "click",
  openCart
);

closeCartButton.addEventListener(
  "click",
  closeCart
);

cartOverlay.addEventListener(
  "click",
  closeCart
);


/* Mennyiségek és kosárba rakás */

document
  .querySelectorAll(".product-card")
  .forEach(function (card) {
    const minusButton =
      card.querySelector(".quantity-minus");

    const plusButton =
      card.querySelector(".quantity-plus");

    const quantityNumber =
      card.querySelector(".quantity-number");

    const addButton =
      card.querySelector(".add-cart-button");


    minusButton.addEventListener(
      "click",
      function () {
        let quantity =
          Number(quantityNumber.textContent);

        if (quantity > 1) {
          quantity--;
        }

        quantityNumber.textContent =
          quantity;
      }
    );


    plusButton.addEventListener(
      "click",
      function () {
        let quantity =
          Number(quantityNumber.textContent);

        quantity++;

        quantityNumber.textContent =
          quantity;
      }
    );


    addButton.addEventListener(
      "click",
      function () {
        const productId =
          card.dataset.productId;

        const productName =
          card.dataset.productName;

        const productPrice =
          Number(card.dataset.productPrice);

        const quantity =
          Number(quantityNumber.textContent);

        const existingItem =
          cart.find(function (item) {
            return item.id === productId;
          });


        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity
          });
        }

        quantityNumber.textContent = "1";

        renderCart();
        openCart();
      }
    );
  });


function removeCartItem(productId) {
  const itemIndex =
    cart.findIndex(function (item) {
      return item.id === productId;
    });

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }

  renderCart();
}


function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>A kosár jelenleg üres.</p>
      </div>
    `;
  } else {
    cart.forEach(function (item) {
      const cartItem =
        document.createElement("div");

      cartItem.className =
        "cart-item";

      cartItem.innerHTML = `
        <div>
          <h3>${item.name}</h3>

          <p>
            ${item.quantity} db ×
            ${formatPrice(item.price)}
          </p>

          <strong>
            ${formatPrice(
              item.price * item.quantity
            )}
          </strong>
        </div>

        <button
          type="button"
          class="remove-item"
          aria-label="Termék törlése"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      const removeButton =
        cartItem.querySelector(".remove-item");

      removeButton.addEventListener(
        "click",
        function () {
          removeCartItem(item.id);
        }
      );

      cartItems.appendChild(cartItem);
    });
  }


  const totalQuantity =
    cart.reduce(
      function (sum, item) {
        return sum + item.quantity;
      },
      0
    );


  const totalPrice =
    cart.reduce(
      function (sum, item) {
        return sum +
          item.price * item.quantity;
      },
      0
    );


  cartCount.textContent =
    totalQuantity;

  cartTotal.textContent =
    formatPrice(totalPrice);
}


/* Rendelés leadása e-mailben */

orderButton.addEventListener(
  "click",
  function () {
    if (cart.length === 0) {
      alert("A kosár jelenleg üres.");
      return;
    }

    const orderLines =
      cart.map(function (item) {
        return (
          item.name +
          " – " +
          item.quantity +
          " db – " +
          formatPrice(
            item.price * item.quantity
          )
        );
      });


    const totalPrice =
      cart.reduce(
        function (sum, item) {
          return sum +
            item.price * item.quantity;
        },
        0
      );


    const subject =
      encodeURIComponent(
        "Vogl Agro Farm rendelés"
      );


    const body =
      encodeURIComponent(
        "Szeretném megrendelni az alábbi termékeket:\n\n" +
        orderLines.join("\n") +
        "\n\nÖsszesen: " +
        formatPrice(totalPrice) +
        "\n\nNév:\n" +
        "Telefonszám:\n" +
        "Kiszállítási település:\n" +
        "Megjegyzés:"
      );


    window.location.href =
      "mailto:egginorkft@gmail.com" +
      "?subject=" +
      subject +
      "&body=" +
      body;
  }
);


renderCart();