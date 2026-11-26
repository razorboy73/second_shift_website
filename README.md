# Second Shift Ops website

Marketing site for Second Shift Ops: homepage, five industry landing pages and a contact form that emails new inquiries.

## Run locally

```bash
npm install
npm run dev          # builds pages, starts http://localhost:3000
```

Without an email provider configured, form submissions are printed to the terminal instead of emailed.

## Edit content

Pages are generated from `src/` into `public/`. Edit the source, then run `npm run build`.

| What | Where |
|---|---|
| Homepage copy | `src/pages/home.mjs` |
| Industry landing pages (all five), including each hero "handover board" | `src/content/industries.mjs` |
| Header, footer, contact form | `src/layout.mjs` |
| Styles | `public/css/site.css` (brand tokens come from `brand_assets/brand.css`) |
| Form behavior | `public/js/site.js` |
| Server and email sending | `server.mjs` |

The generated HTML in `public/` is committed, so Railway does not need a build step.

## Contact form email

`POST /api/contact` validates the submission (with a honeypot and a rate limit of 5 per IP per 10 minutes), then emails it with the visitor's address as reply-to.

### Google Workspace via Apps Script (recommended)

A small script in the josh@secondshiftops.co Google Workspace account sends each inquiry from that mailbox. The server calls it over HTTPS, which Railway allows on every plan (Railway blocks SMTP below Pro). No extra cost; Workspace allows about 1,500 script emails a day.

1. Sign in as josh@secondshiftops.co and go to [script.google.com](https://script.google.com) → **New project**. Name it "Second Shift Ops mailer".
2. Replace the contents of `Code.gs` with [`google-apps-script/Code.gs`](google-apps-script/Code.gs) and save.
3. Choose `sendTestEmail` in the function menu and click **Run**. Approve the permission prompt (Google warns the app is unverified because you wrote it: **Advanced → Go to project**). Check that the test email arrived.
4. **Project Settings** (gear icon) → **Script properties** → add `SHARED_SECRET` with a long random value.
5. **Deploy → New deployment** → type **Web app**. Execute as: **Me**. Who has access: **Anyone** (not "Anyone within secondshiftops.co"). Deploy and copy the web app URL (ends in `/exec`).
6. In Railway (or `.env` locally) set `GMAIL_SCRIPT_URL` to that URL and `GMAIL_SCRIPT_SECRET` to the same secret. Inquiries go to `CONTACT_TO` (default josh@secondshiftops.co).

"Anyone" only means the URL can be called without a Google login; the script ignores any request without the secret. If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

### SMTP (alternative)

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `CONTACT_TO`, e.g. Gmail with an app password. Railway only allows SMTP on the Pro plan and above.

See `.env.example` for every variable.

## Deploy to Railway

1. Push this folder to a GitHub repository.
2. In Railway: **New Project → Deploy from GitHub repo**. Railway detects Node and runs `npm start`.
3. Under **Variables**, add `GMAIL_SCRIPT_URL` and `GMAIL_SCRIPT_SECRET` (see above).
4. Under **Settings → Networking**, generate a domain or attach `secondshiftops.co`. Health check path: `/healthz`.

## Screenshots (design QA)

With the dev server running:

```bash
node screenshot.mjs http://localhost:3000 home
node screenshot.mjs http://localhost:3000/solutions/real-estate/ re --mobile
```

These are saved to `temporary screenshots/` (git-ignored) and use your installed Chrome or Edge.
