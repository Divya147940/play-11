<?php
require_once __DIR__ . '/../api/config/db.php';

// Fetch the most recent submission
$stmt = DB::query("SELECT s.*, u.name as user_name, q.title as quiz_title 
                   FROM submissions s 
                   JOIN users u ON s.user_id = u.id 
                   JOIN quizzes q ON s.quiz_id = q.id 
                   ORDER BY s.submitted_at DESC LIMIT 1");
$sub = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$sub) {
    echo "No submissions found.\n";
    exit;
}

echo "=== LATEST SUBMISSION ===\n";
print_r($sub);

$subId = $sub['id'];
$quizId = $sub['quiz_id'];

// Fetch questions and answers
$questionsStmt = DB::query("
    SELECT q.id as question_id, q.question_text,
           sa.selected_value, sa.is_correct,
           ca.answer_value as correct_value
    FROM questions q
    LEFT JOIN submission_answers sa ON q.id = sa.question_id AND sa.submission_id = ?
    LEFT JOIN correct_answers ca ON q.id = ca.question_id
    WHERE q.quiz_id = ?
    ORDER BY q.sort_order ASC, q.id ASC
", [$subId, $quizId]);
$answers = $questionsStmt->fetchAll(PDO::FETCH_ASSOC);

echo "\n=== ANSWERS fetched for review ===\n";
foreach ($answers as $ans) {
    echo "Q ID: " . $ans['question_id'] . "\n";
    echo "Text: " . $ans['question_text'] . "\n";
    echo "Selected Value: " . json_encode($ans['selected_value']) . "\n";
    echo "Correct Value: " . json_encode($ans['correct_value']) . "\n";
    
    // Fetch options
    $optStmt = DB::query("SELECT option_text, option_value FROM question_options WHERE question_id = ?", [$ans['question_id']]);
    $opts = $optStmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Options:\n";
    print_r($opts);
    echo "----------------------------------------\n";
}
