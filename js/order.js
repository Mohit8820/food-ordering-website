import { currentUserIndex } from "./auth.js";
var users;
var curUser;
console.log(currentUserIndex());

//one modal whose body changes as per button click
//same for toast
//off canvas backdrop
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
          }" onclick="addDish(event);">Add</button>
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
  // check for log in
  var dishId = e.target.getAttribute("data-id");
  var dish = menu.find((dish) => dish.dishId == dishId);
  console.log(dish);
}
function loadCart() {
  // check for log in
  console.log("load");
}
document.addEventListener("DOMContentLoaded", function () {
  fetch("menu.json")
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
  document.getElementById("cart-btn").addEventListener("click", loadCart);
});
