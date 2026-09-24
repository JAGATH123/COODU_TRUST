# Coodu Trust — deployment and setup

**How this site actually runs:** static HTML/CSS/JS served straight from cPanel,
with three small PHP endpoints for the contact form and donations.

There is **no Node.js server, no MongoDB and no `.env` file** in the live setup.
A `server/` folder exists in this repo containing an Express + MongoDB
implementation. **It has never been deployed and is not the live path.** Ignore it.
Earlier versions of this file documented that Node setup and were wrong; following
them creates the wrong configuration in the wrong place.

---

## The one file that is not in git

Everything the site needs is committed **except** `assets/php/config.php`, which
holds the Razorpay keys and the mailbox password. It is gitignored on purpose —
this repository is public and is also the web root, so anything committed is
downloadable by anyone.

It must be created **by hand on the server**, at exactly:

```
public_html/assets/php/config.php
```

Copy `assets/php/config.sample.php` to `config.php` in that same folder and fill
in the values. The endpoints refuse to run without it and report a polite error
rather than falling back to anything guessable.

**Donations do not need the email settings.** `razorpay-create-order.php` requires
only `COODU_RZP_KEY_ID` and `COODU_RZP_KEY_SECRET`. If the SMTP block is absent the
payment still completes and is recorded; only the receipt email is skipped. So you
can take payments before the mailbox is sorted out.

---

## Deploying a change

The repo is the document root, but **nothing deploys automatically.** Uploading is
a manual step. To see what has changed since the last upload, compare the live
site against `HEAD`:

```
curl -s https://coodutrust.org/<path> | md5    # vs    git show HEAD:<path> | md5
```

Remember to bump the `?v=` query string in the HTML whenever you change a CSS or
JS file — the server sends `cache-control: max-age=604800` with no ETag, so
returning visitors will otherwise keep the old file for a week.

---

## Getting donations working — cPanel checklist

Written for someone who has not used PHP. Allow twenty minutes.

Have your Razorpay dashboard open first: *Account & Settings → API Keys*. You need
the **Key Id** (starts `rzp_test_` or `rzp_live_`) and the **Key Secret**. The
Secret is shown only once at generation — if you do not have it saved, click
**Regenerate** and copy both values immediately.

1. **Log in to cPanel** and open **File Manager** (under *Files*).

2. **Settings** (top right) → tick **Show Hidden Files (dotfiles)** → Save.

3. Navigate to **`public_html` → `assets` → `php`**.
   You are in the right folder only if you can see `razorpay-create-order.php`,
   `contact-submit.php` and `config.sample.php`. Do not continue otherwise.

4. **Look for `config.php`.**
   - Not there → go to step 5.
   - There but `0 bytes` → delete it, go to step 5.
   - Named `config.php.txt`, `config.txt` or `config` → rename it to exactly
     `config.php`, then go to step 6.

5. **Create it by copying the sample.** Select `config.sample.php` (single click,
   do not open), click **Copy**, and set the destination path to
   `/public_html/assets/php/config.php`. Click **Copy File(s)**, then **Reload**.

6. **Put the keys in.** Select `config.php` → **Edit**. At the bottom, replace the
   text *between the quotes* on these two lines:

   ```php
   define('COODU_RZP_KEY_ID',     'rzp_test_REPLACE-WITH-THE-KEY-ID');
   define('COODU_RZP_KEY_SECRET', 'REPLACE-WITH-THE-KEY-SECRET');
   ```

   The words `REPLACE-WITH` must not survive anywhere — the site deliberately
   refuses to take money while that placeholder is present. Save, then Close.

7. **Permissions.** `config.php` → **Permissions** → `0644`. Then select the
   `data` folder → **Permissions** → `0755`.
   (`config.php` is already blocked from the public internet by
   `assets/php/.htaccess`; requesting it returns 403.)

8. **Test.** Open `donate.html`, enter ₹1 and real-looking details. Match what you
   see against the table below.

