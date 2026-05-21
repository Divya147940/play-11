<?php
/**
 * Lightweight JWT encoder/decoder utility matching standard JWT specs.
 */

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode($payload, $secret, $expiry = 604800) { // Default: 7 days (604800 seconds)
    $header = json_encode([
        'typ' => 'JWT',
        'alg' => 'HS256'
    ]);

    // Add standard claims
    $payload['iat'] = time();
    $payload['exp'] = time() + $expiry;

    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode(json_encode($payload));

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function jwt_decode($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    list($header64, $payload64, $signature64) = $parts;

    $signature = base64url_decode($signature64);
    $expectedSignature = hash_hmac('sha256', $header64 . "." . $payload64, $secret, true);

    if (!hash_equals($signature, $expectedSignature)) {
        return null; // Invalid signature
    }

    $payload = json_decode(base64url_decode($payload64), true);
    if (!$payload) {
        return null; // Invalid JSON
    }

    // Check expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null; // Token expired
    }

    return $payload;
}
