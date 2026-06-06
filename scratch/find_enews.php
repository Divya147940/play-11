<?php
require_once __DIR__ . '/../api/config/db.php';

// Find option with text like 'E-News'
$stmt = DB::query("SELECT qo.*, q.question_text, qu.title as quiz_title
                   FROM question_options qo
                   JOIN questions q ON qo.question_id = q.id
                   JOIN quizzes qu ON q.quiz_id = qu.id
                   WHERE qo.option_text LIKE '%E-News%'");
$options = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "=== Matching Options ===\n";
print_r($options);

foreach ($options as $opt) {
    $qId = $opt['question_id'];
    
    // Find submissions for this quiz
    $subStmt = DB::query("SELECT s.*, u.name as user_name
                          FROM submissions s
                          JOIN users u ON s.user_id = u.id
                          WHERE s.quiz_id = (SELECT quiz_id FROM questions WHERE id = ?)", [$qId]);
    $submissions = $subStmt->fetchAll(PDO::FETCH_ASSOC);
    echo "\n=== Submissions for Quiz of Question ID $qId ===\n";
    print_r($submissions);
    
    foreach ($submissions as $sub) {
        $subId = $sub['id'];
        $ansStmt = DB::query("SELECT * FROM submission_answers WHERE submission_id = ? AND question_id = ?", [$subId, $qId]);
        echo "Answer for Submission $subId, Question $qId:\n";
        print_r($ansStmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
