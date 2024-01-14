<?php
$executionStartTime = microtime(true) / 1000;

// Get the ISO_A2 code from the AJAX request
$isoA2 = $_GET['isoA2'];

// Read the JSON data from the file
$jsonData = file_get_contents('../js/json/countryBorders.geo.json');

// Decode the JSON data
$border = json_decode($jsonData, true);

// Initialize the output array
$output = [];

// Find the feature with the matching iso_a2
$selectedFeature = null;
foreach ($border['features'] as $feature) {
    if ($feature['properties']['iso_a2'] === $isoA2) {
        $selectedFeature = $feature;
        break;
    }
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

// Only include the selected feature in the output
$output['data']['border'] = $selectedFeature;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
