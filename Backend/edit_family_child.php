<?php
include 'db_connect.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $child_id = $_POST['child_id'];
    $guardian_name = $_POST['guardian_name'];
    $phone = $_POST['phone'];
    $zone = $_POST['zone'];
    $child_name = $_POST['child_name'];
    $child_dob = $_POST['child_dob'];

    // Find the family this child belongs to
    $find_sql = "SELECT family_id FROM children WHERE id = ?";
    $find_stmt = $conn->prepare($find_sql);
    $find_stmt->bind_param("i", $child_id);
    $find_stmt->execute();
    $find_result = $find_stmt->get_result();

    if ($find_result->num_rows == 0) {
        $response['status'] = "error";
        $response['message'] = "Child not found";
    } else {
        $family_row = $find_result->fetch_assoc();
        $family_id = $family_row['family_id'];

        // Update family info (shared across all children under this family)
        $update_family_sql = "UPDATE families SET guardian_name = ?, phone = ?, zone = ? WHERE id = ?";
        $update_family_stmt = $conn->prepare($update_family_sql);
        $update_family_stmt->bind_param("sssi", $guardian_name, $phone, $zone, $family_id);
        $update_family_stmt->execute();
        $update_family_stmt->close();

        // Update this specific child's info
        $update_child_sql = "UPDATE children SET name = ?, dob = ? WHERE id = ?";
        $update_child_stmt = $conn->prepare($update_child_sql);
        $update_child_stmt->bind_param("ssi", $child_name, $child_dob, $child_id);
        $update_child_stmt->execute();
        $update_child_stmt->close();

        $response['status'] = "success";
        $response['message'] = "Family & child record updated successfully";
    }
    $find_stmt->close();
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();