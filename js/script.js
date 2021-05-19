//Assign HTML elements to variables
let name = document.querySelector("#name");
let email = document.querySelector("#email");
let jobRole = document.querySelector("#title");
let otherjobRole = document.querySelector("#other-job-role");
let color = document.querySelector("#color");
let design = document.querySelector("#design");
let activities = document.querySelector("#activities");
let activitiesBox = document.querySelector("#activities-box");
let activitiesCost = document.querySelector("#activities-cost");
let payment = document.querySelector("#payment");
let creditCardSection = document.querySelector("#credit-card");
let paypalSection = document.querySelector("#paypal");
let bitcoinSection = document.querySelector("#bitcoin");
let cardNumber = document.querySelector("#cc-num");
let zip = document.querySelector("#zip");
let cvv = document.querySelector("#cvv");
let form = document.getElementsByTagName("FORM")[0];
let inputElements = document.getElementsByTagName("INPUT");



//------------------#3 The "Name" field--------------------------
//When the page first loads, the first text field should have the focus state by default to prompt the user.
name.focus();


//----------------#4 "Job Role" section--------------------------
//Hide "other" job role, unless "other" is selected
otherjobRole.style.display = "none";
jobRole.addEventListener('change', (event) => {
  if (event.target.value === "other") {
    otherjobRole.style.display = "block";
  } else {
    otherjobRole.style.display = "none";
  }});


//----------------#5 "T-Shirt Info" section--------------------------
//User shouldn’t be able to see or choose a color option until they have chosen a design
color.disabled = true;

//Change color options depending on designs
design.addEventListener('change', (event) => {
  color.disabled = false;

  //Loop through all the color options
  let colorOptions = color.children;
  for (i = 0; i < colorOptions.length; i++ ) {

    //Hide any that dont match the "data-theme" attribute
    if (colorOptions[i].getAttribute("data-theme") === event.target.value) {
      colorOptions[i].style.display = "block";
    } else {
      colorOptions[i].style.display = "none";
    }
  }
  //select first option by default
  color.selectedIndex = 0;
});


//----------------#6 "Register for Activities" section-----------------
//"total" variable will hold the current total
let total = 0;

//Program the "Register for Activities" fieldset element to listen for user changes
activities.addEventListener('change', (event) => {
  if(event.target.tagName === "INPUT") {

    //add or subtract the current cost depending on checkbox
    if (event.target.checked) {
      total += parseInt(event.target.getAttribute("data-cost"));
    } else {
      total -= parseInt(event.target.getAttribute("data-cost"));
    }
    //Extra credit #1 - prevent conflicting activities
    checkConflictingActivities();

    //display updated total on webpage
    activitiesCost.innerHTML = `Total: $${total}`
  }
});


//---------------------#7 "Payment Info" section----------------------
//The credit card payment option should be selected for the user by default.
payment.value = "credit-card";
paypalSection.style.display = "none"
bitcoinSection.style.display = "none"

//When a change is detected, hide all payment sections in the form’s UI except the selected one
payment.addEventListener('change', (event) => {

  //this array holds the payment option sections
  const paymentOptions = [creditCardSection, paypalSection, bitcoinSection];

  //loop through array and hide any that don't match selected option
  for (let i = 0; i < paymentOptions.length; i++){
    if (paymentOptions[i].getAttribute("id") === payment.value) {
      paymentOptions[i].style.display = "block"
    } else {
      paymentOptions[i].style.display = "none"
    }
  }
});


//---------------------------#8 Form validation---------------------------
//create helper functions for each of the required fields to be validated.

//The "Name" field cannot be blank or empty.
function nameValidate() {
  const regex = /\S+/;
  const test = regex.test(name.value);
  showOrHideHint(name, test, "Name field cannot be blank");
  return test;
}

//The "Email Address" field must contain a validly formatted email address
function emailValidate() {
  const regex = /\S+@\S+\.\S+/;
  const test = regex.test(email.value);
  showOrHideHint(email, test, "Email address must be formatted correctly");
  return test;
}

//The "Register for Activities" section must have at least one activity selected.
function activityValidate() {
  //loop through activities to check for at least one checkbox
  let test = false;
  const activitiesCheckboxes = activities.children[1].children;
  for (let i = 0; i < activitiesCheckboxes.length; i++){
    if (activitiesCheckboxes[i].children[0].checked) {
      test = true;
    }
  }
  //show error message if test is not passed
  if (test) {
    activities.children[0].className = "valid";
    activities.lastElementChild.style.display = "none";
  } else {
    activities.children[0].className = "not-valid";
    activities.lastElementChild.style.display = "block";
  }
  return test;
}

