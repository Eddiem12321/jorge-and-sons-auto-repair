# Jorge & Sons Auto Repair

A four-page marketing site for **Jorge & Sons Auto Repair**, a family-owned mechanic shop in East Orange, NJ (a fictional client). Built for the Anchor Digital web designer hiring case.

**Live site:** https://eddiem12321.github.io/jorge-and-sons-auto-repair/

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: opening, our promise, customer testimonials, visit |
| `services.html` | Services: what we fix (icon grid of all 10 services), good to know |
| `about.html` | About: our story, pull quote, the next generation, the team |
| `contact.html` | Contact: address, tap-to-call phone, hours, contact form |
| `css/styles.css` | All styles (mobile-first, one file) |
| `js/main.js` | Mobile menu, fade-in on scroll, today's hours, form validation |

## Tech

- Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no back end.
- Hosted on GitHub Pages straight from the `main` branch.
- To run locally, open `index.html` in a browser, or serve the folder (for example `python3 -m http.server`).

## Design decisions

- **Feel:** a workshop palette of deep charcoal-navy (`#1b2129`), burnt orange (`#b4501a`) and amber (`#f0a15e`) accents, on warm off-white (`#f8f4ed`). It's meant to read as an honest, family-run neighborhood shop rather than a template.
- **Type:** Zilla Slab (a sturdy slab serif, like a painted shop sign) for headlines, Barlow Condensed for buttons and navigation, and Source Sans 3 for body text. All from Google Fonts.
- **Logo:** a type-only wordmark framed like a hand-painted shop sign, a nod to Jorge painting the original sign himself. It uses only the business name, so it adds no new copy.
- **Mobile-first:** most customers will visit on a phone, so every phone number is a `tel:9735550142` link and a sticky **Call** bar stays at the bottom of the screen on small devices. The header collapses into a hamburger menu (it closes with Escape, an outside click, or when the screen widens).
- **Subtle motion:** gentle hover lifts and a fade-in on scroll, both turned off for visitors who set "reduce motion".
- **Scroll-driven video:** the Home and Services headers play a repair video while you scroll. The page scrolls normally and the video moves with it: stop scrolling and it stops, scroll up and it plays backward. Each clip downloads once so scrubbing stays smooth, and visitors with reduced motion or Data Saver turned on see a still image instead.
- **Small touches:** on the Contact page, today's hours are highlighted automatically. The "Four bays now" line on the About page gets a small four-bay illustration.

## Copy rules

All on-page text is the client copy, used verbatim. The only additions are functional UI labels: the nav links (Home, Services, About, Contact), form labels (Name, Phone, Email, Message, Send), the mobile **Call** button, a keyboard-only "Skip to content" link, and image alt text.

- Section names from the copy doc (for example "Our Promise" or "The Team") are not shown on the page. They're used only as invisible `aria-label`s so screen-reader users can navigate by section.
- Team photos are styled placeholders with role icons, not stock photos of people standing in for the Ramírez family.
- **Contact form:** there's no back end, so nothing is sent anywhere. The form uses the browser's built-in validation (required Name, Phone, and Message; a phone-number pattern; a valid email if one is entered), so error messages come from the browser rather than adding new copy. Invalid fields are outlined in red and marked `aria-invalid`. On a valid submit, the form is replaced by an on-page confirmation that reuses a sentence from the copy: "We'll get back to you the same day."

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, labelled sections, and `figure`/`blockquote`/`figcaption` for quotes.
- Color contrast meets WCAG AA (for example, white on burnt orange is 5.1:1 and amber on charcoal is 7.7:1).
- Visible focus outlines, a skip link, a hamburger button with `aria-expanded`/`aria-controls`, `aria-current` on the active page, and decorative icons hidden from screen readers.
- Every content image has descriptive alt text. Every form field has a `<label>`.

## Photo credits

The photos are free to use under the [Unsplash License](https://unsplash.com/license) and are hotlinked from `images.unsplash.com`.

| Where | Photo | Photographer |
| --- | --- | --- |
| Home, our promise | [Man refilling motor oil on car engine bay](https://unsplash.com/photos/man-refilling-motor-oil-on-car-engine-bay-V37iTrYZz2E) | [Tim Mossholder](https://unsplash.com/@timmossholder) |
| About, our story | [A man working on a machine in a garage](https://unsplash.com/photos/a-man-working-on-a-machine-in-a-garage-KhF58h0hTbc) | [Kato Blackmore](https://unsplash.com/@katoblackmore) |

Videos are free to use under the [Pexels License](https://www.pexels.com/license/) and are hotlinked from `videos.pexels.com` (still frames from `images.pexels.com`).

| Where | Video | Videographer |
| --- | --- | --- |
| Home, opening | [Person Repairing a Car Engine](https://www.pexels.com/video/person-repairing-a-car-engine-8469674/) | [Anastasia Shuraeva](https://www.pexels.com/@anastasia-shuraeva/) |
| Services, header | [Close-up of a Car Engine Showing Mechanical Details](https://www.pexels.com/video/close-up-of-a-car-engine-showing-mechanical-details-39112150/) | [Pedro H. Novais](https://www.pexels.com/@pedro-h-novais-2154429539/) |

Icons are inline SVGs. Some are drawn by hand and others are adapted from [Feather Icons](https://feathericons.com/) (MIT License).

---

© 2026 Jorge & Sons Auto Repair. All rights reserved.
