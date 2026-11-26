import { icon } from '../icons.mjs';
import { SITE, esc, page, handoverBoard, faqList, contactSection } from '../layout.mjs';
import { industries } from '../content/industries.mjs';

// Two places AI pays off fastest
const pillars = [
  {
    id: 'clients',
    title: 'Win more clients',
    intro: 'Most small businesses don’t lose work to competitors. They lose it to slow replies and follow-ups nobody had time to send.',
    items: [
      ['Find prospects worth contacting', 'AI researches lists like expired listings, new businesses in your area or old inquiries, and surfaces the ones that fit.'],
      ['Personal outreach without the hours', 'A first draft written for each prospect, approved by you before anything is sent.'],
      ['Every inquiry answered in minutes', 'AI replies, asks the qualifying questions and books the call, including evenings and weekends.'],
      ['Follow-up until there’s an answer', 'Quotes and proposals chased politely and on schedule, so deals don’t go quiet.'],
      ['Referrals and reviews, on cue', 'Happy clients asked at the right moment, every time.'],
    ],
  },
  {
    id: 'ops',
    title: 'Run a tighter operation',
    intro: 'The other half of the week goes to work that keeps the lights on: reading, typing, sorting, chasing and reporting.',
    items: [
      ['Documents read for you', 'Invoices, receipts, contracts and forms read, sorted and entered into the right system.'],
      ['An inbox that triages itself', 'Email sorted, summarized and routed, with routine replies drafted and waiting.'],
      ['Reports written, not assembled', 'Numbers pulled from your systems and summarized in plain English.'],
      ['Systems that stay in sync', 'Details entered once and updated everywhere: CRM, accounting, scheduling.'],
      ['Scheduling, reminders and invoicing', 'The routine admin that runs on its own once it’s set up properly.'],
    ],
  },
];

// Industry index: [group, what's slowing you down, what we put in place]
const index = [
  {
    name: 'Accountants & accounting firms', icon: 'calculator', link: '/solutions/accounting-firms/',
    rows: [
      ['clients', 'Inquiries wait days during busy season', 'AI replies in minutes, qualifies the prospect and books the call'],
      ['clients', 'Referrals depend on someone remembering to ask', 'Referral requests sent when a client is happiest'],
      ['ops', 'Chasing and sorting client documents', 'AI recognizes and files W-2s, 1099s and K-1s, and chases what’s missing'],
      ['ops', 'Monthly reports assembled by hand', 'Figures pulled and commentary drafted, ready for review'],
    ],
  },
  {
    name: 'Real estate agents', icon: 'home', link: '/solutions/real-estate/',
    rows: [
      ['clients', 'Leads going cold while you’re at a showing', 'Instant, personal replies that qualify and book showings'],
      ['clients', 'No time to prospect', 'Expired listings and FSBOs researched, with outreach drafted for your approval'],
      ['ops', 'Writing every listing from scratch', 'Descriptions, posts and emails drafted from your notes and photos'],
      ['ops', 'Tracking a dozen contract dates', 'AI reads the contract and sets up the reminders'],
    ],
  },
  {
    name: 'Lawyers & law firms', icon: 'scale', link: '/solutions/law-firms/',
    rows: [
      ['clients', 'Slow intake and callbacks', 'Inquiries screened by practice area and consultations booked the same day'],
      ['clients', 'Consultations that never get a follow-up', 'Courteous follow-up from attorney-approved templates'],
      ['ops', 'Rebuilding the same documents', 'First drafts from your own templates, ready for attorney review'],
      ['ops', 'Unbilled time', 'Time entries suggested from calendars, emails and documents'],
    ],
  },
  {
    name: 'Manufacturing', icon: 'factory', link: null,
    rows: [
      ['clients', 'RFQs answered slowly', 'AI reads incoming RFQs and drawings and drafts the quote for your estimator'],
      ['clients', 'Customers calling to ask where their order is', 'Status updates sent automatically at each production and shipping stage'],
      ['ops', 'Purchase orders re-keyed from email into the ERP', 'AI reads POs, enters them and flags anything that doesn’t match'],
      ['ops', 'Inventory checked by walking the floor', 'Low-stock alerts and draft supplier orders at the thresholds you set'],
    ],
  },
  {
    name: 'Salons & spas', icon: 'scissors', link: '/solutions/salons-spas/',
    rows: [
      ['clients', 'Booking messages answered hours later', 'An AI assistant that answers and books on Instagram and your website'],
      ['clients', 'Regulars quietly drifting away', 'Personal win-back notes based on each client’s service interval'],
      ['ops', 'No-shows and empty slots', 'Reminders, deposits and automatic waitlist offers'],
      ['ops', 'Commissions tallied in a spreadsheet', 'Payroll summaries compiled per stylist'],
    ],
  },
  {
    name: 'Lawn care & landscaping', icon: 'sprout', link: '/solutions/trades-home-services/',
    rows: [
      ['clients', 'Quote requests in the busy season', 'AI replies, gathers property details and books the estimate visit'],
      ['clients', 'Seasonal upsells forgotten', 'Aeration, cleanup and mulch offers sent to the right past customers'],
      ['ops', 'Rain days mean texting the whole route', 'Everyone affected rescheduled and notified in one step'],
      ['ops', 'Recurring billing by hand', 'Contracts billed on schedule, with reminders when payments slip'],
    ],
  },
  {
    name: 'Plumbers & HVAC', icon: 'droplet', link: '/solutions/trades-home-services/',
    rows: [
      ['clients', 'Missed calls become lost jobs', 'Instant text-back; AI collects the details and books the job'],
      ['clients', 'Estimates that never get chased', 'Estimates written from voice notes, with automatic follow-up'],
      ['ops', 'Invoices wait until Friday', 'Invoice and payment link sent the moment a job closes'],
      ['ops', 'Maintenance plans renewed by memory', 'Renewal reminders and tune-up bookings on schedule'],
    ],
  },
  {
    name: 'General contractors', icon: 'hardHat', link: '/solutions/trades-home-services/',
    rows: [
      ['clients', 'Bids take nights and weekends', 'AI drafts scopes and bid documents from site notes and plans'],
      ['clients', 'Clients anxious between milestones', 'Weekly progress updates written from daily logs and photos'],
      ['ops', 'Schedule changes mean a round of calls', 'Subs and suppliers updated at once'],
      ['ops', 'Change orders agreed verbally', 'Documented, priced and signed before work starts'],
    ],
  },
];

