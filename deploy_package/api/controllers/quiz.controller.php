<?php
require_once dirname(__DIR__) . '/config/db.php';
require_once dirname(__DIR__) . '/controllers/auth.controller.php'; // For guidv4

class QuizController {
    private static function processQuizRow(&$row, $roomBanner = '', $homeBanner = '') {
        $now = time();
        $openAt = strtotime($row['open_at']);
        $closeAt = strtotime($row['close_at']);
        
        // Match JS: +1 minute tolerance or direct
        if ($openAt > $now) {
            $row['status_label'] = 'UPCOMING';
        } elseif ($closeAt < $now) {
            $row['status_label'] = 'CLOSED';
        } else {
            $row['status_label'] = 'LIVE';
        }
        
        // Typecast score/amounts
        if (isset($row['total_score'])) $row['total_score'] = (float)$row['total_score'];
        if (isset($row['prize_amount'])) $row['prize_amount'] = (int)$row['prize_amount'];
        if (isset($row['entry_amount'])) $row['entry_amount'] = (int)$row['entry_amount'];

        // Resolve effective banner url in PHP
        if (!empty($row['banner_url'])) {
            $row['effective_banner_url'] = $row['banner_url'];
        } else {
            $row['effective_banner_url'] = !empty($roomBanner) ? $roomBanner : $homeBanner;
        }
    }

