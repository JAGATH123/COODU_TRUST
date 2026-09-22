<?php
/* ==========================================================================
   COODU Trust — contact form endpoint
   --------------------------------------------------------------------------
   Self-hosted on the trust's own cPanel account on purpose: the privacy policy
   names every third party that receives visitor data, and a hosted form
   backend would add a new data processor that would have to be disclosed under
   the Digital Personal Data Protection Act 2023. Nothing here leaves the host
   except the two emails, sent over authenticated SMTP from the trust's own
   mailbox.

   Accepts:   POST, either JSON (fetch) or application/x-www-form-urlencoded
              (plain <form> submit with JavaScript off).
   Replies:   JSON { status, message }        to XHR / JSON requests
              a styled HTML page              to plain form posts
   Requires:  config.php (copy config.sample.php and fill it in).
   PHP:       7.4+
   ========================================================================== */

/* Never print warnings into the response body — they would break the JSON and
   could disclose paths. Everything goes to the host's PHP error log instead. */
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

date_default_timezone_set('Asia/Kolkata');

/* ------------------------------------------------------------------ tuning */
define('COODU_NAME_MIN',     2);
define('COODU_NAME_MAX',     120);
define('COODU_SUBJECT_MIN',  5);
define('COODU_SUBJECT_MAX',  180);
define('COODU_MESSAGE_MIN',  10);
define('COODU_MESSAGE_MAX',  5000);
define('COODU_MIN_SECONDS',  3);      /* timing trap: faster than this = bot   */
define('COODU_MAX_AGE',      86400);  /* a page left open for > 24h is stale   */
define('COODU_RATE_MAX',     5);      /* submissions per IP ...                */
define('COODU_RATE_WINDOW',  3600);   /* ... per hour                          */
define('COODU_MAX_URLS',     2);      /* links allowed in the message body     */

define('COODU_DATA_DIR', __DIR__ . '/data');
define('COODU_LOG_FILE', COODU_DATA_DIR . '/submissions.log');
define('COODU_RATE_DIR', COODU_DATA_DIR . '/ratelimit');

/* Shown to humans and to bots alike, so a spammer learns nothing from it. */
define('COODU_OK_MESSAGE', 'Your message has been sent. We will get back to you within 24&ndash;48 hours.');
define('COODU_FALLBACK_CONTACT', 'Please email director@coodutrust.org or call +91-451-2461362.');

$COODU_TYPE_LABELS = array(
    'general'     => 'General enquiry',
    'volunteer'   => 'Volunteering enquiry',
    'partnership' => 'Partnership enquiry',
    'donation'    => 'Donation enquiry',
    'support'     => 'Website enquiry',
);

/* ===================================================================== utils */

/* mbstring is normally present on cPanel, but the script must not die with a
   fatal error if it is not. Byte-length is a close enough substitute for the
   length caps below. */
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

