// GLOBAL VARIABLES DECLERATIONS

var countryBorderLayer;
var countryInfo = [];
var restCountryData = [];
var airportsInfo = [];
var newsData = [];
var weatherData = [];
var wikiData = [];
var currenciesData = [];
var specificRate = [];
var currencyKey = [];

const map = L.map('geoMap').setView([51.505, -0.09], 6);
var citiesLayer = L.markerClusterGroup();
var airportsLayer = L.markerClusterGroup();
var streets = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  }
).addTo(map);

var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  }
);

var geoWorldMap = L.tileLayer(
  'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?&apiKey=efa1e62118ac480c8eaa64339f2ea172', // Replace with your actual URL and API Key
  {
    attribution:
      'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    maxZoom: 20,
    id: 'osm-bright',
  }
);

var basemaps = {
  Streets: streets,
  Satellite: satellite,
  'OSM Bright': geoWorldMap,
};
citiesLayer.addTo(map);
airportsLayer.addTo(map);

var overlays = {
  Cities: citiesLayer,
  Airports: airportsLayer,
};
var layerControl = L.control.layers(basemaps, overlays).addTo(map);

$(document).ready(() => {
  // Function to populate country names dropdown
  populateCountryDropdown();
  function populateCountryDropdown() {
    $.ajax({
      type: 'GET',
      url: './libs/php/geoJson.php', // URL to fetch country names
      dataType: 'json',
      success: function (data) {
        console.log('this is border data returned all together: ', data);
        let listHTML = `<option value="Select..." selected>Select...</option>`;
        const countryNames = data.data.countryInfo.features.map((feature) => [
          feature.properties.name,
          feature.properties.iso_a2,
        ]);

        countryNames.sort((a, b) => a[0].localeCompare(b[0]));
        countryNames.forEach(([name, iso_a2]) => {
          listHTML += `<option value="${iso_a2}">${name}</option>`;
        });

        $('#country').html(listHTML);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus, errorThrown);
      },
    });
  }

  function updateCountryBorders(isoA2) {
    $.ajax({
      type: 'GET',
      url: './libs/php/geoCountryBorders.php', // URL to fetch country borders
      data: { isoA2: isoA2 },
      success: function (data) {
        console.log(
          'the correct country border data has been returned: ',
          data
        );
        if (data && data.data && data.data.border) {
          const selectedCountryData = data.data.border;
          if (selectedCountryData) {
            updateMap(
              selectedCountryData.geometry.type,
              selectedCountryData.geometry.coordinates,
              true
            );
          }
        } else {
          console.log('No border data found for the specified country.');
          // Handle the case where no data is found, e.g., display a message or clear the map.
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus, errorThrown);
        // Handle AJAX request errors here.
      },
    });
  }

  // Fetch user's location and set default country
  fetchUserLocationAndSetDefault();

  $('#country').change(function () {
    const selectedIsoA2 = $(this).val();
    const selectedCountryName = $(this).find('option:selected').text();

    if (selectedIsoA2 !== 'Select...') {
      updateCountryBorders(selectedIsoA2);
      getGeneralCountryInfo(selectedCountryName);
      getWiki(selectedCountryName);
    }
  });

  // Function to fetch user's location and set default country
  function fetchUserLocationAndSetDefault() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getCountryFromCoordinates(lat, lon);
        },
        function (error) {
          console.warn(`ERROR(${error.code}): ${error.message}`);
        }
      );
    } else {
      console.log('Geolocation is not available');
    }
  }

  // Function to get country name from coordinates
  function getCountryFromCoordinates(lat, lon) {
    const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=934fe9278a2d4672a2f1dc1eda832981`;
    $.get(apiUrl, function (data) {
      const countryName = data.features[0].properties.country;
      setDefaultCountry(countryName);
    });
  }

  // Function to set the default country in the dropdown
  function setDefaultCountry(countryName) {
    $('#country option').each(function () {
      if ($(this).text() === countryName) {
        $(this).prop('selected', true).trigger('change');
      }
    });
  }
});

// -------------------------------- Update Country Border --------------------------------
const updateMap = (type, coordinates) => {
  // Remove the existing country border layer if it exists
  if (countryBorderLayer) {
    map.removeLayer(countryBorderLayer);
  }

  // Define the new country border layer
  countryBorderLayer = new L.geoJSON(
    {
      type: type,
      coordinates: coordinates,
    },
    {
      style: {
        color: '#2193b0',
      },
    }
  ).addTo(map);

  // Fit the map to the country border layer bounds
  map.fitBounds(countryBorderLayer.getBounds());
};

// All Api calls and data return functions

//function to call general country api
const getGeneralCountryInfo = (countryName) => {
  $.ajax({
    url: './libs/php/info.php',
    type: 'GET',
    data: {
      countryName: countryName,
    },
    success: function (result) {
      var resultObj = JSON.parse(result);

      if (
        resultObj.data &&
        resultObj.data.geonames &&
        resultObj.data.geonames.length > 0
      ) {
        countryInfo = resultObj.data.geonames[0];

        // Call getNews and getWeather
        getNews(countryInfo.countryCode);
        getRestCountry(countryInfo.countryCode);
        getWeather(countryInfo.lat, countryInfo.lng);
        getAirports(countryInfo.countryCode);
        getCities(countryInfo.countryCode);
        countryTest();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data:', textStatus, errorThrown);
    },
  });
};
const countryTest = () => {
  console.log('the country data has been returned succesfully: ', countryInfo);
};
//function to call rest country api
const getRestCountry = (isoCode) => {
  $.ajax({
    url: './libs/php/restCountries.php',
    type: 'GET',
    data: {
      isoCode: isoCode,
    },
    success: function (result) {
      var resultObj = JSON.parse(result);

      if (resultObj.data && resultObj.data) {
        restCountryData = resultObj.data; // Accessing the first item
        restCountryTest();

        // Log the currency key
        if (
          Array.isArray(restCountryData) &&
          restCountryData.length > 0 &&
          restCountryData[0].currencies
        ) {
          currencyKey = Object.keys(restCountryData[0].currencies)[0];
          console.log('Currency Key:', currencyKey);
          getCurrencies(currencyKey);
        } else {
          console.log('No currency information available.');
        }
      } else {
        console.log('No data found in the response');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data:', textStatus, errorThrown);
    },
  });
};

const restCountryTest = () => {
  console.log('the rest data has been returned succesfully: ', restCountryData);
};

const airportIcon = L.icon({
  iconUrl: 'libs/images/airplane.svg',
  iconSize: [50, 50],
});
const cityIcon = L.icon({
  iconUrl: 'libs/images/skyline.svg',
  iconSize: [50, 50],
});
const getCities = (isoCode) => {
  $.ajax({
    url: './libs/php/cities.php',
    type: 'GET',
    data: {
      isoCode: isoCode,
    },
    success: function (result) {
      citiesLayer.clearLayers();

      var cities = result.data.geonames;
      for (let i = 0; i < cities.length; i++) {
        let city = cities[i];
        const cityDetails = {
          cityName: city.name,
          lng: city.lng,
          lat: city.lat,
        };
        console.log('this is the waited for city info: ', cityDetails);

        // Create a marker and add it to the citiesLayer instead of markers
        var marker = L.marker([cityDetails.lat, cityDetails.lng], {
          title: cityDetails.cityName,
          icon: cityIcon,
        });
        citiesLayer.addLayer(marker);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data:', textStatus, errorThrown);
    },
  });
};

// Update the getAirports function to use the airportsLayer
const getAirports = (isoCode) => {
  $.ajax({
    url: './libs/php/airports.php',
    type: 'GET',
    data: {
      isoCode: isoCode,
    },
    success: function (result) {
      airportsLayer.clearLayers();
      airportsInfo = [];
      var resultObj = JSON.parse(result);
      if (
        resultObj.data &&
        resultObj.data.geonames &&
        resultObj.data.geonames.length > 0
      ) {
        for (let i = 0; i < resultObj.data.geonames.length; i++) {
          let airport = resultObj.data.geonames[i];
          const airportDetails = {
            airportName: airport.asciiName,
            Lng: airport.lng,
            lat: airport.lat,
          };

          airportsInfo.push(airportDetails);
          console.log('this is the waited for airport: ', airportDetails);
          let marker = L.marker([airportDetails.lat, airportDetails.Lng], {
            title: airportDetails.airportName,
            icon: airportIcon,
          });

          airportsLayer.addLayer(marker);
        }
      } else {
        console.log('no airports have been found');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data:', textStatus, errorThrown);
    },
  });
};
const airportTest = () => {
  console.log('Airport selected details has arrived: ', airportsInfo);
};
//function to call to news api
const getNews = (isoCode) => {
  $.ajax({
    url: './libs/php/news.php',
    type: 'GET',
    data: {
      isoCode: isoCode,
    },
    success: function (result) {
      newsData = [];
      var resultObj = JSON.parse(result);

      if (
        resultObj.data &&
        resultObj.data.articles &&
        resultObj.data.articles.length > 0
      ) {
        // Iterate over the first four articles
        for (var i = 0; i < 4; i++) {
          var article = resultObj.data.articles[i];

          // Create an object for each article and add it to the array
          const articleDetails = {
            title: article.title,
            author: article.author,
            publishedAt: article.publishedAt,
            url: article.url,
          };
          newsData.push(articleDetails);
        }
        newsTest();
      } else {
        console.log('No articles found for this country.');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching news:', textStatus, errorThrown);
    },
  });
};
const newsTest = () => {
  console.log('the news data has been returned succesfully: ', newsData);
};
//function to call to weather api
const getWeather = (lat, lng) => {
  $.ajax({
    url: './libs/php/openWeather.php',
    type: 'GET',
    data: {
      lat: lat,
      lng: lng,
    },
    success: function (result) {
      var resultObj = JSON.parse(result);

      if (resultObj.data && resultObj.data.current) {
        weatherData = resultObj.data.current; // Accessing the first item
        weatherTest();
      } else {
        console.log('No data found in the response');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data:', textStatus, errorThrown);
    },
  });
};
const weatherTest = () => {
  console.log(
    'the weather you are looking for has been returned: ',
    weatherData
  );
};
//function to call to wiki api
const getWiki = (countryName) => {
  $.ajax({
    url: './libs/php/wiki.php',
    type: 'GET',
    data: {
      countryName: countryName,
    },

    success: function (result) {
      var resultObj = JSON.parse(result);

      if (
        resultObj.data &&
        resultObj.data.geonames &&
        resultObj.data.geonames.length > 0
      ) {
        wikiData = resultObj.data.geonames[1];

        wikiTest();
      } else {
        console.log('No data found in the response');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data:', textStatus, errorThrown);
    },
  });
};
const wikiTest = () => {
  console.log('the wiki data has been returned succsesfully: ', wikiData);
};
// function to get currencies
const getCurrencies = (currencyKey) => {
  $.ajax({
    url: './libs/php/exchangeRate.php',
    type: 'GET',
    dataType: 'json', // Automatic JSON parsing

    success: function (result) {
      if (result && result.data && result.data.rates) {
        const rates = result.data.rates;
        if (rates.hasOwnProperty(currencyKey)) {
          specificRate = { [currencyKey]: rates[currencyKey] };
          console.log('Matched Currency Data: ', specificRate);

          // Process the specific currency rate as needed
        } else {
          console.error('Currency key not found in the rates');
        }
      } else {
        console.error('No data found in the response');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data:', textStatus, errorThrown);
    },
  });
};

// Function to map OpenWeatherMap icon to image path
function mapIconToSvg(openWeatherIcon) {
  const iconMapping = {
    '01d': '01d.svg', // clear sky day
    '01n': '01n.svg', // clear sky night
    '02d': '02d.svg', // few clouds day
    '02n': '02n.svg', // few clouds night
    '03d': '03d.svg', // scattered clouds day
    '03n': '03n.svg', // scattered clouds night
    '04d': '04d.svg', // broken clouds day
    '04n': '04n.svg', // broken clouds night
    '09d': '09d.svg', // shower rain day
    '09n': '09n.svg', // shower rain night
    '10d': '10d.svg', // rain day
    '10n': '10n.svg', // rain night
    '11d': '11d.svg', // thunderstorm day
    '11n': '11n.svg', // thunderstorm night
    '13d': '13d.svg', // snow day
    '13n': '13n.svg', // snow night
    '50d': '50d.svg', // mist day
    '50n': '50n.svg', // mist night
  };

  return (
    'libs/images/' + iconMapping[openWeatherIcon] || 'libs/images/default.svg'
  );
}
// general country modal
L.easyButton({
  position: 'topleft',
  id: 'countryBtn',
  states: [
    {
      icon: 'fa-folder', // Ensure you have the relevant icon class
      stateName: 'unchecked',
      title: 'Show Country Information',
      onClick: function (btn, map) {
        // Show the modal
        $('#countryInfoModal')
          .modal('show')
          .on('shown.bs.modal', function () {
            document.getElementById('Modal1Title').innerHTML =
              'Information For' + '  ' + restCountryData[0].name.common;
            document.getElementById('countryFlag').src =
              restCountryData[0].flags.png;
            document.getElementById('countryInfoName').innerHTML =
              restCountryData[0].name.common;
            document.getElementById('countryInfoCapital').innerHTML =
              restCountryData[0].capital[0];
            document.getElementById('countryInfoLanguage').innerHTML =
              Object.values(restCountryData[0].languages).join(', ');
            document.getElementById('countryInfoTimezone').innerHTML =
              countryInfo.timezone.timeZoneId;
            document.getElementById('countryInfoPopulation').innerHTML = `${(
              countryInfo.population / 1000000
            ).toFixed(1)} M`;
          });

        // Event listener for closing the modal
        $('.close').click(function () {
          $('#countryInfoModal').modal('hide');
        });
      },
    },
    {
      icon: '&#x238C;', // Ensure you have the relevant icon class
      stateName: 'checked',
      onClick: function (btn, map) {
        // Change button state and possibly hide the modal or perform other actions
        btn.state('unchecked');
        $('#countryInfoModal').modal('hide');
      },
    },
  ],
}).addTo(map);
//Weather modal
L.easyButton({
  position: 'topleft',
  id: 'WeatherBtn',
  states: [
    {
      icon: 'fa-sun', // Example icon class
      stateName: 'unchecked',
      title: 'Show Weather Information',
      onClick: function (btn, map) {
        function convertKelvinToCelsius(kelvin) {
          return kelvin - 273.15;
        }

        $('#weatherInfoModal')
          .modal('show')
          .on('shown.bs.modal', function () {
            let tempCelsius = convertKelvinToCelsius(weatherData.temp);

            document.getElementById('weather-modal-title').innerHTML =
              "Today's Weather For" + ' ' + restCountryData[0].name.common;
            let openWeatherIcon = weatherData.weather[0].icon;
            let weatherIconPath = mapIconToSvg(openWeatherIcon);

            // Change the src attribute of the image element to the weather icon path
            document.getElementById('weatherIcon').src = weatherIconPath;

            document.getElementById('weatherDescription').innerHTML =
              weatherData.weather[0].description;
            document.getElementById('weather-city').innerHTML =
              restCountryData[0].name.common;
            document.getElementById('humidity').innerHTML =
              weatherData.humidity + ' %';
            document.getElementById('temp').innerHTML =
              tempCelsius.toFixed(2) + ' °C';
            document.getElementById('uvi').innerHTML = weatherData.uvi;
            document.getElementById('windspeed').innerHTML =
              weatherData.wind_speed + ' m/s';
          });

        $('.close').click(function () {
          $('#weatherInfoModal').modal('hide');
        });
      },
    },
    {
      icon: '&#x238C;',
      stateName: 'checked',
      onClick: function (btn, map) {
        btn.state('unchecked');
        $('#weatherInfoModal').modal('hide');
      },
    },
  ],
}).addTo(map);
// news modal
L.easyButton({
  position: 'topleft',
  id: 'newsBtn',
  states: [
    {
      icon: 'fa fa-newspaper',
      stateName: 'show-news',
      title: 'Show news Information',
      onClick: function (btn, map) {
        // Function to create article HTML
        function createArticleHtml(article) {
          return `
            <h2 class="news-title">${article.title || 'Article Title'}</h2>
            <p class="news-summary"><a href="${
              article.url
            }" target="_blank">Read more</a></p>
            <span class="news-date">Published on ${
              article.publishedAt || 'Unknown Date'
            }</span>
          `;
        }

        // Check if we have at least four articles
        if (newsData.length >= 4) {
          // Populate article one
          document.getElementById('newsModalLabel').innerHTML =
            'Top News Stories In' + ' ' + restCountryData[0].name.common;
          document.getElementById('article-one').innerHTML = createArticleHtml(
            newsData[0]
          );
          document.querySelector(
            '#articles-column h3:first-child'
          ).textContent = `Article From: ${newsData[0].author || 'Unknown'}`;

          // Populate article two
          document.getElementById('article-two').innerHTML = createArticleHtml(
            newsData[1]
          );
          document.querySelector(
            '#articles-column h3:nth-child(3)'
          ).textContent = `Article From: ${newsData[1].author || 'Unknown'}`;

          // Populate article three
          document.getElementById('article-three').innerHTML =
            createArticleHtml(newsData[2]);
          document.querySelector(
            '#articles-column h3:nth-child(5)'
          ).textContent = `Article From: ${newsData[2].author || 'Unknown'}`;

          // Populate article four
          document.getElementById('article-four').innerHTML = createArticleHtml(
            newsData[3]
          );
          document.querySelector(
            '#articles-column h3:nth-child(7)'
          ).textContent = `Article From: ${newsData[3].author || 'Unknown'}`;
        }

        // Show the modal
        $('#newsInfoModal').modal('show');
      },
    },
  ],
}).addTo(map);
// currency modal
L.easyButton({
  position: 'topleft',
  id: 'currencyExchangeBtn',
  states: [
    {
      icon: 'fa-coins',
      stateName: 'unchecked',
      title: 'Show Country Information',
      onClick: function (btn, map) {
        // Show the modal
        $('#currencyExchangeModal')
          .modal('show')
          .on('shown.bs.modal', function () {
            // Set the default value for resultCurrency
            const currencyCountry = Object.keys(specificRate)[0];
            const currencyCode = Object.keys(restCountryData[0].currencies)[0];
            document.getElementById('convert-to').innerHTML =
              'To' + ' ' + currencyCountry;
            document.getElementById('current-currency').innerHTML =
              restCountryData[0].currencies[currencyCode].name;
            if (specificRate && Object.keys(specificRate).length > 0) {
              const rateValue = Object.values(specificRate)[0];
              $('#resultCurrency').val(rateValue.toFixed(2));
            }

            const performCurrencyConversion = () => {
              const rateValue = Object.values(specificRate)[0];

              const fromCurrencyValue = parseFloat($('#fromCurrency').val());

              if (!isNaN(fromCurrencyValue)) {
                // Perform the multiplication
                const exchangedRate = rateValue * fromCurrencyValue;

                $('#resultCurrency').val(exchangedRate.toFixed(2));
              } else {
                console.error('Invalid input value');
                $('#resultCurrency').val('Error');
              }
            };

            $('#exchange-btn').click(performCurrencyConversion);
          });

        // Event listener for closing the modal
        $('.close').click(function () {
          $('#currencyExchangeModal').modal('hide');
        });
      },
    },
    {
      icon: '&#x238C;',
      stateName: 'checked',
      onClick: function (btn, map) {
        btn.state('unchecked');
        $('#currencyExchangeModal').modal('hide');
      },
    },
  ],
}).addTo(map);
// wiki modal
L.easyButton({
  position: 'topleft',
  id: 'wikiBtn',
  states: [
    {
      icon: 'fa fa-wikipedia-w', // Ensure you have the relevant icon class
      stateName: 'unchecked',
      title: 'Show wikipedia Information',
      onClick: function (btn, map) {
        // Show the modal
        $('#wikiInfoModal')
          .modal('show')
          .on('shown.bs.modal', function () {
            document.getElementById('wikiTitle').innerHTML =
              wikiData.title + "'s Wiki info";
            document.getElementById('wiki-image').src = wikiData.thumbnailImg;
            document.getElementById('continent').innerHTML =
              restCountryData[0].region;
            var readMoreLink = `<a href="https://${wikiData.wikipediaUrl}" target="_blank">Read more</a>`;
            document.getElementById('summary').innerHTML =
              wikiData.summary + ' ' + readMoreLink;
            document.getElementById('population').innerHTML = `${(
              countryInfo.population / 1000000
            ).toFixed(1)} M`;
            const currencyCode = Object.keys(restCountryData[0].currencies)[0];
            document.getElementById('currency').innerHTML =
              restCountryData[0].currencies[currencyCode].name;
            document.getElementById('region').innerHTML =
              restCountryData[0].subregion;
          });

        // Event listener for closing the modal
        $('.close').click(function () {
          $('#wikiInfoModal').modal('hide');
        });
      },
    },
    {
      icon: '&#x238C;', // Ensure you have the relevant icon class
      stateName: 'checked',
      onClick: function (btn, map) {
        // Change button state and possibly hide the modal or perform other actions
        btn.state('unchecked');
        $('#wikiInfoModal').modal('hide');
      },
    },
  ],
}).addTo(map);
