const $pizzasWrapper = document.querySelector(".pizzas-wrapper");

const $basketAsideSize = document.querySelector(".basket-aside-size");
const $emptyBasket = document.querySelector(".empty-basket");
const $basketsWithPizza = document.querySelector(".baskets-with-pizza");
const $basketProducts = document.querySelector(".basket-products");

let cartSize = 0;
let cart = [];

// Getting the products through the API
async function getProducts() {
  const res = await fetch("http://10.59.122.150:3000/products");
  // const res = await fetch("../api/products.json");
  const data = await res.json();

  createProducts(data);
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
      $basketProducts.appendChild($newBasketProductItem);

      console.log(cart);

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

        // $newBasketProductDetailsQuantity.textContent = `${item.count}x`;

        cart.splice(cart.indexOf(item), 1);

        console.log(cart);

        substractCartSize(
          item,
          $newBasketProductDetailsQuantity,
          $newBasketProductDetailsTotalPrice
        );
      } else {
        $newAddToCartCount.textContent =
          parseInt($newAddedToCartBtn.textContent) - 1;

        const item = cart.find((item) => item.id === product.id);

        // $newBasketProductDetailsQuantity.textContent = `${item.count}x`;

        item.count--;

        console.log(cart);

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

      console.log(cart);

      addCartSize(
        item,
        $newBasketProductDetailsQuantity,
        $newBasketProductDetailsTotalPrice
      );
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
}

function substractCartSize(
  item,
  $newBasketProductDetailsQuantity,
  $newBasketProductDetailsTotalPrice
) {
  if (cartSize === 1) {
    $emptyBasket.classList.remove("hidden");
    $basketsWithPizza.classList.add("hidden");
  }

  if (cartSize === 0) {
    cartSize = 0;
    console.log(`Cart size is already ${cartSize}`);
  } else {
    cartSize--;
    $basketAsideSize.textContent = cartSize;

    $newBasketProductDetailsQuantity.textContent = `${item.count}x`;
    $newBasketProductDetailsTotalPrice.textContent = `$${
      item.price * item.count
    }.00`;
  }
}

// Document startup / cleanup
document.addEventListener("DOMContentLoaded", () => {
  $pizzasWrapper.innerHTML = "";
  getProducts();
});
