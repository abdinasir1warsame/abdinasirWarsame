<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$geonamesUsername = 'abdinasir1993';

$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';
$wikiUrl = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=$searchTerm&maxRows=20&username=$geonamesUsername&style=full";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $wikiUrl);

$wikiData = curl_exec($ch);

curl_close($ch);

$wikiDecode = json_decode($wikiData, true);

$wikiOutput['status']['code'] = "200";
$wikiOutput['status']['name'] = "ok";
$wikiOutput['status']['description'] = "success";
$wikiOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$wikiOutput['data'] = $wikiDecode;


$lat = isset($_GET['lat']) ? $_GET['lat'] : '';
$lon = isset($_GET['lon']) ? $_GET['lon'] : '';
$countryCodeUrl = "http://api.geonames.org/countryCodeJSON?formatted=true&lat=$lat&lng=$lon&username=$geonamesUsername&style=full";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $countryCodeUrl);

$countryCodeData = curl_exec($ch);

curl_close($ch);

$countryCodeDecode = json_decode($countryCodeData, true);

$countryCodeOutput['status']['code'] = "200";
$countryCodeOutput['status']['name'] = "ok";
$countryCodeOutput['status']['description'] = "success";
$countryCodeOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$countryCodeOutput['data'] = $countryCodeDecode;


$timeLat = isset($_GET['timeLat']) ? $_GET['timeLat'] : '';
$timeLon = isset($_GET['timeLon']) ? $_GET['timeLon'] : '';
$timeZoneUrl = "http://api.geonames.org/timezoneJSON?formatted=true&lat=$timeLat&lng=$timeLon&username=$geonamesUsername&style=full";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $timeZoneUrl);

$timeZoneData = curl_exec($ch);

curl_close($ch);

$timeZoneDecode = json_decode($timeZoneData, true);

$timeZoneOutput['status']['code'] = "200";
$timeZoneOutput['status']['name'] = "ok";
$timeZoneOutput['status']['description'] = "success";
$timeZoneOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$timeZoneOutput['data'] = $timeZoneDecode;

$combinedOutput = array(
    'wikiData' => $wikiOutput,
    'countryCodeData' => $countryCodeOutput,
    "timeZoneData" => $timeZoneOutput
);


header('Content-Type: application/json; charset=UTF-8');
echo json_encode($combinedOutput);
?>