function coodu_h($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Make a value safe to place in a mail header. Header injection is the classic
 * hole in a PHP mail script: a newline in the name or subject field lets an
 * attacker append Bcc: or a second MIME body. PHPMailer rejects most of this
 * itself, but we strip it before it ever reaches PHPMailer.
 */
function coodu_header_safe($value)
{
    $value = str_replace(array("\0", "\r", "\n", "\t", "\v", "\f"), ' ', (string) $value);
    $collapsed = preg_replace('/\s+/u', ' ', $value);
    if ($collapsed === null) {            /* invalid UTF-8: retry without /u */
        $collapsed = preg_replace('/\s+/', ' ', $value);
    }
    return trim((string) $collapsed);
}

/** Obvious header-injection / mail-relay attempt in a field that becomes a header. */
function coodu_looks_like_injection($value)
{
    $value = (string) $value;
    if (strpbrk($value, "\r\n") !== false || strpos($value, "\0") !== false) {
        return true;
    }
    return (bool) preg_match(
        '/\b(bcc|cc|to|from|reply-to|content-type|content-transfer-encoding|mime-version|x-mailer)\s*:/i',
        $value
    );
}

function coodu_count_urls($text)
{
    $text = (string) $text;
    return preg_match_all('#(https?://|www\.|\[url|\[link)#i', $text, $m);
}

function coodu_client_ip()
{
    /* REMOTE_ADDR only. X-Forwarded-For is client-supplied and would let a
       spammer walk straight past the rate limiter. */
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

function coodu_ensure_dir($path)
{
    if (is_dir($path)) {
        return is_writable($path);
    }
    if (!@mkdir($path, 0755, true) && !is_dir($path)) {
        return false;
    }
    /* If the folder had to be created at runtime it has no guard file yet, and
       this tree sits inside the public document root. Write one immediately. */
    $guard = rtrim($path, '/') . '/.htaccess';
    if (!is_file($guard)) {
        @file_put_contents(
            $guard,
            "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n"
            . "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n"
            . "Options -Indexes\n"
        );
    }
    return is_writable($path);
}

/** Does this request want JSON back, or a whole HTML page? */
function coodu_wants_json()
{
    $xhr = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
    if ($xhr === 'xmlhttprequest') {
        return true;
    }
    $ctype  = isset($_SERVER['CONTENT_TYPE']) ? strtolower($_SERVER['CONTENT_TYPE']) : '';
    $accept = isset($_SERVER['HTTP_ACCEPT']) ? strtolower($_SERVER['HTTP_ACCEPT']) : '';
    if (strpos($ctype, 'application/json') !== false) {
        return true;
    }
    return strpos($accept, 'application/json') !== false && strpos($accept, 'text/html') === false;
}

/** Send the reply in whichever shape the caller asked for, then stop. */
function coodu_respond($httpCode, $status, $messageHtml, $heading = null)
{
    if (!headers_sent()) {
        http_response_code($httpCode);
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: same-origin');
        header('Cache-Control: no-store, no-cache, must-revalidate');
    }

    if (coodu_wants_json()) {
        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
        }
        /* The front end reads { status, message }. Entities are decoded so the
           JS can drop the text straight into textContent. */
        $plain = html_entity_decode($messageHtml, ENT_QUOTES, 'UTF-8');
        echo json_encode(
            array('status' => $status, 'message' => $plain),
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        exit;
    }

    if (!headers_sent()) {
        header('Content-Type: text/html; charset=utf-8');
    }
    echo coodu_html_page($status, $messageHtml, $heading);
    exit;
}

/**
 * No-JavaScript reply page. Uses the site's own stylesheets and classes so it
 * looks like part of the site rather than a bare PHP error.
 */
function coodu_html_page($status, $messageHtml, $heading = null)
{
    $ok      = ($status === 'success');
    $title   = $ok ? 'Message sent' : 'Message not sent';
    $heading = $heading !== null ? $heading : ($ok ? 'Thank you!' : 'We could not send that');
    $icon    = $ok ? 'check' : 'alert-circle';
    $tone    = $ok ? 'ok' : 'error';

    $title   = coodu_h($title);
    $heading = coodu_h($heading);

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>{$title} | Coodu Trust</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&amp;family=Source+Sans+3:wght@400;600;700&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/coodu-tokens.css?v=5">
  <link rel="stylesheet" href="/assets/css/coodu-base.css?v=9">
  <link rel="stylesheet" href="/assets/css/coodu-components.css?v=11">
  <link rel="stylesheet" href="/assets/css/coodu-contact.css?v=4">
</head>
<body data-page="contact">
  <main id="main">
    <section class="section">
      <div class="container" style="max-width:640px">
        <div class="msg__card">
          <div class="msg__done">
            <div class="msg__done-check"><i data-lucide="{$icon}" aria-hidden="true"></i></div>
            <h3>{$heading}</h3>
            <p class="msg__feedback msg__feedback--{$tone}" role="status" style="justify-content:center">{$messageHtml}</p>
            <p><a class="btn btn--primary" href="/contact.html">Back to the contact page</a></p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
  <script>window.addEventListener('load',function(){if(window.lucide)window.lucide.createIcons();});</script>
</body>
</html>
HTML;
}

/** One JSON object per line. The folder is blocked from HTTP by data/.htaccess. */
function coodu_log_submission(array $record)
{
    if (!coodu_ensure_dir(COODU_DATA_DIR)) {
        error_log('coodu contact: data directory is not writable: ' . COODU_DATA_DIR);
        return false;
    }
    $line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($line === false) {
        return false;
    }
    return (bool) @file_put_contents(COODU_LOG_FILE, $line . "\n", FILE_APPEND | LOCK_EX);
}

/**
 * File-based rate limit: one small JSON file of timestamps per IP. Counts every
 * POST that reaches us, bots included, so a flood trips the limit too.
 * Returns true when this request is over the limit.
 */
function coodu_rate_limited($ip)
{
    if (!coodu_ensure_dir(COODU_RATE_DIR)) {
        return false; /* never lock the form out because of a filesystem problem */
    }
    $file  = COODU_RATE_DIR . '/' . sha1($ip) . '.json';
    $now   = time();
    $stamps = array();

    if (is_file($file)) {
        $raw = @file_get_contents($file);
        if ($raw !== false) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                foreach ($decoded as $t) {
                    $t = (int) $t;
                    if ($t > 0 && ($now - $t) < COODU_RATE_WINDOW) {
                        $stamps[] = $t;
                    }
                }
            }
        }
    }

    if (count($stamps) >= COODU_RATE_MAX) {
        @file_put_contents($file, json_encode($stamps), LOCK_EX);
        return true;
    }

    $stamps[] = $now;
    @file_put_contents($file, json_encode($stamps), LOCK_EX);

    /* Opportunistic housekeeping: drop counter files nobody has touched in a day. */
    if (mt_rand(1, 50) === 1) {
        foreach ((array) @glob(COODU_RATE_DIR . '/*.json') as $old) {
            if (@filemtime($old) < ($now - 86400)) {
                @unlink($old);
            }
        }
    }
    return false;
}

