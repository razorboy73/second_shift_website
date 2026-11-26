import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { icon } from './icons.mjs';
import { industries } from './content/industries.mjs';

// Content fingerprint for CSS/JS URLs, so browsers fetch new versions as soon as files change.
const ROOT = new URL('../', import.meta.url);
const ver = (file) => createHash('sha1').update(readFileSync(new URL(file, ROOT))).digest('hex').slice(0, 8);
const V = { brand: ver('brand_assets/brand.css'), css: ver('public/css/site.css'), js: ver('public/js/site.js') };

export const SITE = {
  name: 'Second Shift Ops',
  url: 'https://secondshiftops.co',
  email: 'josh@secondshiftops.co',
  tagline: 'Less grunt work. More great work.',
  promise: 'Intelligent workflow automation for businesses with better things to do.',
};

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function page({ title, description, path, body, industrySlug = '', hasContact = true }) {
  const contactHref = hasContact ? '#contact' : '/#contact';
  const fullTitle = path === '/' ? `${SITE.name} | AI workflow automation for professionals & growing businesses` : `${title} | ${SITE.name}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE.url}${path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE.url}${path}">
<meta property="og:image" content="${SITE.url}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B1020">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/css/brand.css?v=${V.brand}">
<link rel="stylesheet" href="/css/site.css?v=${V.css}">
<script src="/js/site.js?v=${V.js}" defer></script>
</head>
<body data-industry="${esc(industrySlug)}">
<a class="skip-link" href="#main">Skip to content</a>
${header(contactHref)}
<main id="main">
${body}
</main>
${footer(contactHref)}
</body>
</html>
`;
}

function header(contactHref) {
  const solutionLinks = industries
    .map((i) => `<li><a href="/solutions/${i.slug}/">${icon(i.icon, { size: 20 })}<span><strong>${esc(i.navLabel)}</strong><small>${esc(i.navBlurb)}</small></span></a></li>`)
    .join('\n');
  return `<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="site-header__logo" href="/" aria-label="Second Shift Ops home">
      <img src="/assets/logo-horizontal-light.png" alt="Second Shift Ops" width="200" height="39">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
      <span class="sr-only">Menu</span>${icon('menu', { cls: 'nav-toggle__open' })}${icon('x', { cls: 'nav-toggle__close' })}
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="site-nav__list">
        <li class="has-menu">
          <button type="button" class="site-nav__link" aria-expanded="false" aria-controls="solutions-menu" data-menu-toggle>Solutions ${icon('chevronDown', { size: 16 })}</button>
          <ul class="site-nav__menu" id="solutions-menu">
${solutionLinks}
          </ul>
        </li>
        <li><a class="site-nav__link" href="/#services">Services</a></li>
        <li><a class="site-nav__link" href="/#training">Training</a></li>
        <li><a class="site-nav__link" href="/#approach">Our approach</a></li>
        <li><a class="site-nav__link" href="/#faq">FAQ</a></li>
      </ul>
      <a class="button button--primary site-nav__cta" href="${contactHref}">Reclaim your time</a>
    </nav>
  </div>
</header>`;
}

