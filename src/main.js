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
