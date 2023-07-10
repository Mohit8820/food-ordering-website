import { currentUserIndex, getUsers, showToast } from "./auth.js";

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
  if (dishes.length < 1) {
    dishContainer.innerHTML = `<img class="no-food" alt="No dish found" src="./img/gifs/noFood.gif" />`;
    return;
  }
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
            <svg fill="currentcolor" 
            clip-rule="evenodd" 
            fill-rule="evenodd" 
            stroke-linejoin="round" 
            stroke-miterlimit="2" 
            viewBox="0 0 24 24" 
            width="12"
            height="12" xmlns="http://www.w3.org/2000/svg"><path d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z" fill-rule="nonzero"/></svg>
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
      if (users[curUser].cart.quantity[dishInd] < 10)
        users[curUser].cart.quantity[dishInd]++;
      else {
        showToast("Can't order more than 10 units of same item.");
        return;
      }
    } else {
      users[curUser].cart.dishes.push(dishId);
      users[curUser].cart.quantity.push(1);
    }
    localStorage.setItem("tastyExUsers", JSON.stringify(users));
    showToast("Dish added to cart.");
  } else {
    showToast("Please Login.");
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
    else showToast("Can't order more than 10 units of same item.");
  } else {
    if (q > 1) users[curUser].cart.quantity[i]--;
    else if (q === 1) {
      removeDish(id);
      return;
    } else showToast("Error");
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
    showToast("dish not in cart");
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
      document.getElementById("total-order-price").innerHTML = 0;
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
     <svg clip-rule="evenodd" 
     fill-rule="evenodd" 
     stroke-linejoin="round" 
     stroke-miterlimit="2" 
     width="28"
       height="28"
       viewBox="0 0 24 24"
       fill="currentcolor"
     class="sec-btn"  onclick="updateDish(\`` +
        "dec" +
        `\`,\`` +
        dishId +
        `\`);" xmlns="http://www.w3.org/2000/svg"><path d="m21 11.75c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg>
     <div class="dish-quantity">${users[curUser].cart.quantity[i]}</div>
     <svg clip-rule="evenodd" 
     fill-rule="evenodd"
      stroke-linejoin="round"
       stroke-miterlimit="2"
       width="28"
       height="28"
       viewBox="0 0 24 24"
       fill="currentcolor" xmlns="http://www.w3.org/2000/svg"
       class="sec-btn" onclick="updateDish(\`` +
        "inc" +
        `\`,\`` +
        dishId +
        `\`);">
        <path d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" fill-rule="nonzero"/>
     </svg>
     
       </div>
        <div class="price">₹ ${
          users[curUser].cart.quantity[i] * dish.price
        }</div>
      </div>
        <button class="del-dish-btn sec-btn"  onclick="removeDish(\`` +
        dishId +
        `\`);">
        <svg fill="currentcolor" width="20" height="20"             viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z"/></svg>        </button>
    </div>`;
      total = total + users[curUser].cart.quantity[i] * dish.price;
    });
    document.getElementById("checkout-btn").disabled = false;
    document.getElementById("total-order-price").innerHTML = total;
  } else {
    showToast("Please Login.");
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
              <svg fill="currentcolor" 
            clip-rule="evenodd" 
            fill-rule="evenodd" 
            stroke-linejoin="round" 
            stroke-miterlimit="2" 
            viewBox="0 0 24 24" 
            width="12"
            height="12" xmlns="http://www.w3.org/2000/svg"><path d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z" fill-rule="nonzero"/></svg>
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
          <h4 class="text-center">${rest}</h4>
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
