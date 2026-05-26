<?php
require_once dirname(__DIR__) . '/config/db.php';

class SettingsController {
    public static function getSetting($key) {
        try {
            $stmt = DB::query('SELECT value FROM settings WHERE key = ?', [$key]);
            $row = $stmt->fetch();
            
            if (!$row) {
                // Return default 0 instead of 404 so frontend doesn't error
                echo json_encode(['success' => true, 'value' => '0']);
                return;
            }
            
            echo json_encode(['success' => true, 'value' => $row['value']]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Fetch multiple settings in a SINGLE query.
     * Usage: GET /api/settings/batch?keys=welcome_bonus,daily_login_bonus,...
     * Returns: { success: true, settings: { key: value, ... } }
     */
    public static function getBatchSettings($queryParams) {
        try {
            $keysParam = isset($queryParams['keys']) ? trim($queryParams['keys']) : '';
            
            if (empty($keysParam)) {
                // Return ALL settings if no specific keys requested
                $stmt = DB::query('SELECT key, value FROM settings');
            } else {
                $keys = array_filter(array_map('trim', explode(',', $keysParam)));
                if (empty($keys)) {
                    echo json_encode(['success' => true, 'settings' => []]);
                    return;
                }
                $placeholders = implode(',', array_fill(0, count($keys), '?'));
                $stmt = DB::query("SELECT key, value FROM settings WHERE key IN ($placeholders)", $keys);
            }
            
            $rows = $stmt->fetchAll();
            $settings = [];
            foreach ($rows as $row) {
                $settings[$row['key']] = $row['value'];
            }
            
            echo json_encode(['success' => true, 'settings' => $settings]);
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