export const services = [
  ['search', 'AI readiness review', 'We map how work and new business flow through your company, find where AI will save the most time or win the most work, and flag the risks. You get a prioritized plan in plain English.'],
  ['plug', 'Build & implement', 'We build the AI workflows on the tools you already use, test them on real cases, and put a person’s approval wherever judgment matters.'],
  ['users', 'Team training', 'Hands-on sessions that teach your team to use tools like ChatGPT, Claude or Microsoft Copilot safely and well in their own daily work.'],
  ['lifeBuoy', 'Ongoing support', 'A monthly plan to monitor, tune and extend your automations as your business and the AI tools change.'],
];

// Training & enablement
const trainingSteps = [
  ['Set up the tools properly', 'Business accounts with the right privacy settings, so nobody is pasting client details into a personal account.'],
  ['Learn on your real work', 'Hands-on sessions built around tasks your team already does every week. No generic demos.'],
  ['Leave with a playbook', 'A shared library of the prompts that worked, plus a one-page policy: what’s fine, what needs a second look and what never goes in.'],
  ['Follow up after 30 days', 'Office hours to fix what isn’t working, answer the questions that came up and show what’s new.'],
];

const trainingRoles = [
  ['Accountants', 'Turn an IRS notice into a plain-English summary with next steps. Draft engagement letters and client explanations.'],
  ['Real estate agents', 'Listing copy from showing notes, market summaries for buyers and follow-ups after an open house.'],
  ['Attorneys', 'A first-pass summary of a long contract or transcript before the close read. Plain-language client updates.'],
  ['Sales & business development', 'Research a prospect before the call, prepare the questions and write the follow-up while it’s fresh.'],
  ['Owners & managers', 'Job posts, policies and customer replies, and quick answers from a spreadsheet nobody wants to open.'],
  ['Office & front desk', 'Inbox replies, meeting notes, checklists and the scheduling back-and-forth.'],
];

const approach = [
  ['Problem first, tool second.', 'We start with where time and revenue are leaking, not with whichever AI tool is trending this month.'],
  ['Your data stays yours.', 'Business-grade AI services, configured so your data isn’t used to train models, with access limited to what each workflow needs.'],
  ['People approve what matters.', 'AI drafts, reads, sorts and suggests. Anything client-facing or consequential waits for a person.'],
  ['Measured, not assumed.', 'We track hours saved and inquiries won, and change or switch off anything that isn’t earning its place.'],
  ['Your team stays in charge.', 'Training and plain-English documentation, so nobody depends on a black box, including us.'],
];

