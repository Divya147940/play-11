<?php
require_once __DIR__ . '/../api/config/db.php';
$stmt = DB::query('SELECT * FROM question_options LIMIT 5');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
