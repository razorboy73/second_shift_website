import { icon } from '../icons.mjs';
import { esc, page, handoverBoard, faqList, contactSection } from '../layout.mjs';
import { industries } from '../content/industries.mjs';
import { services } from './home.mjs';

const GROUPS = [
  ['clients', 'Win more clients'],
  ['ops', 'Run a tighter operation'],
];

export function renderIndustry(ind) {
  const others = industries.filter((i) => i.slug !== ind.slug);
  const team = ind.slug === 'law-firms' ? 'firm' : 'team';
  const body = `
<section class="hero hero--industry" aria-labelledby="hero-heading">
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${esc(ind.navLabel)}</span></nav>
    <div class="hero__top">
      <h1 id="hero-heading" class="h1--industry">${esc(ind.headline)}</h1>
      <div class="hero__aside">
        <p class="hero__detail">${esc(ind.sub)}</p>
        <div class="hero__actions">
          <a class="button button--primary button--hero" href="#contact">Reclaim your time</a>
          <a class="button button--ghost button--hero" href="#workflows">See the workflows</a>
        </div>
      </div>
    </div>
    ${handoverBoard([ind])}
  </div>
</section>

<section class="section pains" aria-labelledby="pains-heading">
  <div class="container pains__grid">
    <h2 id="pains-heading" class="section-title">${esc(ind.painsHeading)}</h2>
    <ul class="pains__list">
${ind.pains.map((p) => `      <li>${esc(p)}</li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="section workflows" id="workflows" aria-labelledby="wf-heading">
  <div class="container">
    <div class="section-intro">
      <h2 id="wf-heading" class="section-title">Where AI helps, and where you stay in charge.</h2>
      <p>Each workflow runs on the tools you already use. Start with one, and add more once it’s paying off.</p>
    </div>
${GROUPS.map(
  ([g, label]) => `    <div class="wf-group">
      <h3 class="wf-group__title">${label}</h3>
      <ul class="wf-list">
${ind.workflows
  .filter((w) => w.group === g)
  .map(
    (w) => `        <li class="wf">
          <h4>${icon(w.icon, { size: 22 })}${esc(w.title)}</h4>
          <p class="wf__body">${esc(w.body)}</p>
          <p class="wf__check">${icon('shield', { size: 18 })}<span><span class="sr-only">Human check: </span>${esc(w.check)}</span></p>
        </li>`
  )
  .join('\n')}
      </ul>
    </div>`
).join('\n')}
  </div>
</section>

<section class="section compare" aria-labelledby="ba-heading">
  <div class="container">
    <h2 id="ba-heading" class="section-title">What changes day to day.</h2>
    <table class="ba">
      <thead><tr><th scope="col">Task</th><th scope="col">Today</th><th scope="col">With AI, set up properly</th></tr></thead>
      <tbody>
${ind.beforeAfter.map(([task, before, after]) => `        <tr><th scope="row">${esc(task)}</th><td data-label="Today">${esc(before)}</td><td data-label="With AI">${esc(after)}</td></tr>`).join('\n')}
      </tbody>
    </table>
    <div class="tools">
      <h3 class="tools__label">Works with tools you may already use</h3>
      <ul class="tools__list">${ind.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="tools__note">Product names are trademarks of their owners, listed to show compatibility, not endorsement.</p>
    </div>
  </div>
</section>

<section class="section services services--compact" aria-labelledby="services-heading">
  <div class="container">
    <div class="section-intro section-intro--dark">
      <h2 id="services-heading" class="section-title">How we work with your ${team}.</h2>
      <p>A readiness review is the usual first step, but you can start at any stage.</p>
    </div>
    <ol class="track">
${services.map(([ic, t, d], n) => `      <li class="track__step"><span class="track__num">${String(n + 1).padStart(2, '0')}</span><h3>${icon(ic, { size: 22 })}${esc(t)}</h3><p>${esc(d)}</p></li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="section faq-section" aria-labelledby="faq-heading">
  <div class="container faq-section__grid">
    <h2 id="faq-heading" class="section-title">Common questions.</h2>
    ${faqList(ind.faq)}
  </div>
</section>

${contactSection({
  intro: `Tell us where AI could help your ${team} most, whether that’s winning new clients or clearing the admin. We’ll reply within one business day to set up a short call.`,
  industry: ind.formIndustry,
})}

<section class="related" aria-labelledby="related-heading">
  <div class="container related__inner">
    <h2 id="related-heading" class="related__title">Other industries we work with</h2>
    <ul class="related__list">
${others.map((o) => `      <li><a href="/solutions/${o.slug}/">${icon(o.icon, { size: 20 })}<span>${esc(o.navLabel)}</span></a></li>`).join('\n')}
    </ul>
  </div>
</section>
`;
  return page({ title: ind.title, description: ind.description, path: `/solutions/${ind.slug}/`, body, industrySlug: ind.slug });
}
