<?php
$executionStartTime = microtime(true) / 1000;

// Read the JSON data from the file
$jsonData = file_get_contents('../js/json/countryBorders.geo.json');

$countryInfo = json_decode($jsonData, true);
$countryList = [];

// Loop through each feature, collect country names and ISO codes
foreach ($countryInfo['features'] as $feature) {
    $countryName = $feature['properties']['name'];
    $isoA2 = $feature['properties']['iso_a2'];
    array_push($countryList, ['name' => $countryName, 'iso_a2' => $isoA2]);
}

// Sort the country list alphabetically based on country name
usort($countryList, function($a, $b) {
    return $a['name'] <=> $b['name'];
});

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

$output['data']['countryList'] = $countryList;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
