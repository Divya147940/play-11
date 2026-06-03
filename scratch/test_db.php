<?php
require_once dirname(__DIR__) . '/api/config/db.php';
echo "Connecting to DB...\n";
$start = microtime(true);
try {
    $pdo = DB::getPdo();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    echo "Driver: $driver\n";
    $time = microtime(true) - $start;
    echo "Connected successfully in " . round($time, 4) . " seconds.\n\n";

    echo "Testing simple query...\n";
    $start = microtime(true);
    $stmt = DB::query("SELECT COUNT(*) FROM quizzes");
    $count = $stmt->fetchColumn();
    $time = microtime(true) - $start;
    echo "Quizzes count: $count in " . round($time, 4) . " seconds.\n\n";

    echo "Testing query in getAllQuizzes...\n";
    $start = microtime(true);
    $stmt = DB::query("
        SELECT q.*,
        (SELECT COUNT(*) FROM quiz_registrations qr WHERE qr.quiz_id = q.id) as players_count
        FROM quizzes q
        WHERE q.status IN ('active', 'completed')
        ORDER BY q.open_at ASC
    ");
    $quizzes = $stmt->fetchAll();
    $time = microtime(true) - $start;
    echo "Fetched " . count($quizzes) . " quizzes in " . round($time, 4) . " seconds.\n";
    if (count($quizzes) > 0) {
        print_r(array_slice($quizzes, 0, 2));
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
