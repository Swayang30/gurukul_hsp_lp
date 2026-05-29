/**
 * SBIHM Hotel Management Landing Page — script.js
 * Plan D Media | 2026
 *
 * Modules:
 * 1.  Sticky header shadow on scroll
 * 2.  Mobile nav drawer
 * 3.  Smooth scroll with offset for sticky header
 * 4.  Animated count-up stats
 * 5.  Testimonial carousel
 * 6.  FAQ accordion
 * 7.  Lead form validation + submission
 * 8.  Brochure download modal
 * 9.  WhatsApp button bounce (CSS-driven; JS pause on hover)
 * 10. Exit-intent modal
 * 11. Scroll-to-top button
 * 12. DataLayer / GTM event tracking
 */

'use strict';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function pushEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

/* ─── Gurukul Unified Lead Capture ────────────────────────────────────────── */

const GURUKUL_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbziDkg_pAYND-NeRrwJ5i8WDQxXXM72KUPpxM3FHpM89K8A9qA6SYwRKb7tyq_l_f4/exec';

function submitGurukulForm(form, handlers) {
  handlers = handlers || {};
  const btn = form.querySelector('[type="submit"], button:not([type="button"])');
  const originalBtnHTML = btn ? btn.innerHTML : '';

  const data = {};
  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    if (!el.name) return;
    if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
    data[el.name] = el.value;
  });
  data.page_url = window.location.href;

  if (btn) { btn.disabled = true; btn.innerHTML = 'Submitting…'; }

  // Content-Type must be text/plain — Apps Script does not answer CORS preflight,
  // so application/json would fail. text/plain is a simple request that works.
  fetch(GURUKUL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data)
  })
  .then(function (r) { return r.json(); })
  .then(function (res) {
    if (res && res.result === 'success') {
      form.reset();
      if (typeof handlers.onSuccess === 'function') handlers.onSuccess();
    } else {
      throw new Error((res && res.message) || 'Submission failed');
    }
  })
  .catch(function (err) {
    if (typeof handlers.onError === 'function') handlers.onError(err);
    else alert('Sorry, something went wrong. Please call +91-9830227324 or try again.');
  })
  .finally(function () {
    if (btn) { btn.disabled = false; btn.innerHTML = originalBtnHTML; }
  });
}

/* ─── 1. Sticky header shadow ─────────────────────────────────────────────── */

(function initStickyHeader() {
  const header = $('#site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── 2. Mobile nav drawer ────────────────────────────────────────────────── */

(function initMobileDrawer() {
  const hamburger = $('#hamburger');
  const drawer = $('#mobile-drawer');
  const closeBtn = $('#drawer-close');
  const backdrop = $('#drawer-backdrop');
  const drawerLinks = $$('.mobile-drawer__link');

  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeDrawer() {
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.getAttribute('aria-hidden') === 'false';
    isOpen ? closeDrawer() : openDrawer();
  });

  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop && backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  const mobileBrochureTrigger = $('#brochure-trigger-mobile');
  mobileBrochureTrigger && mobileBrochureTrigger.addEventListener('click', () => {
    closeDrawer();
    handleBrochureDownloadClick();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });
})();

/* ─── 3. Smooth scroll with header offset ────────────────────────────────── */

(function initSmoothScroll() {
  function getHeaderOffset() {
    const header = $('#site-header');
    return header ? header.offsetHeight + 8 : 72;
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = $(targetId);
    if (!target) return;

    e.preventDefault();

    const offset = getHeaderOffset();
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    if (prefersReducedMotion()) {
      window.scrollTo(0, top);
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }

    /* Update focus for accessibility */
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });

    /* Track apply CTA clicks */
    const track = link.dataset.track;
    if (track) {
      pushEvent(track, {
        cta_location: link.dataset.ctaLocation || 'unknown',
        course: 'BHM'
      });
    }
  });
})();

