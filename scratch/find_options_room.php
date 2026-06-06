<?php
$lines = file('d:/play-11-main/frontend/src/pages/MatchQuizRoom.jsx');
foreach ($lines as $i => $line) {
    if (strpos($line, 'option') !== false || strpos($line, 'click') !== false || strpos($line, 'Click') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
