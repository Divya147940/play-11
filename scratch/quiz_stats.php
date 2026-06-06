<?php
require_once __DIR__ . '/../api/config/db.php';

$stmt = DB::query("
    SELECT q.id, q.title, q.zone_id, COUNT(s.id) as sub_count
    FROM quizzes q
    LEFT JOIN submissions s ON q.id = s.quiz_id
    GROUP BY q.id, q.title, q.zone_id
");
$quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
print_r($quizzes);