/* ─── 4. Animated count-up stats ─────────────────────────────────────────── */

(function initCountUp() {
  const stats = $$('[data-target]');
  if (!stats.length || prefersReducedMotion()) {
    /* Just show final values without animation */
    stats.forEach(el => {
      el.textContent = Number(el.dataset.target).toLocaleString('en-IN') + (el.dataset.suffix || '');
    });
    return;
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString('en-IN') + suffix;

      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  stats.forEach(el => observer.observe(el));
})();

/* ─── 5. Testimonial carousel ────────────────────────────────────────────── */

(function initCarousel() {
  const carousel = $('#testimonials-carousel');
  const track = $('#testimonials-track');
  const prevBtn = $('#carousel-prev');
  const nextBtn = $('#carousel-next');
  const dotsWrap = $('#carousel-dots');

  if (!carousel || !track) return;

  const slides = $$('.testimonial-card', track);
  let current = 0;
  let autoTimer = null;
  const INTERVAL = 6000;

  /* Build dot buttons */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.dataset.index = i;
    if (i === 0) dot.classList.add('active');
    dotsWrap && dotsWrap.appendChild(dot);
  });

  const dots = $$('.carousel-dot', dotsWrap);

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });

    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function startAuto() {
    if (prefersReducedMotion()) return;
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dotsWrap && dotsWrap.addEventListener('click', e => {
    const dot = e.target.closest('.carousel-dot');
    if (dot) { goTo(parseInt(dot.dataset.index, 10)); startAuto(); }
  });

  /* Pause on hover */
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  /* Touch/swipe support */
  let touchStartX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  /* Keyboard navigation */
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); stopAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); stopAuto(); }
  });

  /* Init */
  goTo(0);
  startAuto();
})();

/* ─── 6. FAQ accordion ────────────────────────────────────────────────────── */

(function initFAQ() {
  const faqList = $('#faq-list');
  if (!faqList) return;

  function openItem(item) {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    item.classList.add('faq-item--open');
    btn.setAttribute('aria-expanded', 'true');
    answer.removeAttribute('hidden');
    answer.classList.remove('faq-answer--hidden');
  }

  function closeItem(item) {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    item.classList.remove('faq-item--open');
    btn.setAttribute('aria-expanded', 'false');
    answer.setAttribute('hidden', '');
    answer.classList.add('faq-answer--hidden');
  }

  faqList.addEventListener('click', e => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('faq-item--open');

    /* Close all first */
    $$('.faq-item', faqList).forEach(closeItem);

    /* Toggle clicked item */
    if (!isOpen) openItem(item);
  });

  /* Keyboard: arrow keys to navigate between items */
  faqList.addEventListener('keydown', e => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const items = $$('.faq-item', faqList);
    const current = items.findIndex(item => item.contains(btn));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[current + 1];
      next && next.querySelector('.faq-question').focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[current - 1];
      prev && prev.querySelector('.faq-question').focus();
    }
  });
})();

/* ─── 7. Footer lead form (Contact / Apply section) ──────────────────────── */

