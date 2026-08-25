# Jo's Kiln — website

Static site for Jo's Kiln pottery studio, Westbourne, Bournemouth. No framework, no build
step: plain HTML + one stylesheet + two small scripts. Deploys as-is to Vercel.

## Structure

```
index.html              Home
whats-on.html           Classes + Baluu booking embed (#book)
baby-prints.html        Baby prints, pricing, FAQ, enquiry form (#enquire, #voucher)
around-the-kiln.html    Kiln Club tiers, gallery, noticeboard (#interest)
find-us.html            Map, hours, contact form
privacy.html / 404.html
css/style.css           Design tokens at the top; seasonal accents on html[data-season]
js/config.js            ★ THE ONLY FILE TO EDIT to wire up backends (Baluu, Instagram,
                        Formspree, email, phone, map). Every value has a graceful fallback.
js/main.js              Menu, hero crossfade, accordion, filters, seasonal flip, embeds,
                        form handling, reveal animations. Respects prefers-reduced-motion.
assets/img/             Photos (semantic names). Swap files to update imagery.
vercel.json             Clean URLs on Vercel.
build_pages.py          Dev tool only (regenerates inner pages from index.html's header/
                        footer + pages_content.py). Not needed in production — you can
                        also just edit the HTML files directly and delete these two.
```

## Conventions

- `data-tel`, `data-whatsapp`, `data-email`, `data-book`, `data-voucher`, `data-maps-link`
  on any element get wired from config at load — never hardcode the phone number in markup.
- `data-ig-grid="6"` marks a photo grid that auto-fills from Instagram once
  `instagramFeedUrl` is set; its static children are the fallback.
- `form[data-form="…"]` posts to `formEndpoint` (Formspree) or falls back to mailto.
- Seasonal accent + hero strap flip automatically by month in main.js (`data-season-strap`).
- Workshop "highlight" cards in whats-on.html and index.html are hand-edited each term —
  live availability belongs to the Baluu embed, not these cards.

See NEXT-STEPS.md for the launch checklist.
