"use strict";
const cityList = {
  bh: ["Gaya", "Muzaffarpur", "Nalanda", "Patna", "Rohtas"],
  jh: ["Bokaro", "Dhanbad", "Hazaribagh", "Ramgarh", "Ranchi"],
  kt: ["Bagalkot", "Bangalore", "Belgaum", "Bellary", "Bidar"],
  tn: ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri"],
  mh: ["Amravati", "Jalna", "Kolhapur", "Latur", "Mumbai", "Nagpur"],
  wb: ["Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Kolkata"],
  dl: [
    "Central Delhi",
    "East Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
  ],
};
var logoutBtn = document.getElementById("logout-btn");

/*************populating cities********* */
function autoPopulateCities() {
  document.getElementById("select-state").addEventListener("change", () => {
    console.log("abc");
    var StateSelected = document.getElementById("select-state").value;
    var htmlString = `<option value="" selected="" disabled="" hidden="">
  Choose City
</option>`;
    for (var i = 0; i < cityList[StateSelected].length; i++) {
      htmlString =
        htmlString +
        "<option value='" +
        cityList[StateSelected][i] +
        "'>" +
        cityList[StateSelected][i] +
        "</option>";
    }
    document.getElementById("select-city").innerHTML = htmlString;
  });
}
/*************populating cities********* */

export function getUsers() {
  return JSON.parse(localStorage.getItem("tastyExUsers")) || [];
}

export function currentUserIndex(users) {
  console.log(users);
  if (users.length > 0) {
    var ind = users.findIndex((user) => user.isLoggedIn == true);
    return ind;
  } else return -1;
}

//var signupForm = document.signupForm;
function blurValidation() {
  const onBlurInputs = document.querySelectorAll(".validate-onblur");
  Array.from(onBlurInputs).forEach((input) => {
    input.addEventListener("focusout", (e) => {
      console.log(input.checkValidity());
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
      input.classList.add(input.checkValidity() ? "is-valid" : "is-invalid");
    });
  });
}

function submitValidation() {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
          event.stopPropagation();
        } else {
          if (form.name == "signupForm") signupFunc();
          if (form.name == "loginForm") loginFunc();
        }

        form.classList.add("was-validated");
        console.log(form.name);
      },
      false
    );
  });
}

function signupFunc() {
  var user = {
    isLoggedIn: true,
    fname: document.getElementById("firstName").value,
    lname: document.getElementById("lastName").value,
    pwd: document.getElementById("signupPassword").value,
    email: document.getElementById("signupEmail").value,
    phnNo: document.getElementById("phoneNumber").value,
    city: document.getElementById("select-city").value,
    state: document.getElementById("select-state").value,
    pin: document.getElementById("pinCode").value,
    add1: document.getElementById("address1").value,
    add2: document.getElementById("address2").value,
    cart: { dishes: [], quantity: [] },
    prevOrders: [],
  };
  var users = getUsers();
  const checkEmail = users.some((u) => user.email === u.email);
  if (checkEmail) {
    alert("User already exists. Please Log in");
    return;
  }
  users.forEach((user) => {
    user.isLoggedIn = false;
  });
  users.push(user);
  localStorage.setItem("tastyExUsers", JSON.stringify(users));
  window.location.reload();
}
function loginFunc() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;
  var users = getUsers();
  var userIndex = users.findIndex((u) => u.email === email);
  console.log(users);
  console.log(userIndex);
  if (userIndex >= 0) {
    if (users[userIndex].pwd === pass) {
      users.forEach((user) => {
        user.isLoggedIn = false;
      });
      users[userIndex].isLoggedIn = true;
      localStorage.setItem("tastyExUsers", JSON.stringify(users));
      //toggle logout btn
      window.location.reload();
    } else alert("Invalid Password");
  } else alert("User doesn't exist");
}
function logoutFunc() {
  console.log("logged out");
  var users = getUsers();
  users[currentUserIndex(users)].isLoggedIn = false;
  localStorage.setItem("tastyExUsers", JSON.stringify(users));
  toggleLogoutbtn("logout");
}
function toggleLogoutbtn(action) {
  if (action === "login") {
    document.getElementById("login-btn").classList.add("d-none");
    document.getElementById("signup-btn").classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    document.getElementById("login-btn").classList.remove("d-none");
    document.getElementById("signup-btn").classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  blurValidation();
  submitValidation();
  autoPopulateCities();
  logoutBtn.addEventListener("click", logoutFunc);
  if (localStorage) {
    if (currentUserIndex(getUsers()) >= 0) {
      toggleLogoutbtn("login");
    }
  } else {
    alert("Unsupported browser.");
  }
});
