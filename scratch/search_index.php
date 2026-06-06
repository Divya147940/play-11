<?php
$lines = file('d:/play-11-main/api/index.php');
foreach ($lines as $i => $line) {
    if (stripos($line, 'review') !== false || stripos($line, 'submission') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
