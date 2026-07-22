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
const deliveryAddress =
  document.getElementById("deliveryAddress");

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

    let minusButton =
      card.querySelector(".quantity-minus");

    let plusButton =
      card.querySelector(".quantity-plus");

    let quantityNumber =
      card.querySelector(".quantity-number");

    const addButton =
      card.querySelector(".add-cart-button");


    /*
      Ha egy terméknél még nincs
      mennyiségválasztó, automatikusan létrehozzuk.
      Ez főleg a tésztatermékekhez szükséges.
    */

    if (
      !minusButton ||
      !plusButton ||
      !quantityNumber
    ) {
      const quantitySelector =
        document.createElement("div");

      quantitySelector.className =
        "quantity-selector";

      quantitySelector.innerHTML = `
        <button
          type="button"
          class="quantity-minus"
          aria-label="Mennyiség csökkentése"
        >
          −
        </button>

        <span class="quantity-number">
          1
        </span>

        <button
          type="button"
          class="quantity-plus"
          aria-label="Mennyiség növelése"
        >
          +
        </button>
      `;


      /*
        Ha nincs product-actions rész,
        létrehozzuk, és beletesszük
        a mennyiségválasztót és a Kosárba gombot.
      */

      let productActions =
        card.querySelector(".product-actions");

      if (!productActions) {
        productActions =
          document.createElement("div");

        productActions.className =
          "product-actions";

        if (addButton) {
          addButton.parentNode.insertBefore(
            productActions,
            addButton
          );

          productActions.appendChild(
            quantitySelector
          );

          productActions.appendChild(
            addButton
          );
        }
      } else {
        productActions.insertBefore(
          quantitySelector,
          productActions.firstChild
        );
      }


      minusButton =
        quantitySelector.querySelector(
          ".quantity-minus"
        );

      plusButton =
        quantitySelector.querySelector(
          ".quantity-plus"
        );

      quantityNumber =
        quantitySelector.querySelector(
          ".quantity-number"
        );
    }


    /* Mínusz gomb */

    minusButton.addEventListener(
      "click",
      function () {
        let quantity =
          Number(
            quantityNumber.textContent.trim()
          );

        if (quantity > 1) {
          quantity--;
        }

        quantityNumber.textContent =
          quantity;
      }
    );


    /* Plusz gomb */

    plusButton.addEventListener(
      "click",
      function () {
        let quantity =
          Number(
            quantityNumber.textContent.trim()
          );

        quantity++;

        quantityNumber.textContent =
          quantity;
      }
    );


    /* Kosárba gomb */

    if (addButton) {
      addButton.addEventListener(
        "click",
        function () {
          const productId =
            card.dataset.productId;

          const productName =
            card.dataset.productName;

          const productPrice =
            Number(
              card.dataset.productPrice
            );

          const quantity =
            Number(
              quantityNumber.textContent.trim()
            );


          if (
            !productId ||
            !productName ||
            Number.isNaN(productPrice)
          ) {
            console.error(
              "Hiányos termékadat:",
              card
            );

            return;
          }


          const existingItem =
            cart.find(function (item) {
              return item.id === productId;
            });


          if (existingItem) {
            existingItem.quantity +=
              quantity;
          } else {
            cart.push({
              id: productId,
              name: productName,
              price: productPrice,
              quantity: quantity
            });
          }


          quantityNumber.textContent =
            "1";

          renderCart();
          openCart();
        }
      );
    }
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
cartItem.style.cssText = `
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px;
  margin-bottom: 14px;
  border: 1px solid rgba(23, 63, 52, 0.14);
  border-radius: 18px;
  background: #ffffff;
  box-sizing: border-box;
`;
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


    const address =
      deliveryAddress.value.trim();

    if (address === "") {
      alert(
        "Kérlek, írd be a kiszállítás helyszínét!"
      );

      deliveryAddress.focus();
      return;
    }


    const selectedPayment =
      document.querySelector(
        'input[name="paymentMethod"]:checked'
      );

    const paymentMethod =
      selectedPayment
        ? selectedPayment.value
        : "Nincs kiválasztva";


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
          return (
            sum +
            item.price * item.quantity
          );
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

        "\n\nFizetési mód: " +
        paymentMethod +

        "\n\nKiszállítási helyszín:\n" +
        address +

        "\n\nNév:\n" +
        "Telefonszám:\n" +
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
/* ==================================
   KOSÁR MEGNYITÁSA ÉS BEZÁRÁSA
================================== */

const cartPanel =
  document.getElementById("cartPanel");

const cartOverlay =
  document.getElementById("cartOverlay");

const cartClose =
  document.getElementById("cartClose");

/*
  A kosárgombodhoz add hozzá ezt:
  id="cartOpen"
*/

const cartOpen =
  document.getElementById("cartOpen");

function openCart() {

  cartPanel.classList.add("active");

  cartOverlay.classList.add("active");

  document.body.style.overflow = "hidden";

}

function closeCart() {

  cartPanel.classList.remove("active");

  cartOverlay.classList.remove("active");

  document.body.style.overflow = "";

}

if (cartOpen) {

  cartOpen.addEventListener(
    "click",
    openCart
  );

}

if (cartClose) {

  cartClose.addEventListener(
    "click",
    closeCart
  );

}

if (cartOverlay) {

  cartOverlay.addEventListener(
    "click",
    closeCart
  );

}

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      closeCart();

    }

  }
);


/* ==================================
   FIZETÉSI MÓD KIJELÖLÉSE
================================== */

const paymentOptions =
  document.querySelectorAll(
    ".payment-option"
  );

paymentOptions.forEach(
  function (option) {

    option.addEventListener(
      "click",
      function () {

        paymentOptions.forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );

        option.classList.add(
          "active"
        );

      }
    );

  }
);


/* ==================================
   TERMÉK TÖRLÉSE
================================== */

document.addEventListener(
  "click",
  function (event) {

    const deleteButton =
      event.target.closest(
        ".cart-delete"
      );

    if (!deleteButton) {
      return;
    }

    const cartItem =
      deleteButton.closest(
        ".cart-item"
      );

    if (cartItem) {

      cartItem.remove();

    }

  }
);


/* ==================================
   RENDELÉS LEADÁSA
================================== */

const orderButton =
  document.getElementById(
    "orderButton"
  );

if (orderButton) {

  orderButton.addEventListener(
    "click",
    function () {

      const address =
        document
          .getElementById(
            "deliveryAddress"
          )
          .value
          .trim();

      if (address === "") {

        alert(
          "Kérlek, add meg a kiszállítási címet!"
        );

        return;

      }

      alert(
        "A rendelés elküldéséhez még össze kell kötnünk az adatbázissal."
      );

    }
  );

}