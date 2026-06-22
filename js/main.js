/**
 * HotelApp — Shared interactivity for all multi-page site pages
 * Initialized after Layout injects header/footer.
 */
const HotelApp = (function () {
  'use strict';

  const CONFIG = typeof HOTEL_CONFIG !== 'undefined' ? HOTEL_CONFIG : {};

  function debounce(fn, delay) {
    let timer;
    return function () {
      const args = arguments;
      const ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  function initNav() {
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;

    function toggleNav() {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeNav() {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleNav);
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    if (header) {
      window.addEventListener('scroll', debounce(function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }, 10));
    }
  }

  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img.lazy');
    if (!lazyImages.length) return;

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.addEventListener('load', function () { img.classList.add('loaded'); });
          if (img.complete) img.classList.add('loaded');
        }
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(function (img) { observer.observe(img); });
  }

  function initReveal() {
    const els = document.querySelectorAll(
      '.section-header, .about-grid, .why-card, .room-card, .facility-card, ' +
      '.gallery-item, .explore-card, .contact-card, .highlight-item, .page-hero-inner, .trust-badge'
    );
    els.forEach(function (el) { el.classList.add('reveal'); });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  function initGallery() {
    const filters = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');
    const grid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    filters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        const category = filter.getAttribute('data-filter');
        filters.forEach(function (f) {
          f.classList.remove('active');
          f.setAttribute('aria-selected', 'false');
        });
        filter.classList.add('active');
        filter.setAttribute('aria-selected', 'true');
        items.forEach(function (item) {
          const cat = item.getAttribute('data-category');
          item.classList.toggle('hidden', category !== 'all' && cat !== category);
        });
      });
    });

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.hidden = true;
      if (lightboxImg) lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    if (grid && lightbox) {
      grid.addEventListener('click', function (e) {
        const item = e.target.closest('.gallery-item');
        if (!item) return;
        const img = item.querySelector('img');
        const cap = item.querySelector('figcaption');
        if (img && lightboxImg) {
          lightboxImg.src = img.src || img.getAttribute('data-src') || '';
          lightboxImg.alt = cap ? cap.textContent : 'Gallery';
          if (lightboxCaption) lightboxCaption.textContent = cap ? cap.textContent : '';
          lightbox.hidden = false;
          document.body.style.overflow = 'hidden';
        }
      });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
    });
  }

  function initTestimonials() {
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonials-dots');
    const prev = document.getElementById('testimonial-prev');
    const next = document.getElementById('testimonial-next');
    if (!track || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    let current = 0;
    let timer = null;

    function goTo(index) {
      current = ((index % cards.length) + cards.length) % cards.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsContainer.querySelectorAll('.testimonial-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    cards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Review ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); resetTimer(); });
      dotsContainer.appendChild(dot);
    });

    if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    resetTimer();
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(id, msg) {
      const field = document.getElementById(id);
      const err = document.getElementById(id + '-error');
      if (field) field.classList.add('error');
      if (err) err.textContent = msg;
    }

    function clearErrors() {
      form.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });
      form.querySelectorAll('.form-error').forEach(function (el) { el.textContent = ''; });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearErrors();
      let ok = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');

      if (!name || !name.value.trim()) { showError('name', 'Required'); ok = false; }
      if (!email || !email.value.trim()) { showError('email', 'Required'); ok = false; }
      else if (!validateEmail(email.value)) { showError('email', 'Invalid email'); ok = false; }
      if (!phone || !phone.value.trim()) { showError('phone', 'Required'); ok = false; }

      if (!ok) return;

      const btn = document.getElementById('form-submit');
      const btnText = btn && btn.querySelector('.btn-text');
      const btnLoad = btn && btn.querySelector('.btn-loading');
      const success = document.getElementById('form-success');

      if (btn) btn.disabled = true;
      if (btnText) btnText.hidden = true;
      if (btnLoad) btnLoad.hidden = false;

      try {
        const res = await fetch(CONFIG.formspreeEndpoint || form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (success) { success.hidden = false; setTimeout(function () { success.hidden = true; }, 8000); }
        } else {
          alert('Something went wrong. Please call us directly.');
        }
      } catch (err) {
        alert('Network error. Call ' + (CONFIG.phoneDisplay || CONFIG.phone));
      } finally {
        if (btn) btn.disabled = false;
        if (btnText) btnText.hidden = false;
        if (btnLoad) btnLoad.hidden = true;
      }
    });

    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    if (checkin) {
      const today = new Date().toISOString().split('T')[0];
      checkin.setAttribute('min', today);
      checkin.addEventListener('change', function () {
        if (checkout) checkout.setAttribute('min', checkin.value);
      });
    }
  }

  function init() {
    initNav();
    initLazyLoad();
    initReveal();
    initGallery();
    initTestimonials();
    initContactForm();
  }

  return { init };
})();
