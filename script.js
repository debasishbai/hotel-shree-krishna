/**
 * Hotel Shree Krishna — Main JavaScript
 * Handles navigation, lazy loading, gallery, testimonials, form validation,
 * scroll animations, and accessibility features.
 */

(function () {
  'use strict';

  /* =========================================================================
     CONFIGURATION — Update these values for your hotel
     ========================================================================= */
  const CONFIG = {
    hotelName: 'Hotel Shree Krishna',
    phone: '+919437012345',
    whatsapp: '919437012345',
    email: 'info@hoteltariniregency.in',
    formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
    testimonialAutoPlayInterval: 6000,
    scrollRevealOffset: 80
  };

  /* =========================================================================
     DOM REFERENCES
     ========================================================================= */
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const galleryFilters = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const testimonialTrack = document.getElementById('testimonials-track');
  const testimonialPrev = document.getElementById('testimonial-prev');
  const testimonialNext = document.getElementById('testimonial-next');
  const testimonialsDots = document.getElementById('testimonials-dots');
  const contactForm = document.getElementById('contact-form');
  const currentYearEl = document.getElementById('current-year');

  /* =========================================================================
     UTILITY FUNCTIONS
     ========================================================================= */

  /** Debounce function to limit rapid event firing */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /** Check if element is in viewport */
  function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= 0
    );
  }

  /* =========================================================================
     STICKY HEADER ON SCROLL
     ========================================================================= */
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', debounce(handleHeaderScroll, 10));

  /* =========================================================================
     MOBILE NAVIGATION
     ========================================================================= */
  function toggleNav() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    navMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
    });
  });

  /* =========================================================================
     ACTIVE NAV LINK ON SCROLL (Intersection Observer)
     ========================================================================= */
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* =========================================================================
     LAZY LOADING IMAGES (Intersection Observer)
     ========================================================================= */
  const lazyImages = document.querySelectorAll('img.lazy');

  const lazyObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.addEventListener('load', function () {
              img.classList.add('loaded');
            });
            /* Fallback if already cached */
            if (img.complete) {
              img.classList.add('loaded');
            }
          }
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  lazyImages.forEach(function (img) {
    lazyObserver.observe(img);
  });

  /* =========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================= */
  const revealElements = document.querySelectorAll(
    '.section-header, .about-grid, .why-card, .room-card, .facility-card, ' +
    '.gallery-item, .explore-card, .contact-card, .highlight-item'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* =========================================================================
     GALLERY FILTER
     ========================================================================= */
  galleryFilters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      const category = filter.getAttribute('data-filter');

      /* Update active tab state */
      galleryFilters.forEach(function (f) {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      filter.classList.add('active');
      filter.setAttribute('aria-selected', 'true');

      /* Filter gallery items */
      galleryItems.forEach(function (item) {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* =========================================================================
     GALLERY LIGHTBOX
     ========================================================================= */
  function openLightbox(imgSrc, caption) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = caption || 'Gallery image';
    lightboxCaption.textContent = caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  if (galleryGrid) {
    galleryGrid.addEventListener('click', function (e) {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const img = item.querySelector('img');
      const caption = item.querySelector('figcaption');
      if (img) {
        const src = img.src || img.getAttribute('data-src');
        openLightbox(src, caption ? caption.textContent : '');
      }
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* =========================================================================
     TESTIMONIALS SLIDER
     ========================================================================= */
  let currentSlide = 0;
  let testimonialCards = [];
  let autoPlayTimer = null;

  function initTestimonials() {
    if (!testimonialTrack) return;

    testimonialCards = testimonialTrack.querySelectorAll('.testimonial-card');
    if (testimonialCards.length === 0) return;

    /* Create dot indicators */
    testimonialCards.forEach(function (_, index) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Review ' + (index + 1));
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goToSlide(index);
        resetAutoPlay();
      });
      testimonialsDots.appendChild(dot);
    });

    if (testimonialPrev) {
      testimonialPrev.addEventListener('click', function () {
        goToSlide(currentSlide - 1);
        resetAutoPlay();
      });
    }

    if (testimonialNext) {
      testimonialNext.addEventListener('click', function () {
        goToSlide(currentSlide + 1);
        resetAutoPlay();
      });
    }

    startAutoPlay();
  }

  function goToSlide(index) {
    const total = testimonialCards.length;
    currentSlide = ((index % total) + total) % total;
    testimonialTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

    const dots = testimonialsDots.querySelectorAll('.testimonial-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, CONFIG.testimonialAutoPlayInterval);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  initTestimonials();

  /* =========================================================================
     CONTACT FORM VALIDATION & SUBMISSION (Formspree)
     ========================================================================= */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s+\-()]{10,15}$/.test(phone);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (field) field.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    contactForm.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });
    contactForm.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name) {
      showError('name', 'Please enter your name.');
      isValid = false;
    }

    if (!email) {
      showError('email', 'Please enter your email.');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!phone) {
      showError('phone', 'Please enter your phone number.');
      isValid = false;
    } else if (!validatePhone(phone)) {
      showError('phone', 'Please enter a valid phone number.');
      isValid = false;
    }

    /* Validate check-out is after check-in */
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
      showError('checkout', 'Check-out must be after check-in.');
      isValid = false;
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      const submitBtn = document.getElementById('form-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      const successMsg = document.getElementById('form-success');

      /* Show loading state */
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoading.hidden = false;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(CONFIG.formspreeEndpoint, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          successMsg.hidden = false;
          setTimeout(function () {
            successMsg.hidden = true;
          }, 8000);
        } else {
          const data = await response.json();
          alert(data.error || 'Something went wrong. Please call us directly.');
        }
      } catch (err) {
        alert('Network error. Please call us at ' + CONFIG.phone + ' or WhatsApp us directly.');
      } finally {
        submitBtn.disabled = false;
        btnText.hidden = false;
        btnLoading.hidden = true;
      }
    });
  }

  /* Set minimum check-in date to today */
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  if (checkinInput) {
    const today = new Date().toISOString().split('T')[0];
    checkinInput.setAttribute('min', today);
    checkinInput.addEventListener('change', function () {
      if (checkoutInput) {
        checkoutInput.setAttribute('min', checkinInput.value);
      }
    });
  }

  /* =========================================================================
     FOOTER CURRENT YEAR
     ========================================================================= */
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* =========================================================================
     SMOOTH SCROLL FOR ANCHOR LINKS (with header offset)
     ========================================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

})();
