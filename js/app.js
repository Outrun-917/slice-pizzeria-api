const $pizzasWrapper = document.querySelector(".pizzas-wrapper");
const $basketAsideSize = document.querySelector(".basket-aside-size");

let cartSize = 0;

// Getting the products through the API
async function getProducts() {
  const res = await fetch("http://10.59.122.41:3000/products");
  // const res = await fetch("../api/products.json");
  const data = await res.json();

  // console.log(res);
  // console.log(data);

  createProducts(data);
}

// Creating products with the API data
function createProducts(products) {
  products.forEach((product) => {
    const $newPizzaItem = document.createElement("div");
    $newPizzaItem.classList.add("pizza-item");

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

    // Even listener on new add to cart btns
    $newAddToCartBtn.addEventListener("click", (e) => {
      e.preventDefault();

      $newAddToCartBtn.classList.add("hidden");
      $newAddedToCartBtn.classList.remove("hidden");
      $newPizzaPicture.classList.add("pizza-picture-active");

      addCartSize();
    });

    // Event listener on remove cart item btn
    $newAddToCartSubstract.addEventListener("click", (e) => {
      e.preventDefault();

      if ($newAddedToCartBtn.textContent === "1") {
        $newAddedToCartBtn.classList.add("hidden");
        $newAddToCartBtn.classList.remove("hidden");
        $newAddToCartBtn.classList.remove("add-to-cart-btn-active");
        $newPizzaPicture.classList.remove("pizza-picture-active");

        substractCartSize();
      } else {
        $newAddToCartCount.textContent =
          parseInt($newAddedToCartBtn.textContent) - 1;

        substractCartSize();
      }
    });

    // Event listener on add cart item btn
    $newAddToCartAdd.addEventListener("click", (e) => {
      e.preventDefault();

      $newAddToCartCount.textContent =
        parseInt($newAddedToCartBtn.textContent) + 1;

      addCartSize();
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

function addCartSize() {
  cartSize++;
  $basketAsideSize.textContent = cartSize;
  console.log(`Cart size : ${cartSize}`);
}

function substractCartSize() {
  if (cartSize === 0) {
    cartSize = 0;
    console.log(`Cart size is already ${cartSize}`);
  } else {
    cartSize--;
    $basketAsideSize.textContent = cartSize;
    console.log(`Cart size : ${cartSize}`);
  }
}

// Document startup / cleanup
document.addEventListener("DOMContentLoaded", () => {
  $pizzasWrapper.innerHTML = "";
  getProducts();
});