(function initLeadForm() {
  const form = $('#apply-form-footer');
  const formWrap = $('#apply-form-wrap');
  const thankyou = $('#apply-thankyou');
  const thankyouName = $('#thankyou-name');
  const errBanner = $('#form-error-message');

  if (!form) return;

  const validators = {
    name:  v => v.trim().length >= 2 ? null : 'Please enter your full name.',
    phone: v => /^[6-9][0-9]{9}$/.test(v.replace(/\s/g, '')) ? null : 'Please enter a valid 10-digit Indian mobile number.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email address.',
  };

  function showFieldError(name, message) {
    const input = form.querySelector(`[name="${name}"]`);
    const errEl = $(`#error-${name}`);
    if (input) { input.classList.add('error'); input.setAttribute('aria-invalid', 'true'); }
    if (errEl) errEl.textContent = message;
  }

  function clearFieldError(name) {
    const input = form.querySelector(`[name="${name}"]`);
    const errEl = $(`#error-${name}`);
    if (input) { input.classList.remove('error'); input.removeAttribute('aria-invalid'); }
    if (errEl) errEl.textContent = '';
  }

  /* Blur-time validation */
  $$('input, select', form).forEach(input => {
    if (!input.name || input.type === 'radio' || input.type === 'checkbox' || input.type === 'hidden') return;
    input.addEventListener('blur', () => {
      if (!validators[input.name]) return;
      const err = validators[input.name](input.value);
      err ? showFieldError(input.name, err) : clearFieldError(input.name);
    });
    input.addEventListener('input', () => {
      if (!input.classList.contains('error') || !validators[input.name]) return;
      const err = validators[input.name](input.value);
      err ? showFieldError(input.name, err) : clearFieldError(input.name);
    });
  });

  function getCampusValue() {
    const checked = form.querySelector('input[name="campus"]:checked');
    return checked ? checked.value : '';
  }

  function validateAll() {
    let valid = true;
    let firstInvalid = null;

    ['name', 'phone', 'email'].forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      if (!input) return;
      const err = validators[name](input.value);
      if (err) {
        showFieldError(name, err);
        if (!firstInvalid) firstInvalid = input;
        valid = false;
      } else {
        clearFieldError(name);
      }
    });

    if (!getCampusValue()) {
      const errEl = $('#error-campus');
      if (errEl) errEl.textContent = 'Please select a preferred campus.';
      valid = false;
      if (!firstInvalid) firstInvalid = form.querySelector('input[name="campus"]');
    } else {
      const errEl = $('#error-campus');
      if (errEl) errEl.textContent = '';
    }

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  function showBannerError(message) {
    if (!errBanner) return;
    errBanner.textContent = message;
    errBanner.removeAttribute('hidden');
    errBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideBannerError() {
    if (!errBanner) return;
    errBanner.setAttribute('hidden', '');
    errBanner.textContent = '';
  }

  function isBot() {
    const hp = form.querySelector('#hp-website');
    return hp && hp.value.length > 0;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideBannerError();
    if (isBot()) return;
    if (!validateAll()) return;

    submitGurukulForm(form, {
      onSuccess: function () {
        pushEvent('lead_submit', { course: 'HHM', form_type: 'footer' });
        window.location.href = 'thankyou.html';
      },
      onError: function () {
        showBannerError('Something went wrong. Please try again or call +91-9830227324.');
      }
    });
  });
})();

/* ─── 7b. Hero Enquiry Form ───────────────────────────────────────────────── */

