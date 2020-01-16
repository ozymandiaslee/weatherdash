const apiKey = "edb94b1152386548b889968daf394b97"
const weatherdisplayDiv = $('#weather-card');
const forecastdisplayDiv = $('#forecast-card');
const weatherDiv = $('#weather-display');
let savedCities = [];

function populateSaved() {

    var storedCities = JSON.parse(localStorage.getItem("savedCities"));
    
  if (storedCities !== null) {
    savedCities = storedCities;
    console.log(savedCities);
  }
  var searchList = $('.previous-search');
  searchList.empty();
  for (let i=0; i < savedCities.length; i++) {
      searchList.append(`<button type="button" class="list-group-item list-group-item-action city-button"> ${savedCities[i]} </button>`)
  }
  $(".city-button").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    weatherdisplayDiv.empty();
    $('.forecast').remove();
    var city = $(this).text();
    renderInitialDiv(city);
    searchCurrent(city);
    searchForecast(city);
});


}

function init() {
    populateSaved();
}

function searchCurrent(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var cardDiv = $('.card-body');
        let temp = ((response.main.temp-273.15)*1.8)+32
        cardDiv.append(`<p class="card-text">Temperature: ${temp.toFixed(2)}</br>
                        Humidity: ${response.main.humidity}% </br>
                        Wind Speed: ${response.wind.speed} MPH
                        </p>
                        <img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png"></img>
                        `);
    });
};

function searchForecast(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (let i = 0; i < 5; i++) {
            console.log(response.list[i]);
            let temp = ((response.list[i].main.temp-273.15)*1.8) + 32;
            weatherDiv.append(`<div class="col-2 forecast" style="margin-top:20px"> 
            <div class="card"><div class="card-body">
            <h5 class="card-title">${moment().add(i+1, 'days').format('L')}</h5>
            <p class="card-text">Temperature: ${temp.toFixed(2)} </br>
                                Humidity: ${response.list[i].main.humidity}% </p>
                                <img src="http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png"></img>

         </div></div></div>`)
        }

    });
}

function renderInitialDiv(city) {
    weatherdisplayDiv.append(
        `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${city.charAt(0).toUpperCase() + city.toLowerCase().substring(1)} (${moment().format('L')})</h5>
                 </div>
            </div>
        `)
}

$("#search").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    weatherdisplayDiv.empty();
    $('.forecast').remove();
    // Storing the city name
    var city = $("#city-input").val().trim();
    savedCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    renderInitialDiv(city);
    searchCurrent(city);
    searchForecast(city);
    populateSaved();
});


init();
