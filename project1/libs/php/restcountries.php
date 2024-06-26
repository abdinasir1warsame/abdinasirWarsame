<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if 'isoCode' is set in the request
if (!isset($_REQUEST['isoCode']) || empty($_REQUEST['isoCode'])) {
    echo json_encode(['error' => 'No ISO code provided']);
    exit;
}

// Sanitize and encode the input
$isoCode = urlencode($_REQUEST['isoCode']);


$url = 'https://restcountries.com/v3.1/alpha/' . $isoCode;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Add User-Agent header
curl_setopt($ch, CURLOPT_HTTPHEADER, array('User-Agent: MyPersonalProject/1.0'));

$restData = curl_exec($ch);
curl_close($ch);

if (!$restData) {
    echo json_encode(['error' => 'Failed to retrieve data']);
    exit;
}

$restDecode = json_decode($restData, true);

$restOutput['status']['code'] = "200";
$restOutput['status']['name'] = "ok";
$restOutput['status']['description'] = "success";
$restOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$restOutput['data'] = $restDecode;

echo json_encode($restOutput);

?>