// Sample product object
const product = {
  name: "Helio Pet Device™",
  price: 249.00,
  image: "images/Dog1.png"
};

const mainImg = document.getElementById("mainImg");
const thumbnails = document.querySelectorAll(".thumb");
const addToCartBtn = document.querySelector(".add-to-cart");
const cartDrawer = document.getElementById("cart-drawer");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const qtyDisplay = document.querySelector(".qty");
const plusBtn = document.querySelector(".qty-btn-plus");
const minusBtn = document.querySelector(".qty-btn-minus");
const overlay = document.getElementById("overlay");

thumbnails.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const tempSrc = mainImg.src;
    mainImg.src = thumb.src;
    thumb.src = tempSrc;
  });
});

let quantity = 1;

const sellingPriceEl = document.getElementById("selling-price");
const comparePriceEl = document.getElementById("compare-price");
const baseSellingPrice = parseFloat(sellingPriceEl.textContent);
const baseComparePrice = parseFloat(comparePriceEl.textContent);

function updatePrices() {
  sellingPriceEl.textContent = (baseSellingPrice * quantity).toFixed(2);
  comparePriceEl.textContent = (baseComparePrice * quantity).toFixed(2);
}

// Quantity button logic (main product section)
plusBtn.addEventListener("click", () => {
  if (quantity < 10) {
    quantity++;
    qtyDisplay.textContent = quantity;
    updatePrices();
  }
});

minusBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    qtyDisplay.textContent = quantity;
    updatePrices();
  }
});

// Add to cart
addToCartBtn.onclick = () => {
  const existingItem = document.getElementById("cart-item-1");
  const total = product.price * quantity;

  if (!existingItem) {
    const li = document.createElement("li");
    li.id = "cart-item-1";
    li.setAttribute("data-price", product.price);
    li.innerHTML = `
      <div class="item-detail">
        <img style="width: 100px; object-fit: cover;" src="${product.image}" alt="">
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 1rem; font-weight: 400; color: rgb(102, 102, 102);">
          <h4 style="font-size: 1.125rem;">${product.name}</h4>
          <p>$${product.price.toFixed(2)}</p>
          <div style="display: flex; align-items: center; gap: 15px;">
            <div class="quantity-selector">
              <button class="qty-btn qty-btn-minus">-</button>
              <span style="font-size: 1.125rem;" class="qty">${quantity}</span>
              <button class="qty-btn qty-btn-plus">+</button>
            </div>
            <button style="border: none; background-color: transparent;" class="delete-btn"><img src="images/trash.png" alt=""></button>
          </div>
        </div>
      </div>
      <span style="font-size: 1.125rem; font-weight: 400;" class="item-total">$${total.toFixed(2)}</span>
    `;
    cartItemsList.appendChild(li);
  }

  cartTotal.textContent = `$${total.toFixed(2)}`;
  openCartDrawer();
  saveCartToStorage(quantity);
};

function openCartDrawer() {
    cartDrawer.classList.add("show");
    overlay.classList.remove("hidden");
    document.body.classList.add("no-scroll");
}

function closeCartDrawer() {
    cartDrawer.classList.remove("show");
    overlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
}

// Close drawer when clicking the overlay
overlay.addEventListener("click", () => {
  closeCartDrawer();
});

function saveCartToStorage(qty) {
  const cartData = {
    product: product.name,
    quantity: qty,
    price: product.price
  };
  localStorage.setItem("cart", JSON.stringify(cartData));
}

function loadCartFromStorage() {
  const data = localStorage.getItem("cart");
  if (data) {
    const item = JSON.parse(data);
    quantity = item.quantity;
    qtyDisplay.textContent = quantity;

    const total = item.price * item.quantity;

    const li = document.createElement("li");
    li.id = "cart-item-1";
    li.setAttribute("data-price", item.price);
    li.innerHTML = `
      <div class="item-detail">
        <img style="width: 100px; object-fit: cover;" src="images/Dog1.png" alt="">
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 1rem; font-weight: 400; color: rgb(102, 102, 102);">
          <h4 style="font-size: 1.125rem;">${item.product}</h4>
          <p>$${item.price.toFixed(2)}</p>
          <div style="display: flex; align-items: center; gap: 15px;">
            <div class="quantity-selector">
              <button class="qty-btn qty-btn-minus">-</button>
              <span style="font-size: 1.125rem;" class="qty">${item.quantity}</span>
              <button class="qty-btn qty-btn-plus">+</button>
            </div>
            <button style="border: none; background-color: transparent;" class="delete-btn"><img src="images/trash.png" alt=""></button>
          </div>
        </div>
      </div>
      <span style="font-size: 1.125rem; font-weight: 400;" class="item-total">$${total.toFixed(2)}</span>
    `;
    cartItemsList.appendChild(li);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    updatePrices();
  }
}

// Event delegation for cart buttons
cartItemsList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const qtyEl = li.querySelector(".qty");
  let qty = parseInt(qtyEl.textContent);
  const price = parseFloat(li.getAttribute("data-price"));

  if (e.target.classList.contains("qty-btn-plus")) {
    if (qty < 10) qty++;
  }

  if (e.target.classList.contains("qty-btn-minus")) {
    if (qty > 1) qty--;
  }

  if (e.target.closest(".qty-btn")) {
    qtyEl.textContent = qty;
    li.querySelector(".item-total").textContent = `$${(price * qty).toFixed(2)}`;
    cartTotal.textContent = `$${(price * qty).toFixed(2)}`;
    quantity = qty;
    saveCartToStorage(qty);
  }

  if (e.target.closest(".delete-btn")) {
    li.remove();
    cartTotal.textContent = "$0.00";
    quantity = 1;
    localStorage.removeItem("cart");
  }
});

loadCartFromStorage();