| What you see | What it means | What to do |
|---|---|---|
| The Razorpay window opens | It worked | Pay with test card `4111 1111 1111 1111`, any future expiry, any CVV |
| *Online giving is temporarily unavailable* | The config gate. File missing, misnamed, wrong folder, or still says `REPLACE-WITH` | Repeat steps 3–6, then read the log (below) |
| *We could not reach the payment gateway* | Keys are fine; the server is blocked from reaching Razorpay | Raise a ticket with your host — see below |
| *Online giving is misconfigured at our end* | Razorpay rejected the keys | Re-copy both values together; check for stray spaces |
| *The payment gateway refused the request* | Razorpay accepted the login but declined the order | Check for warnings on your Razorpay dashboard |

9. **Confirm it was recorded.** After a successful payment there should be a new
   `.json` file in `public_html/assets/php/data/orders`. If not, fix the `data`
   folder permissions and retest — without that file the trust gets a ₹0.00
   notification it cannot reconcile.

### Reading the server's own explanation

cPanel home → **Metrics → Errors**. Newest entries are at the **bottom**. Every
diagnostic this site writes begins with `COODU`, and says in plain words what is
wrong — for example `COODU: assets/php/config.php is missing.` or
`COODU: config.php is missing a value for COODU_RZP_KEY_ID.`

If that page is empty, look for a file named `error_log` inside
`public_html/assets/php/` and then `public_html/`.

### If the gateway is unreachable

That is a firewall rule set in WHM, which shared-hosting customers cannot see.
Send your host this:

> Please check whether outbound HTTPS is permitted from my account. A PHP script
> uses cURL to reach `https://api.razorpay.com` on TCP port 443 and is reporting a
> transport error. Please confirm that port 443 is present in `TCP_OUT` in the CSF
> firewall configuration, that `api.razorpay.com` is not blocked by egress or DNS
> filtering, and that the `curl` and `openssl` PHP extensions are enabled for my
> domain. The script is `/public_html/assets/php/razorpay-create-order.php`.

You can check the extensions yourself: cPanel → *Software → Select PHP Version →
Extensions*. `curl`, `openssl` and `mbstring` should be ticked. `allow_url_fopen`
is **not** needed — the code uses cURL only, and there is no Composer dependency.

---

## Going live with real money

Replace **both** values in `config.php` with the `rzp_live_` pair — together,
never a live Id with a test Secret. Live keys require completed Razorpay KYC and
the published Privacy, Terms and Refund policy pages, which are already on the
site.

---

## The contact form

Same `config.php`, the `COODU_SMTP_*` and `COODU_MAIL_*` block. Host
`mail.coodutrust.org`, port 587, `tls`, and the full address plus password of a
mailbox created in *cPanel → Email Accounts* (`website@coodutrust.org`).

Note that the contact endpoint checks only for an *empty* password, not for the
placeholder text — leaving `REPLACE-WITH-THE-MAILBOX-PASSWORD` in place will pass
the configuration check and then fail later at SMTP login.

---

## Known server facts

Verified against the live host, September 2026:

- Apache, **PHP 7.3.33**. That version has been end-of-life since December 2021.
  The site's code is compatible with it and is tested on 7.3, 7.4, 8.2 and 8.4,
  but the host should be moved to 8.1 or newer via *Select PHP Version*. Retest
  the donate and contact flows after any version change.
- **ModSecurity is active** and correctly passes the site's own payloads. It does
  block obvious injection attempts, which is what it is for.
- `assets/php/.htaccess` and `assets/php/lib/.htaccess` are deployed and
  enforcing: `config.php`, `config.sample.php` and everything in `lib/` return
  403, and directory listings are off.

---

## Local development

There is no PHP on the project machine. To run the endpoints locally:

```
docker run --rm -d --name coodu-php -v "$PWD":/app -w /app -p 8099:8099 \
  php:7.3-cli php -S 0.0.0.0:8099 -t /app
```

Use `php:7.3-cli` to match production. Note that `php -S` ignores `.htaccess`, so
access-denial rules cannot be tested this way — only read them.

Preview the static pages over HTTP, never `file://`:

```
python3 -m http.server 8765
```

Programme-page heroes use root-absolute paths inside a CSS custom property, which
resolve against the disk root under `file://` and render as flat green.
