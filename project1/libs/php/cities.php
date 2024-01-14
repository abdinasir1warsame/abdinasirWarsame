<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$geonamesUsername = 'abdinasir1993';
$isoCode = urlencode($_REQUEST['isoCode']);
$citiesUrl = "http://api.geonames.org/searchJSON?country=" . $isoCode . "&maxRows=100&username=" . $geonamesUsername;

$ch = curl_init(); // Initialize cURL session

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $citiesUrl);

$citiesData = curl_exec($ch);

curl_close($ch);

$citiesDecode = json_decode($citiesData, true);

$citiesOutput['status']['code'] = "200";
$citiesOutput['status']['name'] = "ok";
$citiesOutput['status']['description'] = "success";
$citiesOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$citiesOutput['data'] = $citiesDecode;

header('Content-Type: application/json'); // Set response header to indicate JSON data

echo json_encode($citiesOutput);
?>
