// Second Shift Ops: navigation, tabs (handover board + industry index) and contact form.
(() => {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const menuToggle = document.querySelector('[data-menu-toggle]');

  // Solid header once the page scrolls
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setNav = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  };
  navToggle?.addEventListener('click', () => setNav(navToggle.getAttribute('aria-expanded') !== 'true'));

  // Solutions dropdown
  const setMenu = (open) => menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', (e) => {
    if (menuToggle && !menuToggle.parentElement.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (menuToggle?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuToggle.focus(); }
    if (navToggle?.getAttribute('aria-expanded') === 'true') { setNav(false); navToggle.focus(); }
  });
  document.querySelectorAll('.site-nav a').forEach((a) => a.addEventListener('click', () => { setNav(false); setMenu(false); }));

  // Tabs. Without JS every panel is visible (index) or the first one is (board).
  document.querySelectorAll('[data-tabs]').forEach((root) => {
    const list = root.querySelector('[data-tablist]');
    if (!list) return;
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    list.hidden = false;
    root.classList.add('is-tabbed');

    const select = (i, focus) => {
      tabs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
        panels[n].classList.toggle('is-active', on);
        panels[n].classList.remove('is-playing');
      });
      if (root.hasAttribute('data-board')) {
        void panels[i].offsetWidth; // restart the hand-off sequence
        panels[i].classList.add('is-playing');
      }
      if (focus) tabs[i].focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        let next = null;
        if (e.key in keys) next = (i + keys[e.key] + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
    // Initial state: keep the board's first play running; hide the other index panels
    tabs.forEach((t, n) => { if (n !== 0) panels[n].hidden = true; });
  });

  // Links that preselect what the visitor is interested in (e.g. "Plan training for your team")
  document.querySelectorAll('a[data-interest]').forEach((a) => a.addEventListener('click', () => {
    const select = document.querySelector('#contact select[name="interest"]');
    if (select) select.value = a.dataset.interest;
  }));

  // Contact forms
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.elements.page.value = window.location.pathname;
    const errorBox = form.querySelector('[data-form-error]');
    const submit = form.querySelector('[data-submit]');
    const label = form.querySelector('[data-submit-label]');
    const success = form.querySelector('[data-form-success]');
    const fallback = success.querySelector('a[href^="mailto:"]')?.textContent || 'us';

    const showError = (msg, field) => {
      errorBox.textContent = msg;
      errorBox.hidden = false;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    };

    form.addEventListener('input', (e) => e.target.removeAttribute('aria-invalid'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.hidden = true;
      const { name, email, message } = form.elements;
      if (!name.value.trim()) return showError('Enter your name so we know who to reply to.', name);
      if (!EMAIL_RE.test(email.value.trim())) return showError('Enter a valid email address so we can reply.', email);
      if (message.value.trim().length < 10) return showError('Add a sentence or two about what you’d like AI to take off your plate.', message);

      const data = Object.fromEntries(new FormData(form));
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      const original = label.textContent;
      label.textContent = 'Sending…';
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.ok) throw new Error(json.error || 'Your message wasn’t sent.');
        form.classList.add('is-sent');
        success.hidden = false;
        success.setAttribute('tabindex', '-1');
        success.focus();
      } catch (err) {
        showError(`${err.message} Try again, or email ${fallback} directly.`);
      } finally {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        label.textContent = original;
      }
    });
  });
})();
