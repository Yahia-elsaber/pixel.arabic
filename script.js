/* ============================================================
   بيكسل بالعربي — Portfolio JS
   Scroll reveals · back-to-top · counter animation
   ============================================================ */

(function () {
  'use strict';

  /* ----------- 1 · Intersection Observer for reveals ----------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    // graceful fallback: reveal everything immediately
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ----------- 2 · Back-to-top ----------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    const toggleBackTop = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    };
    window.addEventListener('scroll', toggleBackTop, { passive: true });
    toggleBackTop();
  }

  /* ----------- 3 · Animated counters ----------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10) || 0;
          const duration = 1400;
          const startTime = performance.now();

          const tick = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => counterIO.observe(el));
  }

  /* ----------- 4 · Smooth nav highlight on scroll ----------- */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            navLinks.forEach((a) => {
              const isActive = a.getAttribute('href') === id;
              const dot = a.querySelector('.dot');
              if (dot) {
                dot.style.opacity = isActive ? '1' : '';
                dot.style.transform = isActive ? 'scale(1.6)' : '';
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => navIO.observe(s));
  }

  /* ----------- 5 · Subtle parallax on hero icon ----------- */
  const heroIconWrap = document.querySelector('.hero-icon-wrap');
  if (heroIconWrap && window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroIconWrap.style.transform = `translateY(${y * 0.15}px) scale(${1 - y * 0.0003})`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------- 6 · Current year in footer (if exists) ----------- */
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ----------- 6b · Scroll progress bar ----------- */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const updateProgress = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  /* ----------- 7 · THEME toggle (dark / light) ----------- */
  const root = document.documentElement;
  const THEME_KEY = 'pa-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  }
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem(THEME_KEY) || 'dark'; } catch (e) {}
  applyTheme(savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = cur === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ----------- 8 · LANGUAGE toggle (ar / en) ----------- */
  const LANG_KEY = 'pa-lang';
  const i18nEls = document.querySelectorAll('[data-en]');
  // capture the original Arabic markup of each element
  i18nEls.forEach((el) => { el.setAttribute('data-ar', el.innerHTML); });

  function setLangActive(lang) {
    document.querySelectorAll('.lang-ar').forEach((e) => e.classList.toggle('active', lang === 'ar'));
    document.querySelectorAll('.lang-en').forEach((e) => e.classList.toggle('active', lang === 'en'));
  }

  function applyLang(lang) {
    const en = lang === 'en';
    root.setAttribute('lang', en ? 'en' : 'ar');
    root.setAttribute('dir', en ? 'ltr' : 'rtl');
    i18nEls.forEach((el) => {
      const val = el.getAttribute(en ? 'data-en' : 'data-ar');
      if (val !== null) el.innerHTML = val;
    });
    setLangActive(lang);
  }
  let savedLang = 'ar';
  try { savedLang = localStorage.getItem(LANG_KEY) || 'ar'; } catch (e) {}
  applyLang(savedLang);

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const cur = root.getAttribute('lang') === 'en' ? 'en' : 'ar';
      const next = cur === 'en' ? 'ar' : 'en';
      applyLang(next);
      try { localStorage.setItem(LANG_KEY, next); } catch (e) {}
    });
  }

})();
