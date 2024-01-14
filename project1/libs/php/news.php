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

$url = 'https://newsapi.org/v2/top-headlines?country=' . $isoCode . '&apiKey=f7104effcb7b402ab87a8a7d596f174d';
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Add User-Agent header
curl_setopt($ch, CURLOPT_HTTPHEADER, array('User-Agent: MyPersonalProject/1.0'));

$newsData = curl_exec($ch);
curl_close($ch);

if (!$newsData) {
    echo json_encode(['error' => 'Failed to retrieve data']);
    exit;
}

$newsDecode = json_decode($newsData, true);

$newsOutput['status']['code'] = "200";
$newsOutput['status']['name'] = "ok";
$newsOutput['status']['description'] = "success";
$newsOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$newsOutput['data'] = $newsDecode;

echo json_encode($newsOutput);

?>

