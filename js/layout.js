/**
 * Layout — Injects shared header, footer, FABs, and lightbox
 * Works on all multi-page HTML files. Set data-page on <body> for active nav.
 */
const Layout = (function () {
  'use strict';

  /** Resolve path prefix for subfolders (e.g. booking/) */
  function basePath() {
    const path = window.location.pathname;
    if (path.includes('/booking/')) return '../';
    return '';
  }

  function renderHeader(page) {
    const bp = basePath();
    const pages = [
      { id: 'home', href: bp + 'index.html', key: 'nav.home' },
      { id: 'about', href: bp + 'about.html', key: 'nav.about' },
      { id: 'rooms', href: bp + 'rooms.html', key: 'nav.rooms' },
      { id: 'facilities', href: bp + 'facilities.html', key: 'nav.facilities' },
      { id: 'gallery', href: bp + 'gallery.html', key: 'nav.gallery' },
      { id: 'explore', href: bp + 'explore.html', key: 'nav.explore' },
      { id: 'contact', href: bp + 'contact.html', key: 'nav.contact' }
    ];

    const navItems = pages.map(function (p) {
      const active = p.id === page ? ' active' : '';
      return '<li><a href="' + p.href + '" class="nav-link' + active + '" data-i18n="' + p.key + '">' + p.key + '</a></li>';
    }).join('');

    return (
      '<header class="site-header" id="site-header">' +
        '<nav class="navbar container" aria-label="Main navigation">' +
          '<a href="' + bp + 'index.html" class="logo" aria-label="' + HOTEL_CONFIG.name + '">' +
            '<span class="logo-icon" aria-hidden="true">✦</span>' +
            '<span class="logo-text"><strong>' + HOTEL_CONFIG.shortName + '</strong>' +
            '<small>' + HOTEL_CONFIG.location + '</small></span></a>' +
          '<div class="nav-utils">' +
            '<div class="lang-switcher" role="group" aria-label="Language">' +
              '<button class="lang-btn" data-lang="en" aria-pressed="false">EN</button>' +
              '<button class="lang-btn" data-lang="hi" aria-pressed="false">हि</button>' +
              '<button class="lang-btn" data-lang="od" aria-pressed="false">ଓଡ</button>' +
            '</div>' +
            '<button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-menu" data-i18n-aria="nav.toggle">' +
              '<span class="hamburger"></span></button>' +
          '</div>' +
          '<ul class="nav-menu" id="nav-menu">' + navItems +
            '<li><a href="' + bp + 'booking/index.html" class="nav-link nav-cta" data-i18n="nav.book">Book Now</a></li>' +
          '</ul>' +
        '</nav>' +
      '</header>'
    );
  }

  function renderFooter() {
    const bp = basePath();
    const c = HOTEL_CONFIG;
    return (
      '<footer class="site-footer">' +
        '<div class="container footer-grid">' +
          '<div class="footer-brand">' +
            '<a href="' + bp + 'index.html" class="logo">' +
              '<span class="logo-icon" aria-hidden="true">✦</span>' +
              '<span class="logo-text"><strong>' + c.shortName + '</strong><small>' + c.location + '</small></span></a>' +
            '<p data-i18n="footer.tagline">Footer tagline</p>' +
          '</div>' +
          '<div class="footer-links"><h4 data-i18n="footer.quickLinks">Quick Links</h4><ul>' +
            '<li><a href="' + bp + 'about.html" data-i18n="nav.about">About</a></li>' +
            '<li><a href="' + bp + 'rooms.html" data-i18n="nav.rooms">Rooms</a></li>' +
            '<li><a href="' + bp + 'facilities.html" data-i18n="nav.facilities">Facilities</a></li>' +
            '<li><a href="' + bp + 'gallery.html" data-i18n="nav.gallery">Gallery</a></li>' +
            '<li><a href="' + bp + 'explore.html" data-i18n="nav.explore">Explore</a></li>' +
            '<li><a href="' + bp + 'contact.html" data-i18n="nav.contact">Contact</a></li>' +
            '<li><a href="' + bp + 'booking/index.html" data-i18n="nav.book">Book Now</a></li>' +
          '</ul></div>' +
          '<div class="footer-links"><h4 data-i18n="footer.contact">Contact</h4><ul>' +
            '<li><a href="tel:' + c.phone + '">' + c.phoneDisplay + '</a></li>' +
            '<li><a href="mailto:' + c.email + '">' + c.email + '</a></li>' +
            '<li>' + c.address.line1 + '</li><li>' + c.address.city + '</li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom"><div class="container">' +
          '<p>&copy; <span id="current-year"></span> ' + c.name + '. <span data-i18n="footer.rights">All rights reserved.</span></p>' +
          '<p class="footer-seo" data-i18n="footer.seo">SEO keywords</p>' +
        '</div></div>' +
      '</footer>'
    );
  }

  function renderFABs() {
    const c = HOTEL_CONFIG;
    const waText = encodeURIComponent('Hello, I would like to inquire about a stay at ' + c.name + '.');
    return (
      '<div class="fab-container" aria-label="Quick contact">' +
        '<a href="tel:' + c.phone + '" class="fab fab-call" aria-label="Call"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011 1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.25 1.01l-2.22 2.1z"/></svg></a>' +
        '<a href="https://wa.me/' + c.whatsapp + '?text=' + waText + '" class="fab fab-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>' +
      '</div>'
    );
  }

  function renderLightbox() {
    return (
      '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image preview" hidden>' +
        '<button class="lightbox-close" id="lightbox-close" aria-label="Close">&times;</button>' +
        '<img src="" alt="" id="lightbox-img">' +
        '<p class="lightbox-caption" id="lightbox-caption"></p>' +
      '</div>'
    );
  }

  function init() {
    const page = document.body.getAttribute('data-page') || 'home';
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) skipLink.setAttribute('data-i18n', 'nav.skip');

    const headerSlot = document.getElementById('site-header-slot');
    const footerSlot = document.getElementById('site-footer-slot');
    const fabSlot = document.getElementById('fab-slot');
    const lightboxSlot = document.getElementById('lightbox-slot');

    if (headerSlot) headerSlot.outerHTML = renderHeader(page);
    if (footerSlot) footerSlot.outerHTML = renderFooter();
    if (fabSlot) fabSlot.innerHTML = renderFABs();
    if (lightboxSlot) lightboxSlot.innerHTML = renderLightbox();

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    I18n.initLangSwitcher();

    if (typeof HotelApp !== 'undefined') {
      HotelApp.init();
    }
  }

  return { init, basePath };
})();

document.addEventListener('DOMContentLoaded', function () {
  if (typeof Layout !== 'undefined' && document.getElementById('site-header-slot')) {
    Layout.init();
  } else if (typeof HotelApp !== 'undefined') {
    /* Legacy single-page fallback */
    HotelApp.init();
  }
});
