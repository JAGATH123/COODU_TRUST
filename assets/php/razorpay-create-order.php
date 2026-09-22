<?php
/* ==========================================================================
   COODU Trust — STEP 1 of the donation flow: create a Razorpay order.

   POST /assets/php/razorpay-create-order.php
     { amount: <rupees>, donationType, cause, isAnonymous, receiptRequested,
       notes, donorInfo: { name, email, phone, address, panNumber } }

   200 -> { status:'success', data:{ orderId, amount (paise), currency, key } }

   Only the PUBLIC key id is ever returned. COODU_RZP_KEY_SECRET is used to
   authenticate this server-to-server call and never leaves this process.

   The order is written to data/orders/<order_id>.json so that
   razorpay-verify-payment.php can recover the donor details and the amount
   without trusting anything the browser sends back.
   ========================================================================== */

define('COODU_ENDPOINT', 1);
require_once __DIR__ . '/lib/coodu-json-endpoint.php';

/* ------------------------------------------------------------------ tuning */
define('COODU_MIN_PAISE',    100);        /* Razorpay's own floor: ₹1         */
define('COODU_MAX_PAISE',    50000000);   /* ₹5,00,000 — a sanity ceiling     */
define('COODU_ORDER_RATE_MAX',    12);    /* orders per IP ...                */
define('COODU_ORDER_RATE_WINDOW', 3600);  /* ... per hour                     */

coodu_require_post();
coodu_load_config(array('COODU_RZP_KEY_ID', 'COODU_RZP_KEY_SECRET'));

$ip = coodu_client_ip();
if (coodu_rate_limited($ip, 'order', COODU_ORDER_RATE_MAX, COODU_ORDER_RATE_WINDOW)) {
    coodu_fail(429, 'Too many attempts from this connection. Please wait an hour, or email director@coodutrust.org.');
}

$body = coodu_read_json_body();

/* ------------------------------------------------------------ amount ------
   The browser sends rupees; Razorpay wants paise. Round rather than cast, so
   that a float like 499.9999 from a JS input does not silently become 499. */
if (!isset($body['amount']) || !is_numeric($body['amount'])) {
    coodu_fail(400, 'Please choose an amount.');
}
$paise = (int) round(((float) $body['amount']) * 100);

if ($paise < COODU_MIN_PAISE) {
    coodu_fail(400, 'The smallest donation we can accept online is ₹1.');
}
if ($paise > COODU_MAX_PAISE) {
    coodu_fail(400, 'For gifts above ₹5,00,000 please email director@coodutrust.org so we can arrange a transfer.');
}

/* ------------------------------------------------------------- donor ------ */
$donor = (isset($body['donorInfo']) && is_array($body['donorInfo'])) ? $body['donorInfo'] : array();

$name  = coodu_field($donor, 'name');
$email = coodu_field($donor, 'email');
$phone = coodu_field($donor, 'phone');

if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    coodu_fail(400, 'Please tell us your name.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    coodu_fail(400, 'Please give a valid email address so we can send your receipt.');
}
/* Indian mobile: 10 digits starting 6-9, optionally +91 / 0 prefixed. */
$phoneDigits = preg_replace('/\D+/', '', $phone);
if (preg_match('/^(?:91|0)(\d{10})$/', $phoneDigits, $m)) {
    $phoneDigits = $m[1];
}
if (!preg_match('/^[6-9]\d{9}$/', $phoneDigits)) {
    coodu_fail(400, 'Please give a valid 10-digit Indian mobile number.');
}

$allowedCauses = array('general', 'education', 'health', 'environment', 'women-empowerment');
$cause = coodu_field($body, 'cause', 'general');
if (!in_array($cause, $allowedCauses, true)) {
    $cause = 'general';
}

$allowedTypes = array('one-time', 'monthly', 'yearly');
$donationType = coodu_field($body, 'donationType', 'one-time');
if (!in_array($donationType, $allowedTypes, true)) {
    $donationType = 'one-time';
}

$pan = strtoupper(preg_replace('/\s+/', '', coodu_field($donor, 'panNumber')));
if ($pan !== '' && !preg_match('/^[A-Z]{5}\d{4}[A-Z]$/', $pan)) {
    coodu_fail(400, 'That PAN does not look right. Leave it blank if you would rather not give it.');
}

/* --------------------------------------------------------- create order --- */
$receipt = 'ct_' . date('Ymd') . '_' . bin2hex(random_bytes(6));

list($status, $response, $curlError) = coodu_razorpay_request('POST', '/orders', array(
    'amount'          => $paise,
    'currency'        => 'INR',
    'receipt'         => $receipt,
    'payment_capture' => 1,
    'notes'           => array(
        'donor_name'    => mb_substr($name, 0, 100),
        'donor_email'   => mb_substr($email, 0, 100),
        'cause'         => $cause,
        'donation_type' => $donationType,
    ),
));

if ($curlError !== null) {
    error_log('COODU razorpay create-order transport failure: ' . $curlError);
    coodu_fail(500, 'We could not reach the payment gateway. Please try again in a moment.');
}
if ($status === 401 || $status === 403) {
    error_log('COODU razorpay create-order auth failure, HTTP ' . $status . ' — check the keys in config.php.');
    coodu_fail(401, 'Online giving is misconfigured at our end. Please email director@coodutrust.org.');
}
if ($status < 200 || $status >= 300 || empty($response['id'])) {
    $detail = isset($response['error']['description']) ? $response['error']['description'] : 'no description';
    error_log('COODU razorpay create-order failed, HTTP ' . $status . ': ' . $detail);
    coodu_fail(500, 'The payment gateway refused the request. Please try again, or email director@coodutrust.org.');
}

/* ------------------------------------------------------------ remember ----
   Written before the browser opens the modal. verify-payment reads this back
   rather than believing the amount or the donor details the browser returns. */
$orderId = (string) $response['id'];

if (coodu_ensure_dir(COODU_ORDER_DIR)) {
    @file_put_contents(
        COODU_ORDER_DIR . '/' . preg_replace('/[^A-Za-z0-9_]/', '', $orderId) . '.json',
        json_encode(array(
            'orderId'          => $orderId,
            'receipt'          => $receipt,
            'amountPaise'      => $paise,
            'currency'         => 'INR',
            'cause'            => $cause,
            'donationType'     => $donationType,
            'isAnonymous'      => !empty($body['isAnonymous']),
            'receiptRequested' => !isset($body['receiptRequested']) || !empty($body['receiptRequested']),
            'donor'            => array(
                'name'    => $name,
                'email'   => $email,
                'phone'   => $phoneDigits,
                'address' => mb_substr(coodu_field($donor, 'address'), 0, 500),
                'pan'     => $pan,
            ),
            'status'    => 'created',
            'ip'        => $ip,
            'createdAt' => gmdate('c'),
        ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

coodu_ok('Order created.', array(
    'orderId'  => $orderId,
    'amount'   => $paise,
    'currency' => 'INR',
    'key'      => COODU_RZP_KEY_ID,
));
