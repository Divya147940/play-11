<?php
require_once __DIR__ . '/../api/config/db.php';

$stmt = DB::query("SELECT s.id, s.quiz_id, s.user_id, s.correct_count, s.wrong_count, q.title as quiz_title
                   FROM submissions s
                   JOIN quizzes q ON s.quiz_id = q.id");
$subs = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "=== Analyzing Submissions ===\n";
foreach ($subs as $sub) {
    $subId = $sub['id'];
    $ansCount = DB::query("SELECT COUNT(*) FROM submission_answers WHERE submission_id = ?", [$subId])->fetchColumn();
    $nullCount = DB::query("SELECT COUNT(*) FROM submission_answers WHERE submission_id = ? AND (selected_value IS NULL OR selected_value = '')", [$subId])->fetchColumn();
    echo "Sub ID: $subId | Quiz: {$sub['quiz_title']} | Correct/Wrong: {$sub['correct_count']}/{$sub['wrong_count']} | Answers count in DB: $ansCount | Null answers: $nullCount\n";
    
    if ($ansCount < 10) {
        echo "   WARNING: Has only $ansCount answers (expected 10)\n";
        // Let's print which questions are missing
        $missingStmt = DB::query("
            SELECT q.id, q.question_text
            FROM questions q
            WHERE q.quiz_id = ? AND q.id NOT IN (SELECT question_id FROM submission_answers WHERE submission_id = ?)
        ", [$sub['quiz_id'], $subId]);
        print_r($missingStmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