/* ============================================================ 1. METHOD ==== */

$method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper($_SERVER['REQUEST_METHOD']) : 'GET';
if ($method !== 'POST') {
    header('Allow: POST');
    coodu_respond(405, 'error', 'This address only accepts form submissions. ' . COODU_FALLBACK_CONTACT, 'Method not allowed');
}

/* ============================================================ 2. CONFIG ==== */

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    error_log('coodu contact: config.php is missing — copy config.sample.php and fill it in.');
    coodu_respond(500, 'error', 'The contact form is not configured on the server yet. ' . COODU_FALLBACK_CONTACT, 'Form not configured');
}
require $configFile;

$required = array(
    'COODU_SMTP_HOST', 'COODU_SMTP_PORT', 'COODU_SMTP_USER', 'COODU_SMTP_PASS',
    'COODU_MAIL_FROM', 'COODU_MAIL_TO',
);
foreach ($required as $const) {
    if (!defined($const) || trim((string) constant($const)) === '') {
        error_log('coodu contact: config.php is incomplete — ' . $const . ' is missing or empty.');
        coodu_respond(500, 'error', 'The contact form is not configured on the server yet. ' . COODU_FALLBACK_CONTACT, 'Form not configured');
    }
}
if (!defined('COODU_SMTP_SECURE'))    { define('COODU_SMTP_SECURE', 'tls'); }
if (!defined('COODU_MAIL_FROM_NAME')) { define('COODU_MAIL_FROM_NAME', 'Coodu Trust website'); }
if (!defined('COODU_MAIL_TO_NAME'))   { define('COODU_MAIL_TO_NAME', 'Coodu Trust'); }
if (!defined('COODU_SMTP_DEBUG'))     { define('COODU_SMTP_DEBUG', 0); }

/* ============================================================== 3. INPUT === */

$input = $_POST;
$ctype = isset($_SERVER['CONTENT_TYPE']) ? strtolower($_SERVER['CONTENT_TYPE']) : '';
if (strpos($ctype, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    if ($raw !== false && strlen($raw) <= 64000) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $input = $decoded;
        }
    }
}

$field = function ($key) use ($input) {
    if (!isset($input[$key]) || is_array($input[$key])) {
        return '';
    }
    return trim((string) $input[$key]);
};

$name    = $field('name');
$email   = $field('email');
$phone   = $field('phone');
$subject = $field('subject');
$message = $field('message');
$type    = $field('inquiryType');
$honey   = $field('website');     /* honeypot — must stay empty            */
$stamp   = $field('form_ts');     /* ms timestamp planted by JS on page load */

if (!isset($COODU_TYPE_LABELS[$type])) {
    $type = 'general';
}

/* ======================================================== 4. RATE LIMIT ==== */

$ip = coodu_client_ip();
if (coodu_rate_limited($ip)) {
    coodu_respond(
        429,
        'error',
        'That is a lot of messages from one connection. Please wait an hour and try again, or ' . lcfirst(COODU_FALLBACK_CONTACT),
        'Too many messages'
    );
}

/* ====================================================== 5. BOT SCREENING ===
   Everything here answers with the ordinary success message. Telling a spammer
   which trap caught them is free debugging for the spammer. */

$botReason = '';

if ($honey !== '') {
    $botReason = 'honeypot';
} elseif ($stamp !== '' && ctype_digit($stamp)) {
    $elapsed = time() - (int) round(((float) $stamp) / 1000);
    if ($elapsed < COODU_MIN_SECONDS) {
        $botReason = 'too-fast';
    } elseif ($elapsed > COODU_MAX_AGE) {
        $botReason = 'stale-form';
    }
}

if ($botReason === '' && coodu_count_urls($message) > COODU_MAX_URLS) {
    $botReason = 'link-spam';
}
if ($botReason === '' && (coodu_looks_like_injection($name) || coodu_looks_like_injection($email)
    || coodu_looks_like_injection($subject) || coodu_looks_like_injection($phone))) {
    $botReason = 'header-injection';
}

