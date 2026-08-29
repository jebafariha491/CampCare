<?php
include 'db_connect.php';
include 'telegram_config.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $camp_id = $_POST['camp_id'];

    // Get camp info
    $camp_sql = "SELECT zone, location, camp_date FROM camps WHERE id = ?";
    $camp_stmt = $conn->prepare($camp_sql);
    $camp_stmt->bind_param("i", $camp_id);
    $camp_stmt->execute();
    $camp_result = $camp_stmt->get_result();
    $camp = $camp_result->fetch_assoc();
    $camp_stmt->close();

    if (!$camp) {
        $response['status'] = "error";
        $response['message'] = "Camp not found";
    } else {
        // Get all subscribed families in this zone
        $sql = "SELECT ts.chat_id, f.guardian_name 
                FROM telegram_subscriptions ts
                JOIN families f ON ts.family_id = f.id
                WHERE f.zone = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $camp['zone']);
        $stmt->execute();
        $result = $stmt->get_result();

        $sent_count = 0;
        $message = "Reminder: A vaccination camp will be held at " . $camp['location'] . " on " . $camp['camp_date'] . ". Please bring your child.";

        while ($row = $result->fetch_assoc()) {
            $chat_id = $row['chat_id'];
            $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
            $data = array('chat_id' => $chat_id, 'text' => $message);

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_exec($ch);
            curl_close($ch);

            $sent_count++;
        }
        $stmt->close();

        $response['status'] = "success";
        $response['message'] = "Reminder sent to $sent_count registered families in " . $camp['zone'];
    }
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();