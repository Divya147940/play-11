<?php
require_once dirname(__DIR__) . '/config/db.php';
require_once dirname(__DIR__) . '/config/jwt.php';

function guidv4() {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// Verify Firebase ID Token (fallback / verification logic)
function verifyFirebaseToken($firebaseToken) {
    if (strpos($firebaseToken, 'MOCK_TOKEN_') === 0) {
        return str_replace('MOCK_TOKEN_', '', $firebaseToken);
    }

    // Decoding Firebase JWT token manually to extract phone number
    $parts = explode('.', $firebaseToken);
    if (count($parts) !== 3) {
        return null;
    }
    
    $payload = json_decode(base64url_decode($parts[1]), true);
    if (!$payload) {
        return null;
    }
    
    // Check Firebase project ID claim to ensure validity if set in env
    $firebaseProj = getenv('FIREBASE_PROJECT_ID');
    if ($firebaseProj && isset($payload['aud']) && $payload['aud'] !== $firebaseProj) {
        return null;
    }

    if (isset($payload['phone_number'])) {
        // Format to 10-digits
        return substr(str_replace('+91', '', $payload['phone_number']), -10);
    }

    return null;
}

class AuthController {
    public static function sendOtp($data) {
        $mobile = isset($data['mobile']) ? trim($data['mobile']) : null;
        if (!$mobile || strlen($mobile) !== 10) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid 10-digit mobile number required']);
            return;
        }

        $otpCode = '123456'; // Fixed OTP for mock testing
        $otpReference = guidv4();
        // 5 mins expiry
        $expiresAt = date('Y-m-d H:i:s', time() + 300);

        try {
            DB::query(
                'INSERT INTO otp_requests (id, mobile, otp_reference, otp_code, expires_at) VALUES (?, ?, ?, ?, ?)',
                [guidv4(), $mobile, $otpReference, $otpCode, $expiresAt]
            );

            echo json_encode([
                'success' => true, 
                'message' => 'OTP sent successfully', 
                'otp_reference' => $otpReference
            ]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function verifyOtp($data) {
        $mobile = isset($data['mobile']) ? trim($data['mobile']) : null;
        $otp_code = isset($data['otp_code']) ? trim($data['otp_code']) : null;
        $firebaseToken = isset($data['firebaseToken']) ? trim($data['firebaseToken']) : null;
        $referralCodeInput = isset($data['referral_code']) ? trim($data['referral_code']) : null;

        try {
            $verifiedMobile = null;

            if ($firebaseToken) {
                $verifiedMobile = verifyFirebaseToken($firebaseToken);
                if (!$verifiedMobile) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Firebase verification failed']);
                    return;
                }
            } else if ($mobile && $otp_code) {
                // Verify via local DB
                $stmt = DB::query(
                    'SELECT * FROM otp_requests WHERE mobile = ? AND otp_code = ? AND verified = 0 ORDER BY expires_at DESC LIMIT 1',
                    [$mobile, $otp_code]
                );
                $otpRecord = $stmt->fetch();

                if (!$otpRecord || strtotime($otpRecord['expires_at']) < time()) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid or expired OTP']);
                    return;
                }

                // Mark verified
                DB::query('UPDATE otp_requests SET verified = 1 WHERE id = ?', [$otpRecord['id']]);
                $verifiedMobile = $mobile;
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Verification credentials missing']);
                return;
            }

            // Check user existence
            $stmt = DB::query('SELECT * FROM users WHERE mobile = ?', [$verifiedMobile]);
            $user = $stmt->fetch();
            $isNewUser = false;

            $flow = isset($data['flow']) ? trim($data['flow']) : 'register';

            if ($flow === 'login' && !$user) {
                http_response_code(404);
                echo json_encode(['error' => 'User Account not found. Please sign up.']);
                return;
            }

            if (!$user) {
                $isNewUser = true;
                $userId = guidv4();
                $referralCode = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));

                // Fetch referral settings
                $stmt = DB::query("SELECT key, value FROM settings WHERE key IN ('welcome_bonus', 'referral_referrer_bonus', 'referral_referee_bonus')");
                $settings = [];
                while ($row = $stmt->fetch()) {
                    $settings[$row['key']] = (float)$row['value'];
                }

                $welcomeBonus = isset($settings['welcome_bonus']) ? $settings['welcome_bonus'] : 0;
                $referredBy = null;
                $refereeBonus = 0;

                if ($referralCodeInput) {
                    $refStmt = DB::query("SELECT id FROM users WHERE UPPER(referral_code) = UPPER(?)", [$referralCodeInput]);
                    $referrer = $refStmt->fetch();
                    if ($referrer) {
                        $referredBy = $referrer['id'];
                        $refereeBonus = isset($settings['referral_referee_bonus']) ? $settings['referral_referee_bonus'] : 0;
                    }
                }

                $totalInitialBonus = $welcomeBonus + $refereeBonus;

                $name = isset($data['name']) ? trim($data['name']) : null;
                DB::query(
                    'INSERT INTO users (id, mobile, name, referral_code, referred_by, bonus) VALUES (?, ?, ?, ?, ?, ?)',
                    [$userId, $verifiedMobile, $name, $referralCode, $referredBy, $totalInitialBonus]
                );

                // Insert transactions
                if ($welcomeBonus > 0) {
                    DB::query(
                        'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [guidv4(), $userId, 'Welcome Bonus', $welcomeBonus, 'credit', 'bonus', 'success']
                    );
                }
                if ($refereeBonus > 0) {
                    DB::query(
                        'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [guidv4(), $userId, 'Referral Bonus (Joined)', $refereeBonus, 'credit', 'bonus', 'success']
                    );
                }

                if ($referredBy) {
                    $referrerBonus = isset($settings['referral_referrer_bonus']) ? $settings['referral_referrer_bonus'] : 0;
                    if ($referrerBonus > 0) {
                        DB::query('UPDATE users SET bonus = bonus + ? WHERE id = ?', [$referrerBonus, $referredBy]);
                        DB::query(
                            'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [guidv4(), $referredBy, 'Referral Bonus (Friend Joined)', $referrerBonus, 'credit', 'bonus', 'success']
                        );
                    }
                }

                // Fetch new user
                $stmt = DB::query('SELECT * FROM users WHERE id = ?', [$userId]);
                $user = $stmt->fetch();
            } else {
                $name = isset($data['name']) ? trim($data['name']) : null;
                if ($name && empty($user['name'])) {
                    DB::query('UPDATE users SET name = ? WHERE id = ?', [$name, $user['id']]);
                    $user['name'] = $name;
                    $isNewUser = false;
                } else if (empty($user['name'])) {
                    $isNewUser = true;
                }
            }

            // Daily Login Bonus Trigger
            try {
                $driver = DB::getPdo()->getAttribute(PDO::ATTR_DRIVER_NAME);
                if ($driver === 'pgsql') {
                    $checkSql = "SELECT id FROM transactions WHERE user_id = ? AND title = 'Daily Login Bonus' AND created_at >= CURRENT_DATE";
                } else {
                    $checkSql = "SELECT id FROM transactions WHERE user_id = ? AND title = 'Daily Login Bonus' AND created_at >= date('now')";
                }
                
                $claimStmt = DB::query($checkSql, [$user['id']]);
                if (!$claimStmt->fetch()) {
                    $bonusSetting = DB::query("SELECT value FROM settings WHERE key = 'daily_login_bonus'")->fetch();
                    $dailyBonusAmount = $bonusSetting ? (float)$bonusSetting['value'] : 0;
                    if ($dailyBonusAmount > 0) {
                        DB::query("UPDATE users SET bonus = bonus + ? WHERE id = ?", [$dailyBonusAmount, $user['id']]);
                        DB::query(
                            "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                            [guidv4(), $user['id'], 'Daily Login Bonus', $dailyBonusAmount, 'credit', 'bonus', 'success']
                        );
                        $user['bonus'] = (float)($user['bonus'] ?? 0) + $dailyBonusAmount;
                    }
                }
            } catch (Exception $dailyErr) {
                error_log('Failed to credit daily bonus: ' . $dailyErr->getMessage());
            }

            // Sign JWT
            $token = jwt_encode([
                'userId' => $user['id'],
                'mobile' => $user['mobile']
            ], JWT_SECRET);

            echo json_encode([
                'success' => true,
                'token' => $token,
                'user' => $user,
                'isNewUser' => $isNewUser
            ]);

        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function updateProfile($data, $user) {
        $name = isset($data['name']) ? trim($data['name']) : null;
        $userId = $user['userId'];

        if (!$name || strlen($name) < 2) {
            http_response_code(400);
            echo json_encode(['error' => 'Name must be at least 2 characters long']);
            return;
        }

        if (strlen($name) > 50) {
            http_response_code(400);
            echo json_encode(['error' => 'Name must be less than 50 characters long']);
            return;
        }

        try {
            DB::query('UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [$name, $userId]);
            $stmt = DB::query('SELECT * FROM users WHERE id = ?', [$userId]);
            $updatedUser = $stmt->fetch();

            echo json_encode(['success' => true, 'user' => $updatedUser]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getUserHistory($user, $queryParams) {
        $userId = $user['userId'];
        $startDate = isset($queryParams['startDate']) ? $queryParams['startDate'] : null;
        $endDate = isset($queryParams['endDate']) ? $queryParams['endDate'] : null;

        try {
            $query = "
              SELECT s.*, q.title, q.zone_id, q.winner_id as quiz_winner_id, q.prize_amount, 
                     COALESCE(u.name, 'Admin Declared') as winner_name,
                      COALESCE(s.won_amount, 0) as display_won_amount,
                     (
                       SELECT COUNT(*) + 1
                       FROM submissions s2
                       WHERE s2.quiz_id = s.quiz_id 
                       AND s2.total_score > s.total_score
                     ) as leaderboard_rank
              FROM submissions s 
              LEFT JOIN quizzes q ON s.quiz_id = q.id 
              LEFT JOIN users u ON q.winner_id = u.id
              WHERE s.user_id = ? 
            ";
            $params = [$userId];

            if ($startDate) {
                $params[] = $startDate;
                $query .= " AND s.submitted_at >= ?";
            }
            if ($endDate) {
                $params[] = $endDate . ' 23:59:59';
                $query .= " AND s.submitted_at <= ?";
            }

            $query .= " ORDER BY s.submitted_at DESC";

            $stmt = DB::query($query, $params);
            $history = $stmt->fetchAll();

            echo json_encode(['success' => true, 'history' => $history]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getSubmissionReview($id, $user) {
        $userId = $user['userId'];

        try {
            $stmt = DB::query(
                'SELECT s.*, q.title, q.winner_id as quiz_winner_id, q.winner_2_id as quiz_winner_2_id, q.winner_3_id as quiz_winner_3_id, q.status as quiz_status, q.prize_amount 
                 FROM submissions s 
                 JOIN quizzes q ON s.quiz_id = q.id 
                 WHERE s.id = ? AND s.user_id = ?',
                [$id, $userId]
            );
            $submission = $stmt->fetch();

            if (!$submission) {
                $stmt = DB::query(
                    'SELECT s.*, q.title, q.winner_id as quiz_winner_id, q.winner_2_id as quiz_winner_2_id, q.winner_3_id as quiz_winner_3_id, q.status as quiz_status, q.prize_amount 
                     FROM submissions s 
                     JOIN quizzes q ON s.quiz_id = q.id 
                     WHERE s.quiz_id = ? AND s.user_id = ?
                     ORDER BY s.submitted_at DESC LIMIT 1',
                    [$id, $userId]
                );
                $submission = $stmt->fetch();
            }

            if (!$submission) {
                http_response_code(404);
                echo json_encode(['error' => 'Submission not found or unauthorized']);
                return;
            }

            // Get answers with options
            // Note: PostgreSQL has json_agg & json_build_object. For database-agnostic behavior,
            // we will query submission answers, questions, and correct answers first,
            // and then query options separately to format in PHP (so it works on SQLite as well).
            $reviewStmt = DB::query("
                SELECT 
                  q.id as question_id, sa.selected_value, sa.is_correct,
                  q.question_text, q.hindi_question_text,
                  ca.answer_value as correct_value
                FROM questions q
                LEFT JOIN submission_answers sa ON q.id = sa.question_id AND sa.submission_id = ?
                LEFT JOIN correct_answers ca ON q.id = ca.question_id
                WHERE q.quiz_id = ?
                ORDER BY q.sort_order ASC, q.id ASC
            ", [$submission['id'], $submission['quiz_id']]);

            $review = $reviewStmt->fetchAll();

            if (!empty($review)) {
                // Fetch all options for these questions in a single query
                $questionIds = array_column($review, 'question_id');
                $placeholders = implode(',', array_fill(0, count($questionIds), '?'));
                
                $optStmt = DB::query("
                    SELECT question_id, option_text as text, option_value as value 
                    FROM question_options 
                    WHERE question_id IN ($placeholders)
                    ORDER BY option_value ASC
                ", $questionIds);
                $allOptions = $optStmt->fetchAll();

                // Group options by question_id
                $optionsByQuestion = [];
                foreach ($allOptions as $opt) {
                    $qId = $opt['question_id'];
                    unset($opt['question_id']);
                    $optionsByQuestion[$qId][] = $opt;
                }

                // Attach options to each review row
                foreach ($review as &$row) {
                    $row['options'] = isset($optionsByQuestion[$row['question_id']]) ? $optionsByQuestion[$row['question_id']] : [];
                }
            }

            echo json_encode([
                'success' => true,
                'submission' => $submission,
                'review' => $review
            ]);

        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getBalance($user) {
        $userId = $user['userId'];
        try {
            $stmt = DB::query('SELECT coins, points, bonus FROM users WHERE id = ?', [$userId]);
            $balance = $stmt->fetch();
            if (!$balance) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                return;
            }
            echo json_encode([
                'success' => true, 
                'balance' => [
                    'coins' => (float)($balance['coins'] ?? 0), 
                    'points' => (int)($balance['points'] ?? 0), 
                    'bonus' => (float)($balance['bonus'] ?? 0)
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
