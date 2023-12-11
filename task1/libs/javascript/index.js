$(document).ready(function () {
  // Function to make the GeoNames API request
  function getCityInformation(searchTerm) {
    $.ajax({
      url:
        'libs/PHP/wikipedia.php?searchTerm=' + encodeURIComponent(searchTerm), // Adjust the path here
      dataType: 'json', // Keep only one occurrence of dataType
      success: function (data) {
        if (data.status.code === '200') {
          // Extract relevant information from the first city object

          const cityData = data.data.city;
          const population = cityData.population;
          const timeZone = cityData.timezone;

          const wikipediaData = data.data.wikipedia;
          const wikipediaTitle = wikipediaData.title;
          const wikipediaSummary = wikipediaData.summary;

          // Display city information
          $('.card-header h2').text(wikipediaTitle);
          $('.card-body').html('<p>Population: ' + population + '</p>');

          // Extract relevant information from the Wikipedia object

          // Display Wikipedia information
          $('.card-body').append(
            '<p>Title: ' +
              wikipediaTitle +
              '</p>' +
              '<p>Summary: ' +
              wikipediaSummary +
              '</p>'
          );
          // Extract relevant information from the additional city info
          const additionalCityInfo = data.data.additionalCityInfo;
          // Display additional city information
          if (additionalCityInfo) {
            $('.card-body').append(
              '<h3>Additional City Info</h3>' +
                '<p>Country: ' +
                additionalCityInfo.countryName +
                '</p>' +
                '<p>Region: ' +
                additionalCityInfo.adminName1 +
                '</p>'
            );
          }

          // Extract relevant information from the weather object
          const weatherData = data.data.weather;
          const temperature = weatherData.temperature;
          const weatherDescription = weatherData.weatherCondition;

          // Display weather information
          $('.card-body').append(
            '<h3>Weather</h3>' +
              '<p>Temperature: ' +
              temperature +
              '</p>' +
              '<p>Weather Condition: ' +
              weatherDescription +
              '</p>'
          );
        } else {
          // Handle the case when data is not available
          $('.card-body').html('<p>Error: City information not found.</p>');
        }
      },
      error: function () {
        // Handle AJAX error
        $('.card-body').html(
          '<p>Error: Unable to retrieve city information.</p>'
        );
      },
    });
  }

  // Attach a click event to the search button
  $('#search-button').on('click', function () {
    const searchTerm = $('#search-input').val();
    if (searchTerm.trim() !== '') {
      // Call the function with the obtained search term
      getCityInformation(searchTerm);
    } else {
      alert('Please enter a city name.');
    }
  });
});
