<?php
$lines = file('d:/play-11-main/frontend/src/pages/MatchQuizRoom.jsx');
foreach ($lines as $i => $line) {
    if (strpos($line, 'setAnswers') !== false || strpos($line, 'useState') !== false) {
        if (strpos($line, 'answers') !== false || strpos($line, 'Answers') !== false) {
            echo ($i + 1) . ": " . trim($line) . "\n";
        }
    }
}
