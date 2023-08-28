// ------------------------------------------------------------------------
// Cruises Array
// ------------------------------------------------------------------------

const arrCruises = [
  {
    name: "Cape Town Getaway",
    price: 25000,
    description: "Escape to the stunning city of Cape Town, where the iconic Table Mountain meets the vast blue ocean.",
    image: "cruise1-image.png",
    duration: "5 days",
    departure: "Durban, ZA",
    destination: "Cape Town, ZA"
  },
  {
    name: "Garden Route Adventure",
    price: 18000,
    description: "Discover the natural wonders along the Garden Route, from lush forests to pristine beaches.",
    image: "cruise2-image.png",
    duration: "7 days",
    departure: "Port Elizabeth, ZA",
    destination: "Knysna, ZA"
  },
  {
    name: "Drakensberg Retreat",
    price: 30000,
    description: "Embark on a serene journey to the majestic Drakensberg Mountains, where breathtaking landscapes await.",
    image: "cruise3-image.png",
    duration: "6 days",
    departure: "Durban, ZA",
    destination: "Drakensberg, ZA"
  },
  // Add more cruises here...
];

let appliedFilter = "";
let appliedSort = "date added";

// ------------------------------------------------------------------------
// When the document loads
// ------------------------------------------------------------------------

$(document).ready(function(){

    console.log("Hello");

    // ------------------------------------------------------------------
    // Home

    // When the document loads, animate the hero image upwards
    $("#hero-image").animate({top: '-=100px'});

    // ------------------------------------------------------------------
    // Browse

    filterSortCruises();

});

// ------------------------------------------------------------------------
// Load all cruises
// ------------------------------------------------------------------------

function loadCruises(cruisesToShow) {

  // Clear all elements inside the cruises cards container
  $("#cruisesContainer").empty();

  // Loop through cruises
  for (let i = 0; i < cruisesToShow.length; i++) {
    const cruise = cruisesToShow[i];

    // Open weather API call for getting the temperature
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + cruise.destination + "&appid=YOUR_API_KEY",
      success: function (data) {
        tempData = data;
        console.log(tempData);
      },
    }).done(function () {
      // Set Temperature
      $(currentChild).find("#destinationTemp").text("Destination Temp: " + Math.round(tempData.main.temp - 273) + "°C");
    });

    // 1: Select the cruises container and add the cruise card to it
    $("#cruisesContainer").append($("#cruiseCardTemplate").html());

    // 2: Create a variable that contains the most recently added cruise card
    let currentChild = $("#cruisesContainer").children().eq(i);

    // 3: Set the content for the current cruise card from the cruises array
    $(currentChild).find("#nameText").text(cruise.name);
    $(currentChild).find("#priceText").text("ZAR " + cruise.price.toLocaleString());
    $(currentChild).find("#descriptionText").text(cruise.description);
    $(currentChild).find(".card-img-top").attr('src','assets/' + cruise.image);

    // 4: Hide the description text from the current card
    $(currentChild).find("#descriptionText").hide();
    $(currentChild).find("#destinationTemp").hide();
  }
}

// ------------------------------------------------------------------------
// When a filter or sort option is clicked
// ------------------------------------------------------------------------

$("input[name='filterRadio']").click(function(){
  appliedFilter = $(this).attr('value');

  filterSortCruises();
});

$("input[name='sortRadio']").click(function(){
  appliedSort = $(this).attr('value');

  filterSortCruises();
});

function filterSortCruises() {
  
  let filteredSortedArrCruises = [];

  console.log(appliedFilter);
  console.log(appliedSort);

  // Filter Cruises
  if (appliedFilter) {
    filteredSortedArrCruises = arrCruises.filter(cruise => cruise.duration <= appliedFilter);
  } else {
    filteredSortedArrCruises = arrCruises;
  }

  // Sort Cruises
  if (appliedSort == "low to high") {
    // Sort cruises from the lowest to highest price
    filteredSortedArrCruises = filteredSortedArrCruises.sort((a, b) => {
      return a.price - b.price;
    });
  } else if (appliedSort == "date added") {
    // Sort cruises from the newest to oldest
    filteredSortedArrCruises = filteredSortedArrCruises.sort((a, b) => {
      let da = new Date(a.addedDate);
      let db = new Date(b.addedDate);
      return db - da;
    });
  }

  console.log(filteredSortedArrCruises);

  loadCruises(filteredSortedArrCruises);
}

// ------------------------------------------------------------------------
// When a cruise card is clicked
// ------------------------------------------------------------------------

$("#cruisesContainer").on('click','.card', function() {

  // Toggle the price & description text
  $(this).find("#priceText").toggle();
  $(this).find("#descriptionText").toggle();
  $(this).find("#destinationTemp").toggle();

  // Resize the image to fit the additional content
  $(this).find(".card-img-top").toggleClass("small");

});
