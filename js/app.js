const $pizzasWrapper = document.querySelector(".pizzas-wrapper");

const $basketAsideSize = document.querySelector(".basket-aside-size");
const $emptyBasket = document.querySelector(".empty-basket");
const $basketsWithPizza = document.querySelector(".baskets-with-pizza");
const $basketProducts = document.querySelector(".basket-products");
const $totalOrderPrice = document.querySelector(".total-order-price");
const $confirmOrderBtn = document.querySelector(".confirm-order-btn");

const $logoutBtn = document.querySelector(".logout-btn");

const $orderModalWrapper = document.querySelector(".order-modal-wrapper");
const $orderDetail = document.querySelector(".order-detail");
const $newOrderBtn = document.querySelector(".new-order-btn");

let cartSize = 0;
let cartTotalPrice = 0;
let cart = [];

// Getting the products through the API
async function getProducts() {
  const res = await fetch(
    "https://prime-garfish-currently.ngrok-free.app/products",
    {
      headers: {
        "ngrok-skip-browser-warning": "1",
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  createProducts(data);
}

// Sending the order
async function sendOrder(order) {
  const res = await fetch(
    "https://prime-garfish-currently.ngrok-free.app/orders",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "ngrok-skip-browser-warning": "1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: order,
      }),
    }
  );
  const data = await res.json();

  return data.products;
}

async function manageOrderContent() {
  let orderContent = [];

  cart.forEach((item) => {
    orderContent = [
      ...orderContent,
      {
        uuid: item.id,
        quantity: item.count,
      },
    ];
  });

  return orderContent;
}

