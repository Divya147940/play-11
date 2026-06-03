<?php
require_once __DIR__ . '/../api/config/db.php';

$movieQuizId = '30444532-af80-44aa-a99b-39ae950136d3';
$newsQuizId = '6e1a1ea3-5df9-4d08-9966-4d837cd69edb';

echo "=== Movie Quiz Correct Answers ===\n";
$stmt = DB::query("
    SELECT ca.question_id, ca.answer_value 
    FROM correct_answers ca
    JOIN questions q ON ca.question_id = q.id
    WHERE q.quiz_id = ?
", [$movieQuizId]);
print_r($stmt->fetchAll());

echo "\n=== News Quiz Correct Answers ===\n";
$stmt = DB::query("
    SELECT ca.question_id, ca.answer_value 
    FROM correct_answers ca
    JOIN questions q ON ca.question_id = q.id
    WHERE q.quiz_id = ?
", [$newsQuizId]);
print_r($stmt->fetchAll());
