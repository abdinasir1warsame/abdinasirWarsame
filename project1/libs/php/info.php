<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
$geonamesUsername = 'abdinasir1993';

// Check if 'countryName' is set in the request
if (!isset($_REQUEST['countryName']) || empty($_REQUEST['countryName'])) {
    echo json_encode(['error' => 'No country name provided']);
    exit;
}

// Sanitize and encode the input
$countryName = urlencode($_REQUEST['countryName']);

$infoUrl = "http://api.geonames.org/searchJSON?formatted=true&q=" . $countryName . "&maxRows=10&lang=es&username=" . $geonamesUsername . "&style=full";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $infoUrl);

$infoData = curl_exec($ch);
curl_close($ch);

if (!$infoData) {
    echo json_encode(['error' => 'Failed to retrieve data']);
    exit;
}

$infoDecode = json_decode($infoData, true);

$infoOutput['status']['code'] = "200";
$infoOutput['status']['name'] = "ok";
$infoOutput['status']['description'] = "success";
$infoOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$infoOutput['data'] = $infoDecode;

echo json_encode($infoOutput);

?>