// Creating products with the API data
function createProducts(products) {
  products.forEach((product) => {
    const $newPizzaItem = document.createElement("div");
    $newPizzaItem.classList.add("pizza-item");
    $newPizzaItem.setAttribute("data-id", product.id);

    const $newPizzaPicture = document.createElement("img");
    $newPizzaPicture.classList.add("pizza-picture");
    $newPizzaPicture.setAttribute("src", product.image);
    $newPizzaPicture.setAttribute("alt", product.name);

    const $newAddToCartBtn = document.createElement("span");
    $newAddToCartBtn.classList.add("add-to-cart-btn");

    const $newAddedToCartBtn = document.createElement("span");
    $newAddedToCartBtn.classList.add("add-to-cart-btn");
    $newAddedToCartBtn.classList.add("add-to-cart-btn-active");
    $newAddedToCartBtn.classList.add("hidden");

    const $newAddToCartSubstract = document.createElement("img");
    $newAddToCartSubstract.setAttribute(
      "src",
      "../images/add-to-cart_substract-icon.svg"
    );
    $newAddToCartSubstract.classList.add("add-to-cart-btn_sub-btn");

    const $newAddToCartAdd = document.createElement("img");
    $newAddToCartAdd.setAttribute("src", "../images/add-to-cart_add-icon.svg");
    $newAddToCartAdd.classList.add("add-to-cart-btn_sub-btn");

    const $newAddToCartCount = document.createTextNode(1);

    // Aside cart items creation
    const $newBasketProductItem = document.createElement("li");
    $newBasketProductItem.classList.add("basket-product-item");
    $newBasketProductItem.setAttribute("data-name", product.name);
    $newBasketProductItem.setAttribute("data-id", product.id);

    const $newBasketProductItemName = document.createElement("span");
    $newBasketProductItemName.classList.add("basket-product-item-name");
    $newBasketProductItemName.textContent = product.name;

    const $newBasketProductDetails = document.createElement("span");
    $newBasketProductDetails.classList.add("basket-product-details");

    const $newBasketProductDetailsQuantity = document.createElement("span");
    $newBasketProductDetailsQuantity.classList.add(
      "basket-product-details-quantity"
    );

    const $newBasketProductDetailsUnitPrice = document.createElement("span");
    $newBasketProductDetailsUnitPrice.classList.add(
      "basket-product-details-unit-price"
    );
    $newBasketProductDetailsUnitPrice.textContent = `@ $${product.price}.00`;

    const $newBasketProductDetailsTotalPrice = document.createElement("span");
    $newBasketProductDetailsTotalPrice.classList.add(
      "basket-product-details-total-price"
    );

    const $newBasketProductRemoveIcon = document.createElement("img");
    $newBasketProductRemoveIcon.classList.add("basket-product-remove-icon");
    $newBasketProductRemoveIcon.setAttribute(
      "src",
      "../images/remove-icon.svg"
    );

    // Even listener on new add to cart btns
    $newAddToCartBtn.addEventListener("click", (e) => {
      e.preventDefault();

      $newAddToCartBtn.classList.add("hidden");
      $newAddedToCartBtn.classList.remove("hidden");
      $newPizzaPicture.classList.add("pizza-picture-active");

      cart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          count: 1,
        },
      ];

      const item = cart.find((item) => item.id === product.id);

      // Aside cart element handling & integration
      $emptyBasket.classList.add("hidden");
      $basketsWithPizza.classList.remove("hidden");

      $newBasketProductItem.appendChild($newBasketProductItemName);
      $newBasketProductItem.appendChild($newBasketProductDetails);
      $newBasketProductDetails.appendChild($newBasketProductDetailsQuantity);
      $newBasketProductDetails.appendChild($newBasketProductDetailsUnitPrice);
      $newBasketProductDetails.appendChild($newBasketProductDetailsTotalPrice);
      $newBasketProductItem.appendChild($newBasketProductRemoveIcon);
      $basketProducts.appendChild($newBasketProductItem);

      addCartSize(
        item,
        $newBasketProductDetailsQuantity,
        $newBasketProductDetailsTotalPrice
      );
    });

    // Event listener on remove cart item btn
    $newAddToCartSubstract.addEventListener("click", (e) => {
      e.preventDefault();

      if ($newAddedToCartBtn.textContent === "1") {
        $newAddedToCartBtn.classList.add("hidden");
        $newAddToCartBtn.classList.remove("hidden");
        $newAddToCartBtn.classList.remove("add-to-cart-btn-active");
        $newPizzaPicture.classList.remove("pizza-picture-active");

        // Aside cart element handling
        $newBasketProductItem.remove();

        const item = cart.find((item) => item.id === product.id);

        cart.splice(cart.indexOf(item), 1);

        substractCartSize(
          item,
          $newBasketProductDetailsQuantity,
          $newBasketProductDetailsTotalPrice
        );
      } else {
        $newAddToCartCount.textContent =
          parseInt($newAddedToCartBtn.textContent) - 1;

        const item = cart.find((item) => item.id === product.id);

        item.count--;

        substractCartSize(
          item,
          $newBasketProductDetailsQuantity,
          $newBasketProductDetailsTotalPrice
        );
      }
    });

    // Event listener on add cart item btn
    $newAddToCartAdd.addEventListener("click", (e) => {
      e.preventDefault();

      $newAddToCartCount.textContent =
        parseInt($newAddedToCartBtn.textContent) + 1;

      const item = cart.find((item) => item.id === product.id);

      item.count++;

      addCartSize(
        item,
        $newBasketProductDetailsQuantity,
        $newBasketProductDetailsTotalPrice
      );
    });

    // Event listener on reset cart item btn
    $newBasketProductRemoveIcon.addEventListener("click", (e) => {
      e.preventDefault();

      const item = cart.find((item) => item.id === product.id);

      resetCartItem(
        item,
        $newPizzaPicture,
        $newAddedToCartBtn,
        $newAddToCartBtn,
        $newAddToCartCount,
        $newBasketProductItem
      );
    });

    $newOrderBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const item = cart.find((item) => item.id === product.id);

      resetCartItem(
        item,
        $newPizzaPicture,
        $newAddedToCartBtn,
        $newAddToCartBtn,
        $newAddToCartCount,
        $newBasketProductItem
      );

      $orderModalWrapper.classList.add("hidden");
    });

    const $newCartPicture = document.createElement("img");
    $newCartPicture.setAttribute(
      "src",
      "../images/carbon_shopping-cart-plus.svg"
    );
    $newCartPicture.setAttribute("alt", "");
    $newCartPicture.setAttribute("srcset", "");

    const $newAddToCartBtnText = document.createTextNode("Add to Cart");

    const $newPizzaInfos = document.createElement("ul");
    $newPizzaInfos.classList.add("pizza-infos");

    const $newPizzaName = document.createElement("li");
    $newPizzaName.classList.add("pizza-name");
    $newPizzaName.textContent = product.name;

    const $newPizzaPrice = document.createElement("li");
    $newPizzaPrice.classList.add("pizza-price");
    $newPizzaPrice.textContent = `$${product.price}`;

    $newPizzaItem.appendChild($newPizzaPicture);
    $newPizzaItem.appendChild($newAddToCartBtn);
    $newAddToCartBtn.appendChild($newCartPicture);
    $newAddToCartBtn.appendChild($newAddToCartBtnText);

    // Added to cart btn (- ${count} +)
    $newPizzaItem.appendChild($newAddedToCartBtn);
    $newAddedToCartBtn.appendChild($newAddToCartSubstract);
    $newAddedToCartBtn.appendChild($newAddToCartCount);
    $newAddedToCartBtn.appendChild($newAddToCartAdd);

    $newPizzaItem.appendChild($newPizzaInfos);
    $newPizzaInfos.appendChild($newPizzaName);
    $newPizzaInfos.appendChild($newPizzaPrice);
    $pizzasWrapper.appendChild($newPizzaItem);
  });
}

