<?php

// Example use from browser
// http://localhost/companydirectory/libs/php/getDepartmentAndAllLocationsByID.php?id=<id>

// Remove next two lines for production
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

// Query to retrieve a specific department by ID
$query = $conn->prepare('SELECT 
    department.id AS departmentID, 
    department.name AS DepartmentName, 
    department.locationID, 
    location.name AS locationName
FROM 
    department
JOIN 
    location ON department.locationID = location.id
WHERE 
    department.id = ?');

$query->bind_param("i", $_REQUEST['id']);

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

$result = $query->get_result();

$departmentInfo = mysqli_fetch_assoc($result);

// Query to count personnel associated with the department
$queryCountPersonnel = $conn->prepare('SELECT COUNT(*) AS personnelCount FROM personnel WHERE departmentID = ?');
$queryCountPersonnel->bind_param("i", $_REQUEST['id']);
$queryCountPersonnel->execute();
$resultCountPersonnel = $queryCountPersonnel->get_result();

if (!$resultCountPersonnel) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$rowCountPersonnel = mysqli_fetch_assoc($resultCountPersonnel);
$personnelCount = $rowCountPersonnel['personnelCount'];

// Include personnel count in the output
$departmentInfo['personnelCount'] = $personnelCount;

// Query to retrieve all locations from the locations table
$query = 'SELECT id AS locationID, name AS LocationName FROM location';

$result = $conn->query($query);

if (!$result) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}

$locations = [];

while ($row = mysqli_fetch_assoc($result)) {

    $locations[] = $row;

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['department'] = $departmentInfo;
$output['data']['locations'] = $locations;

mysqli_close($conn);

echo json_encode($output);

?>
