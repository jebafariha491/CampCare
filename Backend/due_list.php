<?php
include 'db_connect.php';

$response = array();

// EPI schedule fixed table theke sob vaccine ber koro
$epi_sql = "SELECT vaccine_name, due_week_from_birth FROM epi_schedule ORDER BY due_week_from_birth ASC";
$epi_result = $conn->query($epi_sql);

$epi_schedule = array();
while ($row = $epi_result->fetch_assoc()) {
    $epi_schedule[] = $row;
}

// Zone onujayi sob child ber koro (GET parameter diye zone pathabe)
$zone = isset($_GET['zone']) ? $_GET['zone'] : '';

$sql = "SELECT c.id, c.name, c.dob, f.guardian_name, f.zone 
        FROM children c 
        JOIN families f ON c.family_id = f.id 
        WHERE f.zone = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $zone);
$stmt->execute();
$result = $stmt->get_result();

$due_list = array();

while ($child = $result->fetch_assoc()) {
    // Child-er boyosh (weeks) calculate koro
    $dob = new DateTime($child['dob']);
    $today = new DateTime();
    $age_weeks = $today->diff($dob)->days / 7;

    // Child-ke already ki vaccine deya hoyeche, ber koro
    $given_sql = "SELECT vaccine_name FROM vaccination_records WHERE child_id = ?";
    $given_stmt = $conn->prepare($given_sql);
    $given_stmt->bind_param("i", $child['id']);
    $given_stmt->execute();
    $given_result = $given_stmt->get_result();

    $given_vaccines = array();
    while ($g = $given_result->fetch_assoc()) {
        $given_vaccines[] = $g['vaccine_name'];
    }
    $given_stmt->close();

    // Prottekta EPI vaccine-er shathe compare koro
    $child_due_list = array();
    foreach ($epi_schedule as $vaccine) {
        $status = "upcoming";

        if (in_array($vaccine['vaccine_name'], $given_vaccines)) {
            $status = "given";
        } elseif ($age_weeks >= $vaccine['due_week_from_birth'] + 2) {
            $status = "overdue";
        } elseif ($age_weeks >= $vaccine['due_week_from_birth'] - 2) {
            $status = "due_soon";
        }

        $child_due_list[] = array(
            "vaccine_name" => $vaccine['vaccine_name'],
            "due_week" => $vaccine['due_week_from_birth'],
            "status" => $status
        );
    }

    $due_list[] = array(
        "child_id" => $child['id'],
        "child_name" => $child['name'],
        "guardian_name" => $child['guardian_name'],
        "age_weeks" => round($age_weeks, 1),
        "vaccines" => $child_due_list
    );
}

$response['status'] = "success";
$response['zone'] = $zone;
$response['children'] = $due_list;

$stmt->close();
header('Content-Type: application/json');
echo json_encode($response);
$conn->close();