function createModalContent(orders) {
  let totalPrice = 0;

  const $newOrderDetailTotalPrice = document.createElement("li");
  $newOrderDetailTotalPrice.classList.add("order-detail-total-price");

  const $newTotalOrderTitle = document.createElement("span");
  $newTotalOrderTitle.classList.add("total-order-title");
  $newTotalOrderTitle.textContent = "Order total";

  const $newTotalOrderPrice = document.createElement("span");
  $newTotalOrderPrice.classList.add("total-order-price");

  $newOrderDetailTotalPrice.appendChild($newTotalOrderTitle);
  $newOrderDetailTotalPrice.appendChild($newTotalOrderPrice);

  orders.forEach((item) => {
    totalPrice += item.product.price * item.quantity;

    const $newOrderDetailProductItem = document.createElement("li");
    $newOrderDetailProductItem.classList.add("order-detail-product-item");

    const $newOrderDetailProductImage = document.createElement("img");
    $newOrderDetailProductImage.classList.add("order-detail-product-image");
    $newOrderDetailProductImage.setAttribute("src", item.product.image);
    $newOrderDetailProductImage.setAttribute("alt", "");

    const $newOrderDetailProductName = document.createElement("span");
    $newOrderDetailProductName.classList.add("order-detail-product-name");
    $newOrderDetailProductName.textContent = item.product.name;

    const $newOrderDetailProductQuantity = document.createElement("span");
    $newOrderDetailProductQuantity.classList.add(
      "order-detail-product-quantity"
    );
    $newOrderDetailProductQuantity.textContent = `${item.quantity}x`;

    const $newOrderDetailProductUnitPrice = document.createElement("span");
    $newOrderDetailProductUnitPrice.classList.add(
      "order-detail-product-unit-price"
    );
    $newOrderDetailProductUnitPrice.textContent = `@ $${item.product.price}.00`;

    const $newOrderDetailProductTotalPrice = document.createElement("span");
    $newOrderDetailProductTotalPrice.classList.add(
      "order-detail-product-total-price"
    );
    $newOrderDetailProductTotalPrice.textContent = `$${
      item.product.price * item.quantity
    }.00`;

    $newTotalOrderPrice.textContent = `$${totalPrice}.00`;

    $newOrderDetailProductItem.appendChild($newOrderDetailProductImage);
    $newOrderDetailProductItem.appendChild($newOrderDetailProductName);
    $newOrderDetailProductItem.appendChild($newOrderDetailProductQuantity);
    $newOrderDetailProductItem.appendChild($newOrderDetailProductUnitPrice);
    $newOrderDetailProductItem.appendChild($newOrderDetailProductTotalPrice);
    $orderDetail.appendChild($newOrderDetailProductItem);
    $orderDetail.appendChild($newOrderDetailTotalPrice);
  });
}

function addCartSize(
  item,
  $newBasketProductDetailsQuantity,
  $newBasketProductDetailsTotalPrice
) {
  cartSize++;
  $basketAsideSize.textContent = cartSize;

  $newBasketProductDetailsQuantity.textContent = `${item.count}x`;
  $newBasketProductDetailsTotalPrice.textContent = `$${
    item.price * item.count
  }.00`;

  cartTotalPrice += item.price;
  $totalOrderPrice.textContent = `$${cartTotalPrice}.00`;
}

function substractCartSize(
  item,
  $newBasketProductDetailsQuantity,
  $newBasketProductDetailsTotalPrice
) {
  if (cartSize === 1) {
    $emptyBasket.classList.remove("hidden");
    $basketsWithPizza.classList.add("hidden");

    cartTotalPrice = 0;
    $totalOrderPrice.textContent = `$${cartTotalPrice}.00`;
  }

  if (cartSize !== 0) {
    cartSize--;
    $basketAsideSize.textContent = cartSize;

    $newBasketProductDetailsQuantity.textContent = `${item.count}x`;
    $newBasketProductDetailsTotalPrice.textContent = `$${
      item.price * item.count
    }.00`;

    if (cartSize !== 0) {
      cartTotalPrice -= item.price;
      $totalOrderPrice.textContent = `$${cartTotalPrice}.00`;
    }
  } else {
    cartSize = 0;
    console.log(`Cart size is already ${cartSize}`);
  }
}

function resetCartItem(
  item,
  $newPizzaPicture,
  $newAddedToCartBtn,
  $newAddToCartBtn,
  $newAddToCartCount,
  $newBasketProductItem
) {
  $newPizzaPicture.classList.remove("pizza-picture-active");
  $newAddedToCartBtn.classList.add("hidden");
  $newAddToCartBtn.classList.remove("hidden");
  $newAddToCartCount.textContent = "1";
  cartSize -= item.count;
  $basketAsideSize.textContent = cartSize;

  if (cartSize === 0) {
    $emptyBasket.classList.remove("hidden");
    $basketsWithPizza.classList.add("hidden");

    cartTotalPrice = 0;
    $totalOrderPrice.textContent = `$${cartTotalPrice}.00`;
  } else {
    cartTotalPrice -= item.price * item.count;
    $totalOrderPrice.textContent = `$${cartTotalPrice}.00`;
  }

  $newBasketProductItem.remove();

  cart.splice(cart.indexOf(item), 1);
}

$confirmOrderBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  $orderDetail.innerHTML = "";

  const order = await manageOrderContent();
  const confirmedOrders = await sendOrder(order);

  createModalContent(confirmedOrders);

  $orderModalWrapper.classList.remove("hidden");
});

$logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("token");
  window.location.assign("../index.html");
});

// Document startup / cleanup
document.addEventListener("DOMContentLoaded", () => {
  $pizzasWrapper.innerHTML = "";

  getProducts();
});
