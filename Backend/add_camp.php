<?php
include 'db_connect.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $zone = $_POST['zone'];
    $location = $_POST['location'];
    $camp_date = $_POST['camp_date'];
    $created_by = $_POST['created_by'];

    $sql = "INSERT INTO camps (zone, location, camp_date, created_by) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $zone, $location, $camp_date, $created_by);

    if ($stmt->execute()) {
        $response['status'] = "success";
        $response['message'] = "Camp scheduled successfully";
        $response['camp_id'] = $conn->insert_id;
    } else {
        $response['status'] = "error";
        $response['message'] = "Failed to schedule camp";
    }
    $stmt->close();
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();