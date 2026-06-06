<?php
$lines = file('d:/play-11-main/frontend/src/pages/AdminDashboard.jsx');
foreach ($lines as $i => $line) {
    if (strpos($line, 'updateQuiz') !== false || strpos($line, '/api/admin/quizzes') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
