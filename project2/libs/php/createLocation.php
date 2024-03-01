<?php
    // example use from browser
    // http://localhost/companydirectory/libs/php/createLocation.php

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
    if (isset($_POST['name'])) {
        // Sanitize input data to prevent SQL injection
        $name = mysqli_real_escape_string($conn, $_POST['name']);

        // Insert new location into the database
        $query = $conn->prepare("INSERT INTO location (name) VALUES (?)");
        $query->bind_param("s", $name);

        if ($query->execute()) {
            $output['status']['code'] = "200";
            $output['status']['name'] = "ok";
            $output['status']['description'] = "Location created successfully";
        } else {
            $output['status']['code'] = "400";
            $output['status']['name'] = "error";
            $output['status']['description'] = "Unable to create location";
        }
    } else {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Missing required parameter: name";
    }

    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
?>
