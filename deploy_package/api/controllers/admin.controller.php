<?php
require_once dirname(__DIR__) . '/config/db.php';
require_once dirname(__DIR__) . '/config/jwt.php';
require_once dirname(__DIR__) . '/controllers/auth.controller.php'; // For guidv4

class AdminController {
    public static function login($data) {
        $identifier = isset($data['identifier']) ? trim($data['identifier']) : null;
        $password = isset($data['password']) ? $data['password'] : null;

        if (!$identifier || !$password) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username and password required']);
            return;
        }

        try {
            $stmt = DB::query("SELECT * FROM admins WHERE LOWER(username) = LOWER(?)", [$identifier]);
            $adminUser = $stmt->fetch();

            if ($adminUser && password_verify($password, $adminUser['password'])) {
                $token = jwt_encode([
                    'userId' => $adminUser['id'],
                    'role' => 'admin'
                ], ADMIN_JWT_SECRET, 86400); // 24 hours

                echo json_encode([
                    'success' => true,
                    'token' => $token,
                    'admin' => ['id' => $adminUser['id'], 'username' => $adminUser['username']]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public static function getDashboardStats() {
        try {
            $userCount = (int)DB::query("SELECT COUNT(*) FROM users")->fetchColumn();
            $quizCount = (int)DB::query("SELECT COUNT(*) FROM quizzes WHERE status = 'active'")->fetchColumn();
            $matchCount = (int)DB::query("SELECT COUNT(*) FROM matches WHERE status != 'completed'")->fetchColumn();
            $submissionCount = (int)DB::query("SELECT COUNT(*) FROM submissions")->fetchColumn();

            // Recent activity
            $recentStmt = DB::query("
                SELECT s.id, s.user_id, s.submitted_at, s.total_score,
                       u.name, u.mobile, u.status as user_status
                FROM submissions s 
                LEFT JOIN users u ON s.user_id = u.id 
                ORDER BY s.submitted_at DESC LIMIT 5
            ");
            $recentActivity = $recentStmt->fetchAll();

            foreach ($recentActivity as &$row) {
                if (empty($row['name'])) {
                    $row['name'] = 'Guest (' . substr($row['user_id'] ?? 'unknown', 0, 8) . ')';
                }
                if (empty($row['mobile'])) $row['mobile'] = 'GUEST';
                if (empty($row['user_status'])) $row['user_status'] = 'active';
                $row['total_score'] = (float)$row['total_score'];
            }

            echo json_encode([
                'success' => true,
                'stats' => [
                    'users' => $userCount,
                    'quizzes' => $quizCount,
                    'matches' => $matchCount,
                    'submissions' => $submissionCount
                ],
                'recentActivity' => $recentActivity
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getUsers($queryParams) {
        $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;
        $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 50;
        $offset = ($page - 1) * limit;

        try {
            $stmt = DB::query("SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?", [$limit, $offset]);
            $users = $stmt->fetchAll();

            foreach ($users as &$u) {
                $u['coins'] = (float)($u['coins'] ?? 0);
                $u['points'] = (int)($u['points'] ?? 0);
                $u['bonus'] = (float)($u['bonus'] ?? 0);
            }

            $total = (int)DB::query("SELECT COUNT(*) FROM users")->fetchColumn();

            echo json_encode([
                'success' => true,
                'users' => $users,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function toggleUserStatus($id, $data) {
        $status = isset($data['status']) ? trim($data['status']) : 'active';
        try {
            DB::query("UPDATE users SET status = ? WHERE id = ?", [$status, $id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function createQuiz($data) {
        $zone_id = $data['zone_id'] ?? '';
        $category_id = $data['category_id'] ?? '';
        $match_id = !empty($data['match_id']) ? $data['match_id'] : null;
        $title = $data['title'] ?? '';
        $hindiTitle = !empty($data['hindiTitle']) ? $data['hindiTitle'] : null;
        $description = $data['description'] ?? '';
        $hindiDescription = !empty($data['hindiDescription']) ? $data['hindiDescription'] : null;
        $total_questions = (int)($data['total_questions'] ?? 0);
        $timer_minutes = (int)($data['timer_minutes'] ?? 5);
        $entry_amount = (float)($data['entry_amount'] ?? 0);
        $prize_amount = (float)($data['prize_amount'] ?? 0);
        $open_at = !empty($data['open_at']) ? $data['open_at'] : null;
        $close_at = !empty($data['close_at']) ? $data['close_at'] : null;
        $marks_per_q = (int)($data['marks_per_q'] ?? 2);
        $banner_url = !empty($data['banner_url']) ? $data['banner_url'] : null;
        $questions = $data['questions'] ?? [];

        $quizId = guidv4();
        $pdo = DB::getPdo();

        try {
            $pdo->beginTransaction();

            // 1. Insert Quiz
            DB::query(
                "INSERT INTO quizzes (id, zone_id, category_id, match_id, title, hindi_title, description, hindi_description, total_questions, timer_minutes, entry_amount, prize_amount, open_at, close_at, status, marks_per_q, banner_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)",
                [$quizId, $zone_id, $category_id, $match_id, $title, $hindiTitle, $description, $hindiDescription, $total_questions, $timer_minutes, $entry_amount, $prize_amount, $open_at, $close_at, $marks_per_q, $banner_url]
            );

            // 2. Insert Questions & Options
            if (is_array($questions)) {
                foreach ($questions as $qIdx => $q) {
                    $qId = guidv4();
                    $qText = $q['text'] ?? '';
                    $qHindiText = $q['hindiText'] ?? null;
                    $qMarks = $marks_per_q;

                    DB::query(
                        "INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, marks, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                        [$qId, $quizId, $qText, $qHindiText, $qMarks, $qIdx]
                    );

                    // Options
                    if (isset($q['options']) && is_array($q['options'])) {
                        foreach ($q['options'] as $oIdx => $opt) {
                            $optId = guidv4();
                            $text = is_array($opt) ? ($opt['text'] ?? '') : $opt;
                            $hindiText = is_array($opt) ? ($opt['hindiText'] ?? null) : null;
                            DB::query(
                                "INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value) VALUES (?, ?, ?, ?, ?)",
                                [$optId, $qId, $text, $hindiText, (string)$oIdx]
                            );
                        }
                    }

                    // Correct Answer
                    $correctOptionIndex = (string)($q['correctOptionIndex'] ?? '0');
                    DB::query(
                        "INSERT INTO correct_answers (id, question_id, answer_value) VALUES (?, ?, ?)",
                        [guidv4(), $qId, $correctOptionIndex]
                    );
                }
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'id' => $quizId]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Quiz creation error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getQuizzesWithStats() {
        try {
            $stmt = DB::query("
                SELECT q.*, u.name as winner_name, COUNT(s.id) as participants_count
                FROM quizzes q 
                LEFT JOIN submissions s ON q.id = s.quiz_id
                LEFT JOIN users u ON q.winner_id = u.id
                GROUP BY q.id, u.name
                ORDER BY q.open_at DESC
            ");
            $quizzes = $stmt->fetchAll();

            foreach ($quizzes as &$quiz) {
                if (isset($quiz['entry_amount'])) $quiz['entry_amount'] = (int)$quiz['entry_amount'];
                if (isset($quiz['prize_amount'])) $quiz['prize_amount'] = (int)$quiz['prize_amount'];
                if (isset($quiz['participants_count'])) $quiz['participants_count'] = (int)$quiz['participants_count'];
                if (isset($quiz['total_questions'])) $quiz['total_questions'] = (int)$quiz['total_questions'];
                if (isset($quiz['timer_minutes'])) $quiz['timer_minutes'] = (int)$quiz['timer_minutes'];
                if (isset($quiz['marks_per_q'])) $quiz['marks_per_q'] = (int)$quiz['marks_per_q'];
            }

            echo json_encode(['success' => true, 'quizzes' => $quizzes]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getQuizParticipants($id) {
        try {
            $stmt = DB::query("
                SELECT s.*, q.total_questions,
                       u.name, u.mobile, u.status as user_status
                FROM submissions s
                LEFT JOIN users u ON s.user_id = u.id
                JOIN quizzes q ON s.quiz_id = q.id
                WHERE s.quiz_id = ?
                ORDER BY s.total_score DESC, s.submitted_at ASC
            ", [$id]);
            $participants = $stmt->fetchAll();

            foreach ($participants as &$p) {
                if (empty($p['name'])) {
                    $p['name'] = 'Guest (' . substr($p['user_id'] ?? 'unknown', 0, 8) . ')';
                }
                if (empty($p['mobile'])) $p['mobile'] = 'GUEST';
                if (empty($p['user_status'])) $p['user_status'] = 'active';
                $p['total_score'] = (float)$p['total_score'];
                $p['won_amount'] = (float)($p['won_amount'] ?? 0);
            }

            echo json_encode(['success' => true, 'participants' => $participants]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function declareWinner($id, $data) {
        $winner_id = $data['winner_id'] ?? null;
        if (!$winner_id) {
            http_response_code(400);
            echo json_encode(['error' => 'Winner user ID required']);
            return;
        }

        try {
            $stmt = DB::query("SELECT id FROM submissions WHERE quiz_id = ? AND user_id = ?", [$id, $winner_id]);
            if (!$stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'This user did not participate in the quiz and cannot be declared winner.']);
                return;
            }

            $pdo = DB::getPdo();
            $pdo->beginTransaction();

            $quiz = DB::query("SELECT title, prize_amount FROM quizzes WHERE id = ?", [$id])->fetch();
            $prizeAmount = $quiz ? (float)$quiz['prize_amount'] : 0;

            DB::query("UPDATE quizzes SET winner_id = ?, status = 'completed' WHERE id = ?", [$winner_id, $id]);

            if ($prizeAmount > 0) {
                DB::query("UPDATE users SET coins = coins + ? WHERE id = ?", [$prizeAmount, $winner_id]);
                DB::query("UPDATE submissions SET won_amount = ? WHERE quiz_id = ? AND user_id = ?", [$prizeAmount, $id, $winner_id]);

                $txId = 'tx-' . substr(guidv4(), 0, 8);
                DB::query(
                    'INSERT INTO transactions (id, user_id, title, amount, type, category, status, reference_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [$txId, $winner_id, 'Quiz Won: ' . ($quiz['title'] ?? 'Contest'), $prizeAmount, 'credit', 'win', 'success', $id]
                );
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => "Winner declared and reward of ₹{$prizeAmount} added to user wallet."]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function updateMatch($id, $data) {
        $sport_type = $data['sport_type'] ?? null;
        $team_a = $data['team_a'] ?? null;
        $team_b = $data['team_b'] ?? null;
        $team_a_logo = $data['team_a_logo'] ?? null;
        $team_b_logo = $data['team_b_logo'] ?? null;
        $start_time = $data['start_time'] ?? null;
        $venue = $data['venue'] ?? null;
        $hindi_team_a = $data['hindi_team_a'] ?? null;
        $hindi_team_b = $data['hindi_team_b'] ?? null;
        $hindi_venue = $data['hindi_venue'] ?? null;
        $status = $data['status'] ?? null;
        $score_a = isset($data['score_a']) ? (int)$data['score_a'] : null;
        $score_b = isset($data['score_b']) ? (int)$data['score_b'] : null;

        try {
            DB::query("
                UPDATE matches SET 
                  sport_type = COALESCE(?, sport_type),
                  team_a = COALESCE(?, team_a),
                  team_b = COALESCE(?, team_b),
                  team_a_logo = COALESCE(?, team_a_logo),
                  team_b_logo = COALESCE(?, team_b_logo),
                  start_time = COALESCE(?, start_time),
                  venue = COALESCE(?, venue),
                  hindi_team_a = COALESCE(?, hindi_team_a),
                  hindi_team_b = COALESCE(?, hindi_team_b),
                  hindi_venue = COALESCE(?, hindi_venue),
                  status = COALESCE(?, status),
                  score_a = COALESCE(?, score_a),
                  score_b = COALESCE(?, score_b)
                WHERE id = ?
            ", [$sport_type, $team_a, $team_b, $team_a_logo, $team_b_logo, $start_time, $venue, $hindi_team_a, $hindi_team_b, $hindi_venue, $status, $score_a, $score_b, $id]);
            
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function addMatch($data) {
        $id = guidv4();
        $sport_type = $data['sport_type'] ?? '';
        $team_a = $data['team_a'] ?? '';
        $team_b = $data['team_b'] ?? '';
        $team_a_logo = $data['team_a_logo'] ?? null;
        $team_b_logo = $data['team_b_logo'] ?? null;
        $start_time = $data['start_time'] ?? null;
        $venue = $data['venue'] ?? null;
        $hindi_team_a = $data['hindi_team_a'] ?? null;
        $hindi_team_b = $data['hindi_team_b'] ?? null;
        $hindi_venue = $data['hindi_venue'] ?? null;

        try {
            DB::query(
                "INSERT INTO matches (id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, hindi_team_a, hindi_team_b, hindi_venue, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'upcoming')",
                [$id, $sport_type, $team_a, $team_b, $team_a_logo, $team_b_logo, $start_time, $venue, $hindi_team_a, $hindi_team_b, $hindi_venue]
            );
            echo json_encode(['success' => true, 'id' => $id]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function deleteQuiz($id) {
        try {
            DB::query("DELETE FROM quizzes WHERE id = ?", [$id]);
            echo json_encode(['success' => true, 'message' => 'Quiz and all related data deleted successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function deleteMatch($id) {
        try {
            DB::query("DELETE FROM matches WHERE id = ?", [$id]);
            echo json_encode(['success' => true, 'message' => 'Match deleted successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getAdminQuizQuestions($id) {
        try {
            $stmt = DB::query("
                SELECT q.id, q.quiz_id, q.question_text, q.hindi_question_text, q.marks
                FROM questions q
                WHERE q.quiz_id = ?
                ORDER BY q.sort_order ASC, q.id ASC
            ", [$id]);
            $questions = $stmt->fetchAll();

            foreach ($questions as &$q) {
                // Fetch options
                $optStmt = DB::query("
                    SELECT qo.id, qo.option_text as text, qo.hindi_option_text as hindiText, qo.option_value as value
                    FROM question_options qo
                    WHERE qo.question_id = ?
                    ORDER BY qo.option_value ASC
                ", [$q['id']]);
                $q['options'] = $optStmt->fetchAll();

                // Fetch correct option index
                $correct = DB::query("SELECT answer_value FROM correct_answers WHERE question_id = ? LIMIT 1", [$q['id']])->fetchColumn();
                $q['correct_answer'] = $correct ?: '0';
            }

            echo json_encode(['success' => true, 'questions' => $questions]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function updateQuiz($id, $data) {
        $zone_id = $data['zone_id'] ?? '';
        $category_id = $data['category_id'] ?? '';
        $match_id = !empty($data['match_id']) ? $data['match_id'] : null;
        $title = $data['title'] ?? '';
        $hindiTitle = !empty($data['hindiTitle']) ? $data['hindiTitle'] : null;
        $description = $data['description'] ?? '';
        $hindiDescription = !empty($data['hindiDescription']) ? $data['hindiDescription'] : null;
        $total_questions = (int)($data['total_questions'] ?? 0);
        $timer_minutes = (int)($data['timer_minutes'] ?? 5);
        $entry_amount = (float)($data['entry_amount'] ?? 0);
        $prize_amount = (float)($data['prize_amount'] ?? 0);
        $open_at = !empty($data['open_at']) ? $data['open_at'] : null;
        $close_at = !empty($data['close_at']) ? $data['close_at'] : null;
        $marks_per_q = (int)($data['marks_per_q'] ?? 2);
        $banner_url = !empty($data['banner_url']) ? $data['banner_url'] : null;
        $questions = $data['questions'] ?? [];

        $pdo = DB::getPdo();

        try {
            $pdo->beginTransaction();

            // 1. Reset all previous submissions
            DB::query('DELETE FROM submissions WHERE quiz_id = ?', [$id]);

            // 2. Update Quiz
            DB::query(
                `UPDATE quizzes SET 
                  zone_id = ?, category_id = ?, match_id = ?, title = ?, hindi_title = ?, 
                  description = ?, hindi_description = ?, total_questions = ?, timer_minutes = ?, 
                  entry_amount = ?, prize_amount = ?, open_at = ?, close_at = ?, marks_per_q = ?, banner_url = ?,
                  status = 'active', winner_id = NULL
                WHERE id = ?`,
                [$zone_id, $category_id, $match_id, $title, $hindiTitle, $description, $hindiDescription, $total_questions, $timer_minutes, $entry_amount, $prize_amount, $open_at, $close_at, $marks_per_q, $banner_url, $id]
            );

            if (is_array($questions)) {
                // 3. Delete existing questions
                DB::query("DELETE FROM questions WHERE quiz_id = ?", [$id]);

                // 4. Re-insert questions/options
                foreach ($questions as $qIdx => $q) {
                    $qId = guidv4();
                    $qText = $q['text'] ?? '';
                    $qHindiText = $q['hindiText'] ?? null;

                    DB::query(
                        "INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, marks, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                        [$qId, $id, $qText, $qHindiText, $marks_per_q, $qIdx]
                    );

                    if (isset($q['options']) && is_array($q['options'])) {
                        foreach ($q['options'] as $oIdx => $opt) {
                            $optId = guidv4();
                            $text = is_array($opt) ? ($opt['text'] ?? '') : $opt;
                            $hindiText = is_array($opt) ? ($opt['hindiText'] ?? null) : null;
                            DB::query(
                                "INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value) VALUES (?, ?, ?, ?, ?)",
                                [$optId, $qId, $text, $hindiText, (string)$oIdx]
                            );
                        }
                    }

                    $correctOptionIndex = (string)($q['correctOptionIndex'] ?? '0');
                    DB::query(
                        "INSERT INTO correct_answers (id, question_id, answer_value) VALUES (?, ?, ?)",
                        [guidv4(), $qId, $correctOptionIndex]
                    );
                }
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Quiz updated successfully']);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getSubmissionReviewAdmin($id) {
        try {
            $stmt = DB::query("SELECT s.*, q.title FROM submissions s JOIN quizzes q ON s.quiz_id = q.id WHERE s.id = ?", [$id]);
            $submission = $stmt->fetch();

            if (!$submission) {
                http_response_code(404);
                echo json_encode(['error' => 'Submission not found']);
                return;
            }

            $quizId = $submission['quiz_id'];

            // Fetch answers
            $questionsStmt = DB::query("
                SELECT q.id as question_id, q.question_text, q.hindi_question_text,
                       sa.selected_value, sa.is_correct,
                       ca.answer_value as correct_value
                FROM questions q
                LEFT JOIN submission_answers sa ON q.id = sa.question_id AND sa.submission_id = ?
                LEFT JOIN correct_answers ca ON q.id = ca.question_id
                WHERE q.quiz_id = ?
                ORDER BY q.sort_order ASC, q.id ASC
            ", [$id, $quizId]);
            $answers = $questionsStmt->fetchAll();

            foreach ($answers as &$ans) {
                $optStmt = DB::query("
                    SELECT option_text as text, option_value as value 
                    FROM question_options 
                    WHERE question_id = ?
                ", [$ans['question_id']]);
                $ans['options'] = $optStmt->fetchAll();
                $ans['is_correct'] = (bool)$ans['is_correct'];
            }

            echo json_encode(['success' => true, 'submission' => $submission, 'answers' => $answers]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getPendingTransactions() {
        try {
            // Safe query that runs on pgsql/sqlite
            $stmt = DB::query("
                SELECT t.*, u.name, u.mobile
                FROM transactions t
                LEFT JOIN users u ON t.user_id = u.id
                WHERE t.status = 'pending'
                ORDER BY t.created_at DESC
            ");
            $transactions = $stmt->fetchAll();

            foreach ($transactions as &$tx) {
                if (empty($tx['name'])) $tx['name'] = 'Admin/Guest';
                if (empty($tx['mobile'])) $tx['mobile'] = 'N/A';
                $tx['amount'] = (float)$tx['amount'];
                
                // Get last won quiz title safely
                $quizTitleStmt = DB::query("
                    SELECT q.title 
                    FROM transactions t2 
                    JOIN quizzes q ON t2.reference_id = q.id
                    WHERE t2.user_id = ? AND t2.category = 'win'
                    ORDER BY t2.created_at DESC LIMIT 1
                ", [$tx['user_id']]);
                $tx['last_won_quiz'] = $quizTitleStmt->fetchColumn() ?: null;
            }

            echo json_encode(['success' => true, 'transactions' => $transactions]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function approveTransaction($id) {
        $pdo = DB::getPdo();
        try {
            $pdo->beginTransaction();

            $stmt = DB::query("SELECT * FROM transactions WHERE id = ? AND status = 'pending'", [$id]);
            $tx = $stmt->fetch();

            if (!$tx) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['error' => 'Pending transaction not found']);
                return;
            }

            $txAmount = (float)$tx['amount'];

            if ($tx['category'] === 'deposit') {
                DB::query("UPDATE users SET coins = coins + ? WHERE id = ?", [$txAmount, $tx['user_id']]);

                // Check first successful deposit
                $prevDepositsCount = (int)DB::query(
                    "SELECT COUNT(*) FROM transactions WHERE user_id = ? AND category = 'deposit' AND status = 'success'",
                    [$tx['user_id']]
                )->fetchColumn();

                if ($prevDepositsCount === 0) {
                    $bonusSetting = DB::query("SELECT value FROM settings WHERE key = 'first_deposit_bonus'")->fetch();
                    $bonusAmount = $bonusSetting ? (float)$bonusSetting['value'] : 0;
                    if ($bonusAmount > 0) {
                        DB::query("UPDATE users SET bonus = bonus + ? WHERE id = ?", [$bonusAmount, $tx['user_id']]);
                        DB::query(
                            "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, ?, ?, 'success')",
                            [guidv4(), $tx['user_id'], 'First Deposit Bonus', $bonusAmount, 'credit', 'bonus']
                        );
                    }
                }
            }

            DB::query("UPDATE transactions SET status = 'success' WHERE id = ?", [$id]);

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Transaction approved successfully']);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function rejectTransaction($id) {
        $pdo = DB::getPdo();
        try {
            $pdo->beginTransaction();

            $stmt = DB::query("SELECT * FROM transactions WHERE id = ? AND status = 'pending'", [$id]);
            $tx = $stmt->fetch();

            if (!$tx) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['error' => 'Pending transaction not found']);
                return;
            }

            $txAmount = (float)$tx['amount'];

            // Refund withdrawal
            if ($tx['category'] === 'withdraw') {
                // Deduct negative amount -> adds coins back
                DB::query("UPDATE users SET coins = coins - ? WHERE id = ?", [$txAmount, $tx['user_id']]);
            }

            DB::query("UPDATE transactions SET status = 'failed' WHERE id = ?", [$id]);

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Transaction rejected and funds refunded (if applicable)']);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function getVouchersAdmin() {
        try {
            $stmt = DB::query('SELECT * FROM vouchers ORDER BY status ASC, title ASC');
            $vouchers = $stmt->fetchAll();
            echo json_encode(['success' => true, 'vouchers' => $vouchers]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function createVoucherAdmin($data) {
        $id = guidv4();
        $title = $data['title'] ?? '';
        $code = $data['code'] ?? '';
        $discount_text = $data['discount_text'] ?? '';
        $amount = (float)($data['amount'] ?? 0);
        $type = $data['type'] ?? '';
        $color = $data['color'] ?? '#7c3aed';
        $expiry_days = (int)($data['expiry_days'] ?? 30);
        $expires_at = $data['expires_at'] ?? null;

        try {
            DB::query(
                "INSERT INTO vouchers (id, title, code, discount_text, amount, type, color, expiry_days, status, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)",
                [$id, $title, $code, $discount_text, $amount, $type, $color, $expiry_days, $expires_at]
            );
            echo json_encode(['success' => true, 'id' => $id]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function deleteVoucherAdmin($id) {
        try {
            DB::query("DELETE FROM vouchers WHERE id = ?", [$id]);
            echo json_encode(['success' => true, 'message' => 'Voucher deleted successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function toggleVoucherStatusAdmin($id, $data) {
        $status = $data['status'] ?? 'active';
        try {
            DB::query("UPDATE vouchers SET status = ? WHERE id = ?", [$status, $id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
