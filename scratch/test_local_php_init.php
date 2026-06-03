<?php
// Override env variable before loading db.php
putenv("DATABASE_URL=postgresql://postgres:postgres@localhost:5432/play11?sslmode=disable");
$_ENV['DATABASE_URL'] = "postgresql://postgres:postgres@localhost:5432/play11?sslmode=disable";

require_once dirname(__DIR__) . '/api/config/db.php';

echo "Database initialized!\n";

try {
    $pdo = DB::getPdo();
    echo "Successfully connected to local play11 database in PHP.\n";
    
    // Check if db initialized successfully by calling initDB directly (or checking version)
    echo "Running initDB()...\n";
    initDB();
    echo "initDB() finished successfully!\n";

    // Let's count quizzes
    $stmt = DB::query("SELECT COUNT(*) FROM quizzes");
    echo "Quizzes count: " . $stmt->fetchColumn() . "\n";
    
    // Let's count categories
    $stmt = DB::query("SELECT COUNT(*) FROM categories");
    echo "Categories count: " . $stmt->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "Error during local DB initialization in PHP: " . $e->getMessage() . "\n";
}
