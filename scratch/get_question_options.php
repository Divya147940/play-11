<?php
require_once __DIR__ . '/../api/config/db.php';

$qId = 'cff2be4d-15fd-4910-9511-160cbae1474e';

echo "=== Question Details ===\n";
$qStmt = DB::query("SELECT * FROM questions WHERE id = ?", [$qId]);
print_r($qStmt->fetch(PDO::FETCH_ASSOC));

echo "\n=== All Options for Question ===\n";
$optStmt = DB::query("SELECT * FROM question_options WHERE question_id = ? ORDER BY option_value ASC", [$qId]);
print_r($optStmt->fetchAll(PDO::FETCH_ASSOC));

echo "\n=== Correct Answer for Question ===\n";
$caStmt = DB::query("SELECT * FROM correct_answers WHERE question_id = ?", [$qId]);
print_r($caStmt->fetchAll(PDO::FETCH_ASSOC));
