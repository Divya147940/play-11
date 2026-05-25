<?php
// PHP Script to export Neon PostgreSQL database schema and data into a .sql file
require_once __DIR__ . '/../api/config/dotenv.php';
require_once __DIR__ . '/../api/config/db.php';

global $pdo;

if (!$pdo) {
    die("❌ Error: Database connection could not be established.\n");
}

$tables = [
    'users' => '
      CREATE TABLE "users" (
        "id" TEXT PRIMARY KEY,
        "mobile" TEXT UNIQUE NOT NULL,
        "name" TEXT,
        "coins" NUMERIC DEFAULT 0,
        "points" INTEGER DEFAULT 0,
        "status" TEXT DEFAULT \'active\',
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );',
    'otp_requests' => '
      CREATE TABLE "otp_requests" (
        "id" TEXT PRIMARY KEY,
        "mobile" TEXT NOT NULL,
        "otp_reference" TEXT NOT NULL,
        "otp_code" TEXT NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "verified" INTEGER DEFAULT 0
      );',
    'categories' => '
      CREATE TABLE "categories" (
        "id" TEXT PRIMARY KEY,
        "zone_id" TEXT,
        "name" TEXT NOT NULL,
        "hindi_name" TEXT,
        "icon" TEXT,
        "status" TEXT DEFAULT \'active\',
        "sort_order" INTEGER DEFAULT 0
      );',
    'matches' => '
      CREATE TABLE "matches" (
        "id" TEXT PRIMARY KEY,
        "sport_type" TEXT,
        "team_a" TEXT,
        "team_b" TEXT,
        "team_a_logo" TEXT,
        "team_b_logo" TEXT,
        "start_time" TIMESTAMP,
        "venue" TEXT,
        "score_a" INTEGER DEFAULT 0,
        "score_b" INTEGER DEFAULT 0,
        "hindi_team_a" TEXT,
        "hindi_team_b" TEXT,
        "hindi_venue" TEXT,
        "status" TEXT DEFAULT \'upcoming\'
      );',
    'quizzes' => '
      CREATE TABLE "quizzes" (
        "id" TEXT PRIMARY KEY,
        "zone_id" TEXT,
        "category_id" TEXT REFERENCES categories(id) ON DELETE CASCADE,
        "match_id" TEXT REFERENCES matches(id) ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "total_questions" INTEGER DEFAULT 0,
        "timer_minutes" INTEGER DEFAULT 5,
        "status" TEXT DEFAULT \'active\',
        "reward_text" TEXT,
        "prize_amount" INTEGER DEFAULT 0,
        "entry_type" TEXT DEFAULT \'free\',
        "open_at" TIMESTAMP,
        "close_at" TIMESTAMP,
        "result_at" TIMESTAMP,
        "marks_per_q" INTEGER DEFAULT 2,
        "negative_marks" NUMERIC DEFAULT 0.5
      );',
    'questions' => '
      CREATE TABLE "questions" (
        "id" TEXT PRIMARY KEY,
        "quiz_id" TEXT REFERENCES quizzes(id) ON DELETE CASCADE,
        "question_text" TEXT NOT NULL,
        "hindi_question_text" TEXT,
        "marks" INTEGER DEFAULT 2,
        "sort_order" INTEGER DEFAULT 0
      );',
    'question_options' => '
      CREATE TABLE "question_options" (
        "id" TEXT PRIMARY KEY,
        "question_id" TEXT REFERENCES questions(id) ON DELETE CASCADE,
        "option_text" TEXT NOT NULL,
        "option_value" TEXT NOT NULL
      );',
    'correct_answers' => '
      CREATE TABLE "correct_answers" (
        "id" TEXT PRIMARY KEY,
        "question_id" TEXT REFERENCES questions(id) ON DELETE CASCADE,
        "answer_value" TEXT NOT NULL
      );',
    'submissions' => '
      CREATE TABLE "submissions" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "quiz_id" TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        "status" TEXT DEFAULT \'completed\',
        "total_score" NUMERIC DEFAULT 0,
        "correct_count" INTEGER DEFAULT 0,
        "wrong_count" INTEGER DEFAULT 0,
        "total_marks" INTEGER DEFAULT 0,
        "time_taken" TEXT,
        "submitted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );',
    'visitors' => '
      CREATE TABLE "visitors" (
        "id" BIGSERIAL PRIMARY KEY,
        "ip" TEXT,
        "user_agent" TEXT,
        "path" TEXT,
        "method" TEXT,
        "visited_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );',
    'admins' => '
      CREATE TABLE "admins" (
        "id" TEXT PRIMARY KEY,
        "username" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );',
    'submission_answers' => '
      CREATE TABLE "submission_answers" (
        "id" TEXT PRIMARY KEY,
        "submission_id" TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        "question_id" TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        "selected_value" TEXT,
        "is_correct" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );',
    'transactions' => '
      CREATE TABLE "transactions" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "amount" NUMERIC NOT NULL,
        "type" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "status" TEXT DEFAULT \'success\',
        "upi_id" TEXT,
        "qr_code" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );',
    'vouchers' => '
      CREATE TABLE "vouchers" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "code" TEXT UNIQUE NOT NULL,
        "discount_text" TEXT NOT NULL,
        "amount" NUMERIC DEFAULT 0,
        "type" TEXT NOT NULL,
        "color" TEXT DEFAULT \'#7c3aed\',
        "expiry_days" INTEGER DEFAULT 30,
        "status" TEXT DEFAULT \'active\',
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "expires_at" TIMESTAMP
      );',
    'user_vouchers' => '
      CREATE TABLE "user_vouchers" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "voucher_id" TEXT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
        "status" TEXT DEFAULT \'active\',
        "expires_at" TIMESTAMP NOT NULL,
        "redeemed_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );',
    'settings' => '
      CREATE TABLE "settings" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL,
        "description" TEXT,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );'
];

