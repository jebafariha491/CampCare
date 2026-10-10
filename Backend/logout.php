<?php
session_start();

$response = array();

session_unset();
session_destroy();

$response['status'] = "success";
$response['message'] = "Logged out successfully";

header('Content-Type: application/json');
echo json_encode($response);