const faqs = [
  { q: 'What does using AI “properly” actually mean?', a: 'Starting with a real business problem, choosing the right tool for it, protecting your data, putting a person’s review wherever a mistake would be costly, and measuring whether it actually saves time or wins business. If it doesn’t, we change it or switch it off.' },
  { q: 'Is our client data safe with AI?', a: 'We use business-grade AI services configured so your data isn’t used to train models, limit each workflow’s access to what it needs, and document where data goes. For regulated work like legal and accounting, we design around your professional obligations.' },
  { q: 'Will AI replace my staff?', a: 'That isn’t the goal. The aim is to take repetitive work off your team so the people you have can spend more time with clients and handle more work.' },
  { q: 'Which AI tools do you use?', a: 'Whatever fits the job: models from OpenAI, Anthropic and Microsoft, the AI features already built into your software, and automation platforms such as Zapier, Make or n8n to connect them. We’re not tied to any vendor.' },
  { q: 'Do we need to be technical?', a: 'No. We handle the technical side and train your team on the parts they’ll use. Most workflows run in the background and show up in the email, text or software you already use.' },
  { q: 'Where should we start?', a: 'Usually with an AI readiness review. It shows where AI will help most in your business, what to do first and what it will cost, before you commit to building anything.' },
  { q: 'What does it cost?', a: 'It depends on scope. After our first conversation you’ll get a clear quote, so you can weigh it against the hours and business you’ll get back.' },
];

