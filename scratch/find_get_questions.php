<?php
$lines = file('d:/play-11-main/api/controllers/quiz.controller.php');
foreach ($lines as $i => $line) {
    if (strpos($line, 'questions') !== false || strpos($line, 'function') !== false || strpos($line, 'SELECT') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
