<?php
/* ==========================================================================
   COODU Trust — STEP 3 of the donation flow: verify the payment signature.

   POST /assets/php/razorpay-verify-payment.php
     { razorpay_order_id, razorpay_payment_id, razorpay_signature }

   200 -> { status:'success', data:{ receiptNumber, donorName, amount, ... } }
   400 -> signature mismatch or missing fields. NOTHING is marked as paid.

   The signature is HMAC-SHA256 of "<order_id>|<payment_id>" keyed with the
   Razorpay key secret. Compared with hash_equals() — a plain === on a secret
   comparison leaks timing information.

   The amount and donor details come from the order file this server wrote in
   step 1, never from the request body: a caller who could forge a signature
   could otherwise also dictate the receipt.
   ========================================================================== */

define('COODU_ENDPOINT', 1);
require_once __DIR__ . '/lib/coodu-json-endpoint.php';

define('COODU_DONATION_LOG',    COODU_DATA_DIR . '/donations.log');
define('COODU_SUSPICIOUS_LOG',  COODU_DATA_DIR . '/donations-rejected.log');
define('COODU_RECEIPT_COUNTER', COODU_DATA_DIR . '/receipt-counter.txt');

coodu_require_post();
coodu_load_config(array('COODU_RZP_KEY_ID', 'COODU_RZP_KEY_SECRET'));

$body = coodu_read_json_body();

$orderId   = coodu_field($body, 'razorpay_order_id');
$paymentId = coodu_field($body, 'razorpay_payment_id');
$signature = coodu_field($body, 'razorpay_signature');

if ($orderId === '' || $paymentId === '' || $signature === '') {
    coodu_fail(400, 'Missing payment details. If money has left your account, email director@coodutrust.org and we will sort it out.');
}

/* ------------------------------------------------------------- signature -- */
$expected = hash_hmac('sha256', $orderId . '|' . $paymentId, COODU_RZP_KEY_SECRET);

if (!hash_equals($expected, $signature)) {
    coodu_log_line(COODU_SUSPICIOUS_LOG, array(
        'reason'    => 'signature-mismatch',
        'orderId'   => $orderId,
        'paymentId' => $paymentId,
        'ip'        => coodu_client_ip(),
    ));
    error_log('COODU razorpay signature mismatch for order ' . $orderId);
    coodu_fail(400, 'We could not verify this payment. Nothing has been recorded. Please email director@coodutrust.org before trying again.');
}

/* ----------------------------------------------------------- order file --- */
$orderFile = COODU_ORDER_DIR . '/' . preg_replace('/[^A-Za-z0-9_]/', '', $orderId) . '.json';
$order     = null;
if (is_file($orderFile)) {
    $decoded = json_decode((string) @file_get_contents($orderFile), true);
    if (is_array($decoded)) {
        $order = $decoded;
    }
}

if ($order === null) {
    /* The signature is valid, so the payment is real — we simply cannot match
       it to an order we wrote. Record it and still thank the donor; the
       reconciliation is ours to do, not theirs. */
    coodu_log_line(COODU_SUSPICIOUS_LOG, array(
        'reason'    => 'order-file-missing',
        'orderId'   => $orderId,
        'paymentId' => $paymentId,
    ));
    error_log('COODU razorpay verified payment with no local order file: ' . $orderId);
    $order = array(
        'unreconciled' => true,
        'orderId'     => $orderId,
        'amountPaise' => 0,
        'cause'       => 'general',
        'donationType'=> 'one-time',
        'donor'       => array('name' => '', 'email' => '', 'phone' => '', 'pan' => ''),
    );
}

/* Replay guard: a second verify for an order already marked paid returns the
   receipt we already issued rather than minting a new number. */
if (isset($order['status']) && $order['status'] === 'paid' && !empty($order['receiptNumber'])) {
    coodu_ok('Payment already confirmed.', array(
        'receiptNumber' => $order['receiptNumber'],
        'donorName'     => $order['donor']['name'],
        'amount'        => $order['amountPaise'] / 100,
        'paymentId'     => $paymentId,
        'orderId'       => $orderId,
    ));
}

/* -------------------------------------------------------- receipt number --
   CT-<FY>-<sequence>. Indian financial year, so a receipt number lines up
   with the Form 10BE statement the trust files. */
function coodu_financial_year()
{
    $y = (int) date('Y');
    $m = (int) date('n');
    $start = ($m >= 4) ? $y : $y - 1;
    return $start . '-' . substr((string) ($start + 1), 2);
}

