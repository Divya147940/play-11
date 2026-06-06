<?php
$lines = file('d:/play-11-main/api/controllers/admin.controller.php');
foreach ($lines as $i => $line) {
    if (strpos($line, 'getSubmissionReviewAdmin') !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
