// Second Shift Ops web server: serves public/ and handles POST /api/contact.
// Email delivery (set in Railway variables, see .env.example):
//   RESEND_API_KEY        -> sends through Resend's HTTPS API (recommended on Railway)
//   SMTP_HOST/PORT/USER/PASS -> sends through any SMTP server via nodemailer
// With neither set, submissions are logged to the console (fine for local dev).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'public');
const PORT = Number(process.env.PORT) || 3000;
const CONTACT_TO = process.env.CONTACT_TO || 'joshadamkerbel@gmail.com';
const MAIL_FROM = process.env.MAIL_FROM || 'Second Shift Ops Website <onboarding@resend.dev>';
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_ENVIRONMENT;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}
const sendJson = (res, status, obj) => send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json' });

// ---------- Static files ----------
async function resolveFile(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { return null; }
  p = normalize(p).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, p);
  if (!base.startsWith(ROOT)) return null;
  for (const candidate of [base, base + '.html', join(base, 'index.html')]) {
    try {
      const s = await stat(candidate);
      if (s.isFile()) return candidate;
    } catch { /* try next */ }
  }
  return null;
}

async function serveStatic(req, res, pathname) {
  // Directory URLs without a trailing slash -> redirect so relative paths behave
  if (pathname.startsWith('/solutions/') && !pathname.endsWith('/') && !extname(pathname)) {
    return send(res, 301, '', { Location: pathname + '/' });
  }
  const file = await resolveFile(pathname);
  if (!file) {
    const notFound = await readFile(join(ROOT, '404.html')).catch(() => 'Not found');
    return send(res, 404, notFound, { 'Content-Type': MIME['.html'] });
  }
  const ext = extname(file);
  const cache = ext === '.html' ? 'no-cache' : 'public, max-age=86400';
  const body = await readFile(file);
  send(res, 200, req.method === 'HEAD' ? '' : body, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache });
}

// ---------- Contact form ----------
const hits = new Map(); // ip -> [timestamps]; simple in-memory rate limit
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

function readBody(req, limit = 20_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('too_large')); req.destroy(); }
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const clean = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);
const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildEmail(f) {
  const rows = [
    ['Name', f.name], ['Email', f.email], ['Phone', f.phone], ['Business', f.company],
    ['Industry', f.industry], ['Team size', f.teamSize], ['Interested in', f.interest], ['Page', f.page],
  ].filter(([, v]) => v);
  const subject = `New inquiry: ${f.name}${f.company ? ` (${f.company})` : ''}${f.industry ? ` - ${f.industry}` : ''}`.replace(/[\n]/g, ' ');
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${f.message}\n`;
  const html = `<div style="font-family:Arial,sans-serif;color:#0B1020;max-width:600px">
<h2 style="margin:0 0 16px">New website inquiry</h2>
<table style="border-collapse:collapse;width:100%">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#667085;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0">${escHtml(v)}</td></tr>`)
    .join('')}</table>
<h3 style="margin:24px 0 8px">Message</h3>
<p style="white-space:pre-wrap;line-height:1.6;margin:0">${escHtml(f.message)}</p>
</div>`;
  return { subject, text, html };
}

async function deliver(form) {
  const { subject, text, html } = buildEmail(form);
  if (process.env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: MAIL_FROM, to: [CONTACT_TO], reply_to: form.email, subject, text, html }),
    });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
    return 'resend';
  }
  if (process.env.SMTP_HOST) {
    const { default: nodemailer } = await import('nodemailer');
    const port = Number(process.env.SMTP_PORT) || 587;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port, secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: CONTACT_TO, replyTo: form.email, subject, text, html });
    return 'smtp';
  }
  if (IS_PROD) throw new Error('No email provider configured (set RESEND_API_KEY or SMTP_HOST).');
  console.log('\n[contact] No email provider configured; logging submission instead:\n' + text);
  return 'console';
}

async function handleContact(req, res) {
  const wantsJson = (req.headers.accept || '').includes('application/json');
  const fail = (status, error) =>
    wantsJson ? sendJson(res, status, { ok: false, error }) : send(res, 303, '', { Location: '/#contact' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
  if (rateLimited(ip)) return fail(429, 'Too many messages in a short time. Please try again in a few minutes.');

  let raw;
  try { raw = await readBody(req); } catch { return fail(413, 'That message is too long.'); }

  let data = {};
  const type = req.headers['content-type'] || '';
  try {
    data = type.includes('application/json') ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw));
  } catch { return fail(400, 'We could not read that submission.'); }

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (data.website) return wantsJson ? sendJson(res, 200, { ok: true }) : send(res, 303, '', { Location: '/thanks' });

  const form = {
    name: clean(data.name, 120), email: clean(data.email, 200), phone: clean(data.phone, 40),
    company: clean(data.company, 160), industry: clean(data.industry, 80), teamSize: clean(data.teamSize, 20), interest: clean(data.interest, 80),
    message: clean(data.message, 5000), page: clean(data.page, 200),
  };
  if (!form.name) return fail(400, 'Please tell us your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return fail(400, 'Please enter a valid email address.');
  if (form.message.length < 10) return fail(400, 'Please add a little more detail to your message.');

  try {
    const via = await deliver(form);
    console.log(`[contact] delivered via ${via} from ${form.email} (${form.page})`);
  } catch (err) {
    console.error('[contact] delivery failed:', err.message);
    return fail(502, 'Your message wasn’t sent because of a problem on our side.');
  }
  return wantsJson ? sendJson(res, 200, { ok: true }) : send(res, 303, '', { Location: '/thanks' });
}

// ---------- Server ----------
const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://localhost');
    if (pathname === '/healthz') return send(res, 200, 'ok', { 'Content-Type': 'text/plain' });
    if (pathname === '/api/contact') {
      if (req.method !== 'POST') return send(res, 405, '', { Allow: 'POST' });
      return await handleContact(req, res);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, '', { Allow: 'GET, HEAD' });
    return await serveStatic(req, res, pathname);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) send(res, 500, 'Server error', { 'Content-Type': 'text/plain' });
  }
});

server.listen(PORT, () => {
  const mail = process.env.RESEND_API_KEY ? 'Resend' : process.env.SMTP_HOST ? 'SMTP' : 'console (no provider set)';
  console.log(`Second Shift Ops running on http://localhost:${PORT}  |  contact email -> ${CONTACT_TO} via ${mail}`);
});