$sqlDump = "-- --------------------------------------------------------\n";
$sqlDump .= "-- Play 11 PostgreSQL Database Export Dump\n";
$sqlDump .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
$sqlDump .= "-- --------------------------------------------------------\n\n";

// Disable foreign key constraints during insertion
$sqlDump .= "SET session_replication_role = 'replica';\n\n";

foreach ($tables as $name => $schema) {
    $sqlDump .= "--\n-- Table structure for table \"$name\"\n--\n\n";
    $sqlDump .= "DROP TABLE IF EXISTS \"$name\" CASCADE;\n";
    $sqlDump .= trim($schema) . "\n\n";
    
    // Fetch and export rows
    try {
        $stmt = $pdo->query("SELECT * FROM \"$name\"");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($rows) > 0) {
            $sqlDump .= "--\n-- Dumping data for table \"$name\"\n--\n\n";
            foreach ($rows as $row) {
                $columns = array_keys($row);
                $escapedColumns = array_map(function($col) { return "\"$col\""; }, $columns);
                
                $values = [];
                foreach ($row as $val) {
                    if ($val === null) {
                        $values[] = "NULL";
                    } else {
                        $values[] = $pdo->quote($val);
                    }
                }
                
                $sqlDump .= "INSERT INTO \"$name\" (" . implode(', ', $escapedColumns) . ") VALUES (" . implode(', ', $values) . ");\n";
            }
            $sqlDump .= "\n";
        }
    } catch (PDOException $e) {
        $sqlDump .= "-- Could not fetch data for table \"$name\": " . $e->getMessage() . "\n\n";
    }
}

// Restore foreign key constraints checks
$sqlDump .= "SET session_replication_role = 'origin';\n";

// Save dump to scratch/play11_backup.sql
$outputPath = __DIR__ . '/play11_backup.sql';
file_put_contents($outputPath, $sqlDump);

echo "✅ Success! PostgreSQL database exported successfully to:\n$outputPath\n";