(function initHeroForm() {
  const form = $('#apply-form-hero');
  const successEl = $('#hero-form-success');

  if (!form) return;

  /* ── Validators ── */
  const validators = {
    name:           v => v.trim().length >= 2 ? null : 'Please enter your full name.',
    email:          v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email address.',
    phone:          v => /^[6-9][0-9]{9}$/.test(v.replace(/\s/g, '')) ? null : 'Enter a valid 10-digit mobile number.',
    course_variant: v => v ? null : 'Please select a programme.',
  };

  const fieldGroups = {
    name:           'field-fullname',
    email:          'field-email',
    phone:          'field-phone',
    course_variant: 'field-course-variant',
  };

  /* ── Error helpers ── */
  function setError(fieldName, message) {
    const groupId = fieldGroups[fieldName];
    const group = groupId ? $(`#${groupId}`) : null;
    const errEl = groupId ? $(`#err-${groupId.replace('field-', '')}`) : null;
    if (group) group.classList.add('hero-form__group--error');
    if (errEl) errEl.textContent = message || '';
  }

  function clearError(fieldName) {
    const groupId = fieldGroups[fieldName];
    const group = groupId ? $(`#${groupId}`) : null;
    const errEl = groupId ? $(`#err-${groupId.replace('field-', '')}`) : null;
    if (group) group.classList.remove('hero-form__group--error');
    if (errEl) errEl.textContent = '';
  }

  /* ── Blur-time validation ── */
  $$('input:not([type="hidden"]):not([type="checkbox"]), select', form).forEach(input => {
    if (!input.name || !validators[input.name]) return;
    input.addEventListener('blur', () => {
      const err = validators[input.name](input.value);
      err ? setError(input.name, err) : clearError(input.name);
    });
    input.addEventListener('input', () => {
      const group = $(`#${fieldGroups[input.name]}`);
      if (group && group.classList.contains('hero-form__group--error')) {
        const err = validators[input.name](input.value);
        err ? setError(input.name, err) : clearError(input.name);
      }
    });
  });

  /* Phone field — digits only */
  const phoneInput = $('#hf-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
  }

  /* ── Full validation ── */
  function validateAll() {
    let firstInvalid = null;
    let valid = true;

    ['name', 'email', 'phone', 'course_variant'].forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      if (!input) return;
      const err = validators[name](input.value);
      if (err) {
        setError(name, err);
        if (!firstInvalid) firstInvalid = input;
        valid = false;
      } else {
        clearError(name);
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  /* ── Toast helpers ── */
  function showToast() {
    if (!successEl) return;
    successEl.removeAttribute('hidden');
    successEl.classList.remove('toast--dismissing');
    const progressBar = successEl.querySelector('.success-toast__progress');
    if (progressBar) progressBar.style.animationPlayState = 'running';
    window.__toastTimer = setTimeout(() => dismissToast(), 6000);
  }

  function dismissToast() {
    if (!successEl || successEl.hasAttribute('hidden')) return;
    successEl.classList.add('toast--dismissing');
    successEl.addEventListener('animationend', () => {
      successEl.setAttribute('hidden', '');
      successEl.classList.remove('toast--dismissing');
    }, { once: true });
  }

  const toastCloseBtn = $('#toast-close-btn');
  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', () => {
      clearTimeout(window.__toastTimer);
      dismissToast();
    });
  }

  if (successEl) {
    successEl.addEventListener('mouseenter', () => {
      clearTimeout(window.__toastTimer);
      const progressBar = successEl.querySelector('.success-toast__progress');
      if (progressBar) progressBar.style.animationPlayState = 'paused';
    });
    successEl.addEventListener('mouseleave', () => {
      const progressBar = successEl.querySelector('.success-toast__progress');
      if (progressBar) progressBar.style.animationPlayState = 'running';
      window.__toastTimer = setTimeout(() => dismissToast(), 4000);
    });
  }

  /* ── Submit ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateAll()) return;

    submitGurukulForm(form, {
      onSuccess: function () {
        pushEvent('hero_lead_submit', { course: 'HHM' });
        sessionStorage.setItem(BROCHURE_UNLOCK_KEY, 'true');
        if (sessionStorage.getItem(BROCHURE_PENDING_KEY) === 'true') {
          sessionStorage.removeItem(BROCHURE_PENDING_KEY);
          triggerBrochureDownload();
          setTimeout(function () { window.location.href = 'thankyou.html'; }, 900);
        } else {
          window.location.href = 'thankyou.html';
        }
      }
    });
  });
})();

/* ─── 8. Brochure download modal ──────────────────────────────────────────── */

function openBrochureModal() {
  const modal = $('#brochure-modal');
  if (!modal) return;

  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  const firstInput = modal.querySelector('input');
  firstInput && firstInput.focus();

  pushEvent('brochure_download_modal_open', { course: 'BHM' });
}

function closeBrochureModal() {
  const modal = $('#brochure-modal');
  if (!modal) return;

  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

(function initBrochureModal() {
  const triggers = [
    '#brochure-trigger',
    '#brochure-trigger-hero',
    '#brochure-trigger-programme',
    '#brochure-trigger-thankyou',
  ];

  triggers.forEach(sel => {
    const el = $(sel);
    el && el.addEventListener('click', handleBrochureDownloadClick);
  });

  const closeBtn = $('#brochure-modal-close');
  const backdrop = $('#brochure-modal-backdrop');
  const form = $('#brochure-form');

  closeBtn && closeBtn.addEventListener('click', closeBrochureModal);
  backdrop && backdrop.addEventListener('click', closeBrochureModal);

  document.addEventListener('keydown', e => {
    const modal = $('#brochure-modal');
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) closeBrochureModal();
  });

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl = $('#brochure-name');
    const phoneEl = $('#brochure-phone');
    const emailEl = $('#brochure-email');
    let valid = true;

    if (!nameEl.value.trim()) {
      $('#brochure-error-name').textContent = 'Please enter your name.';
      nameEl.classList.add('error');
      valid = false;
    } else {
      $('#brochure-error-name').textContent = '';
      nameEl.classList.remove('error');
    }

    if (!/^[6-9][0-9]{9}$/.test(phoneEl.value.replace(/\s/g, ''))) {
      $('#brochure-error-phone').textContent = 'Please enter a valid 10-digit mobile number.';
      phoneEl.classList.add('error');
      valid = false;
    } else {
      $('#brochure-error-phone').textContent = '';
      phoneEl.classList.remove('error');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      $('#brochure-error-email').textContent = 'Please enter a valid email address.';
      emailEl.classList.add('error');
      valid = false;
    } else {
      $('#brochure-error-email').textContent = '';
      emailEl.classList.remove('error');
    }

    if (!valid) return;

    pushEvent('brochure_download', { course: 'HHM' });

    submitGurukulForm(form, {
      onSuccess: function () {
        const link = document.createElement('a');
        link.href = BROCHURE_PATH;
        link.download = BROCHURE_FILENAME;
        link.click();
        closeBrochureModal();
      }
    });
  });
})();

