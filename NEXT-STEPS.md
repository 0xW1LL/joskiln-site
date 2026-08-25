# Jo's Kiln — what to do next

The site is fully built and deployable today. Everything below the "Deploy now" section
can happen after it's live — each service you wire up is a one-line change in `js/config.js`,
and the site behaves gracefully until then (phone/WhatsApp booking fallback, hand-picked
photo grids, mailto contact forms).

## 1. Deploy — DONE (25 Aug 2026)

- [x] Live at **https://www.joskiln.co.uk** (apex joskiln.co.uk 308-redirects to www, SSL
      issued by Vercel). Code lives at github.com/0xW1LL/joskiln-site (main branch);
      Vercel project `joskiln-site` redeploys automatically on every commit.
- [ ] Check the live site on your phone + Jo's phone (fonts, map, tap targets).

## 2. Domain + email — DONE (25 Aug 2026)

- [x] Email is LIVE: hello@joskiln.co.uk on Google Workspace. Gmail activated, MX at IONOS
      points to smtp.google.com (priority 1), Google SPF TXT added, IONOS mail records
      disabled, Workspace user renamed to Jo Rogers, IONOS contact details confirmed.
- [x] `email` in js/config.js updated to hello@joskiln.co.uk.
- [x] Domain wired: IONOS A `@` → 216.150.1.1 and CNAME `www` →
      b4d0d483855d9740.vercel-dns-016.com; old parking records (A/AAAA/mutex) disabled.
      MX + SPF untouched — email unaffected.
- [ ] Optional 5-min deliverability win: Admin console → Apps → Gmail → Authenticate
      email → generate DKIM key → add its TXT record in IONOS → Start authentication.
- [ ] Still worth checking in IONOS: what plan Jo pays for — cancel any website-builder
      part, keep the domain (don't touch it before checking the domain isn't bundled).
- [ ] Note: Workspace costs ~£5/user/month from the trial's end — Jo's ongoing cost.

## 3. Baluu — bookings (you WITH Jo, ~1–2 hours together)

This is the heart of the site. Do it sitting next to her.

- [x] Account created: Jo Rogers / Jo's Kiln under hello@joskiln.co.uk. Public booking
      page (permanent): https://jos-kiln.live.baluu.co.uk/events — already in js/config.js.
- [ ] Connect her bank/Stripe for payouts — she'll need her bank details ("Connect Stripe"
      is flagged in Baluu's sidebar).
- [ ] Create the autumn classes together (this doubles as her training — let her drive).
- [ ] Turn on gift vouchers in Baluu.
- [ ] Copy the embed URL / booking page URL / voucher page URL into `js/config.js`
      (`baluuEmbedUrl`, `baluuBookingUrl`, `voucherUrl`). The What's On page swaps its
      "warming up" card for the live calendar automatically, and every Book button deep-links.
- [ ] Watch her add one class and edit one class on her own phone before you leave.

## 4. Instagram feed (you, ~20 minutes)

- [ ] Confirm the @joskiln account (or whatever handle she uses) — update
      `instagramProfile` in config.
- [ ] Create a free feed at behold.so connected to her account, output = JSON,
      paste the feed URL into `instagramFeedUrl`. All three photo grids then update
      themselves whenever she posts. Until then the hand-picked photos stay.

## 5. Forms (you, ~10 minutes)

- [ ] Create a free form at formspree.io pointing at her email; paste the endpoint into
      `formEndpoint`. (Until then, submitting opens the visitor's own email app pre-filled —
      functional, but Formspree is nicer.) The newsletter signup posts there too, tagged by
      subject — a proper mailing tool (Mailchimp free) can replace it later if she outgrows it.

## 6. Content sign-off (Jo, before you announce the site)

- [ ] **Photo consent — launch blocker.** Several photos show children's pieces with names
      and birth dates (the painted plate, the LOVE frame, and pieces naming Neve, Ottie,
      Bella, Arlo, Harper, Phoebe and Quinn). Jo confirms each family is happy, or you
      swap/re-caption. There's a consent line in privacy.html — make "may we share a photo?"
      part of every session. (One photo naming a child in full was deliberately left out.)
- [x] Address confirmed: 79 Poole **Road** (updated throughout the site and config).
- [ ] Copy pass with Jo: prices, dates, opening hours, the FAQ safety wording
      ("non-toxic, skin-safe" — she confirms the actual materials), the two testimonials
      (replace with real ones or get permission to use these).
- [ ] The workshop "highlights" cards on What's On are hand-edited each season (marked with
      a comment in the HTML) — agree with Jo that she WhatsApps you the new term's list;
      it's a 10-minute job for you 3–4 times a year. Live availability always comes from Baluu.

## 7. Launch week (free marketing, mostly Jo)

- [ ] Register the free **Google Business Profile** ("pottery studio, Westbourne") with the
      same address/phone/hours — this is how locals will actually find her. Add photos.
- [ ] Get the site linked from the Westbourne village sites (discoverwestbourne.co.uk etc.)
      and local Facebook groups.
- [ ] Jo posts the website link on Instagram; vouchers make a good first post.

## 8. Later / nice-to-have

- [ ] Real photo shoot: portrait of Jo (replaces the illustrated stand-in — there's a TODO
      comment in index.html), each class in progress, the shopfront, finished pieces.
- [ ] Real testimonials with permission.
- [ ] Analytics if you want it (Vercel Analytics is one click, or Plausible ~£7/mo — skip
      Google Analytics, it needs a cookie banner).
- [ ] When Kiln Club launches: prices confirmed, "Launching this autumn" badge removed,
      membership sold through Baluu too.

## How updates work after launch (the promise to keep)

Jo never edits the website. Classes and prices: Baluu app on her phone. Photos: posting to
Instagram. Everything else (copy tweaks, seasonal highlight cards, noticeboard lines) is a
WhatsApp to Will. The seasonal colour accent and hero strap line flip themselves by date.
