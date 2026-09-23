<?php
/* ==========================================================================
   COODU Trust — shared helpers for the JSON endpoints.

   Used by razorpay-create-order.php and razorpay-verify-payment.php.
   contact-submit.php predates this file and carries its own copies of the
   same helpers; it is left alone deliberately, because it is live and a
   refactor there buys nothing.

   Nothing in lib/ is meant to be requested over HTTP — lib/.htaccess denies
   it. The guard below is the second line of defence.
   ========================================================================== */

if (!defined('COODU_ENDPOINT')) {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/* A stray notice or warning printed before the JSON makes the body unparseable
   for the client, and once output has started headers_sent() is true, so
   coodu_json() can no longer set the status code or the content type. Many
   cPanel hosts ship display_errors=On. Errors go to the log, never the body. */
@ini_set('display_errors', '0');
@ini_set('log_errors', '1');

/* Receipt numbers carry the Indian financial year and the donor email prints a
   date. On a UTC host both are a day behind between 00:00 and 05:30 IST, which
   on 1 April would file a receipt under the wrong FY. contact-submit.php:26
   already does this; the Razorpay endpoints must too. */
date_default_timezone_set('Asia/Kolkata');

/* mbstring is normally present on cPanel but is not guaranteed, and an
   undefined mb_strlen() is a blank 500 with display_errors off. Mirrors the
   polyfill in contact-submit.php:62. */
if (!function_exists('mb_strlen')) {
    function mb_strlen($string, $encoding = null)
    {
        return strlen((string) $string);
    }
    function mb_substr($string, $start, $length = null, $encoding = null)
    {
        return $length === null ? substr((string) $string, $start) : substr((string) $string, $start, $length);
    }
}

define('COODU_DATA_DIR',  dirname(__DIR__) . '/data');
define('COODU_ORDER_DIR', COODU_DATA_DIR . '/orders');
define('COODU_RATE_DIR',  COODU_DATA_DIR . '/ratelimit');

/* ------------------------------------------------------------------ output */

/**
 * Emit a JSON response and stop. Shape matches what coodu-donate.js expects:
 * { status: 'success'|'error', message: string, data?: object }
 */
function coodu_json($httpCode, array $body)
{
    if (!headers_sent()) {
        http_response_code($httpCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
    }
    $encoded = json_encode($body);
    echo ($encoded === false)
        ? '{"status":"error","message":"Server error."}'
        : $encoded;
    exit;
}

/**
 * Emit the response, hand it to the client, THEN run $after.
 * Slow best-effort work (sending mail) must not hold the donor's browser open
 * or risk max_execution_time killing the script before the JSON is delivered.
 */
function coodu_json_then($httpCode, array $body, $after)
{
    if (!headers_sent()) {
        http_response_code($httpCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
    }
    $encoded = json_encode($body);
    $encoded = ($encoded === false) ? '{"status":"error","message":"Server error."}' : $encoded;

    if (!headers_sent()) {
        header('Content-Length: ' . strlen($encoded));
    }
    echo $encoded;

    /* Under PHP-FPM / LSAPI this returns the response and lets the script run
       on. Elsewhere, flush as best we can and accept that the client may wait. */
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        @ob_end_flush();
        @flush();
    }

    try {
        call_user_func($after);
    } catch (Throwable $e) {
        error_log('COODU post-response task failed: ' . $e->getMessage());
    }
    exit;
}

function coodu_ok($message, array $data = array())
{
    coodu_json(200, array('status' => 'success', 'message' => $message, 'data' => $data));
}

/**
 * Never put the underlying exception text in $message — it reaches the browser.
 * Log detail with coodu_log_line() instead.
 */
function coodu_fail($httpCode, $message)
{
    coodu_json($httpCode, array('status' => 'error', 'message' => $message));
}

/* ------------------------------------------------------------------- input */

function coodu_require_post()
{
    $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper($_SERVER['REQUEST_METHOD']) : '';
    if ($method === 'OPTIONS') {
        http_response_code(204);
        header('Allow: POST');
        exit;
    }
    if ($method !== 'POST') {
        header('Allow: POST');
        coodu_fail(405, 'This endpoint only accepts POST.');
    }
}

/** Decode the JSON request body, or fail with 400. Caps the size it will read. */
function coodu_read_json_body($maxBytes = 65536)
{
    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || $raw === '') {
        coodu_fail(400, 'Empty request.');
    }
    if (strlen($raw) > $maxBytes) {
        coodu_fail(413, 'Request too large.');
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        coodu_fail(400, 'Malformed request.');
    }
    return $decoded;
}

/** Fetch a scalar from a decoded body without tripping notices on missing keys. */
function coodu_field(array $src, $key, $default = '')
{
    if (!array_key_exists($key, $src) || is_array($src[$key]) || is_object($src[$key])) {
        return $default;
    }
    return trim((string) $src[$key]);
}

/* -------------------------------------------------------------- filesystem */

function coodu_ensure_dir($path)
{
    if (is_dir($path)) {
        return true;
    }
    return @mkdir($path, 0700, true) && is_dir($path);
}

/** One JSON object per line. Best-effort: logging must never break a payment. */
function coodu_log_line($file, array $record)
{
    if (!coodu_ensure_dir(dirname($file))) {
        return false;
    }
    $record['at'] = gmdate('c');
    $line = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return @file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX) !== false;
}

