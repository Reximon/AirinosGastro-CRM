<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$cp = isset($_GET['cp']) ? preg_replace('/[^0-9]/', '', $_GET['cp']) : '';

if (strlen($cp) !== 5) {
    echo json_encode(['error' => 'CP inválido']);
    exit;
}

$url = "https://api.zippopotam.us/es/" . $cp;
$response = @file_get_contents($url);

if (!$response) {
    echo json_encode(['error' => 'No encontrado']);
    exit;
}

$data = json_decode($response, true);

if (isset($data['places'][0])) {
    echo json_encode([
        'provincia' => $data['places'][0]['state'],
        'poblacion' => $data['places'][0]['place name']
    ]);
} else {
    echo json_encode(['error' => 'No encontrado']);
}
