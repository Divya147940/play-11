<?php
date_default_timezone_set('Asia/Kolkata');
require_once dirname(__DIR__) . '/api/config/db.php';

try {
    $stmt = DB::query("SELECT title, open_at, close_at FROM quizzes");
    while ($row = $stmt->fetch()) {
        echo "Title: " . $row['title'] . "\n";
        echo "  Raw open_at: " . $row['open_at'] . "\n";
        echo "  Raw close_at: " . $row['close_at'] . "\n";
        echo "  strtotime(open_at): " . strtotime($row['open_at']) . "\n";
        echo "  Formatted strtotime: " . date('Y-m-d H:i:s', strtotime($row['open_at'])) . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
