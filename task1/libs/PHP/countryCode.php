<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$geonamesUsername = 'abdinasir1993';


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

echo json_encode($countryCodeOutput);
?>