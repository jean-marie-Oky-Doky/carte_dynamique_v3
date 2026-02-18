<?php

http_response_code(410);
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'error' => 'Deprecated endpoint',
    'message' => 'This project now uses Vercel Node.js serverless functions under /api.',
], JSON_UNESCAPED_UNICODE);