function footer(contactHref) {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <img src="/assets/logo-horizontal-light.png" alt="Second Shift Ops" width="200" height="39" loading="lazy">
      <p class="site-footer__tagline">${SITE.tagline}</p>
      <p>${SITE.promise}</p>
    </div>
    <div>
      <h2 class="site-footer__heading">Solutions</h2>
      <ul>${industries.map((i) => `<li><a href="/solutions/${i.slug}/">${esc(i.navLabel)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="site-footer__heading">Services</h2>
      <ul>
        <li><a href="/#services">AI readiness review</a></li>
        <li><a href="/#services">Build &amp; implement</a></li>
        <li><a href="/#training">Team training</a></li>
        <li><a href="/#services">Ongoing support</a></li>
      </ul>
    </div>
    <div>
      <h2 class="site-footer__heading">Company</h2>
      <ul>
        <li><a href="/#approach">Our approach</a></li>
        <li><a href="/#faq">FAQ</a></li>
        <li><a href="${contactHref}">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="container site-footer__base">
    <p>&copy; ${year} Second Shift Ops. All rights reserved.</p>
    <p>secondshiftops.co</p>
  </div>
</footer>`;
}

const TAGS = {
  ai: { label: 'AI', title: 'Done by AI' },
  auto: { label: 'Automated', title: 'Rule-based automation' },
  you: { label: 'You approved', title: 'A person reviewed and approved' },
  needs: { label: 'Needs you', title: 'Sent to a person to decide' },
};
const tag = (by) => `<span class="tag tag--${by}" title="${TAGS[by].title}">${TAGS[by].label}</span>`;

function boardPanel(ind, { id, active }) {
  let n = 0;
  const day = ind.board.day
    .map((d) => {
      if (d.keep) return `<li class="task task--keep">${esc(d.text)}</li>`;
      return `<li class="task task--handoff" style="--i:${n++}"><span class="task__text">${esc(d.text)}</span><span class="task__note">Handed off</span></li>`;
    })
    .join('\n');
  const log = ind.board.log
    .map((l, i) => `<li class="log__item" style="--i:${i}"><time>${esc(l.t)}</time><span class="log__text">${esc(l.text)}</span>${tag(l.by)}</li>`)
    .join('\n');
  return `<div class="board__panel${active ? ' is-active is-playing' : ''}" id="${id}" role="tabpanel" aria-label="${esc(ind.board.setting)}"${active ? '' : ' hidden'}>
    <p class="board__setting">${esc(ind.board.setting)}</p>
    <div class="board__cols">
      <section class="board__day" aria-label="Your day">
        <h3 class="board__title">Your day</h3>
        <ul class="tasks">
${day}
        </ul>
      </section>
      <div class="board__handoff" aria-hidden="true">${icon('sync', { size: 22 })}</div>
      <section class="board__log" aria-label="Handled for you">
        <h3 class="board__title">Handled for you</h3>
        <ol class="log">
${log}
        </ol>
      </section>
    </div>
  </div>`;
}

/** The hero "handover board". With several industries it gets tabs; with one it's a single panel. */
export function handoverBoard(list) {
  const multi = list.length > 1;
  const tabs = multi
    ? `<div class="board__tabs" role="tablist" aria-label="Show a day in your industry" data-tablist hidden>
    <span class="board__tabs-label" aria-hidden="true">Show me a day in</span>
${list.map((ind, i) => `    <button type="button" role="tab" id="tab-${ind.slug}" aria-controls="board-${ind.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(ind.tabLabel)}</button>`).join('\n')}
  </div>`
    : '';
  return `<div class="board" data-tabs data-board>
  ${tabs}
  <div class="board__frame">
${list.map((ind, i) => boardPanel(ind, { id: `board-${ind.slug}`, active: i === 0 })).join('\n')}
    <p class="board__legend">${tag('ai')} drafts, reads and sorts. ${tag('auto')} sends and syncs. ${tag('needs')} and ${tag('you')} mean a person made the call.</p>
  </div>
</div>`;
}

export function faqList(items) {
  return `<div class="faq">
${items
  .map(
    (f) => `<details class="faq__item">
  <summary>${esc(f.q)}${icon('chevronDown', { size: 20 })}</summary>
  <div class="faq__answer"><p>${esc(f.a)}</p></div>
</details>`
  )
  .join('\n')}
</div>`;
}

const INDUSTRY_OPTIONS = [
  'Accounting or bookkeeping',
  'Real estate',
  'Legal',
  'Plumbing, HVAC or electrical',
  'Lawn care or landscaping',
  'General contracting or construction',
  'Salon, spa or studio',
  'Manufacturing',
  'Other professional services',
  'Something else',
];

const INTEREST_OPTIONS = [
  'Winning more clients',
  'Streamlining operations',
  'An AI readiness review',
  'Training my team',
  'Not sure yet',
];

export function contactSection({ heading = 'Reclaim your time.', intro, industry = '' } = {}) {
  const lead =
    intro ||
    'Tell us where you’d like AI to help: winning clients, running operations, or working out where to start. We’ll reply within one business day to set up a short call.';
  const opts = (list, selected = '') => list.map((o) => `<option${o === selected ? ' selected' : ''}>${esc(o)}</option>`).join('');
  return `<section class="section contact" id="contact" aria-labelledby="contact-heading">
  <div class="container contact__grid">
    <div class="contact__intro">
      <h2 id="contact-heading">${esc(heading)}</h2>
      <p class="contact__lead">${esc(lead)}</p>
      <ol class="contact__steps">
        <li><span class="contact__num">1</span><span><strong>Tell us what’s slowing you down.</strong> A few sentences is plenty.</span></li>
        <li><span class="contact__num">2</span><span><strong>We talk it through.</strong> A short call about how work and new business flow through your company today.</span></li>
        <li><span class="contact__num">3</span><span><strong>You get a plain-English plan.</strong> Where AI will help most, what to do first, and what it costs.</span></li>
      </ol>
    </div>
    <form class="form" action="/api/contact" method="post" data-contact-form novalidate>
      <input type="hidden" name="page" value="">
      <div class="form__hp" aria-hidden="true">
        <label>Leave this field empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
      </div>
      <div class="form__row">
        <div class="field">
          <label for="cf-name">Name <span aria-hidden="true">*</span></label>
          <input id="cf-name" name="name" type="text" autocomplete="name" required maxlength="120">
        </div>
        <div class="field">
          <label for="cf-email">Work email <span aria-hidden="true">*</span></label>
          <input id="cf-email" name="email" type="email" autocomplete="email" required maxlength="200">
        </div>
      </div>
      <div class="form__row">
        <div class="field">
          <label for="cf-company">Business name</label>
          <input id="cf-company" name="company" type="text" autocomplete="organization" maxlength="160">
        </div>
        <div class="field">
          <label for="cf-phone">Phone <span class="field__hint">(optional)</span></label>
          <input id="cf-phone" name="phone" type="tel" autocomplete="tel" maxlength="40">
        </div>
      </div>
      <div class="form__row form__row--3">
        <div class="field">
          <label for="cf-industry">Industry</label>
          <select id="cf-industry" name="industry"><option value="">Select one</option>${opts(INDUSTRY_OPTIONS, industry)}</select>
        </div>
        <div class="field">
          <label for="cf-size">Team size</label>
          <select id="cf-size" name="teamSize"><option value="">Select one</option>${opts(['Just me', '2–10', '11–50', '51–200', '200+'])}</select>
        </div>
        <div class="field">
          <label for="cf-interest">Most interested in</label>
          <select id="cf-interest" name="interest"><option value="">Select one</option>${opts(INTEREST_OPTIONS)}</select>
        </div>
      </div>
      <div class="field">
        <label for="cf-message">What would you like AI to take off your plate? <span aria-hidden="true">*</span></label>
        <textarea id="cf-message" name="message" rows="5" required maxlength="5000" placeholder="For example: leads that come in after hours wait until morning, and month-end reporting takes us two days."></textarea>
      </div>
      <p class="form__error" role="alert" data-form-error hidden></p>
      <button class="button button--primary button--block" type="submit" data-submit><span data-submit-label>Book a consultation</span></button>
      <p class="form__note">Fields marked * are required. We only use your details to reply to you.</p>
      <div class="form__success" role="status" data-form-success hidden>
        ${icon('check', { size: 28 })}
        <h3>Thanks. Your message is on its way.</h3>
        <p>We’ll reply within one business day. If it’s urgent, email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
      </div>
    </form>
  </div>
</section>`;
}
