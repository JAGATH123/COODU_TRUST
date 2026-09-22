<?php
/* ==========================================================================
   COODU Trust — contact-form mail configuration (SAMPLE)
   --------------------------------------------------------------------------
   HOW TO USE
     1. Copy this file, in the same folder, to  config.php
     2. Fill in the real values below.
     3. Never commit config.php — it is listed in .gitignore, and this folder
        is inside the public web root.

   The endpoint (contact-submit.php) refuses to run without config.php, so the
   form will report a polite server error rather than leaking anything.
   ========================================================================== */

/* --------------------------------------------------------------- SMTP host
   The outgoing mail server. Two normal choices:
     • cPanel mailbox  ->  'mail.coodutrust.org'   (same server as the site)
     • Gmail / Google Workspace  ->  'smtp.gmail.com'
   Use the hostname your mail provider documents, not an IP address, so TLS
   certificate verification succeeds. */
define('COODU_SMTP_HOST', 'mail.coodutrust.org');

/* --------------------------------------------------------------- SMTP port
   587 with STARTTLS (recommended) or 465 with implicit TLS.
   Port 25 is blocked by most hosts and must not be used. */
define('COODU_SMTP_PORT', 587);

/* ------------------------------------------------------------- SMTP secure
   'tls' for port 587 (STARTTLS)   |   'ssl' for port 465 (implicit TLS).
   Must match the port above. */
define('COODU_SMTP_SECURE', 'tls');

/* ------------------------------------------------------- SMTP credentials
   The mailbox the script logs in as. For cPanel this is the full email
   address of a mailbox you created in cPanel > Email Accounts; for Gmail it
   is the Google account address.
   COODU_SMTP_PASS: the mailbox password, or — for Gmail / Workspace — a
   16-character App Password (Google account > Security > App passwords).
   A normal Google password will NOT work once 2-Step Verification is on. */
define('COODU_SMTP_USER', 'website@coodutrust.org');
define('COODU_SMTP_PASS', 'REPLACE-WITH-THE-MAILBOX-PASSWORD');

/* -------------------------------------------------------------- From / To
   COODU_MAIL_FROM must be a mailbox on a domain you control and, for SPF and
   DKIM to pass, it should normally be the same address as COODU_SMTP_USER.
   Do NOT put the visitor's address here — that is what Reply-To is for.
   COODU_MAIL_TO is where enquiries land. */
define('COODU_MAIL_FROM',      'website@coodutrust.org');
define('COODU_MAIL_FROM_NAME', 'Coodu Trust website');
define('COODU_MAIL_TO',        'director@coodutrust.org');
define('COODU_MAIL_TO_NAME',   'Coodu Trust');

/* ---------------------------------------------------------- SMTP debugging
   0 = silent (correct in production). Raise to 2 only while testing from the
   command line; the endpoint never prints debug output to the browser. */
define('COODU_SMTP_DEBUG', 0);
