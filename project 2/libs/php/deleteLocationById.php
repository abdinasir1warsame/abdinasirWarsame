<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    // Handle connection error
    // ...
}

// Get location ID from request
$locationId = $_REQUEST['id'];

// Check if the location is being used by any departments
$departmentCheckQuery = $conn->prepare('SELECT COUNT(*) AS department_count FROM department WHERE locationID = ?');
$departmentCheckQuery->bind_param("i", $locationId);
$departmentCheckQuery->execute();
$departmentCheckResult = $departmentCheckQuery->get_result();
$departmentCount = $departmentCheckResult->fetch_assoc()['department_count'];

if ($departmentCount > 0) {
    // Location is being used by some departments, so we can't delete it
    $output['status']['code'] = "400";
    $output['status']['name'] = "not allowed";
    $output['status']['description'] = "Location is in use by departments and cannot be deleted";
    $output['data'] = [];
} else {
    // Location is not being used, so we can proceed with deletion
    $deleteQuery = $conn->prepare('DELETE FROM location WHERE id = ?');
    $deleteQuery->bind_param("i", $locationId);
    $deleteQuery->execute();

    if ($deleteQuery->affected_rows > 0) {
        // Deletion successful
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "Location deleted successfully";
        $output['data'] = [];
    } else {
        // Deletion failed (e.g., location not found)
        $output['status']['code'] = "400";
        $output['status']['name'] = "failed";
        $output['status']['description'] = "Location deletion failed";
        $output['data'] = [];
    }
}

mysqli_close($conn);

echo json_encode($output);

?>
