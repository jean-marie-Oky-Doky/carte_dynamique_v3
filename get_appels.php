<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = getDatabaseConnection();

    $query = $pdo->query('SELECT id, adresse, gravite, score, latitude, longitude FROM liste_appel ORDER BY id');
    $appels = $query->fetchAll();

    echo json_encode($appels, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database query failed.',
        'details' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}
