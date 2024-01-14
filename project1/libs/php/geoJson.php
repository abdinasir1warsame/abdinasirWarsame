<?php
$executionStartTime = microtime(true) / 1000;

// Read the JSON data from the file
$jsonData = file_get_contents('../js/json/countryBorders.geo.json');


$countryInfo = json_decode($jsonData, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";


$output['data']['countryInfo'] = $countryInfo;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
