<?php
include 'db_connect.php';

$response = array();

// Total EPI vaccine count
$epi_count_sql = "SELECT COUNT(*) AS total FROM epi_schedule";
$epi_count_result = $conn->query($epi_count_sql);
$total_vaccines = $epi_count_result->fetch_assoc()['total'];

// Get all zones with their children
$zones_sql = "SELECT DISTINCT zone FROM families";
$zones_result = $conn->query($zones_sql);

$coverage_data = array();

while ($zone_row = $zones_result->fetch_assoc()) {
    $zone = $zone_row['zone'];

    $children_sql = "SELECT c.id, c.dob FROM children c 
                      JOIN families f ON c.family_id = f.id 
                      WHERE f.zone = ?";
    $children_stmt = $conn->prepare($children_sql);
    $children_stmt->bind_param("s", $zone);
    $children_stmt->execute();
    $children_result = $children_stmt->get_result();

    $total_children = 0;
    $fully_vaccinated = 0;
    $total_progress_percent = 0; // sum of each child's individual % progress

    while ($child = $children_result->fetch_assoc()) {
        $total_children++;

        $given_sql = "SELECT COUNT(*) AS given_count FROM vaccination_records WHERE child_id = ?";
        $given_stmt = $conn->prepare($given_sql);
        $given_stmt->bind_param("i", $child['id']);
        $given_stmt->execute();
        $given_count = $given_stmt->get_result()->fetch_assoc()['given_count'];
        $given_stmt->close();

        // Individual child's vaccination progress (%)
        $child_percent = $total_vaccines > 0 ? ($given_count / $total_vaccines) * 100 : 0;
        $total_progress_percent += $child_percent;

        if ($given_count >= $total_vaccines) {
            $fully_vaccinated++;
        }
    }
    $children_stmt->close();

    // Zone's average progress across all children (partial credit included)
    $average_progress = $total_children > 0 ? round($total_progress_percent / $total_children, 1) : 0;

    // Keep the strict "fully vaccinated" percentage too, for comparison
    $fully_vaccinated_percent = $total_children > 0 ? round(($fully_vaccinated / $total_children) * 100, 1) : 0;

    $coverage_data[] = array(
        "zone" => $zone,
        "total_children" => $total_children,
        "fully_vaccinated" => $fully_vaccinated,
        "fully_vaccinated_percent" => $fully_vaccinated_percent,
        "average_progress_percent" => $average_progress
    );
}

$response['status'] = "success";
$response['coverage'] = $coverage_data;

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();