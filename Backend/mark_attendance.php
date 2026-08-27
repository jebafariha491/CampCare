<?php
include 'db_connect.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $camp_id = $_POST['camp_id'];
    $child_id = $_POST['child_id'];

    // Check if attendance record already exists for this camp+child
    $check_sql = "SELECT id FROM camp_attendance WHERE camp_id = ? AND child_id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("ii", $camp_id, $child_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        // Already exists — update to attended = true
        $update_sql = "UPDATE camp_attendance SET attended = TRUE WHERE camp_id = ? AND child_id = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ii", $camp_id, $child_id);
        $update_stmt->execute();
        $update_stmt->close();
    } else {
        // Doesn't exist — insert new record
        $insert_sql = "INSERT INTO camp_attendance (camp_id, child_id, attended) VALUES (?, ?, TRUE)";
        $insert_stmt = $conn->prepare($insert_sql);
        $insert_stmt->bind_param("ii", $camp_id, $child_id);
        $insert_stmt->execute();
        $insert_stmt->close();
    }
    $check_stmt->close();

    $response['status'] = "success";
    $response['message'] = "Attendance marked successfully";
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();