# Copilot Instructions for Hotel Shree Krishna

## Project overview
This repository is a static multi-page hotel website built with plain HTML, CSS, and JavaScript. Keep changes lightweight, accessible, and consistent with the existing brand and information architecture.

## Project conventions
- Prefer vanilla HTML, CSS, and JavaScript over frameworks, bundlers, or package-heavy tooling.
- Preserve the current hotel branding, tone, and page structure across all versions of the site.
- Maintain responsive mobile-first layouts; do not break desktop and mobile layouts when editing shared styles.
- Favor semantic HTML, clear labels, meaningful alt text, and keyboard-friendly interactions.
- Reuse the existing shared script flow: `js/config.js`, `locales/translations.js`, `js/i18n.js`, `js/layout.js`, and `js/main.js`.
- For pages that use localization, keep `data-i18n`, `data-i18n-placeholder`, and `data-i18n-aria` keys aligned with `locales/translations.js`.
- If a page uses the shared header/footer or layout injection, avoid breaking `body data-page` values and navigation links.
- Keep links consistent with the hotel flow: home, rooms, facilities, gallery, explore, contact, and booking routes.

## File and folder conventions
- Root pages such as `index.html`, `about.html`, `rooms.html`, `facilities.html`, `gallery.html`, `explore.html`, and `contact.html` are content-heavy marketing pages.
- `style.css` is the shared design system for the main site.
- `js/` contains shared config, layout logic, localization helpers, and main page behaviors.
- `locales/translations.js` stores the language content for the bilingual EN/HI/OD experience.
- `booking/` is the conversion-oriented booking flow and should stay self-contained but aligned with the main site branding.
- Prefer small, targeted edits over broad rewrites unless the task explicitly requires an architectural change.

## Validation and test commands
Use these checks before finalizing changes:

```bash
cd "c:/Users/baide/go/src/hotel-shree-krishna"
python -m http.server 8000
```

Then confirm the site loads in a browser:

- http://localhost:8000/
- http://localhost:8000/booking/
- http://localhost:8000/contact.html

Optional quick syntax checks for JavaScript:

```bash
node --check js/main.js
node --check js/i18n.js
node --check js/layout.js
```

For a lightweight HTTP check in another terminal:

```bash
curl -I http://localhost:8000/
curl -I http://localhost:8000/booking/
```

## Quality bar before completion
- Confirm the page still renders without obvious syntax or layout breakage.
- Verify there are no broken selectors, missing assets, or invalid relative paths.
- Check that booking or CTA links still work and that localized text keys remain valid.
- Ensure no new dependency or framework is introduced for a simple static-site task.

## Avoid
- Do not add frameworks, package managers, or build systems unless explicitly requested.
- Do not introduce external dependencies or heavy client-side libraries for simple UI changes.
- Do not change page structure, navigation, or content flow in a way that disrupts the current design or localization behavior.
- Do not break the static, GitHub Pages-friendly setup that this project relies on.
