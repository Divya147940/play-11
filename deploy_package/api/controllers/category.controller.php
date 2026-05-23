<?php
require_once dirname(__DIR__) . '/config/db.php';

class CategoryController {
    public static function getStudyCategories() {
        try {
            // Note: To be compatible with standard group by behavior, we list or dynamically join
            $stmt = DB::query("
                SELECT c.id, c.zone_id, c.name, c.hindi_name, c.icon, c.status, c.sort_order, COUNT(q.id) as quiz_count
                FROM categories c
                LEFT JOIN quizzes q ON c.id = q.category_id AND q.status = 'active'
                WHERE c.status = 'active' AND c.zone_id = 'study-zone'
                GROUP BY c.id, c.zone_id, c.name, c.hindi_name, c.icon, c.status, c.sort_order
                ORDER BY c.sort_order ASC
            ");
            $categories = $stmt->fetchAll();

            header('Cache-Control: public, max-age=60, s-maxage=600');
            echo json_encode(['success' => true, 'categories' => $categories]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getGameCategories() {
        try {
            $stmt = DB::query("
                SELECT * FROM categories 
                WHERE status = 'active' AND (zone_id = 'game-zone' OR zone_id = 'sport-zone') 
                ORDER BY sort_order ASC
            ");
            $categories = $stmt->fetchAll();

            header('Cache-Control: public, max-age=60, s-maxage=600');
            echo json_encode(['success' => true, 'categories' => $categories]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    public static function getAllCategories() {
        try {
            $stmt = DB::query("SELECT * FROM categories WHERE status = 'active' ORDER BY zone_id, sort_order ASC");
            $categories = $stmt->fetchAll();

            header('Cache-Control: public, max-age=60, s-maxage=600');
            echo json_encode(['success' => true, 'categories' => $categories]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }
}
