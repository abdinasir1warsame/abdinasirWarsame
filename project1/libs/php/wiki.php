<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$geonamesUsername = 'abdinasir1993';

$countryName = urlencode($_REQUEST['countryName']);
$wikiUrl = "http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=" . $countryName . "&maxRows=20&username=" . $geonamesUsername . "&style=full";



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


echo json_encode($wikiOutput);
?>