export function renderHome() {
  const tabs = index.map((ind, i) => `        <button type="button" role="tab" id="itab-${i}" aria-controls="ipanel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${icon(ind.icon, { size: 20 })}<span>${esc(ind.name)}</span></button>`).join('\n');
  const panels = index
    .map(
      (ind, i) => `        <div class="index__panel" id="ipanel-${i}" role="tabpanel" aria-labelledby="itab-${i}">
          <h3>${icon(ind.icon, { size: 24 })}${esc(ind.name)}</h3>
          <table class="ledger">
            <thead><tr><th scope="col">What’s slowing you down</th><th scope="col">What we put in place</th></tr></thead>
            <tbody>
${ind.rows.map(([g, p, f]) => `              <tr><td><span class="ledger__group ledger__group--${g}">${g === 'clients' ? 'Winning clients' : 'Operations'}</span>${esc(p)}</td><td>${esc(f)}</td></tr>`).join('\n')}
            </tbody>
          </table>
          ${ind.link ? `<a class="text-link" href="${ind.link}">${esc(industries.find((x) => ind.link.includes(x.slug)).navLabel)}: full details</a>` : `<a class="text-link" href="#contact">Talk to us about manufacturing</a>`}
        </div>`
    )
    .join('\n');

  const body = `
<section class="hero" aria-labelledby="hero-heading">
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="container">
    <div class="hero__top">
      <h1 id="hero-heading">Less grunt work.<br>More great work.</h1>
      <div class="hero__aside">
        <p class="hero__lead">${SITE.promise}</p>
        <p class="hero__detail">We help professionals and small and mid-sized businesses put AI to work properly: finding and following up with new clients, and taking the repetitive work out of daily operations.</p>
        <div class="hero__actions">
          <a class="button button--primary button--hero" href="#contact">Reclaim your time</a>
          <a class="button button--ghost button--hero" href="#who-we-help">Explore our solutions</a>
        </div>
      </div>
    </div>
    ${handoverBoard(industries)}
  </div>
</section>

<section class="section pillars" aria-labelledby="pillars-heading">
  <div class="container">
    <h2 id="pillars-heading" class="section-title">Two places AI pays off fastest.</h2>
    <div class="pillars__grid">
${pillars
  .map(
    (p) => `      <div class="pillar">
        <h3>${esc(p.title)}</h3>
        <p class="pillar__intro">${esc(p.intro)}</p>
        <ul class="pillar__list">
${p.items.map(([t, d]) => `          <li><strong>${esc(t)}</strong>${esc(d)}</li>`).join('\n')}
        </ul>
      </div>`
  )
  .join('\n')}
    </div>
  </div>
</section>

<section class="section who" id="who-we-help" aria-labelledby="who-heading">
  <div class="container">
    <div class="section-intro">
      <h2 id="who-heading" class="section-title">What it looks like in your line of work.</h2>
      <p>The same AI tools do very different jobs in a law firm and a lawn care company. Pick yours.</p>
    </div>
    <div class="index" data-tabs>
      <div class="index__list" role="tablist" aria-label="Industries" aria-orientation="vertical" data-tablist hidden>
${tabs}
      </div>
      <div class="index__panels">
${panels}
      </div>
    </div>
  </div>
</section>

<section class="section services" id="services" aria-labelledby="services-heading">
  <div class="container">
    <div class="section-intro section-intro--dark">
      <h2 id="services-heading" class="section-title">How we work with you.</h2>
      <p>Most clients start with a readiness review and carry on from there, but you can start at any step.</p>
    </div>
    <ol class="track">
${services
  .map(
    ([ic, t, d], n) => `      <li class="track__step">
        <span class="track__num">${String(n + 1).padStart(2, '0')}</span>
        <h3>${icon(ic, { size: 22 })}${esc(t)}</h3>
        <p>${esc(d)}</p>
      </li>`
  )
  .join('\n')}
    </ol>
  </div>
</section>

<section class="section training" id="training" aria-labelledby="training-heading">
  <div class="container">
    <div class="section-intro">
      <h2 id="training-heading" class="section-title">Teach your people to get real work out of AI.</h2>
      <p>Automations take care of the repetitive work. Everything else your team does, from writing and research to reviewing and planning, gets faster when people know how to use AI well. We train professionals on ChatGPT, Claude or Microsoft Copilot using their own work, and set the guardrails so they can use it with confidence.</p>
    </div>
    <div class="training__grid">
      <div>
        <h3 class="training__subhead">How training works</h3>
        <ol class="training__steps">
${trainingSteps.map(([t, d], n) => `          <li><span class="training__num">${n + 1}</span><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></li>`).join('\n')}
        </ol>
      </div>
      <figure class="prompt-ex">
        <figcaption><h3 class="training__subhead">Same tool, better instructions</h3></figcaption>
        <div class="prompt-ex__pair">
          <div class="prompt-ex__item">
            <p class="prompt-ex__label">What most people type</p>
            <blockquote class="prompt-ex__prompt prompt-ex__prompt--before">Write an email to a client about missing documents.</blockquote>
          </div>
          <div class="prompt-ex__item">
            <p class="prompt-ex__label">After training</p>
            <blockquote class="prompt-ex__prompt">I’m an accountant writing to a long-time client who owns a small restaurant. Their return is due in two weeks and we’re still missing their October and November bank statements and one 1099. Write a short, friendly email asking for these by Friday. Plain language, no jargon, and list the missing items as bullets.</blockquote>
          </div>
        </div>
        <p class="prompt-ex__note">The first gets a generic template. The second gets an email you can send after a quick read. Most of good AI use is this: knowing what context to give it, and what to check before anything goes out.</p>
      </figure>
    </div>
    <div class="training__roles">
      <h3 class="training__subhead">What people learn to hand off</h3>
      <dl class="roles">
${trainingRoles.map(([r, d]) => `        <div class="roles__row"><dt>${esc(r)}</dt><dd>${esc(d)}</dd></div>`).join('\n')}
      </dl>
    </div>
    <div class="training__foot">
      <p>One-on-one coaching for owners and partners, or workshops for your whole team, in person or remote.</p>
      <a class="button button--primary" href="#contact" data-interest="Training my team">Plan training for your team</a>
    </div>
  </div>
</section>

<section class="section approach" id="approach" aria-labelledby="approach-heading">
  <div class="container approach__grid">
    <div class="approach__head">
      <h2 id="approach-heading" class="section-title">AI done properly.</h2>
      <p>Plenty of businesses have tried an AI tool and quietly stopped using it. The difference is rarely the technology. It’s how it was chosen, set up and checked.</p>
      <a class="button button--secondary" href="#contact">Book a consultation</a>
    </div>
    <ul class="approach__list">
${approach.map(([t, d]) => `      <li><strong>${esc(t)}</strong> ${esc(d)}</li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="section faq-section" id="faq" aria-labelledby="faq-heading">
  <div class="container faq-section__grid">
    <h2 id="faq-heading" class="section-title">Questions we hear a lot.</h2>
    ${faqList(faqs)}
  </div>
</section>

${contactSection()}
`;
  return page({
    title: 'Home',
    path: '/',
    description:
      'Second Shift Ops helps professionals and small and mid-sized businesses use AI properly to win more clients and run tighter operations. Less grunt work. More great work.',
    body,
  });
}
