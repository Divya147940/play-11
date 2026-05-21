<?php
require_once dirname(__DIR__) . '/config/jwt.php';

define('JWT_SECRET', getenv('JWT_SECRET') ?: 'supersecretplay11token');
define('ADMIN_JWT_SECRET', getenv('ADMIN_JWT_SECRET') ?: 'admin-only-ultra-secret-key-123');

function getAuthorizationHeader() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { // Nginx or fastcgi
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } else if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}

function getBearerToken() {
    $header = getAuthorizationHeader();
    if (!empty($header)) {
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function verifyToken() {
    $token = getBearerToken();
    $guestId = isset($_SERVER['HTTP_X_GUEST_ID']) ? $_SERVER['HTTP_X_GUEST_ID'] : null;

    if (!$token && !$guestId) {
        http_response_code(401);
        echo json_encode(['error' => 'Access denied. No token or guest ID provided.']);
        exit;
    }

    if (!$token && $guestId) {
        return ['userId' => $guestId, 'isGuest' => true];
    }

    // Try verifying user token
    $decoded = jwt_decode($token, JWT_SECRET);
    if ($decoded) {
        return $decoded;
    }

    // Try verifying admin token
    $decodedAdmin = jwt_decode($token, ADMIN_JWT_SECRET);
    if ($decodedAdmin) {
        return array_merge($decodedAdmin, [
            'userId' => isset($decodedAdmin['userId']) ? $decodedAdmin['userId'] : (isset($decodedAdmin['id']) ? $decodedAdmin['id'] : null)
        ]);
    }

    // Fallback to guest if guestId exists
    if ($guestId) {
        return ['userId' => $guestId, 'isGuest' => true];
    }

    http_response_code(401);
    echo json_encode(['error' => 'Invalid or expired token.']);
    exit;
}

function verifyAdmin() {
    $token = getBearerToken();

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Access denied. No token provided.']);
        exit;
    }

    $decoded = jwt_decode($token, ADMIN_JWT_SECRET);
    if (!$decoded || (isset($decoded['role']) && $decoded['role'] !== 'admin')) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. Admin privileges required.']);
        exit;
    }

    return array_merge($decoded, [
        'userId' => isset($decoded['userId']) ? $decoded['userId'] : (isset($decoded['id']) ? $decoded['id'] : null)
    ]);
}

function optionalToken() {
    $token = getBearerToken();
    if (!$token) {
        return null;
    }

    $decoded = jwt_decode($token, JWT_SECRET);
    if ($decoded) {
        return $decoded;
    }

    $decodedAdmin = jwt_decode($token, ADMIN_JWT_SECRET);
    if ($decodedAdmin) {
        return array_merge($decodedAdmin, [
            'userId' => isset($decodedAdmin['userId']) ? $decodedAdmin['userId'] : (isset($decodedAdmin['id']) ? $decodedAdmin['id'] : null)
        ]);
    }

    return null;
}
