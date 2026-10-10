<?php
session_start();
include 'db_connect.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $phone = $_POST['phone'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE phone = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $phone);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            $response['status'] = "success";
            $response['message'] = "Login successful";
            $response['user'] = array(
                "id" => $user['id'],
                "name" => $user['name'],
                "role" => $user['role'],
                "zone" => $user['zone']
            );
        } else {
            $response['status'] = "error";
            $response['message'] = "Incorrect password";
        }
    } else {
        $response['status'] = "error";
        $response['message'] = "No user found with this phone number";
    }

    $stmt->close();
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();