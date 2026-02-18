<?php

http_response_code(410);
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'error' => 'Deprecated endpoint',
    'message' => 'Use GET /api/get-appels instead.',
], JSON_UNESCAPED_UNICODE);
