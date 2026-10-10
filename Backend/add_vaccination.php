<?php
include 'db_connect.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $child_id = $_POST['child_id'];
    $vaccine_name = $_POST['vaccine_name'];
    $date_given = $_POST['date_given'];

    $sql = "INSERT INTO vaccination_records (child_id, vaccine_name, date_given) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iss", $child_id, $vaccine_name, $date_given);

    if ($stmt->execute()) {
        $response['status'] = "success";
        $response['message'] = "Vaccination record added successfully";
    } else {
        $response['status'] = "error";
        $response['message'] = "Failed to add vaccination record";
    }
    $stmt->close();
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();