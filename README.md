# Hotel Shree Krishna — Website Versions Guide

Production-ready hotel portfolio with **three deployable versions**:

| Version | Entry Point | Best For |
|---------|-------------|----------|
| **Multi-page** | `index.html` | SEO, Google ranking, detailed content per topic |
| **Booking / Conversion** | `booking/index.html` | Direct bookings, ads, WhatsApp campaigns |
| **Bilingual** | All pages (EN / HI / OD toggle) | Local guests in Keonjhar, Odisha |
| **Single-page (legacy)** | `index-single.html` | Simple one-scroll demo |

---

## Project Structure

```
keonjhar-hotel/
├── index.html              # Multi-page home
├── about.html
├── rooms.html
├── facilities.html
├── gallery.html
├── explore.html
├── contact.html
├── index-single.html       # Original single-page version
├── booking/
│   ├── index.html          # High-conversion booking page
│   ├── booking.css
│   └── booking.js
├── js/
│   ├── config.js           # Hotel phone, email, Formspree — edit once
│   ├── layout.js           # Shared header/footer injection
│   ├── i18n.js             # Language switcher logic
│   └── main.js             # Lazy load, gallery, forms, slider
├── locales/
│   └── translations.js     # English, Hindi, Odia strings
├── style.css
├── script.js               # Legacy (single-page only)
├── sitemap.xml
└── robots.txt
```

---

## Version 1: Multi-Page Site

### Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/index.html` | Hero, trust bar, highlights, previews, reviews |
| About | `/about.html` | Story, mission, values, why choose us |
| Rooms | `/rooms.html` | Room types, pricing, book CTAs |
| Facilities | `/facilities.html` | Restaurant, Wi-Fi, events, conference |
| Gallery | `/gallery.html` | Filterable photos + lightbox |
| Explore | `/explore.html` | SEO content: waterfalls, temples, industry |
| Contact | `/contact.html` | Form, map, phone, WhatsApp |

### How it works

- Shared **header**, **footer**, **FAB buttons**, and **lightbox** are injected by `js/layout.js`
- Set active nav via `<body data-page="rooms">` (values: `home`, `about`, `rooms`, etc.)
- Each page loads the same script stack:

```html
<script src="js/config.js"></script>
<script src="locales/translations.js"></script>
<script src="js/i18n.js"></script>
<script src="js/layout.js"></script>
<script src="js/main.js"></script>
```

### Deploy steps

1. Push to GitHub repository `keonjhar-hotel`
2. Enable **GitHub Pages** → Source: `main` branch → `/ (root)`
3. Site live at: `https://YOUR-USERNAME.github.io/keonjhar-hotel/`
4. Submit sitemap to Google Search Console

---

## Version 2: Booking / High-Conversion Page

**URL:** `/booking/index.html`

### Conversion features

- **Urgency:** "Only 3 Deluxe rooms left this weekend"
- **Social proof:** "12 guests booked in last 24 hours"
- **Trust badges:** 4.6★ rating, 128+ reviews, best price guarantee, SSL, verified hotel
- **Direct booking discount:** Live 15% savings calculator
- **Room picker** with URL pre-select: `booking/index.html?room=deluxe`
- **Pulsing primary CTA** — "Confirm My Booking"
- **Sticky mobile bar** with price + Book Now
- **WhatsApp / Call fallbacks** for instant conversion
- **Trust seals** below form

### Use this page for

- Google Ads landing page
- WhatsApp campaign links
- Social media "Book Now" buttons
- QR codes at reception

### Link from main site

All pages include **Book Now** in navigation → `booking/index.html`

---

## Version 3: Bilingual (English + Hindi + Odia)

### How to switch language

Click **EN | हि | ଓଡ** in the header. Choice is saved in `localStorage`.

### How to add / edit translations

1. Open `locales/translations.js`
2. Find the key under `en`, `hi`, or `od`
3. Add `data-i18n="key.name"` to any HTML element

Example:

```html
<h1 data-i18n="hero.brand">Hotel Shree Krishna</h1>
```

### Supported attributes

| Attribute | Effect |
|-----------|--------|
| `data-i18n` | Sets `textContent` |
| `data-i18n-placeholder` | Sets input placeholder |
| `data-i18n-aria` | Sets `aria-label` |

### Adding more Odia/Hindi content

Room descriptions and explore cards are still in English — add keys to `translations.js` and `data-i18n` attributes on those elements for full translation.

---

## Configuration Checklist

Edit **`js/config.js`** once:

```javascript
const HOTEL_CONFIG = {
  name: 'Hotel Shree Krishna',      // Your hotel name
  phone: '+919437012345',
  whatsapp: '919437012345',
  email: 'info@hoteltariniregency.in',
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  siteUrl: 'https://YOUR-USERNAME.github.io/keonjhar-hotel',
  directBookingDiscount: '15'
};
```

Also update:

- [ ] `YOUR-USERNAME` in `sitemap.xml`, `robots.txt`, and page canonical URLs
- [ ] Formspree ID in `contact.html` and `booking/index.html`
- [ ] Google Maps iframe with exact hotel coordinates
- [ ] Replace Unsplash images with your hotel photos
- [ ] Room prices on `rooms.html` and `booking/index.html`

---

## Local Preview

```bash
cd keonjhar-hotel
python -m http.server 8000
```

Open:

- Multi-page home: http://localhost:8000/
- Booking page: http://localhost:8000/booking/
- Single-page legacy: http://localhost:8000/index-single.html

> Use a local server (not `file://`) so layout injection and i18n work correctly.

---

## GitHub Pages Deployment

```bash
git add .
git commit -m "Add multi-page, booking, and bilingual versions"
git push origin main
```

Then: **Repository → Settings → Pages → Deploy from branch `main`**

---

## SEO Notes

- Each page has unique `<title>` and `<meta description>`
- `explore.html` targets: *Hotels Near Maa Tarini Temple*, *Hotels Near Khandadhar Waterfall*
- `booking/` has highest sitemap priority (0.95) for conversion
- Submit: `https://YOUR-USERNAME.github.io/keonjhar-hotel/sitemap.xml`

---

## Which Version Should You Use?

| Goal | Recommendation |
|------|----------------|
| Google ranking & trust | Deploy full **multi-page** site |
| Facebook/WhatsApp ads | Link to **booking/** page |
| Local Odia/Hindi guests | Enable **language toggle** (already on all pages) |
| Quick demo | Share **index-single.html** |

You can deploy **all three together** — they share the same GitHub Pages hosting with no extra cost.