if ($botReason !== '') {
    coodu_log_submission(array(
        'ts'        => date('c'),
        'ip'        => $ip,
        'rejected'  => $botReason,
        'name'      => mb_substr($name, 0, 120),
        'email'     => mb_substr($email, 0, 160),
        'ua'        => isset($_SERVER['HTTP_USER_AGENT']) ? mb_substr((string) $_SERVER['HTTP_USER_AGENT'], 0, 300) : '',
    ));
    coodu_respond(200, 'success', COODU_OK_MESSAGE);
}

/* ========================================================= 6. VALIDATION ===
   Server-side and authoritative. The browser checks are a courtesy only. */

$errors = array();

if (mb_strlen($name) < COODU_NAME_MIN) {
    $errors[] = 'Please enter your name (at least ' . COODU_NAME_MIN . ' characters).';
} elseif (mb_strlen($name) > COODU_NAME_MAX) {
    $errors[] = 'That name is longer than we can store. Please shorten it.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
} elseif (mb_strlen($email) > 254) {
    $errors[] = 'That email address is too long.';
}

if ($phone !== '') {
    $digits = preg_replace('/\D+/', '', $phone);
    if (strlen($digits) < 10 || strlen($digits) > 15) {
        $errors[] = 'Please enter a 10-digit phone number, or leave the field blank.';
    }
}

if ($subject === '') {
    $subject = $COODU_TYPE_LABELS[$type] . ($name !== '' ? ' from ' . $name : '');
}
$subject = coodu_header_safe($subject);
if (mb_strlen($subject) < COODU_SUBJECT_MIN) {
    $subject = $COODU_TYPE_LABELS[$type];
}
if (mb_strlen($subject) > COODU_SUBJECT_MAX) {
    $subject = mb_substr($subject, 0, COODU_SUBJECT_MAX);
}

if (mb_strlen($message) < COODU_MESSAGE_MIN) {
    $errors[] = 'Please add a short message (at least ' . COODU_MESSAGE_MIN . ' characters).';
} elseif (mb_strlen($message) > COODU_MESSAGE_MAX) {
    $errors[] = 'Your message is longer than ' . number_format(COODU_MESSAGE_MAX) . ' characters. Please shorten it.';
}

if ($errors) {
    coodu_respond(400, 'error', coodu_h($errors[0]), 'Please check the form');
}

/* Header-bound values, scrubbed of CR/LF before they go anywhere near a header. */
$safeName    = coodu_header_safe($name);
$safeEmail   = coodu_header_safe($email);
$safeSubject = coodu_header_safe($subject);
$safePhone   = coodu_header_safe($phone);
$typeLabel   = $COODU_TYPE_LABELS[$type];
$firstName   = trim(explode(' ', $safeName)[0]);

/* =============================================================== 7. MAIL === */

require_once __DIR__ . '/lib/PHPMailer/src/Exception.php';
require_once __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/lib/PHPMailer/src/SMTP.php';

/**
 * A PHPMailer instance already wired to the trust's SMTP mailbox.
 */
function coodu_mailer()
{
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = COODU_SMTP_HOST;
    $mail->Port       = (int) COODU_SMTP_PORT;
    $mail->SMTPAuth   = true;
    $mail->Username   = COODU_SMTP_USER;
    $mail->Password   = COODU_SMTP_PASS;
    $mail->SMTPSecure = (strtolower(COODU_SMTP_SECURE) === 'ssl')
        ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPDebug  = (int) COODU_SMTP_DEBUG;
    $mail->Debugoutput = 'error_log';
    $mail->Timeout    = 20;
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';
    $mail->setFrom(COODU_MAIL_FROM, COODU_MAIL_FROM_NAME);
    return $mail;
}

$rowsHtml = '';
$rows = array(
    'Name'    => $safeName,
    'Email'   => $safeEmail,
    'Phone'   => ($safePhone !== '' ? $safePhone : 'not given'),
    'About'   => $typeLabel,
    'Sent'    => date('j M Y, g:i a') . ' IST',
);
foreach ($rows as $label => $value) {
    $rowsHtml .= '<tr><td style="padding:6px 12px 6px 0;color:#555;white-space:nowrap">' . coodu_h($label)
        . '</td><td style="padding:6px 0;color:#111"><strong>' . coodu_h($value) . '</strong></td></tr>';
}
/* nl2br over escaped text — the message body is never inserted as raw HTML. */
$messageHtml = nl2br(coodu_h($message), false);

