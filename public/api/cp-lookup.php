<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$cp = isset($_GET['cp']) ? preg_replace('/[^0-9]/', '', $_GET['cp']) : '';

if (empty($cp)) {
    echo json_encode(['error' => 'CP inválido']);
    exit;
}

// Detectar país según longitud del CP
if (strlen($cp) === 5) {
    $country = 'es';
} elseif (strlen($cp) === 7) {
    $country = 'jp';
} else {
    echo json_encode(['error' => 'Formato de CP no reconocido']);
    exit;
}

$url = "https://nominatim.openstreetmap.org/search?postalcode=" . $cp . "&country=" . $country . "&format=json&addressdetails=1";
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

    $poblacion = '';
    foreach (['city', 'town', 'village', 'municipality', 'county', 'suburb'] as $key) {
        if (!empty($address[$key])) {
            $poblacion = $address[$key];
            break;
        }
    }

    $provincia = isset($address['state']) ? $address['state'] : '';
    $provincia = str_replace(['Comunidad de ', 'Comunidad Autónoma de ', 'Región de ', 'Principado de '], '', $provincia);

function traducir($texto) {
    if (empty($texto)) return $texto;
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=" . urlencode($texto);
    $opts = ['http' => ['header' => "User-Agent: Mozilla/5.0\r\n"]];
    $context = stream_context_create($opts);
    $response = @file_get_contents($url, false, $context);
    if (!$response) return $texto;
    $data = json_decode($response, true);
    return isset($data[0][0][0]) ? $data[0][0][0] : $texto;
}
// Traducir si es japonés
if ($country === 'jp') {
    $poblacion = traducir($poblacion);
    $provincia = 'Japón';
}
    echo json_encode([
        'provincia' => $provincia,
        'poblacion' => strtoupper($poblacion)
    ]);
} else {
    echo json_encode(['error' => 'No encontrado']);
}
