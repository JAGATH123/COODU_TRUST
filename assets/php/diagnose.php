<?php
/* ==========================================================================
   COODU Trust — TEMPORARY configuration diagnostic.

   Answers one question: why do the endpoints say "not configured"?

   It NEVER prints a secret. Every value is reported as present/absent plus a
   length and a masked preview, never the value itself.

   Gated behind a token so it is not a free map of the server to anyone who
   guesses the filename.

   DELETE THIS FILE once the form works.
   ========================================================================== */

$TOKEN = 'kRj_-rYAF9BVxp_N5s4jsNG7';

if (!isset($_GET['k']) || !hash_equals($TOKEN, (string) $_GET['k'])) {
    http_response_code(404);
    exit('Not found');
}

header('Content-Type: text/plain; charset=utf-8');

function line($label, $value) { printf("%-34s %s\n", $label, $value); }
function yn($b) { return $b ? 'YES' : 'NO'; }

echo "COODU Trust — configuration diagnostic\n";
echo str_repeat('=', 62) . "\n\n";

echo "PHP\n" . str_repeat('-', 62) . "\n";
line('PHP version', PHP_VERSION);
line('curl extension', yn(function_exists('curl_init')));
line('mbstring (mb_strlen)', yn(function_exists('mb_strlen')));
line('openssl / hash_hmac', yn(function_exists('hash_hmac')));
line('display_errors', ini_get('display_errors') ? 'On  <- should be Off' : 'Off');
line('max_execution_time', ini_get('max_execution_time'));
echo "\n";

echo "FILE LAYOUT\n" . str_repeat('-', 62) . "\n";
line('This file lives in', __DIR__);
line('Document root', isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : '(unknown)');
echo "\nFiles present in " . __DIR__ . ":\n";
foreach ((array) @scandir(__DIR__) as $f) {
    if ($f === '.' || $f === '..') { continue; }
    $p = __DIR__ . '/' . $f;
    printf("   %-34s %-6s %s\n", $f, is_dir($p) ? '[dir]' : (@filesize($p) . 'B'),
        substr(sprintf('%o', @fileperms($p)), -4));
}
echo "\n";

$configFile = __DIR__ . '/config.php';
echo "CONFIG FILE\n" . str_repeat('-', 62) . "\n";
line('Expected at', $configFile);
line('Exists (is_file)', yn(is_file($configFile)));
line('Readable by PHP', yn(is_readable($configFile)));
if (is_file($configFile)) {
    line('Size', @filesize($configFile) . ' bytes');
    line('Permissions', substr(sprintf('%o', @fileperms($configFile)), -4));
    line('Owner UID / PHP running as', @fileowner($configFile) . ' / ' . (function_exists('posix_geteuid') ? posix_geteuid() : 'unknown'));
    line('Last modified', @date('Y-m-d H:i:s', @filemtime($configFile)));
} else {
    echo "\n  *** config.php IS NOT AT THE PATH ABOVE. ***\n";
    echo "  Copy config.sample.php to config.php IN THIS EXACT FOLDER.\n";
}
echo "\n";

if (is_file($configFile) && is_readable($configFile)) {
    require_once $configFile;
}

echo "CONSTANTS (values masked — this file never prints a secret)\n" . str_repeat('-', 62) . "\n";
$required = array(
    'COODU_RZP_KEY_ID'   => 'donations',
    'COODU_RZP_KEY_SECRET' => 'donations',
    'COODU_SMTP_HOST'    => 'contact form',
    'COODU_SMTP_PORT'    => 'contact form',
    'COODU_SMTP_SECURE'  => 'contact form',
    'COODU_SMTP_USER'    => 'contact form',
    'COODU_SMTP_PASS'    => 'contact form',
    'COODU_MAIL_FROM'    => 'contact form',
    'COODU_MAIL_TO'      => 'contact form',
);
$problems = array();
foreach ($required as $name => $used_by) {
    if (!defined($name)) {
        printf("  %-24s MISSING        (needed by %s)\n", $name, $used_by);
        $problems[] = $name . ' is not defined';
        continue;
    }
    $v = (string) constant($name);
    if ($v === '') {
        printf("  %-24s EMPTY          (needed by %s)\n", $name, $used_by);
        $problems[] = $name . ' is empty';
    } elseif (strpos($v, 'REPLACE-WITH') !== false) {
        printf("  %-24s PLACEHOLDER    still says REPLACE-WITH...\n", $name);
        $problems[] = $name . ' still holds the sample placeholder';
    } else {
        $mask = (strlen($v) <= 6) ? str_repeat('*', strlen($v))
              : substr($v, 0, 3) . str_repeat('*', max(0, strlen($v) - 6)) . substr($v, -3);
        printf("  %-24s set, %3d chars  %s\n", $name, strlen($v), $mask);
    }
}
echo "\n";

echo "DATA DIRECTORY\n" . str_repeat('-', 62) . "\n";
$dataDir = __DIR__ . '/data';
line('Path', $dataDir);
line('Exists', yn(is_dir($dataDir)));
line('Writable by PHP', yn(is_writable($dataDir)));
if (is_dir($dataDir)) {
    line('Permissions', substr(sprintf('%o', @fileperms($dataDir)), -4));
}
if (!is_writable($dataDir)) { $problems[] = 'data/ is not writable — donations would not be recorded'; }
echo "\n";

echo "OUTBOUND CONNECTION TO RAZORPAY\n" . str_repeat('-', 62) . "\n";
if (!function_exists('curl_init')) {
    echo "  curl is not available — donations cannot work.\n";
    $problems[] = 'curl extension missing';
} else {
    $ch = curl_init('https://api.razorpay.com/v1/payments');
    curl_setopt_array($ch, array(CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 12,
        CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2, CURLOPT_NOBODY => true));
    curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_errno($ch) ? curl_error($ch) : '';
    curl_close($ch);
    if ($err !== '') {
        line('Reached api.razorpay.com', 'NO — ' . $err);
        $problems[] = 'cannot reach api.razorpay.com: ' . $err;
    } else {
        line('Reached api.razorpay.com', 'yes (HTTP ' . $code . ', 401 expected here)');
    }
}
echo "\n";

echo str_repeat('=', 62) . "\nVERDICT\n" . str_repeat('=', 62) . "\n";
if (!$problems) {
    echo "No configuration problems found. If the form still fails, read the\n";
    echo "PHP error log and look for lines beginning \"COODU\".\n";
} else {
    foreach ($problems as $i => $p) { echo '  ' . ($i + 1) . ". " . $p . "\n"; }
}
echo "\nDelete this file when you are done.\n";