/* ------------------------------------------------------------------ client */

function coodu_client_ip()
{
    foreach (array('HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR') as $key) {
        if (!empty($_SERVER[$key])) {
            $candidate = trim(explode(',', $_SERVER[$key])[0]);
            if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                return $candidate;
            }
        }
    }
    return '0.0.0.0';
}

/**
 * Sliding-window limiter, one counter file per IP per bucket.
 * Returns true when the caller should be refused.
 * A filesystem failure returns false — never lock people out of donating
 * because a directory is unwritable.
 */
function coodu_rate_limited($ip, $bucket, $max, $window)
{
    $dir = COODU_RATE_DIR . '/' . preg_replace('/[^a-z0-9_-]/i', '', $bucket);
    if (!coodu_ensure_dir($dir)) {
        return false;
    }
    $file   = $dir . '/' . sha1($ip) . '.json';
    $now    = time();
    $stamps = array();

    if (is_file($file)) {
        $raw = @file_get_contents($file);
        if ($raw !== false) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                foreach ($decoded as $t) {
                    $t = (int) $t;
                    if ($t > 0 && ($now - $t) < $window) {
                        $stamps[] = $t;
                    }
                }
            }
        }
    }

    if (count($stamps) >= $max) {
        @file_put_contents($file, json_encode($stamps), LOCK_EX);
        return true;
    }

    $stamps[] = $now;
    @file_put_contents($file, json_encode($stamps), LOCK_EX);

    /* Opportunistic housekeeping: drop counters nobody has touched in a day. */
    if (mt_rand(1, 50) === 1) {
        foreach ((array) @glob($dir . '/*.json') as $old) {
            if (@filemtime($old) < ($now - 86400)) {
                @unlink($old);
            }
        }
    }
    return false;
}

/* ------------------------------------------------------------------ config */

/**
 * Load config.php, which holds the Razorpay keys and SMTP credentials and is
 * gitignored. Without it the endpoint refuses to run rather than falling back
 * to anything guessable.
 */
function coodu_load_config(array $required)
{
    $configFile = dirname(__DIR__) . '/config.php';
    if (!is_file($configFile)) {
        error_log('COODU: assets/php/config.php is missing.');
        coodu_fail(503, 'Online giving is temporarily unavailable. Please email director@coodutrust.org.');
    }
    require_once $configFile;

    foreach ($required as $name) {
        if (!defined($name) || constant($name) === '' || strpos((string) constant($name), 'REPLACE-WITH') !== false) {
            error_log('COODU: config.php is missing a value for ' . $name . '.');
            coodu_fail(503, 'Online giving is temporarily unavailable. Please email director@coodutrust.org.');
        }
    }
}

/* ---------------------------------------------------------------- Razorpay */

/**
 * Call the Razorpay REST API with HTTP Basic auth (key_id : key_secret).
 * Deliberately no SDK: composer is not available on this host, and the two
 * calls we make are a POST and nothing else.
 *
 * Returns array(httpStatus, decodedBody|null, curlError|null).
 */
function coodu_razorpay_request($method, $path, $payload = null)
{
    $ch = curl_init('https://api.razorpay.com/v1' . $path);
    if ($ch === false) {
        return array(0, null, 'curl_init failed');
    }

    $options = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_USERPWD        => COODU_RZP_KEY_ID . ':' . COODU_RZP_KEY_SECRET,
        CURLOPT_HTTPHEADER     => array('Content-Type: application/json'),
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    );
    if ($payload !== null) {
        $options[CURLOPT_POSTFIELDS] = json_encode($payload);
    }
    curl_setopt_array($ch, $options);

    $body   = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error  = curl_errno($ch) ? curl_error($ch) : null;
    curl_close($ch);

    $decoded = ($body === false) ? null : json_decode($body, true);
    return array($status, is_array($decoded) ? $decoded : null, $error);
}