    public static function getQuizzesByCategory($categoryId) {
        try {
            $settingsStmt = DB::query("SELECT key, value FROM settings WHERE key IN ('quiz_room_banner_url', 'home_banner_url')");
            $settings = [];
            foreach ($settingsStmt->fetchAll() as $s) {
                $settings[$s['key']] = $s['value'];
            }
            $roomBanner = $settings['quiz_room_banner_url'] ?? '';
            $homeBanner = $settings['home_banner_url'] ?? '';

            $stmt = DB::query("
                SELECT q.*
                FROM quizzes q 
                WHERE q.category_id = ? AND q.status = 'active'
            ", [$categoryId]);
            $quizzes = $stmt->fetchAll();

            foreach ($quizzes as &$quiz) {
                self::processQuizRow($quiz, $roomBanner, $homeBanner);
            }

            echo json_encode(['success' => true, 'quizzes' => $quizzes]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getQuizzesByZone($zoneId, $user) {
        try {
            $settingsStmt = DB::query("SELECT key, value FROM settings WHERE key IN ('quiz_room_banner_url', 'home_banner_url')");
            $settings = [];
            foreach ($settingsStmt->fetchAll() as $s) {
                $settings[$s['key']] = $s['value'];
            }
            $roomBanner = $settings['quiz_room_banner_url'] ?? '';
            $homeBanner = $settings['home_banner_url'] ?? '';

            $userId = $user ? $user['userId'] : null;
            
            $stmt = DB::query("
                SELECT q.*,
                CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END as is_submitted,
                s.submitted_at
                FROM quizzes q
                LEFT JOIN submissions s ON q.id = s.quiz_id AND s.user_id = ?
                WHERE q.zone_id = ? AND q.status = 'active'
                ORDER BY q.open_at ASC
            ", [$userId, $zoneId]);
            $quizzes = $stmt->fetchAll();

            foreach ($quizzes as &$quiz) {
                self::processQuizRow($quiz, $roomBanner, $homeBanner);
                $quiz['is_submitted'] = (bool)$quiz['is_submitted'];
            }

            echo json_encode(['success' => true, 'quizzes' => $quizzes]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getAllQuizzes($user) {
        try {
            $settingsStmt = DB::query("SELECT key, value FROM settings WHERE key IN ('quiz_room_banner_url', 'home_banner_url')");
            $settings = [];
            foreach ($settingsStmt->fetchAll() as $s) {
                $settings[$s['key']] = $s['value'];
            }
            $roomBanner = $settings['quiz_room_banner_url'] ?? '';
            $homeBanner = $settings['home_banner_url'] ?? '';

            $userId = $user ? $user['userId'] : null;

            $stmt = DB::query("
                SELECT q.*,
                CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END as is_submitted,
                s.submitted_at
                FROM quizzes q
                LEFT JOIN submissions s ON q.id = s.quiz_id AND s.user_id = ?
                WHERE q.status = 'active'
                ORDER BY q.open_at ASC
            ", [$userId]);
            $quizzes = $stmt->fetchAll();

            foreach ($quizzes as &$quiz) {
                self::processQuizRow($quiz, $roomBanner, $homeBanner);
                $quiz['is_submitted'] = (bool)$quiz['is_submitted'];
            }

            echo json_encode(['success' => true, 'quizzes' => $quizzes]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getJoinedQuizzes($user) {
        try {
            $settingsStmt = DB::query("SELECT key, value FROM settings WHERE key IN ('quiz_room_banner_url', 'home_banner_url')");
            $settings = [];
            foreach ($settingsStmt->fetchAll() as $s) {
                $settings[$s['key']] = $s['value'];
            }
            $roomBanner = $settings['quiz_room_banner_url'] ?? '';
            $homeBanner = $settings['home_banner_url'] ?? '';

            $userId = $user['userId'];
            $stmt = DB::query("
                SELECT q.*, 
                'CLOSED' as status_label, 
                1 as is_submitted, 
                s.total_score, 
                s.submitted_at
                FROM quizzes q
                JOIN submissions s ON q.id = s.quiz_id
                WHERE s.user_id = ?
                ORDER BY s.submitted_at DESC
            ", [$userId]);
            $quizzes = $stmt->fetchAll();

            foreach ($quizzes as &$quiz) {
                self::processQuizRow($quiz, $roomBanner, $homeBanner);
                $quiz['is_submitted'] = true;
            }

            echo json_encode(['success' => true, 'quizzes' => $quizzes]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getQuizById($id, $user) {
        try {
            $settingsStmt = DB::query("SELECT key, value FROM settings WHERE key IN ('quiz_room_banner_url', 'home_banner_url')");
            $settings = [];
            foreach ($settingsStmt->fetchAll() as $s) {
                $settings[$s['key']] = $s['value'];
            }
            $roomBanner = $settings['quiz_room_banner_url'] ?? '';
            $homeBanner = $settings['home_banner_url'] ?? '';

            $userId = $user ? $user['userId'] : null;

            $stmt = DB::query("
                SELECT q.*, u.name as winner_name,
                CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END as is_submitted,
                s.submitted_at
                FROM quizzes q 
                LEFT JOIN users u ON q.winner_id = u.id 
                LEFT JOIN submissions s ON q.id = s.quiz_id AND s.user_id = ?
                WHERE q.id = ?
            ", [$userId, $id]);
            $quiz = $stmt->fetch();

            if (!$quiz) {
                http_response_code(404);
                echo json_encode(['error' => 'Quiz not found']);
                return;
            }

            self::processQuizRow($quiz, $roomBanner, $homeBanner);
            $quiz['is_submitted'] = (bool)$quiz['is_submitted'];

            echo json_encode(['success' => true, 'quiz' => $quiz]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getQuizQuestions($id) {
        try {
            // Fetch questions
            $stmt = DB::query("
                SELECT q.id, q.quiz_id, q.question_text, q.hindi_question_text, q.marks
                FROM questions q
                WHERE q.quiz_id = ?
                ORDER BY q.sort_order ASC, q.id ASC
            ", [$id]);
            $questions = $stmt->fetchAll();

            if (!empty($questions)) {
                // Fetch all options in a single query
                $optStmt = DB::query("
                    SELECT qo.id, qo.question_id, qo.option_text as text, qo.hindi_option_text as hindiText, qo.option_value as value
                    FROM question_options qo
                    JOIN questions q ON qo.question_id = q.id
                    WHERE q.quiz_id = ?
                    ORDER BY qo.option_value ASC
                ", [$id]);
                $allOptions = $optStmt->fetchAll();

                // Group options by question_id
                $optionsByQuestion = [];
                foreach ($allOptions as $opt) {
                    $qId = $opt['question_id'];
                    unset($opt['question_id']);
                    $optionsByQuestion[$qId][] = $opt;
                }

                // Attach options to questions
                foreach ($questions as &$q) {
                    $q['options'] = isset($optionsByQuestion[$q['id']]) ? $optionsByQuestion[$q['id']] : [];
                }
            }

            echo json_encode(['success' => true, 'questions' => $questions]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function submitQuiz($id, $data, $user) {
        $answers = isset($data['answers']) ? $data['answers'] : [];
        $time_taken = isset($data['time_taken']) ? $data['time_taken'] : null;
        $userId = $user ? $user['userId'] : null;

        if (!$userId) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'User identification missing. Please refresh or login.']);
            return;
        }

        $pdo = DB::getPdo();
        
        try {
            $pdo->beginTransaction();

            // 1. Check if user already submitted this quiz
            $stmt = DB::query('SELECT id FROM submissions WHERE user_id = ? AND quiz_id = ?', [$userId, $id]);
            if ($stmt->fetch()) {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'You have already submitted this quiz.']);
                return;
            }

            // 2. Fetch the questions and their correct answers
            $stmt = DB::query("
                SELECT q.*, ca.answer_value 
                FROM questions q
                LEFT JOIN correct_answers ca ON q.id = ca.question_id
                WHERE q.quiz_id = ?
            ", [$id]);
            $questions = $stmt->fetchAll();

            // 3. Fetch Quiz details
            $stmt = DB::query('SELECT marks_per_q, negative_marks, open_at, close_at FROM quizzes WHERE id = ?', [$id]);
            $quiz = $stmt->fetch();

            if (!$quiz) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Quiz not found.']);
                return;
            }

            $now = time();
            if (strtotime($quiz['open_at']) > $now) {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'This quiz has not opened yet.']);
                return;
            }
            if (strtotime($quiz['close_at']) < $now) {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'This quiz has already closed.']);
                return;
            }

            $marksPerQ = $quiz['marks_per_q'] ?: 2;
            $negativeMarks = (float)($quiz['negative_marks'] ?: 0.5);

            $totalQuestions = count($questions);
            $correctCount = 0;
            $wrongCount = 0;

            foreach ($questions as $q) {
                $selectedValue = isset($answers[$q['id']]) ? $answers[$q['id']] : null;
                $correctValue = $q['answer_value'];

                if ($selectedValue !== null) {
                    $isCorrect = (string)$selectedValue === (string)$correctValue;
                    if ($isCorrect) {
                        $correctCount++;
                    } else {
                        $wrongCount++;
                    }
                }
            }

            $score = ($correctCount * $marksPerQ) - ($wrongCount * $negativeMarks);
            $subId = guidv4();

            // 4. Insert submission
            DB::query(
                'INSERT INTO submissions (id, user_id, quiz_id, status, total_score, correct_count, wrong_count, time_taken, submitted_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
                [$subId, $userId, $id, 'completed', $score, $correctCount, $wrongCount, $time_taken]
            );

            // 5. Insert answers using batch insert
            $ansPlaceholders = [];
            $ansParams = [];
            foreach ($questions as $q) {
                $selectedValue = isset($answers[$q['id']]) ? $answers[$q['id']] : null;
                if ($selectedValue !== null) {
                    $isCorrect = (string)$selectedValue === (string)$q['answer_value'];
                    $ansPlaceholders[] = '(?, ?, ?, ?, ?)';
                    array_push($ansParams, guidv4(), $subId, $q['id'], (string)$selectedValue, $isCorrect ? 1 : 0);
                }
            }
            if (!empty($ansPlaceholders)) {
                // Batch insert answers
                foreach(array_chunk($ansPlaceholders, 100) as $chunkIdx => $chunk) {
                    $chunkParams = array_slice($ansParams, $chunkIdx * 500, count($chunk) * 5);
                    DB::query('INSERT INTO submission_answers (id, submission_id, question_id, selected_value, is_correct) VALUES ' . implode(',', $chunk), $chunkParams);
                }
            }

            // 6. Calculate Rank
            $stmt = DB::query("
                SELECT COUNT(*) + 1 as rank
                FROM submissions
                WHERE quiz_id = ? AND total_score > ?
            ", [$id, $score]);
            $rankRow = $stmt->fetch();
            $rank = $rankRow ? $rankRow['rank'] : 1;

            $pdo->commit();

            echo json_encode([
                'success' => true, 
                'submission' => [
                    'id' => $subId,
                    'total_score' => $score,
                    'correct_count' => $correctCount,
                    'wrong_count' => $wrongCount,
                    'rank' => $rank
                ],
                'result' => [
                    'total' => $totalQuestions,
                    'correct' => $correctCount,
                    'wrong' => $wrongCount,
                    'score' => $score
                ]
            ]);

        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Submission Error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public static function getResults($quizId, $user) {
        $userId = $user ? $user['userId'] : null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Identification required']);
            return;
        }

        try {
            $stmt = DB::query("
                SELECT s.*, 
                (
                  SELECT COUNT(*) + 1
                  FROM submissions s2
                  WHERE s2.quiz_id = s.quiz_id 
                  AND s2.total_score > s.total_score
                ) as rank
                FROM submissions s 
                WHERE s.quiz_id = ? AND s.user_id = ? 
                ORDER BY s.submitted_at DESC LIMIT 1
            ", [$quizId, $userId]);
            $result = $stmt->fetch();

            if (!$result) {
                http_response_code(404);
                echo json_encode(['error' => 'No result found']);
                return;
            }

            // Fetch quiz details
            $quizStmt = DB::query("
                SELECT q.title, q.status, q.total_questions, u.name as winner_name
                FROM quizzes q
                LEFT JOIN users u ON q.winner_id = u.id
                WHERE q.id = ?
            ", [$quizId]);
            $quiz = $quizStmt->fetch();

            echo json_encode(['success' => true, 'result' => $result, 'quiz' => $quiz]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getLeaderboard($quizId, $user) {
        $userId = $user ? $user['userId'] : null;
        try {
            // Get Top 10
            // Note: Postgres left/split/etc. we can simplify guest name concatenation
            $stmt = DB::query("
                SELECT s.total_score, u.name, u.id as user_id
                FROM submissions s 
                LEFT JOIN users u ON s.user_id = u.id 
                WHERE s.quiz_id = ? 
                ORDER BY s.total_score DESC, s.submitted_at ASC LIMIT 10
            ", [$quizId]);
            $leaderboard = $stmt->fetchAll();

            foreach ($leaderboard as &$row) {
                if (empty($row['name'])) {
                    $row['name'] = 'Guest (' . substr($row['user_id'] ?? 'unknown', 0, 8) . ')';
                }
            }

            // Get Current User Rank
            $userRank = null;
            if ($userId) {
                $rankStmt = DB::query("
                    SELECT s.total_score,
                    (
                      SELECT COUNT(*) + 1
                      FROM submissions s2
                      WHERE s2.quiz_id = s.quiz_id 
                      AND s2.total_score > s.total_score
                    ) as rank
                    FROM submissions s 
                    WHERE s.quiz_id = ? AND s.user_id = ? 
                    ORDER BY s.submitted_at DESC LIMIT 1
                ", [$quizId, $userId]);
                $userRank = $rankStmt->fetch() ?: null;
            }

            echo json_encode(['success' => true, 'leaderboard' => $leaderboard, 'userRank' => $userRank]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getGlobalLeaderboard($user) {
        $userId = $user ? $user['userId'] : null;
        try {
            $stmt = DB::query("
                SELECT 
                  s.user_id,
                  u.name,
                  SUM(s.total_score) as total_score,
                  COUNT(s.id) as quizzes_played,
                  MAX(s.total_score) as best_score
                FROM submissions s
                LEFT JOIN users u ON s.user_id = u.id
                GROUP BY s.user_id, u.name
                ORDER BY total_score DESC, quizzes_played DESC
                LIMIT 50
            ");
            $leaderboard = $stmt->fetchAll();

            foreach ($leaderboard as &$row) {
                if (empty($row['name'])) {
                    $row['name'] = 'Guest (' . substr($row['user_id'] ?? 'unknown', 0, 8) . ')';
                }
                $row['total_score'] = (float)$row['total_score'];
                $row['quizzes_played'] = (int)$row['quizzes_played'];
                $row['best_score'] = (float)$row['best_score'];
            }

            $userRank = null;
            if ($userId) {
                // Get user global stats and rank
                // Database-agnostic ranked query wrapper
                $rankQuery = "
                    SELECT 
                      SUM(s.total_score) as total_score,
                      COUNT(s.id) as quizzes_played
                    FROM submissions s
                    WHERE s.user_id = ?
                ";
                $rankData = DB::query($rankQuery, [$userId])->fetch();

                if ($rankData && $rankData['quizzes_played'] > 0) {
                    $globalRankQuery = "
                        SELECT COUNT(*) + 1 as rank FROM (
                          SELECT user_id, SUM(total_score) as ts
                          FROM submissions GROUP BY user_id
                        ) ranked
                        WHERE ranked.ts > (
                          SELECT COALESCE(SUM(total_score), 0) FROM submissions WHERE user_id = ?
                        )
                    ";
                    $rankRow = DB::query($globalRankQuery, [$userId])->fetch();
                    $userRank = [
                        'total_score' => (float)$rankData['total_score'],
                        'quizzes_played' => (int)$rankData['quizzes_played'],
                        'rank' => $rankRow ? (int)$rankRow['rank'] : 1
                    ];
                }
            }

            echo json_encode(['success' => true, 'leaderboard' => $leaderboard, 'userRank' => $userRank]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
