<?php
require_once __DIR__ . '/../api/config/db.php';

$subId = '2fc446e0-8a28-46a2-b099-8858154b63f9';
$quizId = '30444532-af80-44aa-a99b-39ae950136d3';

echo "=== Quiz Questions & Options ===\n";
$qStmt = DB::query("SELECT id, question_text FROM questions WHERE quiz_id = ? ORDER BY sort_order ASC, id ASC", [$quizId]);
$questions = $qStmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($questions as $q) {
    echo "Question: {$q['question_text']} ({$q['id']})\n";
    $optStmt = DB::query("SELECT option_text, option_value FROM question_options WHERE question_id = ? ORDER BY option_value ASC", [$q['id']]);
    $options = $optStmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($options as $opt) {
        echo "  Option: [{$opt['option_value']}] {$opt['option_text']}\n";
    }
    
    // Correct Answer
    $ca = DB::query("SELECT answer_value FROM correct_answers WHERE question_id = ?", [$q['id']])->fetchColumn();
    echo "  Correct: $ca\n";
    
    // Submission Answer
    $sa = DB::query("SELECT selected_value, is_correct FROM submission_answers WHERE submission_id = ? AND question_id = ?", [$subId, $q['id']])->fetch(PDO::FETCH_ASSOC);
    if ($sa) {
        echo "  User Selected: [{$sa['selected_value']}] | Is Correct: {$sa['is_correct']}\n";
    } else {
        echo "  User Selected: [NOT FOUND / SKIPPED]\n";
    }
}
