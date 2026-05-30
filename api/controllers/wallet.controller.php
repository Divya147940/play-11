<?php
require_once dirname(__DIR__) . '/config/db.php';
require_once dirname(__DIR__) . '/controllers/auth.controller.php'; // For guidv4

class WalletController {
    public static function getBalance($user) {
        $userId = $user['userId'];
        try {
            $stmt = DB::query('SELECT coins, points, bonus FROM users WHERE id = ?', [$userId]);
            $balance = $stmt->fetch();

            if (!$balance) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'User not found']);
                return;
            }

            $balance['coins'] = (float)($balance['coins'] ?? 0);
            $balance['points'] = (int)($balance['points'] ?? 0);
            $balance['bonus'] = (float)($balance['bonus'] ?? 0);

            echo json_encode(['success' => true, 'balance' => $balance]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function getTransactions($user) {
        $userId = $user['userId'];
        try {
            $stmt = DB::query(
                'SELECT id, title, amount, type, category, status, created_at, reference_id 
                 FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
                [$userId]
            );
            $transactions = $stmt->fetchAll();

            foreach ($transactions as &$tx) {
                $tx['amount'] = (float)$tx['amount'];
            }

            echo json_encode(['success' => true, 'transactions' => $transactions]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function addMoney($data, $user) {
        $userId = $user['userId'];
        $amount = isset($data['amount']) ? (float)$data['amount'] : 0;

        if ($amount <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid amount']);
            return;
        }

        $pdo = DB::getPdo();
        try {
            $pdo->beginTransaction();

            $txId = 'tx-' . substr(guidv4(), 0, 8);
            DB::query(
                'INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [$txId, $userId, 'Deposit Request (Manual)', $amount, 'credit', 'deposit', 'pending']
            );

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Money added successfully', 'transactionId' => $txId]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function withdrawMoney($data, $user) {
        $userId = $user['userId'];
        $amount = isset($data['amount']) ? (float)$data['amount'] : 0;
        $upiId = isset($data['upiId']) ? trim($data['upiId']) : null;
        $qrCode = isset($data['qrCode']) ? trim($data['qrCode']) : null;

        if ($amount <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid amount']);
            return;
        }

        if (!$upiId && !$qrCode) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'UPI ID or QR Code is required']);
            return;
        }

        $pdo = DB::getPdo();
        try {
            $pdo->beginTransaction();

            // Check balance
            $stmt = DB::query('SELECT coins FROM users WHERE id = ?', [$userId]);
            $userRow = $stmt->fetch();
            $coins = $userRow ? (float)$userRow['coins'] : 0;

            if ($coins < $amount) {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Insufficient balance']);
                return;
            }

            // Deduct balance
            DB::query('UPDATE users SET coins = coins - ? WHERE id = ?', [$amount, $userId]);

            // Record transaction as pending (manual/delayed)
            $txId = 'tx-' . substr(guidv4(), 0, 8);
            DB::query(
                'INSERT INTO transactions (id, user_id, title, amount, type, category, status, upi_id, qr_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [$txId, $userId, 'Withdrawal Request', -$amount, 'debit', 'withdraw', 'pending', $upiId, $qrCode]
            );

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Withdrawal request submitted successfully', 'transactionId' => $txId]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function creditCoins($data, $user) {
        $userId = $user['userId'];
        $amount = isset($data['amount']) ? (float)$data['amount'] : 0;

        if ($amount <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid amount']);
            return;
        }

        $pdo = DB::getPdo();
        try {
            $pdo->beginTransaction();

            // Credit coins
            DB::query("UPDATE users SET coins = coins + ? WHERE id = ?", [$amount, $userId]);

            // Create successful transaction
            $txId = 'tx-' . substr(guidv4(), 0, 8);
            DB::query(
                "INSERT INTO transactions (id, user_id, title, amount, type, category, status) VALUES (?, ?, ?, ?, 'credit', 'deposit', 'success')",
                [$txId, $userId, 'Simulated Payment Gateway Deposit', $amount]
            );

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Coins credited successfully', 'transactionId' => $txId]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
