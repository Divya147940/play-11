<?php
require_once dirname(__DIR__) . '/api/config/db.php';
echo "getenv(DATABASE_URL): " . getenv('DATABASE_URL') . "\n";
echo "\$_ENV[DATABASE_URL]: " . ($_ENV['DATABASE_URL'] ?? 'not set') . "\n";
echo "\$_SERVER[DATABASE_URL]: " . ($_SERVER['DATABASE_URL'] ?? 'not set') . "\n";
