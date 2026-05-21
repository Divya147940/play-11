<?php
require_once dirname(__DIR__) . '/config/db.php';
require_once dirname(__DIR__) . '/controllers/auth.controller.php'; // For guidv4

class VoucherController {
    public static function getVouchers($user) {
        $userId = $user['userId'];
        try {
            $stmt = DB::query("
                SELECT v.*, uv.status as user_status, uv.redeemed_at, uv.expires_at as user_expires_at, uv.created_at as acquired_at
                FROM vouchers v
                LEFT JOIN user_vouchers uv ON v.id = uv.voucher_id AND uv.user_id = ?
                WHERE v.status = 'active'
            ", [$userId]);
            $vouchers = $stmt->fetchAll();

            foreach ($vouchers as &$voucher) {
                $voucher['amount'] = (float)$voucher['amount'];
                $voucher['expiry_days'] = (int)$voucher['expiry_days'];
            }

            echo json_encode(['success' => true, 'vouchers' => $vouchers]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function redeemVoucher($data, $user) {
        $userId = $user['userId'];
        $code = isset($data['code']) ? trim($data['code']) : null;

        if (!$code) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Voucher code is required']);
            return;
        }

        $pdo = DB::getPdo();
        try {
            $pdo->beginTransaction();

            // 1. Find the voucher
            $stmt = DB::query("SELECT * FROM vouchers WHERE code = ? AND status = 'active'", [$code]);
            $voucher = $stmt->fetch();

            if (!$voucher) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Invalid or expired voucher code']);
                return;
            }

            // 2. Check if user already used it
            $stmt = DB::query('SELECT * FROM user_vouchers WHERE user_id = ? AND voucher_id = ?', [$userId, $voucher['id']]);
            $userVoucher = $stmt->fetch();

            if ($userVoucher && $userVoucher['status'] === 'used') {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'You have already redeemed this voucher']);
                return;
            }

            // 3. Apply the reward based on type
            $amount = (float)$voucher['amount'];
            if ($voucher['type'] === 'cash') {
                DB::query('UPDATE users SET coins = coins + ? WHERE id = ?', [$amount, $userId]);
                $category = 'deposit';
            } else {
                // Default to bonus
                DB::query('UPDATE users SET bonus = bonus + ? WHERE id = ?', [$amount, $userId]);
                $category = 'bonus';
            }

            // Record transaction
            $txId = 'tx-' . substr(guidv4(), 0, 8);
            DB::query(
                'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [$txId, $userId, "Voucher Redeemed: {$voucher['code']}", $amount, 'credit', $category, 'success']
            );

            // 4. Update user_vouchers record
            if ($userVoucher) {
                DB::query(
                    "UPDATE user_vouchers SET status = 'used', redeemed_at = CURRENT_TIMESTAMP WHERE id = ?",
                    [$userVoucher['id']]
                );
            } else {
                $expiryDays = (int)($voucher['expiry_days'] ?: 30);
                $expiresAt = date('Y-m-d H:i:s', time() + ($expiryDays * 86400));
                
                DB::query(
                    'INSERT INTO user_vouchers (id, user_id, voucher_id, status, redeemed_at, expires_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
                    [guidv4(), $userId, $voucher['id'], 'used', $expiresAt]
                );
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => "Voucher \"{$voucher['code']}\" redeemed successfully!"]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
