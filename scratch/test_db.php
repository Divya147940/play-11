<?php
require_once dirname(__DIR__) . '/api/config/db.php';

try {
    $driver = DB::getPdo()->getAttribute(PDO::ATTR_DRIVER_NAME);
    echo "Database driver: $driver\n";
    
    if ($driver === 'mysql') {
        $stmt = DB::query("SHOW INDEX FROM submissions");
        $indexes = $stmt->fetchAll();
        echo "Submissions indexes:\n";
        foreach ($indexes as $index) {
            echo " - " . $index['Key_name'] . " on " . $index['Column_name'] . "\n";
        }
        
        $stmt = DB::query("SHOW INDEX FROM quizzes");
        $indexes = $stmt->fetchAll();
        echo "Quizzes indexes:\n";
        foreach ($indexes as $index) {
            echo " - " . $index['Key_name'] . " on " . $index['Column_name'] . "\n";
        }
    } else {
        echo "Not mysql driver, it's $driver\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
