<?php
    // example use from browser
    // http://localhost/companydirectory/libs/php/createPersonnel.php

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

    // Check if all required POST parameters are present
    if (isset($_POST['firstName']) && isset($_POST['lastName']) && isset($_POST['email']) && isset($_POST['jobTitle']) && isset($_POST['departmentID'])) {
        // Sanitize input data to prevent SQL injection
        $firstName = mysqli_real_escape_string($conn, $_POST['firstName']);
        $lastName = mysqli_real_escape_string($conn, $_POST['lastName']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $jobTitle = mysqli_real_escape_string($conn, $_POST['jobTitle']);
        $departmentID = intval($_POST['departmentID']); // Convert to integer

        // Insert new personnel into the database
        $query = $conn->prepare("INSERT INTO personnel (firstName, lastName, email, jobTitle, departmentID) VALUES (?, ?, ?, ?, ?)");
        $query->bind_param("ssssi", $firstName, $lastName, $email, $jobTitle, $departmentID);

        if ($query->execute()) {
            $output['status']['code'] = "200";
            $output['status']['name'] = "ok";
            $output['status']['description'] = "Personnel created successfully";
        } else {
            $output['status']['code'] = "400";
            $output['status']['name'] = "error";
            $output['status']['description'] = "Unable to create personnel";
        }
    } else {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Missing required parameters";
    }

    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
?>
