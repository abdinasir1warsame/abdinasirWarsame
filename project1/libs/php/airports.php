<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$geonamesUsername = 'abdinasir1993';
$isoCode = urlencode($_REQUEST['isoCode']);
$airpUrl = "http://api.geonames.org/searchJSON?formatted=true&maxRows=100&lang=es&username=" . $geonamesUsername . "&style=full&country=" . $isoCode . "&featureCode=AIRP";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $airpUrl);

$airpData = curl_exec($ch);

curl_close($ch);

$airpDecode = json_decode($airpData, true);

$airpOutput['status']['code'] = "200";
$airpOutput['status']['name'] = "ok";
$airpOutput['status']['description'] = "success";
$airpOutput['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$airpOutput['data'] = $airpDecode;


echo json_encode($airpOutput);
?>