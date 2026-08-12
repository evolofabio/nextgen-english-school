/* NextGen English School — main.js */
const header   = document.querySelector('[data-header]');
const burger   = document.querySelector('[data-burger]');
const mobMenu  = document.querySelector('[data-mob]');
const yearEl   = document.querySelector('[data-year]');
const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Active nav link ── */
const page = (window.location.pathname.replace(/\/$/, '') || '/').split('/').pop() || 'index.html';
const normalized = page === '' || page === '/' ? 'index.html' : page;

document.querySelectorAll('.nav a, .mob a').forEach(a => {
  const href = a.getAttribute('href');
  if (!href || href.startsWith('tel:') || href.startsWith('http')) return;

  let linkPage = href.replace(/\/$/, '');
  if (linkPage === '/' || linkPage === '') linkPage = 'index.html';
  else linkPage = linkPage.split('/').pop();

  const isHome = linkPage === 'index.html' && (normalized === 'index.html' || normalized === '');
  const isExact = linkPage === normalized;
  const isCorsiSection = linkPage === 'corsi.html' && normalized.startsWith('corso-');

  if (isHome || isExact || isCorsiSection) a.classList.add('is-active');
});

/* ── Header scroll state ── */
const setHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 32);
};
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

/* ── Mobile menu ── */
const closeMenu = () => {
  if (!burger || !mobMenu) return;
  burger.setAttribute('aria-expanded', 'false');
  mobMenu.hidden = true;
};

if (burger && mobMenu) {
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    mobMenu.hidden = open;
  });
  mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ── Reveal on scroll ── */
const revealEls = document.querySelectorAll('[data-reveal]');

if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('on');
      io.unobserve(e.target);
    }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  revealEls.forEach((el, i) => {
    el.style.setProperty('--d', `${Math.min(i % 4, 3) * 80}ms`);
    io.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('on'));
}

/* ── Contact form ── */
const contactForm = document.querySelector('[data-contact-form]');
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/info@nextgenenglishschool.it';

if (contactForm) {
  const statusEl = contactForm.querySelector('[data-form-status]');
  const submitBtn = contactForm.querySelector('[type="submit"]');
  const defaultBtnText = submitBtn?.textContent ?? 'Invia richiesta';

  const showStatus = (message, type) => {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = `form__status form__status--${type}`;
  };

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const hp = contactForm.querySelector('[name="_gotcha"]');
    if (hp?.value) return;

    const data = Object.fromEntries(new FormData(contactForm));
    const payload = {
      nome: data.nome,
      email: data.email,
      telefono: data.telefono || 'Non indicato',
      corso: data.corso || 'Non specificato',
      messaggio: data.messaggio,
      _subject: `Richiesta da ${data.nome} — NextGen English School`,
      _template: 'table',
      _captcha: 'false',
    };

    contactForm.classList.add('is-loading');
    if (submitBtn) submitBtn.textContent = 'Invio in corso…';
    statusEl.hidden = true;

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('submit failed');

      contactForm.reset();
      showStatus('Messaggio inviato! Ti risponderemo entro 24 ore.', 'ok');
    } catch {
      showStatus('Invio non riuscito. Chiama il +39 347 290 9887 o scrivici su Instagram.', 'err');
    } finally {
      contactForm.classList.remove('is-loading');
      if (submitBtn) submitBtn.textContent = defaultBtnText;
    }
  });
}