/* ─── 8b. Brochure download gate ─────────────────────────────────────────── */
// All five brochure buttons are wired to handleBrochureDownloadClick.
// The file downloads only after the hero form has been submitted in this session.

const BROCHURE_PATH = 'assets/campus/Gurukul_brochure.jpeg';
const BROCHURE_FILENAME = 'Gurukul-Hotel-Hospitality-Brochure.jpeg';
const BROCHURE_UNLOCK_KEY = 'gurukul_brochure_unlocked';
const BROCHURE_PENDING_KEY = 'gurukul_brochure_pending';

function isBrochureUnlocked() {
  return sessionStorage.getItem(BROCHURE_UNLOCK_KEY) === 'true';
}

function triggerBrochureDownload() {
  const a = document.createElement('a');
  a.href = BROCHURE_PATH;
  a.download = BROCHURE_FILENAME;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function handleBrochureDownloadClick(e) {
  if (e) e.preventDefault();
  if (isBrochureUnlocked()) {
    triggerBrochureDownload();
    return;
  }
  sessionStorage.setItem(BROCHURE_PENDING_KEY, 'true');
  const form = document.getElementById('apply-form-hero');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.classList.add('form-pulse');
    setTimeout(function () { form.classList.remove('form-pulse'); }, 2500);
  }
  showBrochureGateToast('Please fill the form to download the brochure.');
}

function showBrochureGateToast(message) {
  let toast = document.getElementById('gurukul-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'gurukul-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showBrochureGateToast._t);
  showBrochureGateToast._t = setTimeout(function () {
    toast.classList.remove('is-visible');
  }, 3200);
}

/* Delegated listener for any [data-brochure-download] button added dynamically */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-brochure-download]');
  if (btn) handleBrochureDownloadClick(e);
});

