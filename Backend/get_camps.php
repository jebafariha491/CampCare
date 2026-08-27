<?php
include 'db_connect.php';

$response = array();

$zone = isset($_GET['zone']) ? $_GET['zone'] : '';

$sql = "SELECT c.id, c.zone, c.location, c.camp_date, u.name AS created_by_name 
        FROM camps c 
        LEFT JOIN users u ON c.created_by = u.id 
        WHERE c.zone = ? 
        ORDER BY c.camp_date ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $zone);
$stmt->execute();
$result = $stmt->get_result();

$camps = array();
while ($row = $result->fetch_assoc()) {
    $camps[] = $row;
}

$response['status'] = "success";
$response['zone'] = $zone;
$response['camps'] = $camps;

$stmt->close();
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();