<?php
$lines = file('d:/play-11-main/frontend/src/pages/QuizReviewPage.jsx');
foreach ($lines as $i => $line) {
    if (strpos($line, 'fetch') !== false || strpos($line, 'api') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
