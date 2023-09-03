// ------------------------------------------------------------------------
// Cruises Array
// ------------------------------------------------------------------------

// Data representing cruises
const cruises = [
  {
    wishlistCruiseame: "Cape Town Getaway",
    price: "ZAR 25,000",
    image: "Cruise1.jpg",
    duration: 7,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Escape to the stunning city of Cape Town."
  },
  {
    name: "Durban Discovery",
    price: "ZAR 18,500",
    image: "Cruise2.jpg",
    duration: 4,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Experience the vibrant culture and beaches of Durban."
  },
  {
    name: "Ocean Voyage Cruises",
    price: "ZAR 32,800",
    image: "DD.jpg",
    duration: 10,
    destinations: 3,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Embark on a journey across the open seas with OceanVoyage Cruises, where every voyage is an adventure waiting to be discovered."
  },
  {
    name: "South Africa Seafarers",
    price: "ZAR 40,200",
    image: "DD.jpg",
    duration: 8,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Experience the rich and diverse beauty of South Africa's coastline as you set sail with South Africa Seafarers."
  },
  {
    name: "African Odyssey Cruises",
    price: "ZAR 28,900",
    image: "DD.jpg",
    duration: 6,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Embark on an epic odyssey through Africa's coastal treasures, where history and nature converge in breathtaking harmony."
  },
  {
    name: "Cape Breeze Cruises",
    price: "ZAR 22,750",
    image: "DD.jpg",
    duration: 14,
    destinations: 1,
    roundTrip: true,
    rowBoatSpecial: false,
    description: "Let the gentle Cape Breeze carry you away on luxurious cruises along the stunning coasts of Africa."
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

document.addEventListener("DOMContentLoaded", function() {
  const purchaseTable = document.getElementById("purchase-table");
  const removeAllButton = document.getElementById("remove-all-button");
  const purchaseButton = document.getElementById("purchase-button");
  const successMessage = document.getElementById("success-message");

  removeAllButton.addEventListener("click", function() {
      const tbody = purchaseTable.querySelector("tbody");
      tbody.innerHTML = "";
  });

  purchaseButton.addEventListener("click", function() {
      successMessage.classList.remove("hidden");
  });

  purchaseTable.addEventListener("click", function(e) {
      if (e.target && e.target.nodeName == "BUTTON") {
          // Remove the row when the remove button is clicked
          e.target.closest("tr").remove();
      }
  });

  // Function to add a new row to the table
  function addTableRow(tripCode, ticketQuantity, totalCost) {
      const tbody = purchaseTable.querySelector("tbody");
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td>${tripCode}</td>
          <td>${ticketQuantity}</td>
          <td>${totalCost}</td>
          <td><button class="remove-button">Remove</button></td>
      `;
      tbody.appendChild(newRow);
  }

  // Example: Adding rows to the table
  addTableRow("Durban Discovery", 2, "R37,000");
  addTableRow("DEF456", 1, "$50");
});


// Sample trip data (you can replace this with your actual data)
const trips = [
  { name: 'Trip 1', details: 'Details for Trip 1' },
  { name: 'Trip 2', details: 'Details for Trip 2' },
  { name: 'Trip 3', details: 'Details for Trip 3' },
];

const tripOptionsContainer = document.querySelector('.trip-options');
const tripDetailsContainer = document.querySelector('.trip-details');
const purchaseButton = document.getElementById('purchase-button');

// Function to populate trip options
function populateTripOptions() {
  tripOptionsContainer.innerHTML = '';
  trips.forEach((trip, index) => {
      const tripOption = document.createElement('div');
      tripOption.classList.add('trip-option');
      tripOption.innerText = trip.name;

      tripOption.addEventListener('click', () => {
          // Reset all trip options
          tripOptionsContainer.querySelectorAll('.trip-option').forEach((option) => {
              option.classList.remove('active');
          });

          // Highlight the selected trip
          tripOption.classList.add('active');

          // Display additional information on the selected trip
          tripDetailsContainer.innerHTML = `<p>${trip.details}</p>`;
          purchaseButton.classList.add('active');
      });

      tripOptionsContainer.appendChild(tripOption);
  });
}

// Initialize the trip options
populateTripOptions();


// JavaScript for dynamic content

// Function to update the header text when the document is ready
document.addEventListener("DOMContentLoaded", function() {
  const headerText = document.getElementById("header-text");
  headerText.textContent = "Welcome to Your Cruise Name";
});

// Function to fetch and display weather data from Open Weather API
function fetchWeatherData() {
  // Replace 'YOUR_API_KEY' with your actual Open Weather API key
  const apiKey = 'YOUR_API_KEY';
  const city = 'YourCity'; // Replace with the desired city
  const weatherDataElement = document.getElementById("weather-data");

  // Construct the API URL
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Make a fetch request to the API
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          // Extract and display relevant weather information
          const temperature = data.main.temp;
          const description = data.weather[0].description;
          weatherDataElement.innerHTML = `<p>Weather in ${city}: ${temperature}°C, ${description}</p>`;
      })
      .catch(error => {
          console.error("Error fetching weather data:", error);
          weatherDataElement.innerHTML = "<p>Weather data unavailable</p>";
      });
}

// Call the function to fetch weather data when the page loads
fetchWeatherData();
