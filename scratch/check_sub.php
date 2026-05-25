<?php
require_once dirname(__DIR__) . '/api/config/db.php';

$subId = '6e8e5f8d-1c24-4341-9eaa-86effdf4e5de';

echo "1. Checking submission details:\n";
$stmt = DB::query("SELECT * FROM submissions WHERE id = ?", [$subId]);
$sub = $stmt->fetch();
print_r($sub);

if ($sub) {
    $quizId = $sub['quiz_id'];
    echo "\n2. Checking questions for quiz $quizId:\n";
    $stmt = DB::query("SELECT id, question_text FROM questions WHERE quiz_id = ?", [$quizId]);
    $questions = $stmt->fetchAll();
    print_r($questions);

    echo "\n3. Checking submission_answers for submission $subId:\n";
    $stmt = DB::query("SELECT * FROM submission_answers WHERE submission_id = ?", [$subId]);
    $answers = $stmt->fetchAll();
    print_r($answers);

    echo "\n4. Running our new LEFT JOIN query:\n";
    $stmt = DB::query("
        SELECT 
          q.id as question_id, sa.selected_value, sa.is_correct,
          q.question_text, q.hindi_question_text,
          ca.answer_value as correct_value
        FROM questions q
        LEFT JOIN submission_answers sa ON q.id = sa.question_id AND sa.submission_id = ?
        LEFT JOIN correct_answers ca ON q.id = ca.question_id
        WHERE q.quiz_id = ?
        ORDER BY q.sort_order ASC, q.id ASC
    ", [$subId, $quizId]);
    $review = $stmt->fetchAll();
    print_r($review);
} else {
    echo "Submission not found in DB!\n";
}
