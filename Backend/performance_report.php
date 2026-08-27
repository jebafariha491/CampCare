<?php
include 'db_connect.php';

$response = array();

$sql = "SELECT u.id, u.name, u.zone,
        COUNT(DISTINCT f.id) AS families_registered,
        COUNT(DISTINCT c.id) AS children_registered,
        COUNT(DISTINCT vr.id) AS vaccinations_given,
        COUNT(DISTINCT ca.id) AS camps_organized
        FROM users u
        LEFT JOIN families f ON f.worker_id = u.id
        LEFT JOIN children c ON c.family_id = f.id
        LEFT JOIN vaccination_records vr ON vr.child_id = c.id
        LEFT JOIN camps ca ON ca.created_by = u.id
        WHERE u.role = 'worker'
        GROUP BY u.id, u.name, u.zone";

$result = $conn->query($sql);

$performance = array();
while ($row = $result->fetch_assoc()) {
    $performance[] = $row;
}

$response['status'] = "success";
$response['performance'] = $performance;

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();