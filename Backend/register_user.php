<?php
include 'db_connect.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    $role = $_POST['role'];
    $zone = $_POST['zone'];

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $check_sql = "SELECT * FROM users WHERE phone = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $phone);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        $response['status'] = "error";
        $response['message'] = "This phone number is already registered";
    } else {
        $sql = "INSERT INTO users (name, phone, password, role, zone) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", $name, $phone, $hashed_password, $role, $zone);

        if ($stmt->execute()) {
            $response['status'] = "success";
            $response['message'] = "Account created successfully";
        } else {
            $response['status'] = "error";
            $response['message'] = "Registration failed";
        }
        $stmt->close();
    }
    $check_stmt->close();
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();