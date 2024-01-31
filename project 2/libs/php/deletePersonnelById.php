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

    // Prepare the DELETE statement to avoid SQL injection
    $query = $conn->prepare('DELETE FROM `personnel` WHERE `id` = ?');

    // Bind the ID parameter from the request to the query
    $query->bind_param("i", $_REQUEST['id']);

    // Execute the query
    $query->execute();

    if (false === $query) {
        // Query execution error response
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";    
        $output['data'] = [];
    } else {
        // Successful deletion response
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "personnel deleted successfully";
        $output['data'] = [];
    }

    // Calculate the script execution time
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    // Close the database connection
    mysqli_close($conn);

    // Output the response in JSON format
    echo json_encode($output);
?>
