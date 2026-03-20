<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$cp = isset($_GET['cp']) ? preg_replace('/[^0-9]/', '', $_GET['cp']) : '';

if (strlen($cp) !== 5) {
    echo json_encode(['error' => 'CP inválido']);
    exit;
}

$url = "https://nominatim.openstreetmap.org/search?postalcode=" . $cp . "&country=es&format=json&addressdetails=1";
$opts = [
    'http' => [
        'header' => "User-Agent: AirinosGastroCRM/1.0\r\n"
    ]
];
$context = stream_context_create($opts);
$response = @file_get_contents($url, false, $context);

if (!$response) {
    echo json_encode(['error' => 'No encontrado']);
    exit;
}

$data = json_decode($response, true);

if (isset($data[0]['address'])) {
    $address = $data[0]['address'];

    // Población: ciudad, town, village o municipality
    $poblacion = '';
    foreach (['city', 'town', 'village', 'municipality', 'county'] as $key) {
        if (!empty($address[$key])) {
            $poblacion = $address[$key];
            break;
        }
    }

    // Provincia: state
    $provincia = isset($address['state']) ? $address['state'] : '';
    // Quitar "Comunidad de" para quedarnos solo con el nombre corto
    $provincia = str_replace(['Comunidad de ', 'Comunidad Autónoma de ', 'Región de ', 'Principado de '], '', $provincia);

    echo json_encode([
        'provincia' => $provincia,
        'poblacion' => $poblacion
    ]);
} else {
    echo json_encode(['error' => 'No encontrado']);
}
