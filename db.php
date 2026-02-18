<?php

declare(strict_types=1);

function getDatabaseConnection(): PDO
{
    $databaseUrl = getenv('DATABASE_URL');

    if ($databaseUrl === false || $databaseUrl === '') {
        throw new RuntimeException('DATABASE_URL is not set.');
    }

    $parts = parse_url($databaseUrl);

    if ($parts === false) {
        throw new RuntimeException('Invalid DATABASE_URL format.');
    }

    if (($parts['scheme'] ?? '') !== 'postgresql' && ($parts['scheme'] ?? '') !== 'postgres') {
        throw new RuntimeException('DATABASE_URL must use postgresql scheme.');
    }

    $host = $parts['host'] ?? null;
    $port = $parts['port'] ?? 5432;
    $database = isset($parts['path']) ? ltrim($parts['path'], '/') : null;
    $user = $parts['user'] ?? null;
    $password = $parts['pass'] ?? null;

    if (!$host || !$database || !$user) {
        throw new RuntimeException('DATABASE_URL is missing host, database name, or user.');
    }

    $queryParams = [];
    if (isset($parts['query'])) {
        parse_str($parts['query'], $queryParams);
    }

    $sslMode = $queryParams['sslmode'] ?? 'require';

    $dsn = sprintf(
        'pgsql:host=%s;port=%d;dbname=%s;sslmode=%s',
        $host,
        (int) $port,
        $database,
        $sslMode
    );

    return new PDO(
        $dsn,
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
}
