<?php
include 'db_connect.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $guardian_name = $_POST['guardian_name'];
    $phone = $_POST['phone'];
    $zone = $_POST['zone'];
    $worker_id = $_POST['worker_id'];

    // Check if this exact family (phone + name) already exists
    $check_sql = "SELECT id FROM families WHERE phone = ? AND guardian_name = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("ss", $phone, $guardian_name);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        $existing = $check_result->fetch_assoc();
        $family_id = $existing['id'];
    } else {
        $sql_family = "INSERT INTO families (guardian_name, phone, zone, worker_id) VALUES (?, ?, ?, ?)";
        $stmt_family = $conn->prepare($sql_family);
        $stmt_family->bind_param("sssi", $guardian_name, $phone, $zone, $worker_id);
        $stmt_family->execute();
        $family_id = $conn->insert_id;
        $stmt_family->close();
    }
    $check_stmt->close();

    // Add children under this family_id (new or existing), skipping duplicates
    $child_names = $_POST['child_name'];
    $child_dobs = $_POST['child_dob'];

    $children_added = 0;
    for ($i = 0; $i < count($child_names); $i++) {
        if (!empty($child_names[$i]) && !empty($child_dobs[$i])) {

            // Check if this exact child (same name + dob) already exists under this family
            $check_child_sql = "SELECT id FROM children WHERE family_id = ? AND name = ? AND dob = ?";
            $check_child_stmt = $conn->prepare($check_child_sql);
            $check_child_stmt->bind_param("iss", $family_id, $child_names[$i], $child_dobs[$i]);
            $check_child_stmt->execute();
            $check_child_result = $check_child_stmt->get_result();

            if ($check_child_result->num_rows == 0) {
                $sql_child = "INSERT INTO children (family_id, name, dob) VALUES (?, ?, ?)";
                $stmt_child = $conn->prepare($sql_child);
                $stmt_child->bind_param("iss", $family_id, $child_names[$i], $child_dobs[$i]);
                $stmt_child->execute();
                $children_added++;
                $stmt_child->close();
            }
            $check_child_stmt->close();
        }
    }

    $response['status'] = "success";
    $response['message'] = "$children_added child(ren) registered under $guardian_name";
    $response['family_id'] = $family_id;
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();