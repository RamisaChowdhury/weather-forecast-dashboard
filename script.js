//Variables
var apiURL = "https://api.openweathermap.org/data/2.5/weather?q="
var key = "b89451221676870f9b7abb8245ede578"
var cityName = $("#search-input").val();
var queryURL;
var savedSearches = [];

//Get co-ordinates from city name searched
function getCityInfo () {
    var savedSearches = JSON.parse(localStorage.getItem("cities")) || [];
    cityName = $("#search-input").val();
    coordURL = apiURL + cityName + "&appid=" + key;
    console.log('query: ', coordURL)

    fetch(coordURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var cityInfo = {
                city: cityName,
                lon: data.coord.lon,
                lat: data.coord.lat,
            }
            console.log(cityInfo);
            savedSearches.push(cityInfo);
            localStorage.setItem("cities", JSON.stringify(savedSearches));
            getTodaysWeather();
            get5DayForecast();
            showSearchHistory();
        })
        return;
};


//Get today's weather
function getTodaysWeather (data) {
    weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric" + "&APPID=" + key;
    fetch(weatherURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            //create element for today's weather
            var todaysWeatherEl = $("#today");
            todaysWeatherEl.addClass("border border-5 p-5");
            //create title for city name
            var cityNameTitleEl = $("<h2>");
            // cityNameLowerCase = cityName.slice(1, cityName.length).toLowerCase();
            // cityNameUpperCase = cityName[0].toUpperCase();
            cityNameTitleEl.text(cityName);
            todaysWeatherEl.append(cityNameTitleEl)
            //create element for today's date
            var todaysDate = dayjs().format("DD/MM/YYYY");
            todaysDateEl = $("<span>");
            todaysDateEl.text(" " + todaysDate);
            cityNameTitleEl.append(todaysDateEl);
            //create element for today's weather icon
            var weatherIcon = data.weather[0].icon;
            var todaysWeatherIcon = $("<img>");
            todaysWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png");
            todaysDateEl.append(todaysWeatherIcon);
            //create element for today's temperature
            var todaysTemp = data.main.temp;
            var todaysTempEl = $("<p>");
            todaysTempEl.text("Temperature: " + todaysTemp + "°C");
            todaysWeatherEl.append(todaysTempEl); 
            //create element for today's humidity
            var todaysHumidity = data.main.humidity;
            var todaysHumidityEl = $("<p>");
            todaysHumidityEl.text("Humidity: " + todaysHumidity + "%");
            todaysWeatherEl.append(todaysHumidityEl); 
            //create element for today's wind speed
            var todaysWindSpeed = data.wind.speed;
            var todaysWindSpeedEl = $("<p>");
            todaysWindSpeedEl.text("Wind Speed: " + todaysWindSpeed + "ms⁻¹");
            todaysWeatherEl.append(todaysWindSpeedEl);
        });
};
        
//Get 5 day forecast
function get5DayForecast (data) {
    //clear previous weather info
    $("#forecast").empty();
    //create title for 5 day forecast
    var forecastEl = $("#forecast");
    var forecastTitleEl = $("<h2>");
    forecastTitleEl.text("5-day Forecast").addClass("py-3")
    forecastEl.append(forecastTitleEl);
    //display data for next 5 days
    var cityName = $("#search-input").val();
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric" + "&appid=" + key;
    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            for (var i = 1; i <= 5; i++) {
                //Get date
                date = dayjs().add(i, 'days').format("DD/MM/YYYY");
                var dateEl = $("<p>").text(date).addClass("mx-auto pt-3").css({"font-weight":"bolder", "font-size":"14pt"})
                
                //Get temp for each day
                temp = data.list[i].main.temp;
                var tempEl = $("<p>").text("Temperature: " + temp + "°C");

                //Get weather icon for each day
                icon = data.list[i].weather[0].icon
                var iconEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + icon + ".png");

                //Get wind speed for each day
                wind = data.list[i].wind.speed
                var windEl = $("<p>").text("Wind Speed: " + wind + "ms⁻¹");

                //Get humidity for each day
                humidity = data.list[i].main.humidity;
                var humidityEl = $("<p>").text("Humidity: " + humidity + "%");

                //Create a card for each day
                var dayCard = $("<div>").addClass("card col-lg-2 mx-auto");
                var dayCardBody = $("<div>").addClass("card-body mx-auto");

                //Create a div within the card
                dayCard.append(dateEl, dayCardBody);

                //Add info to card body
                dayCardBody.append(iconEl, tempEl, windEl, humidityEl);

                //Add card to forecast in body
                forecastEl.append(dayCard);
            };
        });
    return;
};


