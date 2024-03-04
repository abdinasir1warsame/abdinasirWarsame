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

// Get department ID from request
$departmentId = $_REQUEST['id'];

// Check if the department is being used by any employees
$employeeCheckQuery = $conn->prepare('SELECT COUNT(id) AS employee_count FROM personnel WHERE departmentID = ?');

$employeeCheckQuery->bind_param("i", $departmentId);
$employeeCheckQuery->execute();
$employeeCheckResult = $employeeCheckQuery->get_result();
$employeeCount = $employeeCheckResult->fetch_assoc()['employee_count'];

// Always return the number of employees in the output
$output['data']['employeeCount'] = $employeeCount;

if ($employeeCount > 0) {
    // Department is being used by some employees, so we can't delete it
    $output['status']['code'] = "400";
    $output['status']['name'] = "not allowed";
    $output['status']['description'] = "Department is in use by employees and cannot be deleted";
} else {
    // Department is not being used, so we can proceed with deletion
    $deleteQuery = $conn->prepare('DELETE FROM department WHERE id = ?');
    $deleteQuery->bind_param("i", $departmentId);
    $deleteQuery->execute();

    if ($deleteQuery->affected_rows > 0) {
        // Deletion successful
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "Department deleted successfully";
    } else {
        // Deletion failed (e.g., department not found)
        $output['status']['code'] = "400";
        $output['status']['name'] = "failed";
        $output['status']['description'] = "Department deletion failed";
    }
}

mysqli_close($conn);

echo json_encode($output);

?>

