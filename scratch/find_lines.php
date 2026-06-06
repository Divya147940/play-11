<?php
$lines = file('d:/play-11-main/frontend/src/pages/AdminDashboard.jsx');
foreach ($lines as $i => $line) {
    if (stripos($line, 'SKIPPED') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
