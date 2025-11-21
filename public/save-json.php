<?php
// Allow JSON POST
header("Content-Type: application/json");

// Increase PHP input limits like Express body-parser did
ini_set('post_max_size', '20M');
ini_set('upload_max_filesize', '20M');

// Read raw POST body
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data["quals"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON body"]);
    exit;
}

$updates = $data["quals"];
$filePath = __DIR__ . "/quals.json";

// Check if file exists
if (!file_exists($filePath)) {
    http_response_code(500);
    echo json_encode(["error" => "quals.json not found"]);
    exit;
}

// Load current JSON
$currentData = json_decode(file_get_contents($filePath), true);

if (!$currentData) {
    $currentData = ["quals" => []];
}

foreach ($updates as $update) {
    $index = -1;

    // Find by ID (just like your Node code)
    foreach ($currentData["quals"] as $i => $q) {
        if ($q["id"] === $update["id"]) {
            $index = $i;
            break;
        }
    }

    if ($index !== -1) {
        // Merge updated fields
        $currentData["quals"][$index] = array_merge($currentData["quals"][$index], $update);
    } else {
        // Add new entry
        $currentData["quals"][] = $update;
    }
}

// Save updated JSON
file_put_contents($filePath, json_encode($currentData, JSON_PRETTY_PRINT));

echo json_encode(["message" => "JSON updated successfully!"]);
