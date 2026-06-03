<?php
require_once __DIR__ . '/../api/config/db.php';
$stmt = DB::query("SELECT id, title, entry_amount, status, open_at, close_at FROM quizzes WHERE title LIKE '%Daily%' OR title LIKE '%daily%'");
print_r($stmt->fetchAll());

$regs = DB::query("SELECT * FROM quiz_registrations");
echo "\n=== All Registrations ===\n";
print_r($regs->fetchAll());
