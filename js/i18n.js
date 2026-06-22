/**
 * i18n — Language switcher for EN / HI / OD
 * Applies translations to elements with data-i18n, data-i18n-placeholder, data-i18n-aria
 */
const I18n = (function () {
  'use strict';

  const STORAGE_KEY = 'hotel_lang';

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && TRANSLATIONS[saved]) return saved;
    return HOTEL_CONFIG.defaultLang || 'en';
  }

  function t(key, lang) {
    const l = lang || getLang();
    return (TRANSLATIONS[l] && TRANSLATIONS[l][key]) ||
           (TRANSLATIONS.en && TRANSLATIONS.en[key]) ||
           key;
  }

  function applyTranslations(lang) {
    const activeLang = lang || getLang();
    document.documentElement.lang = activeLang === 'od' ? 'or' : activeLang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const value = t(key, activeLang);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'), activeLang);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), activeLang));
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'), activeLang);
    });

    /* Update language switcher active state */
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      const isActive = btn.getAttribute('data-lang') === activeLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    localStorage.setItem(STORAGE_KEY, activeLang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: activeLang } }));
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    applyTranslations(lang);
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });
    applyTranslations(getLang());
  }

  return { getLang, t, setLang, applyTranslations, initLangSwitcher };
})();
