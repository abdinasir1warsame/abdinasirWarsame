<?php

    // Enable error reporting for debugging (remove this for production)
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    // Record the start time for execution
    $executionStartTime = microtime(true);

    include("config.php");

    // Set the content type to JSON
    header('Content-Type: application/json; charset=UTF-8');

    // Create a connection to the database
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // Check the connection
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

    // Prepare the SQL query
    $query = $conn->prepare('SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, `d`.`name` AS `departmentName`, `l`.`id` as `locationID`, `l`.`name` AS `locationName` FROM `personnel` `p` LEFT JOIN `department` `d` ON (`d`.`id` = `p`.`departmentID`) LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`) WHERE (`d`.`id` = ? OR ? IS NULL) AND (`l`.`id` = ? OR ? IS NULL) ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`');

    // Get input parameters (departmentID and locationID) and set to NULL if empty
    $departmentID = $_REQUEST['departmentID'] ? $_REQUEST['departmentID'] : NULL;
    $locationID = $_REQUEST['locationID'] ? $_REQUEST['locationID'] : NULL;

    // Bind parameters
    $query->bind_param("iiii", $departmentID, $departmentID, $locationID, $locationID);

    // Execute the query
    $query->execute();

    if (false === $query) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;
    }

    // Fetch the results
    $result = $query->get_result();

    $personnel = [];

    while ($row = mysqli_fetch_assoc($result)) {
        array_push($personnel, $row);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data']['personnel'] = $personnel;

    // Close the database connection
    mysqli_close($conn);

    // Return the data in JSON format
    echo json_encode($output);

?>
