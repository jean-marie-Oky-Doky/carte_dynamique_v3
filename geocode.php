<?php

http_response_code(410);
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'error' => 'Deprecated endpoint',
    'message' => 'Use POST /api/geocode instead.',
], JSON_UNESCAPED_UNICODE);
