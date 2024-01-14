<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if 'lat' and 'lng' are set in the request
if (!isset($_REQUEST['lat']) || empty($_REQUEST['lat']) || !isset($_REQUEST['lng']) || empty($_REQUEST['lng'])) {
    echo json_encode(['error' => 'No Lat & long provided']);
    exit;
}

// Sanitize and encode the input
$lat = urlencode($_REQUEST['lat']);
$lng = urlencode($_REQUEST['lng']);

$weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' . $lat . '&lon=' . $lng . '&appid=b12576978ee89d5afb176d845464f39b';
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $weatherUrl);

$weatherData = curl_exec($ch);
curl_close($ch);

if (!$weatherData) {
    echo json_encode(['error' => 'Failed to retrieve data']);
    exit;
}

$weatherDecode = json_decode($weatherData, true);

$weatherOutput['status']['code'] = "200";
$weatherOutput['status']['name'] = "ok";
$weatherOutput['status']['description'] = "success";
$weatherOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$weatherOutput['data'] = $weatherDecode;

echo json_encode($weatherOutput);

?>
