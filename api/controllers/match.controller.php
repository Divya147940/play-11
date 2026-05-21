<?php
require_once dirname(__DIR__) . '/config/db.php';

class MatchController {
    public static function getAllMatches() {
        try {
            $stmt = DB::query("
                SELECT m.*, 
                       q.entry_amount, 
                       q.reward_text,
                       (SELECT COUNT(*) FROM submissions s WHERE s.quiz_id = q.id) as players_count
                FROM matches m
                LEFT JOIN quizzes q ON m.id = q.match_id AND q.status = 'active'
                ORDER BY m.start_time ASC
            ");
            $matches = $stmt->fetchAll();

            foreach ($matches as &$match) {
                if (isset($match['entry_amount'])) $match['entry_amount'] = (int)$match['entry_amount'];
                if (isset($match['players_count'])) $match['players_count'] = (int)$match['players_count'];
                if (isset($match['score_a'])) $match['score_a'] = (int)$match['score_a'];
                if (isset($match['score_b'])) $match['score_b'] = (int)$match['score_b'];
            }

            header('Cache-Control: public, max-age=10, s-maxage=10');
            echo json_encode(['success' => true, 'matches' => $matches]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getMatchQuizzes($id) {
        try {
            // Find quiz
            $stmt = DB::query("SELECT * FROM quizzes WHERE match_id = ? AND status = 'active' LIMIT 1", [$id]);
            $quiz = $stmt->fetch();

            if (!$quiz) {
                http_response_code(404);
                echo json_encode(['error' => 'No active quiz found for this match']);
                return;
            }

            if (isset($quiz['entry_amount'])) $quiz['entry_amount'] = (int)$quiz['entry_amount'];
            if (isset($quiz['prize_amount'])) $quiz['prize_amount'] = (int)$quiz['prize_amount'];

            // Fetch questions
            $qStmt = DB::query("
                SELECT q.id, q.question_text, q.marks
                FROM questions q
                WHERE q.quiz_id = ?
                ORDER BY q.id ASC
            ", [$quiz['id']]);
            $questions = $qStmt->fetchAll();

            // Fetch and attach options for each question
            foreach ($questions as &$q) {
                $optStmt = DB::query("
                    SELECT qo.id, qo.option_text as text, qo.hindi_option_text as hindiText, qo.option_value as value
                    FROM question_options qo
                    WHERE qo.question_id = ?
                    ORDER BY qo.option_value ASC
                ", [$q['id']]);
                $q['options'] = $optStmt->fetchAll();
            }

            echo json_encode(['success' => true, 'quiz' => $quiz, 'questions' => $questions]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getMatchById($id) {
        try {
            $stmt = DB::query("SELECT * FROM matches WHERE id = ?", [$id]);
            $match = $stmt->fetch();
            if (!$match) {
                http_response_code(404);
                echo json_encode(['error' => 'Match not found']);
                return;
            }
            if (isset($match['score_a'])) $match['score_a'] = (int)$match['score_a'];
            if (isset($match['score_b'])) $match['score_b'] = (int)$match['score_b'];

            echo json_encode(['success' => true, 'match' => $match]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }
}
