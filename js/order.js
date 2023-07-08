import { currentUserIndex, getUsers } from "./auth.js";

//one modal whose body changes as per button click
//same for toast
//off canvas backdrop
function convertToHrsMins(num) {
  if (isNaN(num)) {
    return "Error calculating";
  }
  num = Math.floor(num);
  let hrs = Math.floor(num / 60);
  let mins = num % 60;
  let output = "";
  if (hrs > 0) {
    output += hrs + " hr";
    if (hrs > 1) {
      output += "s";
    }
    if (mins > 0) {
      output += " ";
    }
  }
  if (mins > 0) {
    output += mins + " min";
    if (mins > 1) {
      output += "s";
    }
  }
  return output;
}

var menu;
var filterMenu;

let restaurantNames = [
  "all",
  "kfc",
  "haldiram",
  "kaveri",
  "dominos",
  "pizza hut",
  "barbeque nation",
  "mcdonald's",
];
let restaurantImages = [
  "all.gif",
  "kfc.avif",
  "haldiram.png",
  "kaveri.avif",
  "dominos.avif",
  "pizzahut.avif",
  "bbq.png",
  "McDonalds.png",
];

function filterDishes(i) {
  if (restaurantNames[i] == "all") {
    filterMenu = menu;
    // appendDishes(menu);
  } else {
    filterMenu = menu.filter(function (dish) {
      return dish.restaurant.toLowerCase() == restaurantNames[i].toLowerCase();
    });
    // appendDishes(filterMenu);
  }
  searchDish();
}

let dishContainer = document.getElementById("dish-list");
function appendDishes(dishes) {
  dishContainer.innerHTML = "";
  dishes.forEach((dish, i) => {
    dishContainer.innerHTML += `
      <div class="dish">
        <div class="dish-img">
          <img
            src="${"img/gallery/gallery-" + ((i + 1) % 11)}.jpg"
            alt="dish-image"
          />
          <div class="rating">
            ${dish.rating}
            <ion-icon name="star" aria-hidden="true"></ion-icon>
          </div>
        </div>
        <h4>${dish.name}</h4>
        <p>${dish.description}</p>
        <div class="dish-footer">
          <div class="price">₹${dish.price}</div>
          <button data-id="${
            dish.dishId
          }" onclick="addDish(event);" class="primary-btn">Add</button>
        </div>
      </div>`;
  });
}
function searchDish() {
  let searchedText = document.getElementById("dish-search-box").value;
  if (searchedText === "") appendDishes(filterMenu);
  else {
    var searchedMenu = filterMenu.filter(function (dish) {
      return dish.name.toLowerCase().indexOf(searchedText.toLowerCase()) !== -1;
    });
    appendDishes(searchedMenu);
  }
}

export function addDish(e) {
  var dishId = e.target.getAttribute("data-id");
  var dish = menu.find((dish) => dish.dishId == dishId);
  console.log(dish);
  var users = getUsers();
  var curUser = currentUserIndex(users);
  if (curUser >= 0) {
    var dishInd = users[curUser].cart.dishes.findIndex((d) => d === dishId);
    if (dishInd >= 0) {
      users[curUser].cart.quantity[dishInd]++;
    } else {
      users[curUser].cart.dishes.push(dishId);
      users[curUser].cart.quantity.push(1);
    }
    localStorage.setItem("tastyExUsers", JSON.stringify(users));
  } else {
    alert("Please Login.");
  }
}
export function updateDish(action, id) {
  console.log(action);
  var users = getUsers();
  var curUser = currentUserIndex(users);
  const i = users[curUser].cart.dishes.indexOf(id);
  var q = users[curUser].cart.quantity[i];
  if (action === "inc") {
    if (q < 10) users[curUser].cart.quantity[i]++;
    else alert("Can't order more than 10 units of same item.");
  } else {
    if (q > 1) users[curUser].cart.quantity[i]--;
    else if (q === 1) {
      removeDish(id);
      return;
    } else alert("Error");
  }
  localStorage.setItem("tastyExUsers", JSON.stringify(users));
  loadCart();
}
export function removeDish(id) {
  var users = getUsers();
  var curUser = currentUserIndex(users);
  const index = users[curUser].cart.dishes.indexOf(id);
  if (index > -1) {
    // only splice array when item is found
    users[curUser].cart.dishes.splice(index, 1);
    users[curUser].cart.quantity.splice(index, 1);
  } else {
    alert("dish not in cart");
  }
  localStorage.setItem("tastyExUsers", JSON.stringify(users));
  loadCart();
}
function loadCart() {
  // check for log in
  var users = getUsers();
  var curUser = currentUserIndex(users);
  var cartCont = document.getElementById("cart-dish-container");
  if (curUser >= 0) {
    if (users[curUser].cart.dishes.length < 1) {
      cartCont.innerHTML = `<p class="text-center">No item found.</p>`;
      document.getElementById("checkout-btn").disabled = true;
      return;
    }
    var total = 0;
    cartCont.innerHTML = "";
    users[curUser].cart.dishes.forEach((dishId, i) => {
      var dish = menu.find((d) => d.dishId === dishId);
      cartCont.innerHTML +=
        `
      <div class="cart-dish">
      <div class="cart-dish-img">
        <img
          src="https://www.dominos.co.in/files/items/Pepper_Barbeque.jpg"
          alt=""
        />
      </div>
      <div class="cart-dish-col-2">
        <p>${dish.name}</p>
        <div class="one-price sub-title">₹ ${dish.price}</div>
      </div>
      <div class="cart-dish-col-3">
     <div class="quantity-editor"> 
     <ion-icon name="remove-outline" class="sec-btn"  onclick="updateDish(\`` +
        "dec" +
        `\`,\`` +
        dishId +
        `\`);"></ion-icon>
     <div class="dish-quantity">${users[curUser].cart.quantity[i]}</div>
     <ion-icon name="add-outline"  class="sec-btn" onclick="updateDish(\`` +
        "inc" +
        `\`,\`` +
        dishId +
        `\`);"></ion-icon>
       </div>
        <div class="price">₹ ${
          users[curUser].cart.quantity[i] * dish.price
        }</div>
      </div>
        <button class="del-dish-btn sec-btn"  onclick="removeDish(\`` +
        dishId +
        `\`);">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
    </div>`;
      total = total + users[curUser].cart.quantity[i] * dish.price;
    });
    document.getElementById("checkout-btn").disabled = false;
    document.getElementById("total-order-price").innerHTML = total;
  } else {
    alert("Please Login.");
    cartCont.innerHTML = `<p class="text-center">No item found.</p>`;
    document.getElementById("checkout-btn").disabled = true;
  }
  console.log("load");
}

