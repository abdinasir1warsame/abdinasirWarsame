$('#search-button').click(function (event) {
  event.preventDefault();
  const searchTerm = $('#search-input').val();
  $.ajax({
    url: 'libs/PHP/geonames.php?searchTerm=' + encodeURIComponent(searchTerm),
    dataType: 'json',
    success: function (data) {
      const wikiData = data.wikiData;
      if (wikiData.status.code == '200') {
        $('#wiki-summary').html(wikiData.data.geonames[0].summary);
        $('#wiki-title').html(wikiData.data.geonames[0].title);
        $('#picture').html(wikiData.data.geonames[0].thumbnail);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
});

$('#country-code-search-button').click(function (event) {
  event.preventDefault();
  const lat = $('#country-code-lat').val();
  const lon = $('#country-code-lon').val();

  $.ajax({
    url:
      'libs/PHP/geonames.php?lat=' +
      encodeURIComponent(lat) +
      '&lon=' +
      encodeURIComponent(lon),
    dataType: 'json',
    success: function (data) {
      console.log('Entire Response:', data);

      const countryCodeData = data.countryCodeData;
      if (countryCodeData.status.code === '200') {
        $('#country-name').html(countryCodeData.data.countryName);
        $('#country-code').html(countryCodeData.data.countryCode);
        $('#country-languages').html(countryCodeData.data.languages);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
});

$('#timezone-search-button').click(function (event) {
  event.preventDefault();
  const timeLat = $('#timezone-lat').val();
  const timeLon = $('#timezone-lon').val();

  $.ajax({
    url:
      'libs/PHP/geonames.php?timeLat=' +
      encodeURIComponent(timeLat) +
      '&timeLon=' +
      encodeURIComponent(timeLon),
    dataType: 'json',
    success: function (data) {
      console.log('Entire Response:', data);

      const timeZoneData = data.timeZoneData;
      if (timeZoneData.status.code === '200') {
        $('#country').html(timeZoneData.data.countryName);
        $('#continent').html(timeZoneData.data.timezoneId);
        $('#time').html(timeZoneData.data.time);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
});
