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

// Initialize the output array early so we can add to it as we go
$output = ['data' => []];

// Check if the location is being used by any departments
$departmentCheckQuery = $conn->prepare('SELECT COUNT(id) AS department_count FROM department WHERE locationID = ?');

$departmentCheckQuery->bind_param("i", $locationId);
$departmentCheckQuery->execute();
$departmentCheckResult = $departmentCheckQuery->get_result();
$departmentCount = $departmentCheckResult->fetch_assoc()['department_count'];

// Check if the location is being used by any employees through their departments
$employeeCheckQuery = $conn->prepare('SELECT COUNT(personnel.id) AS employee_count FROM personnel JOIN department ON personnel.departmentID = department.id WHERE department.locationID = ?');

$employeeCheckQuery->bind_param("i", $locationId);
$employeeCheckQuery->execute();
$employeeCheckResult = $employeeCheckQuery->get_result();
$employeeCount = $employeeCheckResult->fetch_assoc()['employee_count'];

// Include employee count in the output regardless of the condition
$output['data']['employeeCount'] = $employeeCount;

if ($departmentCount > 0 || $employeeCount > 0) {
    // Location is being used by some departments or employees, so we can't delete it
    $output['status']['code'] = "400";
    $output['status']['name'] = "not allowed";
    $output['status']['description'] = "Location is in use by departments or employees and cannot be deleted";
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
    } else {
        // Deletion failed (e.g., location not found)
        $output['status']['code'] = "400";
        $output['status']['name'] = "failed";
        $output['status']['description'] = "Location deletion failed";
    }
}

mysqli_close($conn);

echo json_encode($output);

?>
