// Your existing JavaScript code for weather app...

const domManip = (() => {
  const searchButton = document.querySelector(".search-button");
  const clearButton = document.querySelector(".reset-button");
  searchButton.addEventListener("click", fetchCurrentWeather);
  clearButton.addEventListener("click", clearSearch);
  document.addEventListener("DOMContentLoaded", function hideBrokenImg() {
    firstLoadImg.style.display = "none";
  });
})();

async function fetchCurrentWeather() {
  try {
    const searchCity = document.getElementById("search-city").value;
    const searchState = document.getElementById("search-state").value;

    if (searchCity == "") {
      alert("Enter city and country name!");
      return;
    }

    const locations = [
      { city: searchCity, state: searchState, country: "" }, // Add more locations as needed
      // { city: "AnotherCity", state: "AnotherState", country: "" },
    ];

    const promises = locations.map((location) => {
      return fetchWeatherData(location);
    });

    const weatherDataArray = await Promise.all(promises);

    // Now weatherDataArray contains an array of weather data for each location
    console.log("All weather data fetched:", weatherDataArray);

    // Process or display the weather data as needed
  } catch (err) {
    alert("Your input data are Invalid!");
  }
}

async function fetchWeatherData(location) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.city},${location.state},${location.country}&units=imperial&APPID=d1f87e6c9c7218274f8b83bf9e900783`,
      { mode: "cors" }
    );
    const currentData = await response.json();
    console.log(
      `Fetching current weather data for ${location.city} from API....`,
      currentData
    );

    const currentWeather = {
      mainWeather: currentData.weather[0].main,
      place:
        currentData.name +
        ", " +
        location.state.toUpperCase() +
        " " +
        currentData.sys.country,
      temp: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity + "%",
      wind: Math.round(currentData.wind.speed) + " MPH",
    };

    console.log(currentWeather);

    // Return the weather data for this location
    return currentWeather;
  } catch (err) {
    console.log(`Error fetching weather data for ${location.city}`, err);
    // You may choose to return some default values or handle the error differently
    return {};
  }
}

// Other functions remain the same

async function fetchCurrentWeather(searchCity, searchState, searchCountry) {
  try {
    const searchCity = document.getElementById("search-city").value;
    const searchState = document.getElementById("search-state").value;
    if (searchCity == "") {
      alert("Enter city and country name!");
      return;
    }

    console.log(searchCity);
    console.log(searchState);
    console.log(searchCountry);

    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchCity +
        "," +
        searchState +
        "," +
        searchCountry +
        "&units=imperial&APPID=d1f87e6c9c7218274f8b83bf9e900783",
      { mode: "cors" }
    );
    const currentData = await response.json();
    console.log("Fetching current weather data from API....", currentData);

    const currentWeather = {
      mainWeather: currentData.weather[0].main,
      place:
        currentData.name +
        ", " +
        searchState.toUpperCase() +
        " " +
        currentData.sys.country,
      temp: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity + "%",
      wind: Math.round(currentData.wind.speed) + " MPH",
    };

    console.log(currentWeather);

    displayWeather(currentWeather);

    getGiphy(currentWeather.mainWeather);
  } catch (err) {
    alert("Your input data are Invalid!");
  }

  //  fetching country info

  const countryInput = document.getElementById("countryInput").value;

  if (!countryInput) {
    alert("Please enter a country name.");
    return;
  }

  const apiUrl = `https://restcountries.com/v3.1/name/${countryInput}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 404) {
        alert("Country not found. Please enter a valid country name.");
      } else {
        displayCountryInfo(data[0]);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function clearSearch() {
  document.getElementById("search-city").value = "";
  document.getElementById("search-state").value = "";
  document.querySelector(".hide").style.display = "";
  const img = document.querySelector("img");
  img.style.display = "none";

  // clear country info
  const countryInfoDiv = document.getElementById("countryInfo");
  countryInfoDiv.innerHTML = "";
  // end

  clearDOM();
}

function displayWeather(currentWeather) {
  const displayDiv = document.querySelector(".display-div");

  clearDOM();

  const city = document.createElement("p");
  city.textContent = currentWeather.place;
  displayDiv.appendChild(city);
  const status = document.createElement("p");
  status.textContent = currentWeather.mainWeather;
  displayDiv.appendChild(status);
  const cityTemp = document.createElement("p");
  cityTemp.textContent = currentWeather.temp + " Degrees";
  displayDiv.appendChild(cityTemp);
  const cityHumidity = document.createElement("p");
  cityHumidity.textContent = currentWeather.humidity + " Humidity";
  displayDiv.appendChild(cityHumidity);
  const cityWind = document.createElement("p");
  cityWind.textContent = currentWeather.wind + " Wind";
  displayDiv.appendChild(cityWind);
}

async function getGiphy(mainWeather) {
  try {
    let keyWord = mainWeather;
    if (keyWord == "Clear") {
      keyWord = "Clear Sky";
    }
    const response = await fetch(
      "https://api.giphy.com/v1/gifs/translate?api_key=jh5Ua1zTUPEmBUWYn69qc94sPCUIWoQz&weirdness=0&s=" +
        keyWord,
      { mode: "cors" }
    );
    const giphyResponse = await response.json();
    console.log(giphyResponse);
    img.style.display = "";
  } catch (err) {
    console.log("Something has went wrong, trying again to fetch", err);
  }
}

function clearDOM() {
  const nodeList = document.querySelectorAll("p");
  if (nodeList !== null) {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].remove();
    }
  }
}

// function getCountryInfo() {

// }

function displayCountryInfo(country) {
  const countryInfoDiv = document.getElementById("countryInfo");
  countryInfoDiv.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="${country.name.common} Flag" width="100">
        <p>Population: ${country.population}</p>
        <p>Area Surface: ${country.area} k2</p>
      `;
}