function coodu_next_receipt_number()
{
    $fy  = coodu_financial_year();
    $seq = 0;

    if (coodu_ensure_dir(dirname(COODU_RECEIPT_COUNTER))) {
        $fh = @fopen(COODU_RECEIPT_COUNTER, 'c+');
        if ($fh !== false) {
            if (flock($fh, LOCK_EX)) {
                $stored = trim((string) stream_get_contents($fh));
                $parts  = explode(':', $stored);
                $seq    = (count($parts) === 2 && $parts[0] === $fy) ? (int) $parts[1] : 0;
                $seq++;
                ftruncate($fh, 0);
                rewind($fh);
                fwrite($fh, $fy . ':' . $seq);
                fflush($fh);
                flock($fh, LOCK_UN);
            }
            fclose($fh);
        }
    }

    if ($seq < 1) {
        /* Counter unavailable — fall back to something unique and obviously
           out-of-band rather than reusing 1. */
        return 'CT-' . $fy . '-X' . strtoupper(bin2hex(random_bytes(3)));
    }
    return 'CT-' . $fy . '-' . str_pad((string) $seq, 5, '0', STR_PAD_LEFT);
}

$receiptNumber = coodu_next_receipt_number();
$amountRupees  = $order['amountPaise'] / 100;

/* ------------------------------------------------------------- persist ---- */
$order['status']        = 'paid';
$order['paymentId']     = $paymentId;
$order['receiptNumber'] = $receiptNumber;
$order['paidAt']        = gmdate('c');
@file_put_contents($orderFile, json_encode($order, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);

coodu_log_line(COODU_DONATION_LOG, array(
    'receiptNumber' => $receiptNumber,
    'orderId'       => $orderId,
    'paymentId'     => $paymentId,
    'amountINR'     => $amountRupees,
    'cause'         => isset($order['cause']) ? $order['cause'] : 'general',
    'donationType'  => isset($order['donationType']) ? $order['donationType'] : 'one-time',
    'isAnonymous'   => !empty($order['isAnonymous']),
    'donor'         => $order['donor'],
));

/* --------------------------------------------------------------- email ----
   The donor's JSON goes out FIRST, then the mail runs. Two PHPMailer sends can
   take longer than max_execution_time, and a script killed mid-send would
   leave the payment logged and the receipt minted but the browser showing
   "verification failed" on money that has already moved. */
coodu_json_then(200, array(
    'status'  => 'success',
    'message' => 'Payment verified.',
    'data'    => array(
        'receiptNumber' => $receiptNumber,
        'donorName'     => $order['donor']['name'],
        'amount'        => $amountRupees,
        'paymentId'     => $paymentId,
        'orderId'       => $orderId,
    ),
), function () use ($order, $receiptNumber, $amountRupees, $paymentId) {
    coodu_send_donation_mail($order, $receiptNumber, $amountRupees, $paymentId);
});

/* ========================================================================== */

function coodu_send_donation_mail(array $order, $receiptNumber, $amountRupees, $paymentId)
{
    if (!defined('COODU_SMTP_HOST') || !defined('COODU_SMTP_USER') || !defined('COODU_SMTP_PASS')) {
        return; /* mail not configured yet — the contact form README covers it */
    }

    $mailer = __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
    if (!is_file($mailer)) {
        return;
    }
    require_once __DIR__ . '/lib/PHPMailer/src/Exception.php';
    require_once $mailer;
    require_once __DIR__ . '/lib/PHPMailer/src/SMTP.php';

    $esc = function ($v) {
        return htmlspecialchars((string) $v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };
    $amount = number_format((float) $amountRupees, 2);
    $donor  = $order['donor'];
    $to     = defined('COODU_MAIL_TO') ? COODU_MAIL_TO : COODU_SMTP_USER;

    /* --- 1. the trust's own copy --- */
    try {
        $m = new PHPMailer\PHPMailer\PHPMailer(true);
        $m->isSMTP();
        $m->Host       = COODU_SMTP_HOST;
        $m->Port       = defined('COODU_SMTP_PORT') ? COODU_SMTP_PORT : 587;
        $m->SMTPAuth   = true;
        $m->Username   = COODU_SMTP_USER;
        $m->Password   = COODU_SMTP_PASS;
        $m->SMTPSecure = defined('COODU_SMTP_SECURE') ? COODU_SMTP_SECURE : 'tls';
        $m->CharSet    = 'UTF-8';
        $m->SMTPDebug  = 0;
        $m->Timeout    = 15;
        $m->Encoding   = 'base64';

        $m->setFrom(COODU_MAIL_FROM, defined('COODU_MAIL_FROM_NAME') ? COODU_MAIL_FROM_NAME : 'Coodu Trust website');
        $m->addAddress($to);
        $m->Subject = 'Donation received — ' . $receiptNumber . ' — Rs ' . $amount;
        $m->isHTML(true);
        $m->Body =
            '<h2>Donation received</h2><table cellpadding="6">' .
            '<tr><td><b>Receipt</b></td><td>' . $esc($receiptNumber) . '</td></tr>' .
            '<tr><td><b>Amount</b></td><td>Rs ' . $esc($amount) . '</td></tr>' .
            '<tr><td><b>Cause</b></td><td>' . $esc($order['cause']) . '</td></tr>' .
            '<tr><td><b>Name</b></td><td>' . $esc($donor['name']) . '</td></tr>' .
            '<tr><td><b>Email</b></td><td>' . $esc($donor['email']) . '</td></tr>' .
            '<tr><td><b>Phone</b></td><td>' . $esc($donor['phone']) . '</td></tr>' .
            '<tr><td><b>PAN</b></td><td>' . $esc($donor['pan'] !== '' ? $donor['pan'] : 'not given') . '</td></tr>' .
            '<tr><td><b>Anonymous</b></td><td>' . (!empty($order['isAnonymous']) ? 'yes' : 'no') . '</td></tr>' .
            '<tr><td><b>Razorpay payment</b></td><td>' . $esc($paymentId) . '</td></tr>' .
            '<tr><td><b>Razorpay order</b></td><td>' . $esc($order['orderId']) . '</td></tr>' .
            '</table>';
        $m->send();
    } catch (Throwable $e) {
        error_log('COODU donation notification failed: ' . $e->getMessage());
    }

    /* --- 2. the donor's acknowledgement --- */
    if (!filter_var($donor['email'], FILTER_VALIDATE_EMAIL)) {
        return;
    }
    try {
        $m = new PHPMailer\PHPMailer\PHPMailer(true);
        $m->isSMTP();
        $m->Host       = COODU_SMTP_HOST;
        $m->Port       = defined('COODU_SMTP_PORT') ? COODU_SMTP_PORT : 587;
        $m->SMTPAuth   = true;
        $m->Username   = COODU_SMTP_USER;
        $m->Password   = COODU_SMTP_PASS;
        $m->SMTPSecure = defined('COODU_SMTP_SECURE') ? COODU_SMTP_SECURE : 'tls';
        $m->CharSet    = 'UTF-8';
        $m->SMTPDebug  = 0;
        $m->Timeout    = 15;
        $m->Encoding   = 'base64';

        $m->setFrom(COODU_MAIL_FROM, defined('COODU_MAIL_FROM_NAME') ? COODU_MAIL_FROM_NAME : 'Coodu Trust');
        $m->addAddress($donor['email'], $donor['name']);
        if (defined('COODU_MAIL_TO')) {
            $m->addReplyTo(COODU_MAIL_TO, 'Coodu Trust');
        }
        $m->Subject = 'Thank you for your donation — receipt ' . $receiptNumber;
        $m->isHTML(true);
        $m->Body =
            '<p>Dear ' . $esc($donor['name']) . ',</p>' .
            '<p>Thank you. We have received your donation of <b>Rs ' . $esc($amount) . '</b>.</p>' .
            '<table cellpadding="6">' .
            '<tr><td><b>Receipt number</b></td><td>' . $esc($receiptNumber) . '</td></tr>' .
            '<tr><td><b>Payment reference</b></td><td>' . $esc($paymentId) . '</td></tr>' .
            '<tr><td><b>Date</b></td><td>' . $esc(date('j F Y')) . '</td></tr>' .
            '</table>' .
            '<p>Coodu Trust is approved under Section 80G of the Income-tax Act 1961 ' .
            '(Unique Registration Number AAATC5133E25CH02, valid for assessment years ' .
            '2027&ndash;28 to 2031&ndash;32). Your Form 10BE certificate is issued annually ' .
            'by 31 May for the previous financial year; you will need it to claim a deduction.</p>' .
            '<p>If anything above is wrong, reply to this email and we will correct it.</p>' .
            '<p>With gratitude,<br>Coodu Trust<br>Dindigul, Tamil Nadu</p>';
        $m->send();
    } catch (Throwable $e) {
        error_log('COODU donor acknowledgement failed: ' . $e->getMessage());
    }
}
