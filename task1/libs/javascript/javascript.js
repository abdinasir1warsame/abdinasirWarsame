$('#search-button').click(function (event) {
  event.preventDefault();
  const searchTerm = $('#search-input').val();
  $.ajax({
    url: 'libs/PHP/wiki.php?searchTerm=' + encodeURIComponent(searchTerm),
    dataType: 'json',
    success: function (data) {
      if (data.status.code == '200') {
        $('#wiki-summary').html(data.data.geonames[0].summary);
        $('#wiki-title').html(data.data.geonames[0].title);
        $('#picture').html(data.data.geonames[0].thumbnail);
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
      'libs/PHP/countryCode.php?lat=' +
      encodeURIComponent(lat) +
      '&lon=' +
      encodeURIComponent(lon),
    dataType: 'json',
    success: function (data) {
      if (data.status.code === '200') {
        $('#country-name').html(data.data.countryName);
        $('#country-code').html(data.data.countryCode);
        $('#country-languages').html(data.data.languages);
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
      'libs/PHP/timezone.php?timeLat=' +
      encodeURIComponent(timeLat) +
      '&timeLon=' +
      encodeURIComponent(timeLon),
    dataType: 'json',
    success: function (data) {
      if (data.status.code === '200') {
        $('#country').html(data.data.countryName);
        $('#continent').html(data.data.timezoneId);
        $('#time').html(data.data.time);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
});
