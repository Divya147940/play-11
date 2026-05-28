<?php
require __DIR__ . '/../api/config/db.php';
$stmt = DB::query("SELECT id, title, code, user_id FROM vouchers WHERE user_id IS NOT NULL");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
