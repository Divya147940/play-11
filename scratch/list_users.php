<?php
require_once __DIR__ . '/../api/config/db.php';
$stmt = DB::query('SELECT * FROM users');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
