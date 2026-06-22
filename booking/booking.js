/**
 * Booking page — conversion-focused interactions
 * Room picker, live pricing, URL pre-select, sticky bar
 */
(function () {
  'use strict';

  const DISCOUNT = 0.15;

  const ROOMS = {
    standard: { price: 1499, label: 'Standard Room' },
    deluxe: { price: 2499, label: 'Deluxe AC Room' },
    family: { price: 3499, label: 'Family Room' },
    suite: { price: 4499, label: 'Executive Suite' }
  };

  function formatINR(n) {
    return '₹' + n.toLocaleString('en-IN');
  }

  function updatePrice(roomKey) {
    const room = ROOMS[roomKey] || ROOMS.deluxe;
    const discount = Math.round(room.price * DISCOUNT);
    const total = room.price - discount;

    const nightly = document.getElementById('price-nightly');
    const discEl = document.getElementById('price-discount');
    const totalEl = document.getElementById('price-total');
    const hiddenRoom = document.getElementById('hidden-room');
    const hiddenPrice = document.getElementById('hidden-price');
    const stickyPrice = document.querySelector('.sticky-price strong');

    if (nightly) nightly.textContent = formatINR(room.price);
    if (discEl) discEl.textContent = '-' + formatINR(discount);
    if (totalEl) totalEl.textContent = formatINR(total);
    if (hiddenRoom) hiddenRoom.value = roomKey;
    if (hiddenPrice) hiddenPrice.value = total;
    if (stickyPrice) stickyPrice.textContent = formatINR(total);
  }

  function initRoomPicker() {
    const picker = document.getElementById('room-picker');
    if (!picker) return;

    /* Pre-select from URL ?room=deluxe */
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom && ROOMS[urlRoom]) {
      const radio = picker.querySelector('input[value="' + urlRoom + '"]');
      if (radio) {
        radio.checked = true;
        picker.querySelectorAll('.room-option').forEach(function (o) { o.classList.remove('selected'); });
        radio.closest('.room-option').classList.add('selected');
        updatePrice(urlRoom);
      }
    }

    picker.querySelectorAll('input[name="room_type"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        picker.querySelectorAll('.room-option').forEach(function (o) { o.classList.remove('selected'); });
        radio.closest('.room-option').classList.add('selected');
        updatePrice(radio.value);
      });
    });
  }

  function initStickyBar() {
    const bar = document.getElementById('sticky-book-bar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      bar.classList.toggle('visible', window.scrollY > 400);
    });
  }

  function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    if (checkin) {
      const today = new Date().toISOString().split('T')[0];
      checkin.setAttribute('min', today);
      checkin.addEventListener('change', function () {
        if (checkout) checkout.setAttribute('min', checkin.value);
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = document.getElementById('form-submit');
      const btnText = btn && btn.querySelector('.btn-text');
      const btnLoad = btn && btn.querySelector('.btn-loading');
      const success = document.getElementById('form-success');

      if (btn) btn.disabled = true;
      if (btnText) btnText.hidden = true;
      if (btnLoad) btnLoad.hidden = false;

      try {
        const endpoint = (typeof HOTEL_CONFIG !== 'undefined') ? HOTEL_CONFIG.formspreeEndpoint : form.action;
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (success) success.hidden = false;
          /* Conversion tracking placeholder */
          if (window.gtag) gtag('event', 'booking_submit', { event_category: 'conversion' });
        } else {
          alert('Please call us or book via WhatsApp for instant confirmation.');
        }
      } catch (err) {
        alert('Network error — call +91 94370 12345 or WhatsApp us.');
      } finally {
        if (btn) btn.disabled = false;
        if (btnText) btnText.hidden = false;
        if (btnLoad) btnLoad.hidden = true;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updatePrice('deluxe');
    initRoomPicker();
    initStickyBar();
    initBookingForm();
  });
})();
