// ------------------------------------------------------------------------
// Cruises Array
// ------------------------------------------------------------------------

// Data representing cruises
const cruises = [
  {
    name: "Cape Town Getaway",
    price: "ZAR 25,000",
    duration: 7,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Escape to the stunning city of Cape Town..."
  },
  {
    name: "Durban Discovery",
    price: "ZAR 18,500",
    duration: 4,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Experience the vibrant culture and beaches of Durban..."
  },
  {
    name: "Garden Route Expedition",
    price: "ZAR 32,800",
    duration: 10,
    destinations: 3,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Explore the breathtaking landscapes of the Garden Route..."
  },
  {
    name: "Kruger National Park Safari",
    price: "ZAR 40,200",
    duration: 8,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Embark on an unforgettable safari adventure in Kruger National Park..."
  },
  {
    name: "Cape Winelands Escape",
    price: "ZAR 28,900",
    duration: 6,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Indulge in the finest wines and scenic beauty of the Cape Winelands..."
  },
  {
    name: "Wild Coast Retreat",
    price: "ZAR 22,750",
    duration: 5,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Experience the untouched beauty of the Wild Coast and its beaches..."
  },
  // Add more trips here...
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

const cruiseCardTemplate = document.getElementById("cruiseCardTemplate");
const cruisesContainer = document.getElementById("cruisesContainer");

function renderCruiseCard(cruise) {
  const cardClone = document.importNode(cruiseCardTemplate.content, true);
  const card = cardClone.querySelector(".card");
  card.querySelector("#nameText").textContent = cruise.name;
  card.querySelector("#priceText").textContent = cruise.price;
  card.querySelector("#destinationTemp").textContent = cruise.destinations + " Destinations";
  card.querySelector("#descriptionText").textContent = cruise.description;
  return card;
}

function filterCruises(filterType) {
  cruisesContainer.innerHTML = "";
  
  if (filterType === "all") {
    cruises.forEach(cruise => {
      cruisesContainer.appendChild(renderCruiseCard(cruise));
    });
  } else {
    const filteredCruises = cruises.filter(cruise => {
      if (filterType === "short") {
        return cruise.duration <= 5;
      } else if (filterType === "long") {
        return cruise.duration > 5;
      } else if (filterType === "single") {
        return cruise.destinations === 1;
      } else if (filterType === "multi") {
        return cruise.destinations > 1;
      } else if (filterType === "round") {
        return cruise.roundTrip;
      } else if (filterType === "rowBoat") {
        return cruise.rowBoatSpecial;
      }
    });

    filteredCruises.forEach(cruise => {
      cruisesContainer.appendChild(renderCruiseCard(cruise));
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  filterCruises("all");

  document.querySelectorAll('input[name="filterRadio"]').forEach(radio => {
    radio.addEventListener("change", event => {
      filterCruises(event.target.id.replace("Filter", "").toLowerCase());
    });
  });
});

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
