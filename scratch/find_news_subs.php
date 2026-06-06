<?php
require_once __DIR__ . '/../api/config/db.php';

// Find quizzes with 'news' in title
$stmt = DB::query("SELECT * FROM quizzes WHERE title LIKE '%news%' OR title LIKE '%News%'");
$quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "=== Matching Quizzes ===\n";
print_r($quizzes);

foreach ($quizzes as $q) {
    $qId = $q['id'];
    echo "\n--- Submissions for Quiz: {$q['title']} ($qId) ---\n";
    $subStmt = DB::query("SELECT s.*, u.name as user_name FROM submissions s JOIN users u ON s.user_id = u.id WHERE s.quiz_id = ?", [$qId]);
    $subs = $subStmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($subs);
    
    foreach ($subs as $sub) {
        $subId = $sub['id'];
        echo "Answers for Submission $subId:\n";
        $ansStmt = DB::query("SELECT * FROM submission_answers WHERE submission_id = ?", [$subId]);
        print_r($ansStmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
