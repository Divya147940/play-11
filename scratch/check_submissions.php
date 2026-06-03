<?php
require_once __DIR__ . '/../api/config/db.php';

echo "=== Submissions ===\n";
$stmt = DB::query('SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 5');
$submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
print_r($submissions);

if (!empty($submissions)) {
    $subId = $submissions[0]['id'];
    echo "\n=== Submission Answers for ID $subId ===\n";
    $stmt = DB::query('SELECT * FROM submission_answers WHERE submission_id = ?', [$subId]);
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
}