//Create buttons for searched vities (search-history)
function showSearchHistory () {
    var savedSearches = JSON.parse(localStorage.getItem("cities")) || [];
    var searchHistory = $("#history");
    searchHistory.html("");
    for (i = 0; i < savedSearches.length; i++) {
        var savedCity1stChar = savedSearches[i].city[0].toUpperCase();
        var savedCityLowercaseChar = savedSearches[i].city.slice(1, savedSearches[i].city.length).toLowerCase();
        var savedCity = $("<button>").text(savedCity1stChar+savedCityLowercaseChar)
        savedCity.addClass("btn btn-outline-dark m-1 previous-search");
        searchHistory.append(savedCity);
    }
};

function clearCurrentWeather () {
    $("#today").empty();
    $("#forecast").empty();
}

function clearSearchHistory () {
    $("#history").empty();
    clearCurrentWeather();
    $("#today").removeClass("border border-5 p-5");
    localStorage.clear();
}

//When a previous search is clicked, get forecast for that city
function getWeather(event) {
    var element = event.target
    if (element.matches(".previous-search")) {
        var newCity = element
        var cityName = newCity.innerHTML;
        console.log(cityName)
        clearCurrentWeather();
        var newWeatherURL = apiURL + cityName + "&appid=" + key;
        console.log('query: ', newWeatherURL)

        fetch(newWeatherURL)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                //create element for today's weather
                var todaysWeatherEl = $("#today");
                todaysWeatherEl.addClass("border border-5 p-5");
                //create title for city name
                var cityNameTitleEl = $("<h2>");
                cityNameTitleEl.text(cityName);
                todaysWeatherEl.append(cityNameTitleEl)
                //create element for today's date
                var todaysDate = dayjs().format("DD/MM/YYYY");
                todaysDateEl = $("<span>");
                todaysDateEl.text(" " + todaysDate);
                cityNameTitleEl.append(todaysDateEl);
                //create element for today's weather icon
                var weatherIcon = data.weather[0].icon;
                var todaysWeatherIcon = $("<img>");
                todaysWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png");
                todaysDateEl.append(todaysWeatherIcon);
                //create element for today's temperature
                var todaysTemp = data.main.temp;
                var todaysTempEl = $("<p>");
                todaysTempEl.text("Temperature: " + todaysTemp + "°C");
                todaysWeatherEl.append(todaysTempEl); 
                //create element for today's humidity
                var todaysHumidity = data.main.humidity;
                var todaysHumidityEl = $("<p>");
                todaysHumidityEl.text("Humidity: " + todaysHumidity + "%");
                todaysWeatherEl.append(todaysHumidityEl); 
                //create element for today's wind speed
                var todaysWindSpeed = data.wind.speed;
                var todaysWindSpeedEl = $("<p>");
                todaysWindSpeedEl.text("Wind Speed: " + todaysWindSpeed + "ms⁻¹");
                todaysWeatherEl.append(todaysWindSpeedEl);

                //5 day forecast
                var forecastEl = $("#forecast");
                var forecastTitleEl = $("<h2>");
                forecastTitleEl.text("5-day Forecast").addClass("py-3")
                forecastEl.append(forecastTitleEl);
                var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric" + "&appid=" + key;
                fetch(forecastUrl)
                    .then(function (response) {
                        return response.json();
                        }).then(function (data) {
                    for (var i = 1; i <= 5; i++) {
                        //Get date
                        date = dayjs().add(i, 'days').format("DD/MM/YYYY");
                        var dateEl = $("<p>").text(date).addClass("mx-auto pt-3").css({"font-weight":"bolder", "font-size":"14pt"})  
                        //Get temp for each day
                        temp = data.list[i].main.temp;
                        var tempEl = $("<p>").text("Temperature: " + temp + "°C")
                        //Get weather icon for each day
                        icon = data.list[i].weather[0].icon
                        var iconEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + icon + ".png");
                        //Get wind speed for each day
                        wind = data.list[i].wind.speed
                        var windEl = $("<p>").text("Wind Speed: " + wind + "ms⁻¹");
                        //Get humidity for each day
                        humidity = data.list[i].main.humidity;
                        var humidityEl = $("<p>").text("Humidity: " + humidity + "%");
                        //Create a card for each day
                        var dayCard = $("<div>").addClass("card col-lg-2 mx-auto");
                        var dayCardBody = $("<div>").addClass("card-body mx-auto");
                        //Create a div within the card
                        dayCard.append(dateEl, dayCardBody);
                        //Add info to card body
                        dayCardBody.append(iconEl, tempEl, windEl, humidityEl);
                        //Add card to forecast in body
                        forecastEl.append(dayCard);
                    };
                });
            return;
        });
    }
};

//Functions and JQuery listener
showSearchHistory();

$("#search-button").on("click", function (event) {
    event.preventDefault();
    clearCurrentWeather();
    getCityInfo();
});

$("#history").on("click", getWeather);

$("#clear-history").on("click", clearSearchHistory);
