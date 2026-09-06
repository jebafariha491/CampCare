<?php
include 'db_connect.php';

$response = array();

$zone = isset($_GET['zone']) ? $_GET['zone'] : '';
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'normal'; // normal = default, no specific sort

$sql = "SELECT c.id, c.name, c.dob, f.guardian_name, f.zone 
        FROM children c 
        JOIN families f ON c.family_id = f.id 
        WHERE f.zone = ?";

if ($sort == 'asc') {
    $sql .= " ORDER BY c.dob DESC"; // youngest first (DOB most recent)
} elseif ($sort == 'desc') {
    $sql .= " ORDER BY c.dob ASC"; // oldest first (DOB earliest)
}
// jদি "normal" hয়, kono ORDER BY add hবে না — database-er natural/insertion order-e ashবে

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $zone);
$stmt->execute();
$result = $stmt->get_result();

$children = array();
while ($row = $result->fetch_assoc()) {
    $children[] = $row;
}

$response['status'] = "success";
$response['sort_applied'] = $sort;
$response['children'] = $children;

$stmt->close();
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();