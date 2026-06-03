<?php
$dbUrl = "postgresql://neondb_owner:npg_yJvwu4AfP7ec@ep-steep-pond-a10nn3cv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
$dbParts = parse_url($dbUrl);
$host = $dbParts['host'];
$port = isset($dbParts['port']) ? $dbParts['port'] : 5432;
$user = $dbParts['user'];
$pass = isset($dbParts['pass']) ? $dbParts['pass'] : '';
$dbname = ltrim($dbParts['path'], '/');

echo "Test 1: Connecting without any extra options...\n";
try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
    $start = microtime(true);
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => true
    ]);
    echo "Success in " . round(microtime(true) - $start, 4) . " seconds!\n";
    $stmt = $pdo->query("SELECT COUNT(*) FROM quizzes");
    echo "Quizzes count: " . $stmt->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "Failed: " . $e->getMessage() . "\n";
}

echo "\nTest 2: Connecting to SQLite...\n";
try {
    $dbPath = dirname(__DIR__) . '/api/play11.db';
    $start = microtime(true);
    $pdo = new PDO("sqlite:$dbPath", null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo "Success in " . round(microtime(true) - $start, 4) . " seconds!\n";
    $stmt = $pdo->query("SELECT COUNT(*) FROM quizzes");
    echo "Quizzes count: " . $stmt->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "Failed: " . $e->getMessage() . "\n";
}
