<?php
include 'db_connect.php';

$response = array();

$sql = "SELECT u.id, u.name, u.zone, 
        COUNT(DISTINCT f.id) AS families_registered,
        COUNT(DISTINCT c.id) AS children_registered
        FROM users u
        LEFT JOIN families f ON f.worker_id = u.id
        LEFT JOIN children c ON c.family_id = f.id
        WHERE u.role = 'worker'
        GROUP BY u.id, u.name, u.zone";

$result = $conn->query($sql);

$workers = array();
while ($row = $result->fetch_assoc()) {
    $workers[] = $row;
}

$response['status'] = "success";
$response['workers'] = $workers;

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();