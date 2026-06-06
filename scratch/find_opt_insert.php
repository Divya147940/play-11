<?php
$lines = file('d:/play-11-main/api/controllers/admin.controller.php');
foreach ($lines as $i => $line) {
    if (strpos($line, 'question_options') !== false || strpos($line, 'correct_answers') !== false || strpos($line, 'INSERT INTO') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
