---
applyTo: "**/*.html, **/*.css, **/*.js"
---

# Frontend page conventions

- Keep this site in plain HTML, CSS, and JavaScript without introducing frameworks or a build pipeline.
- Preserve the existing hotel branding, spacing, typography, and page flow across all pages.
- Match the current structure and naming conventions used in nearby files before making edits.
- Prefer semantic elements, accessible labels, and keyboard-friendly controls.
- If a change affects shared layout or styling, verify the main page and booking page still render correctly.
- Keep localization support intact: `data-i18n` attributes and translation keys must remain aligned with the source files in `locales/translations.js`.
- Validate locally with a static server and confirm the affected page loads without obvious JavaScript or asset errors.

## Local checks
```bash
cd "c:/Users/baide/go/src/hotel-shree-krishna"
python -m http.server 8000
```

Then open:
- http://localhost:8000/
- http://localhost:8000/booking/
- http://localhost:8000/contact.html
