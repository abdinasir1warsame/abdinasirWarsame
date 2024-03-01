<?php
// example use from browser
// http://localhost/companydirectory/libs/php/updateDepartment.php?id=<id>

// remove next two lines for production	
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    
    mysqli_close($conn);
    
    echo json_encode($output);
    
    exit;
}

// Check if the 'id' parameter is provided in the request
if (!isset($_REQUEST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Missing 'id' parameter";
    $output['data'] = [];
    
    echo json_encode($output);
    
    mysqli_close($conn);
    
    exit;
}

// Check if the 'name' and 'locationID' parameters are provided in the request
if (!isset($_REQUEST['name']) || !isset($_REQUEST['locationID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Missing 'name' or 'locationID' parameter";
    $output['data'] = [];
    
    echo json_encode($output);
    
    mysqli_close($conn);
    
    exit;
}

$id = $_REQUEST['id'];
$name = $_REQUEST['name'];
$locationID = $_REQUEST['locationID'];

// Update the department based on ID
$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
$query->bind_param("sii", $name, $locationID, $id);

$query->execute();

if (false === $query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
    
    echo json_encode($output);
    
    mysqli_close($conn);
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Department updated successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

echo json_encode($output);

mysqli_close($conn);
?>
