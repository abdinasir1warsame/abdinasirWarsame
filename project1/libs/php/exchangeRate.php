<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$exchangeUrl='https://openexchangerates.org/api/latest.json?app_id=d73aae50608846b284d85a23aaa77040';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $exchangeUrl);

$exchangeData = curl_exec($ch);
curl_close($ch);

if (!$exchangeData) {
    echo json_encode(['error' => 'Failed to retrieve data']);
    exit;
}

$exchangeDecode = json_decode($exchangeData, true);

$exchangeOutput['status']['code'] = "200";
$exchangeOutput['status']['name'] = "ok";
$exchangeOutput['status']['description'] = "success";
$exchangeOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$exchangeOutput['data'] = $exchangeDecode;

echo json_encode($exchangeOutput);

?>