function checkout() {
  var users = getUsers();
  var curUser = currentUserIndex(users);
  var mealtime = 0;
  var orderRestaurants = new Set();
  users[curUser].cart.dishes.forEach((dishId, i) => {
    var dish = menu.find((d) => d.dishId === dishId);
    mealtime = Math.max(mealtime, dish.timeTaken);
    orderRestaurants.add(dish.restaurant);
  });
  var subtotal = parseFloat(
    document.getElementById("total-order-price").innerHTML
  );
  var delch = orderRestaurants.size * 7;
  var totalch = delch + subtotal;
  document.getElementById("subtotal").innerHTML = "₹ " + subtotal;
  document.getElementById("del-charge").innerHTML = "₹ " + delch;
  document.getElementById("total-charge").innerHTML = "₹ " + totalch;
  document.getElementById("address-table").innerHTML = `<tr>
  <td>${users[curUser].add1}</td>
</tr>
<tr>
  <td>${users[curUser].add2}</td>
</tr>
<tr>
  <th>${users[curUser].city}, ${users[curUser].state}</th>
</tr>`;

  var deltime = orderRestaurants.size * 10;
  var totaltime = deltime + mealtime;
  document.getElementById("meal-time").innerHTML = convertToHrsMins(mealtime);
  document.getElementById("del-time").innerHTML = convertToHrsMins(deltime);
  document.getElementById("total-time").innerHTML = convertToHrsMins(totaltime);
}
function successFunc() {
  console.log("cld");
  document.getElementById("order-no").innerHTML = Math.random()
    .toString()
    .slice(2, 12);
  document.getElementById("order-time").innerHTML =
    document.getElementById("total-time").innerHTML;
  var users = getUsers();
  var curUser = currentUserIndex(users);
  var prev = new Set([
    ...users[curUser].prevOrders,
    ...users[curUser].cart.dishes,
  ]);
  users[curUser].prevOrders = [...prev];
  users[curUser].cart.dishes = [];
  users[curUser].cart.quantity = [];
  localStorage.setItem("tastyExUsers", JSON.stringify(users));
  loadCart();
}
function loadPrevDishes() {
  var users = getUsers();
  var curUser = currentUserIndex(users);
  var prevSec = document.getElementById("prev-sec");
  if (curUser >= 0 && users[curUser].prevOrders.length > 0) {
    prevSec.classList.remove("d-none");
    var prevDishCont = document.getElementById("prev-dish-cont");
    users[curUser].prevOrders.forEach((dishId, i) => {
      var dish = menu.find((d) => d.dishId === dishId);
      prevDishCont.innerHTML += ` <div class="dish">
          <div class="dish-img">
            <img
              src="${"img/gallery/gallery-" + ((i + 1) % 11)}.jpg"
              alt="dish-image"
            />
            <div class="rating">
              ${dish.rating}
              <ion-icon name="star" aria-hidden="true"></ion-icon>
            </div>
          </div>
          <h4>${dish.name}</h4>
          <div class="dish-footer">
            <div class="price">₹${dish.price}</div>
            <button data-id="${
              dish.dishId
            }" onclick="addDish(event);" class="primary-btn">Add</button>
          </div>
        </div>`;
    });
  } else {
    prevSec.classList.add("d-none");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await fetch("menu.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      menu = data;
      filterMenu = data;
      appendDishes(data);
    })
    .catch(function (err) {
      console.log("error: " + err);
    });
  let restContainer = document.getElementById("rest-list");
  restaurantNames.forEach((rest, i) => {
    restContainer.innerHTML += `<div class="restaurant">
          <div class="rest-img ${i == 0 && "active-rest"}">
            <img src="./img/restaurants/${restaurantImages[i]}" alt="${
      restaurantImages[i]
    }" />
          </div>
          <h4 class="center-text">${rest}</h4>
        </div>`;
  });
  let restaurants = document.querySelectorAll(".restaurant");
  restaurants.forEach((restaurant, index) => {
    restaurant.addEventListener("click", function handleRestaurantClick(event) {
      for (const rest of document.querySelectorAll("div.active-rest")) {
        rest.classList.remove("active-rest");
      }
      restaurant
        .getElementsByClassName("rest-img")[0]
        .classList.add("active-rest");
      filterDishes(index);
    });
  });
  document
    .getElementById("dish-search-box")
    .addEventListener("keyup", searchDish);
  loadPrevDishes();
  document.getElementById("cart-btn").addEventListener("click", loadCart);
  document.getElementById("checkout-btn").addEventListener("click", checkout);
  document.getElementById("confirm-btn").addEventListener("click", successFunc);
});
