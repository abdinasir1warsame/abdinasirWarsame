<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Record the start time of script execution
$executionStartTime = microtime(true);

// Include the database configuration file (make sure this contains your db credentials)
include("config.php");

// Set the content type for the response
header('Content-Type: application/json; charset=UTF-8');

// Create connection to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check connection
if (mysqli_connect_errno()) {
    // Connection error response
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Check if 'id' parameter is provided in the request
if(isset($_REQUEST['id'])) {
    $id = $_REQUEST['id'];

    // Prepare the SELECT statement to avoid SQL injection
    $query = $conn->prepare('SELECT `id`, `name` FROM `location` WHERE `id` = ?');

    // Bind the ID parameter from the request to the query
    $query->bind_param("i", $id);

    // Execute the query
    $query->execute();

    $result = $query->get_result();

    if ($result->num_rows > 0) {
        // Location found, fetch and return data
        $row = $result->fetch_assoc();
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "location retrieved successfully";
        $output['data'] = $row;

        // Check if the location is being used by any employees
        $employeeCheckQuery = $conn->prepare('SELECT COUNT(personnel.id) AS employee_count FROM personnel JOIN department ON personnel.departmentID = department.id WHERE department.locationID = ?');
        $employeeCheckQuery->bind_param("i", $id);
        $employeeCheckQuery->execute();
        $employeeCheckResult = $employeeCheckQuery->get_result();
        $employeeCount = $employeeCheckResult->fetch_assoc()['employee_count'];

        if ($employeeCount > 0) {
            // Include employee count in the output only if there are employees attributed
            $output['data']['employeeCount'] = $employeeCount;
        }
    } else {
        // Location not found
        $output['status']['code'] = "404";
        $output['status']['name'] = "not found";
        $output['status']['description'] = "location not found";
        $output['data'] = [];
    }

} else {
    // 'id' parameter not provided in the request
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "'id' parameter is missing in the request";
    $output['data'] = [];
}

// Calculate the script execution time
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

// Close the database connection
mysqli_close($conn);

// Output the response in JSON format
echo json_encode($output);
?>
