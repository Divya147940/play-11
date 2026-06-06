<?php
$content = file_get_contents('d:/play-11-main/frontend/src/pages/QuizReviewPage.jsx');
$lines = explode("\n", $content);
foreach ($lines as $i => $line) {
    if (stripos($line, 'skipped') !== false || stripos($line, 'select') !== false || stripos($line, 'correct') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