/* ─── 8c. Programme card → hero form pre-select helper ───────────────────── */
// Called by onclick on the "Apply for this Programme" buttons in Section 5.5.
// Uses the form's existing ID (apply-form-hero); no duplicate ID needed.
function scrollToHeroFormAndSelect(value) {
  const select = document.getElementById('hero-course-variant');
  if (select) select.value = value;
  const formContainer = document.getElementById('hero-form-container');
  if (formContainer) formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ─── 10. Exit-intent modal ───────────────────────────────────────────────── */

(function initExitIntent() {
  /* Desktop only, after 30s on page, once per session */
  if (window.innerWidth < 768) return;
  if (sessionStorage.getItem('sbihm_exit_shown')) return;

  const modal = $('#exit-modal');
  const closeBtn = $('#exit-modal-close');
  const backdrop = $('#exit-modal-backdrop');
  const form = $('#exit-form');

  if (!modal) return;

  let pageTime = 0;
  const MIN_TIME = 30000; // 30 seconds

  const timer = setInterval(() => {
    pageTime += 1000;
    if (pageTime >= MIN_TIME) clearInterval(timer);
  }, 1000);

  function openExitModal() {
    if (sessionStorage.getItem('sbihm_exit_shown')) return;
    if (modal.hasAttribute('hidden') === false) return;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    sessionStorage.setItem('sbihm_exit_shown', '1');

    const firstInput = modal.querySelector('input');
    firstInput && setTimeout(() => firstInput.focus(), 100);
  }

  function closeExitModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  document.addEventListener('mouseleave', e => {
    if (e.clientY <= 0 && pageTime >= MIN_TIME) {
      openExitModal();
    }
  });

  closeBtn && closeBtn.addEventListener('click', closeExitModal);
  backdrop && backdrop.addEventListener('click', closeExitModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeExitModal();
  });

  if (!form) return;

  // Exit-intent modal form is currently commented out in HTML.
  // When re-enabled, add hidden landing_course + form_type inputs to the form,
  // then wire submission with submitGurukulForm as below.
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl = $('#exit-name');
    const emailEl = $('#exit-email');
    let valid = true;

    if (!nameEl.value.trim()) {
      $('#exit-error-name').textContent = 'Please enter your name.';
      nameEl.classList.add('error');
      valid = false;
    } else {
      $('#exit-error-name').textContent = '';
      nameEl.classList.remove('error');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      $('#exit-error-email').textContent = 'Please enter a valid email.';
      emailEl.classList.add('error');
      valid = false;
    } else {
      $('#exit-error-email').textContent = '';
      emailEl.classList.remove('error');
    }

    if (!valid) return;

    pushEvent('exit_intent_lead', { course: 'HHM' });

    submitGurukulForm(form, {
      onSuccess: function () {
        closeExitModal();
      }
    });
  });
})();

/* ─── 11. Scroll-to-top button ────────────────────────────────────────────── */

(function initScrollToTop() {
  const btn = $('#scroll-to-top');
  if (!btn) return;

  function onScroll() {
    const shouldShow = window.scrollY > 600;
    if (shouldShow) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }

  btn.addEventListener('click', () => {
    if (prefersReducedMotion()) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── 12. Event tracking — click delegation ───────────────────────────────── */

(function initTracking() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-track]');
    if (!el) return;

    const track = el.dataset.track;

    switch (track) {
      case 'phone_click':
        pushEvent('phone_click', { course: 'BHM' });
        break;
      case 'whatsapp_click':
        pushEvent('whatsapp_click', { course: 'BHM' });
        break;
      case 'apply_cta_click':
        pushEvent('apply_cta_click', {
          course: 'BHM',
          cta_location: el.dataset.ctaLocation || 'unknown',
        });
        break;
    }
  });
})();

/* ─── Active nav highlighting on scroll ───────────────────────────────────── */

(function initNavHighlight() {
  const sections = $$('section[id], div[id="apply"]');
  const navLinks = $$('.site-nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
        link.setAttribute('aria-current', href === `#${id}` ? 'page' : 'false');
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();

