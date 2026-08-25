/* ============================================================
   JO'S KILN — SITE CONFIG
   This is the ONLY file you need to edit to wire up the backend.
   Each empty value has a graceful fallback until you fill it in.
   ============================================================ */
window.JK_CONFIG = {

  /* --- Contact ------------------------------------------------ */
  phoneDisplay: "07917 413699",
  phoneIntl:    "+447917413699",
  whatsappUrl:  "https://wa.me/447917413699",

  /* Live Google Workspace inbox — activated 25 Aug 2026.        */
  email: "hello@joskiln.co.uk",

  /* --- Booking (Baluu) ---------------------------------------- */
  /* Account live: Jo Rogers / Jo's Kiln (hello@joskiln.co.uk).
     Public booking page is permanent. Still to do IN BALUU:
     connect Stripe, create the class listings, enable vouchers.
     The page shows "no events" until listings exist — that's fine.
     If the iframe embed refuses to render (frame-blocking), blank
     baluuEmbedUrl — the phone/WhatsApp fallback card returns and
     every Book button still deep-links to the booking page.       */
  baluuEmbedUrl:   "https://jos-kiln.live.baluu.co.uk/events",
  baluuBookingUrl: "https://jos-kiln.live.baluu.co.uk/events",

  /* --- Gift vouchers ------------------------------------------ */
  /* Enable vouchers in Baluu, then paste the URL from
     Embeds → Sharing links (likely .../gift-cards).               */
  voucherUrl: "",

  /* --- Instagram feed (Behold.so or similar) ------------------ */
  /* Create a free feed at behold.so for @joskiln, choose JSON,
     paste the feed URL. Galleries then auto-update when Jo posts.
     Until then the hand-picked photos below stay in place.        */
  instagramFeedUrl: "",
  instagramProfile: "https://instagram.com/joskiln",

  /* --- Forms (Formspree) -------------------------------------- */
  /* Create a free form at formspree.io pointing at Jo's email,
     paste the endpoint. Until then, submitting opens the visitor's
     email app with the message pre-filled (mailto fallback).      */
  formEndpoint: "",      /* e.g. "https://formspree.io/f/abcdwxyz"  */

  /* --- Map ----------------------------------------------------- */
  mapQuery: "79 Poole Road, Westbourne, Bournemouth BH4 9BB",

  /* --- Site ---------------------------------------------------- */
  siteUrl: "https://joskiln.co.uk"   /* update if the domain differs */
};
