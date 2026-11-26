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

`POST /api/contact` validates the submission (with a honeypot and a rate limit of 5 per IP per 10 minutes) and emails it to `CONTACT_TO` with the sender as reply-to. Set one provider:

- **Resend (recommended):** create an API key at resend.com and set `RESEND_API_KEY`. Until you verify a domain in Resend, it only delivers to the email address on your Resend account, and `MAIL_FROM` must stay `onboarding@resend.dev`. Sign up with the same address as `CONTACT_TO`, or verify `secondshiftops.co` and set `MAIL_FROM` to something like `Website <hello@secondshiftops.co>`.
- **SMTP:** set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Railway blocks outbound SMTP on some plans, so Resend is the safer choice there.

See `.env.example` for every variable.

## Deploy to Railway

1. Push this folder to a GitHub repository.
2. In Railway: **New Project → Deploy from GitHub repo**. Railway detects Node and runs `npm start`.
3. Under **Variables**, add `RESEND_API_KEY` (and optionally `CONTACT_TO`, `MAIL_FROM`).
4. Under **Settings → Networking**, generate a domain or attach `secondshiftops.co`. Health check path: `/healthz`.

## Screenshots (design QA)

With the dev server running:

```bash
node screenshot.mjs http://localhost:3000 home
node screenshot.mjs http://localhost:3000/solutions/real-estate/ re --mobile
```

These are saved to `temporary screenshots/` (git-ignored) and use your installed Chrome or Edge.
