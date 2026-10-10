<?php

include 'db_connect.php';
include 'sms_config.php';

$response = array();


// ============================================================
// 1. Check request method
// ============================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    $response['status'] = "error";
    $response['message'] = "Invalid request method";

    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}


// ============================================================
// 2. Get camp_id from Postman
// ============================================================

$camp_id = $_POST['camp_id'] ?? null;

if (!$camp_id) {

    $response['status'] = "error";
    $response['message'] = "camp_id is required";

    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}


// ============================================================
// 3. Get camp information
// ============================================================

$camp_sql = "SELECT zone, location, camp_date
             FROM camps
             WHERE id = ?";

$camp_stmt = $conn->prepare($camp_sql);

if (!$camp_stmt) {

    $response['status'] = "error";
    $response['message'] = "Failed to prepare camp query";

    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}

$camp_stmt->bind_param("i", $camp_id);
$camp_stmt->execute();

$camp = $camp_stmt->get_result()->fetch_assoc();

$camp_stmt->close();


// ============================================================
// 4. Check whether camp exists
// ============================================================

if (!$camp) {

    $response['status'] = "error";
    $response['message'] = "Camp not found";

    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}


// ============================================================
// 5. Get families from the same zone
// ============================================================

$sql = "SELECT phone, guardian_name
        FROM families
        WHERE zone = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {

    $response['status'] = "error";
    $response['message'] = "Failed to prepare family query";

    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}

$stmt->bind_param("s", $camp['zone']);
$stmt->execute();

$result = $stmt->get_result();


// ============================================================
// 6. Counters
// ============================================================

$total_families = 0;
$sent_count = 0;
$failed_count = 0;
$skipped_count = 0;

$results = array();


// ============================================================
// 7. Twilio Trial Template
// ============================================================
//
// Trial account cannot send a custom SMS body.
// Therefore we use a predefined Twilio trial template.
//
// ============================================================

$body = "sms_appointment_reminders";

//$body = "Vaccination camp on " . $camp['camp_date'] . " at " . $camp['location'] . ". Please bring your child.";

// ============================================================
// 8. Process every family
// ============================================================

while ($row = $result->fetch_assoc()) {

    $total_families++;

    $original_phone = trim($row['phone']);

    $to_number = $original_phone;


    // ========================================================
    // Convert local Bangladeshi number to E.164
    //
    // Example:
    // 01976900123
    // becomes
    // +8801976900123
    // ========================================================

    if (preg_match('/^01[3-9][0-9]{8}$/', $to_number)) {

        $to_number = '+88' . $to_number;
    }


    // ========================================================
    // Validate Bangladesh phone number
    // ========================================================

    if (!preg_match('/^\+8801[3-9][0-9]{8}$/', $to_number)) {

        $skipped_count++;

        $results[] = array(
            "phone" => $original_phone,
            "guardian_name" => $row['guardian_name'],
            "status" => "skipped",
            "reason" => "Invalid Bangladesh phone number format"
        );

        continue;
    }


    // ========================================================
    // Skip Teletalk for current Twilio sender setup
    //
    // Teletalk prefix = 015
    // ========================================================

    if (substr($to_number, 0, 6) === '+88015') {

        $skipped_count++;

        $results[] = array(
            "phone" => $to_number,
            "guardian_name" => $row['guardian_name'],
            "status" => "skipped",
            "reason" => "Teletalk is skipped with current Twilio sender setup"
        );

        continue;
    }


    // ========================================================
    // Twilio API URL
    // ========================================================

    $url = "https://api.twilio.com/2010-04-01/Accounts/"
         . TWILIO_SID
         . "/Messages.json";


    // ========================================================
    // Data to send to Twilio
    // ========================================================

    $data = array(
        'To' => $to_number,
        'From' => TWILIO_PHONE_NUMBER,
        'Body' => $body
    );


    // ========================================================
    // Initialize cURL
    // ========================================================

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_POST, true);

    curl_setopt(
        $ch,
        CURLOPT_POSTFIELDS,
        http_build_query($data)
    );

    curl_setopt(
        $ch,
        CURLOPT_USERPWD,
        TWILIO_SID . ":" . TWILIO_AUTH_TOKEN
    );

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

    curl_setopt($ch, CURLOPT_TIMEOUT, 30);


    // ========================================================
    // Send request to Twilio
    // ========================================================

    $twilio_response = curl_exec($ch);

    $http_code = curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );

    $curl_error = curl_error($ch);

    curl_close($ch);


    // ========================================================
    // Handle cURL connection error
    // ========================================================

    if ($twilio_response === false) {

        $failed_count++;

        $results[] = array(
            "phone" => $to_number,
            "guardian_name" => $row['guardian_name'],
            "status" => "curl_error",
            "error" => $curl_error
        );

        continue;
    }


    // ========================================================
    // Decode Twilio response
    // ========================================================

    $twilio_data = json_decode(
        $twilio_response,
        true
    );


    // ========================================================
    // IMPORTANT:
    // Count as sent ONLY if Twilio accepted the request
    // ========================================================

    if ($http_code >= 200 && $http_code < 300) {

        $sent_count++;

        $results[] = array(
            "phone" => $to_number,
            "guardian_name" => $row['guardian_name'],
            "status" => $twilio_data['status'] ?? 'unknown',
            "sid" => $twilio_data['sid'] ?? null
        );

    } else {

        $failed_count++;

        $results[] = array(
            "phone" => $to_number,
            "guardian_name" => $row['guardian_name'],
            "status" => "failed",
            "http_code" => $http_code,
            "error_code" => $twilio_data['code'] ?? null,
            "error_message" => $twilio_data['message'] ?? null
        );
    }
}


// ============================================================
// 9. Close database statement
// ============================================================

$stmt->close();


// ============================================================
// 10. Final response
// ============================================================

$response['status'] = "completed";

$response['camp_id'] = (int) $camp_id;

$response['zone'] = $camp['zone'];

$response['location'] = $camp['location'];

$response['camp_date'] = $camp['camp_date'];

$response['total_families'] = $total_families;

$response['sent_to_twilio'] = $sent_count;

$response['failed'] = $failed_count;

$response['skipped'] = $skipped_count;

$response['results'] = $results;


// ============================================================
// 11. Return JSON
// ============================================================

header('Content-Type: application/json');

echo json_encode(
    $response,
    JSON_PRETTY_PRINT
);


$conn->close();

?>