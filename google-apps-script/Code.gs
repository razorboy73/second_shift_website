/**
 * Second Shift Ops: contact form mailer.
 *
 * Runs in your Google account and sends website inquiries from your Gmail.
 * The website server POSTs JSON here; this script checks the shared secret and emails CONTACT_TO.
 *
 * Setup (see README.md, "Contact form email"):
 *   1. Paste this file into a new Apps Script project at script.google.com.
 *   2. Project Settings > Script properties: add SHARED_SECRET (a long random string)
 *      and, optionally, CONTACT_TO (defaults to your own Gmail address).
 *   3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *   4. Put the web app URL and the same secret in Railway as GMAIL_SCRIPT_URL and GMAIL_SCRIPT_SECRET.
 */
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('SHARED_SECRET');
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'bad_json' });
  }
  if (!secret || data.secret !== secret) return reply_({ ok: false, error: 'unauthorized' });
  if (!data.subject || !data.text) return reply_({ ok: false, error: 'missing_fields' });

  var to = props.getProperty('CONTACT_TO') || Session.getEffectiveUser().getEmail();
  var options = { name: 'Second Shift Ops Website', htmlBody: data.html || undefined };
  if (data.replyTo) options.replyTo = data.replyTo;

  MailApp.sendEmail(to, String(data.subject).slice(0, 250), String(data.text), options);
  return reply_({ ok: true, remaining: MailApp.getRemainingDailyQuota() });
}

// Opening the URL in a browser shows this, which confirms the deployment works.
function doGet() {
  return reply_({ ok: true, service: 'Second Shift Ops contact mailer' });
}

// Run once from the editor to grant Gmail permission and send yourself a test email.
function sendTestEmail() {
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Second Shift Ops mailer test', 'The contact form mailer can send email from this account.');
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
