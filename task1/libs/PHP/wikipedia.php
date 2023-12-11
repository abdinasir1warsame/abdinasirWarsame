<?php
// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// GeoNames API key (replace with your username)
$geonamesUsername = 'abdinasir1993';

// GeoNames API request to search
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';
$geonamesSearchUrl = "http://api.geonames.org/searchJSON?formatted=true&q=$searchTerm&maxRows=1&lang=es&username=$geonamesUsername&style=full";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $geonamesSearchUrl);

$result = curl_exec($ch);

curl_close($ch);

$geonamesSearchData = json_decode($result, true);

// Check if GeoNames search data is available
if (!empty($geonamesSearchData['geonames'])) {
    $cityData = $geonamesSearchData['geonames'][0];

    // GeoNames API request to get additional city information
    $additionalCityInfoUrl = "http://api.geonames.org/searchJSON?formatted=true&q={$cityData['name']}&maxRows=10&lang=es&username=$geonamesUsername&style=full";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $additionalCityInfoUrl);

    $result = curl_exec($ch);

    curl_close($ch);

    $additionalCityInfo = json_decode($result, true);

    // Check if additional city information is available
    if (!empty($additionalCityInfo['geonames'])) {
        // Use the first result for simplicity
        $additionalCityResult = $additionalCityInfo['geonames'][0];
        $additionalCityLat = $additionalCityResult['lat'];
        $additionalCityLng = $additionalCityResult['lng'];

        // GeoNames API request to get weather information
        $weatherUrl = "http://api.geonames.org/weatherJSON?formatted=true&lat=$additionalCityLat&lng=$additionalCityLng&username=$geonamesUsername&style=full";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $weatherUrl);

        $result = curl_exec($ch);

        curl_close($ch);

        $weatherData = json_decode($result, true);

        // GeoNames API request to get Wikipedia information
        $wikipediaUrl = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q={$cityData['toponymName']}&maxRows=1&username=$geonamesUsername&style=full";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $wikipediaUrl);

        $result = curl_exec($ch);

        curl_close($ch);

        $wikipediaData = json_decode($result, true);

        // Prepare the output
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data']['city'] = $cityData;
        $output['data']['additionalCityInfo'] = $additionalCityResult;
        $output['data']['weather'] = $weatherData;
        $output['data']['wikipedia'] = !empty($wikipediaData['geonames']) ? $wikipediaData['geonames'][0] : [];
    } else {
        $output['status']['code'] = "404";
        $output['status']['name'] = "not found";
        $output['status']['description'] = "Additional city information not found.";
    }
} else {
    $output['status']['code'] = "404";
    $output['status']['name'] = "not found";
    $output['status']['description'] = "GeoNames search data not found for the given search term.";
}

// Set the response header
header('Content-Type: application/json; charset=UTF-8');

// Output the JSON response
echo json_encode($output);
?>
