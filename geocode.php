<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = getDatabaseConnection();

    $sql = 'SELECT id, adresse FROM liste_appel WHERE latitude IS NULL OR longitude IS NULL';
    $query = $pdo->query($sql);
    $appels = $query->fetchAll();

    $updated = 0;

    foreach ($appels as $appel) {
        $adresse = urlencode((string) $appel['adresse']);
        $url = "https://nominatim.openstreetmap.org/search?format=json&q={$adresse}";

        $opts = [
            'http' => [
                'header' => "User-Agent: Projet-Appel/1.0\r\n",
            ],
        ];

        $context = stream_context_create($opts);
        $json = file_get_contents($url, false, $context);

        if ($json === false) {
            continue;
        }

        $data = json_decode($json, true);

        if (!empty($data)) {
            $lat = $data[0]['lat'];
            $lon = $data[0]['lon'];

            $update = $pdo->prepare(
                'UPDATE liste_appel SET latitude = :latitude, longitude = :longitude WHERE id = :id'
            );

            $update->execute([
                'latitude' => $lat,
                'longitude' => $lon,
                'id' => $appel['id'],
            ]);

            $updated++;
        }

        sleep(1);
    }

    echo json_encode([
        'status' => 'ok',
        'processed' => count($appels),
        'updated' => $updated,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Geocoding process failed.',
        'details' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}
