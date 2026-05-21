<?php
require_once dirname(__DIR__) . '/config/db.php';

class SettingsController {
    public static function getSetting($key) {
        try {
            $stmt = DB::query('SELECT value FROM settings WHERE key = ?', [$key]);
            $row = $stmt->fetch();
            
            if (!$row) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Setting not found']);
                return;
            }
            
            echo json_encode(['success' => true, 'value' => $row['value']]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function updateSetting($data) {
        $key = isset($data['key']) ? trim($data['key']) : null;
        $value = isset($data['value']) ? trim($data['value']) : null;

        if (!$key || $value === null) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Key and value are required']);
            return;
        }

        try {
            // EXCLUDED.value is fully compatible with both pgsql and sqlite ON CONFLICT clauses.
            DB::query("
                INSERT INTO settings (key, value)
                VALUES (?, ?)
                ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
            ", [$key, $value]);

            echo json_encode(['success' => true, 'message' => 'Setting updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
