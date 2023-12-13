<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$geonamesUsername = 'abdinasir1993';

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

echo json_encode($timeZoneOutput);
?>