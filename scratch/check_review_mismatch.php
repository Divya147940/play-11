<?php
require_once __DIR__ . '/../api/config/db.php';

$subId = '64a6814c-a8cf-4251-b5a4-9ecccd01091d';
$stmt = DB::query('SELECT s.*, q.title FROM submissions s JOIN quizzes q ON s.quiz_id = q.id WHERE s.id = ?', [$subId]);
$sub = $stmt->fetch(PDO::FETCH_ASSOC);

$optStmt = DB::query("
    SELECT qo.question_id, qo.option_text, qo.option_value 
    FROM question_options qo
    JOIN questions q ON qo.question_id = q.id
    WHERE q.quiz_id = ?
", [$sub['quiz_id']]);
print_r($optStmt->fetchAll(PDO::FETCH_ASSOC));
