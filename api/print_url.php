<?php
require_once __DIR__ . '/config/dotenv.php';
// Load environment variables from the parent or current directory
loadDotenv(dirname(__DIR__) . '/.env');
loadDotenv(__DIR__ . '/.env');

echo json_encode([
    'DATABASE_URL' => getenv('DATABASE_URL'),
    'POSTGRES_URL' => getenv('POSTGRES_URL'),
    'ENV_DATABASE_URL' => $_ENV['DATABASE_URL'] ?? null,
    'SERVER_DATABASE_URL' => $_SERVER['DATABASE_URL'] ?? null,
]);