//Validate payment fields only on credit Card
function paymentValidate() {
  let isValid = true
  if (payment.value === "credit-card") {
    if (!cardNumberValidate()){
      isValid = false
    }
    if (!zipValidate()) {
      isValid = false
    }
    if (!cvvValidate()) {
      isValid = false
    }
  }
  return isValid;
}

//The "Card number" field must contain a 13 - 16 digit credit card number with no dashes or spaces
function cardNumberValidate() {
  const regex = /^[0-9]{13,16}$/;
  const test = regex.test(cardNumber.value);
  showOrHideHint(cardNumber, test, "Credit card number must be between 13 - 16 digits");
  return test;
}

//The "Zip code" field must contain a 5 digit number.
function zipValidate() {
  const regex = /^[0-9]{5}$/;
  const test = regex.test(zip.value);
  showOrHideHint(zip, test, "Zip Code must be 5 digits");
  return test;
}

//The "CVV" field must contain a 3 digit number.
function cvvValidate() {
  const regex = /^[0-9]{3}$/;
  const test = regex.test(cvv.value);
  showOrHideHint(cvv, test, "CVV must be 3 digits");
  return test;
}

//Program the form element to listen for the submit event
form.addEventListener('submit', (event) => {
  let isValid = true

  //run all validations, boolean "isValid" should be true if all are passed
  if (!nameValidate()){
    isValid = false
  }
  if (!emailValidate()) {
    isValid = false
  }
  if (!activityValidate()) {
    isValid = false
  }
  if (!paymentValidate()){
    isValid = false
  }

  //only prevent default if there are invalid fields
  if(!isValid) {
    event.preventDefault();
  } else {
    alert("Successfully registered!");
  }

});


//---------------------------#9 Accessibility---------------------------
//Program all of the activity checkbox input elements to listen for the focus and blur events
for (let i = 0; i < inputElements.length; i++){
  inputElements[i].addEventListener('focus', (event) => {
    //add the .focus class name to parent label
    inputElements[i].parentElement.className = "focus";
  });
  inputElements[i].addEventListener('blur', (event) => {
    //remove the .focus className from the label element that possesses it.
    inputElements[i].parentElement.removeAttribute("class");
  });
}

//this function controls diplaying or hiding the hints for the input elements
function showOrHideHint(element, isValid, hint) {
  if (isValid) {
    element.parentElement.className = "valid";
    element.parentElement.lastElementChild.style.display = "none";
  } else {
    element.parentElement.className = "not-valid";
    element.parentElement.lastElementChild.style.display = "block";

    //Extra Credit #3 - Conditional error message if blank
    if (element.value === "") {
      //use the element ID in the blank error message!
      element.parentElement.lastElementChild.innerHTML = `${element.id.charAt(0).toUpperCase() + element.id.slice(1)} field cannot be blank`;
    } else {
      element.parentElement.lastElementChild.innerHTML = hint;
    }
  }
}


//----Extra Credit #1 - Prevent users from registering for conflicting activities-----
//When then user interaction occurs, run the validation check for that input
function checkConflictingActivities() {
  let currentBooked = [];
  let activitiesCheckboxes = activities.children[1].children;

  //first for loop is to reset and place any checked booked times in "currentBooked" array
  for (let i = 0; i < activitiesCheckboxes.length; i++){
    if (activitiesCheckboxes[i].children[0].checked) {
      currentBooked.push(activitiesCheckboxes[i].children[0].getAttribute("data-day-and-time"));
    }
    //reset all to enabled
    activitiesCheckboxes[i].children[0].disabled = false;
  }

  //second for loop is to disable any that are unchecked and inclided in "currentBooked" array
  for (let i = 0; i < activitiesCheckboxes.length; i++){

    //is it unchecked?
    if (!activitiesCheckboxes[i].children[0].checked) {

      //loop throgh currentBooked array to see if there is a match
      for (let j = 0; j < currentBooked.length; j++){
        if (currentBooked[j] === activitiesCheckboxes[i].children[0].getAttribute("data-day-and-time")){
          activitiesCheckboxes[i].children[0].disabled = true;
        }
      }
    }
  }
}


//---------------Extra Credit #2 - Real-time error message-------------------------
//When then user interaction occurs, run the validation check for that input
name.addEventListener('keyup', nameValidate);
email.addEventListener('keyup', emailValidate);
activities.addEventListener('change', activityValidate);
cardNumber.addEventListener('keyup', cardNumberValidate);
zip.addEventListener('keyup', zipValidate);
cvv.addEventListener('keyup', cvvValidate);