$enquirySent = false;
$ackSent     = false;
$mailError   = '';

try {
    $mail = coodu_mailer();
    $mail->addAddress(COODU_MAIL_TO, COODU_MAIL_TO_NAME);
    $mail->addReplyTo($safeEmail, $safeName !== '' ? $safeName : $safeEmail);
    $mail->Subject = '[Website] ' . $safeSubject;
    $mail->isHTML(true);
    $mail->Body =
        '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111">'
        . '<p style="margin:0 0 14px"><strong>New enquiry from the Coodu Trust website</strong></p>'
        . '<table style="border-collapse:collapse;font-size:14px;margin:0 0 16px">' . $rowsHtml . '</table>'
        . '<div style="border-left:3px solid #1e7e34;padding:2px 0 2px 14px">' . $messageHtml . '</div>'
        . '<p style="margin:18px 0 0;font-size:12px;color:#777">Reply to this email to answer '
        . coodu_h($safeEmail) . ' directly.</p></div>';
    $mail->AltBody =
        "New enquiry from the Coodu Trust website\n\n"
        . 'Name:  ' . $safeName . "\n"
        . 'Email: ' . $safeEmail . "\n"
        . 'Phone: ' . ($safePhone !== '' ? $safePhone : 'not given') . "\n"
        . 'About: ' . $typeLabel . "\n\n"
        . $message . "\n";
    $mail->send();
    $enquirySent = true;
} catch (\Throwable $e) {
    $mailError = $e->getMessage();
    error_log('coodu contact: enquiry mail failed — ' . $mailError);
}

/* The acknowledgement is a courtesy. If it fails the enquiry still counts. */
if ($enquirySent) {
    try {
        $ack = coodu_mailer();
        $ack->addAddress($safeEmail, $safeName !== '' ? $safeName : $safeEmail);
        $ack->addReplyTo(COODU_MAIL_TO, COODU_MAIL_TO_NAME);
        $ack->Subject = "We have your message \xE2\x80\x94 Coodu Trust";
        $ack->isHTML(true);
        $ack->Body =
            '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111">'
            . '<p>Dear ' . coodu_h($firstName !== '' ? $firstName : 'friend') . ',</p>'
            . '<p>Thank you for writing to Coodu Trust. Your message has reached us and a member of '
            . 'the team will reply, usually within 24&ndash;48 hours.</p>'
            . '<p style="margin:18px 0 6px;font-size:13px;color:#555">This is what you sent us:</p>'
            . '<div style="border-left:3px solid #1e7e34;padding:2px 0 2px 14px;font-size:14px;color:#333">'
            . $messageHtml . '</div>'
            . '<p style="margin-top:20px">If it is urgent, please call us on +91-451-2461362.</p>'
            . '<p style="margin:22px 0 0;font-size:13px;color:#555">Warm regards,<br>Coodu Trust<br>'
            . '74, 2nd Floor, Thadicombu Road, Dindigul &ndash; 624001, Tamil Nadu</p></div>';
        $ack->AltBody =
            'Dear ' . ($firstName !== '' ? $firstName : 'friend') . ",\n\n"
            . "Thank you for writing to Coodu Trust. Your message has reached us and a member of the team\n"
            . "will reply, usually within 24-48 hours. If it is urgent, please call +91-451-2461362.\n\n"
            . "This is what you sent us:\n\n" . $message . "\n\n"
            . "Warm regards,\nCoodu Trust\n74, 2nd Floor, Thadicombu Road, Dindigul - 624001, Tamil Nadu\n";
        $ack->send();
        $ackSent = true;
    } catch (\Throwable $e) {
        error_log('coodu contact: acknowledgement mail failed — ' . $e->getMessage());
    }
}

/* ================================================================ 8. LOG === */

coodu_log_submission(array(
    'ts'           => date('c'),
    'ip'           => $ip,
    'name'         => $safeName,
    'email'        => $safeEmail,
    'phone'        => $safePhone,
    'inquiryType'  => $type,
    'subject'      => $safeSubject,
    'message'      => $message,
    'enquiry_sent' => $enquirySent,
    'ack_sent'     => $ackSent,
    'ua'           => isset($_SERVER['HTTP_USER_AGENT']) ? mb_substr((string) $_SERVER['HTTP_USER_AGENT'], 0, 300) : '',
));

/* ============================================================ 9. RESPOND === */

if (!$enquirySent) {
    coodu_respond(
        500,
        'error',
        'We could not send your message just now, but we have kept a copy. ' . COODU_FALLBACK_CONTACT,
        'Message not sent'
    );
}

coodu_respond(200, 'success', COODU_OK_MESSAGE);
