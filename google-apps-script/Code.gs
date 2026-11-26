/**
 * Second Shift Ops: contact form mailer.
 *
 * Runs in the Google Workspace account josh@secondshiftops.co and sends website inquiries
 * from that mailbox. The website server POSTs JSON here; this script checks the shared secret
 * and sends the email.
 *
 * Setup (see README.md, "Contact form email"):
 *   1. Signed in as josh@secondshiftops.co, paste this file into a new project at script.google.com.
 *   2. Run sendTestEmail once to grant permission.
 *   3. Project Settings > Script properties: add SHARED_SECRET (a long random string).
 *   4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *   5. In Railway set GMAIL_SCRIPT_URL (the /exec URL) and GMAIL_SCRIPT_SECRET (same secret).
 *
 * Recipient: the server sends CONTACT_TO. A CONTACT_TO script property overrides it; with
 * neither, the email goes to the mailbox running this script.
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

  var to = props.getProperty('CONTACT_TO') || data.to || Session.getEffectiveUser().getEmail();
  var options = { name: 'Second Shift Ops Website', htmlBody: data.html || undefined };
  if (data.replyTo) options.replyTo = data.replyTo;

  MailApp.sendEmail(to, String(data.subject).slice(0, 250), String(data.text), options);
  return reply_({ ok: true, remaining: MailApp.getRemainingDailyQuota() });
}

// Opening the URL in a browser shows this, which confirms the deployment works.
function doGet() {
  return reply_({ ok: true, service: 'Second Shift Ops contact mailer' });
}

// Run once from the editor to grant permission and send yourself a test email.
function sendTestEmail() {
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Second Shift Ops mailer test', 'The contact form mailer can send email from this account.');
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
