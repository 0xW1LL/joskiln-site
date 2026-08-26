/* ============================================================
   JO'S KILN — behaviour
   Reads js/config.js (window.JK_CONFIG). Everything degrades
   gracefully while config values are empty.
   ============================================================ */
(function () {
  "use strict";
  var C = window.JK_CONFIG || {};
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- seasonal accent + strap (automatic, by date) ---------- */
  var m = new Date().getMonth() + 1; // 1..12
  var season = (m >= 3 && m <= 5) ? "spring" : (m >= 6 && m <= 8) ? "summer" : (m >= 9 && m <= 11) ? "autumn" : "winter";
  document.documentElement.setAttribute("data-season", season);
  var straps = {
    spring: "Spring at the kiln. Seasonal events for adults.",
    summer: "Summer at the kiln. Seasonal events for adults.",
    autumn: "Autumn at the kiln. Seasonal events for adults.",
    winter: "Winter at the kiln. Seasonal events for adults."
  };
  document.querySelectorAll("[data-season-strap]").forEach(function (el) {
    el.textContent = straps[season];
    el.classList.add("has-strap");
  });

  /* ---------- contact wiring ---------- */
  document.querySelectorAll("[data-phone]").forEach(function (el) {
    el.textContent = C.phoneDisplay || el.textContent;
  });
  document.querySelectorAll("[data-tel]").forEach(function (el) {
    el.setAttribute("href", "tel:" + (C.phoneIntl || ""));
  });
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.setAttribute("href", C.whatsappUrl || "#");
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.setAttribute("href", "mailto:" + (C.email || ""));
    if (el.hasAttribute("data-email-text")) el.textContent = C.email || "";
  });
  document.querySelectorAll("[data-instagram]").forEach(function (el) {
    el.setAttribute("href", C.instagramProfile || "#");
  });

  /* ---------- Book buttons deep-link to Baluu when configured ---------- */
  document.querySelectorAll("[data-book]").forEach(function (el) {
    if (C.baluuBookingUrl) {
      el.setAttribute("href", C.baluuBookingUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      // fallback: send people to the booking section / What's On page
      var fallback = el.getAttribute("data-book") || "whats-on.html#book";
      el.setAttribute("href", fallback);
    }
  });
  document.querySelectorAll("[data-voucher]").forEach(function (el) {
    if (C.voucherUrl) {
      el.setAttribute("href", C.voucherUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });

  /* ---------- mobile menu ---------- */
  var menu = document.getElementById("mobile-menu");
  var openBtn = document.getElementById("menu-open");
  var closeBtn = document.getElementById("menu-close");
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
  }
  if (openBtn) openBtn.addEventListener("click", function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
  if (menu) menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- hero crossfade (pausable, reduced-motion aware) ---------- */
  var hero = document.querySelector(".hero__slides");
  if (hero) {
    var slides = hero.querySelectorAll("img");
    var dots = document.querySelectorAll(".hero__dots span");
    var pauseBtn = document.querySelector(".hero__pause");
    var idx = 0, paused = false, timer = null;
    function show(i) {
      slides.forEach(function (s, j) { s.classList.toggle("is-active", i === j); });
      dots.forEach(function (d, j) { d.classList.toggle("is-active", i === j); });
    }
    show(0);
    if (slides.length > 1 && !reduced) {
      timer = setInterval(function () {
        if (!paused) { idx = (idx + 1) % slides.length; show(idx); }
      }, 6000);
    }
    if (pauseBtn) {
      if (slides.length < 2 || reduced) { pauseBtn.style.display = "none"; }
      pauseBtn.addEventListener("click", function () {
        paused = !paused;
        pauseBtn.textContent = paused ? "▶" : "❚❚";
        pauseBtn.setAttribute("aria-label", paused ? "Play photos" : "Pause photos");
        pauseBtn.setAttribute("aria-pressed", String(paused));
      });
    }
  }

  /* ---------- accordion ---------- */
  document.querySelectorAll(".acc__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc__item");
      var open = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!open));
      btn.setAttribute("aria-expanded", String(!open));
      var icon = btn.querySelector(".acc__icon");
      if (icon) icon.textContent = open ? "+" : "–";
    });
  });

  /* ---------- workshop filter chips ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter");
        document.querySelectorAll("[data-cat]").forEach(function (card) {
          var cats = card.getAttribute("data-cat").split(" ");
          card.style.display = (f === "all" || cats.indexOf(f) !== -1) ? "" : "none";
        });
      });
    });
  }

  /* ---------- Baluu booking embed ---------- */
  var embedHost = document.getElementById("booking-embed");
  var embedFallback = document.getElementById("booking-fallback");
  if (embedHost && C.baluuEmbedUrl) {
    var iframe = document.createElement("iframe");
    iframe.src = C.baluuEmbedUrl;
    iframe.title = "Book a class at Jo's Kiln";
    iframe.loading = "lazy";
    iframe.allow = "payment";
    embedHost.appendChild(iframe);
    if (embedFallback) embedFallback.style.display = "none";
  }

  /* ---------- Instagram-fed galleries (Behold JSON) ---------- */
  /* Grids marked data-ig-grid keep their hand-picked photos until
     C.instagramFeedUrl is set; then the newest posts replace them. */
  if (C.instagramFeedUrl) {
    fetch(C.instagramFeedUrl)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var posts = data.posts || data.media || [];
        if (!posts.length) return;
        document.querySelectorAll("[data-ig-grid]").forEach(function (grid) {
          var max = parseInt(grid.getAttribute("data-ig-grid"), 10) || 6;
          grid.innerHTML = "";
          posts.slice(0, max).forEach(function (p) {
            var url = p.sizes && p.sizes.medium ? p.sizes.medium.mediaUrl : (p.mediaUrl || p.thumbnailUrl);
            if (!url) return;
            var fig = document.createElement("figure");
            var a = document.createElement("a");
            a.href = p.permalink || C.instagramProfile;
            a.target = "_blank"; a.rel = "noopener";
            var img = document.createElement("img");
            img.src = url; img.alt = (p.caption || "Fresh from the kiln").slice(0, 80); img.loading = "lazy";
            a.appendChild(img); fig.appendChild(a);
            var cap = document.createElement("figcaption");
            cap.textContent = (p.caption || "").split("\n")[0].slice(0, 60);
            fig.appendChild(cap);
            grid.appendChild(fig);
          });
        });
      })
      .catch(function () { /* keep the static photos */ });
  }

  /* ---------- forms: Formspree when configured, mailto fallback ---------- */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form__status");
      var fields = {};
      form.querySelectorAll("input[name], textarea[name]").forEach(function (f) { fields[f.name] = f.value; });
      var subject = form.getAttribute("data-form") === "baby"
        ? "Baby prints enquiry from the website"
        : "Message from the Jo's Kiln website";

      if (C.formEndpoint) {
        var btn = form.querySelector("button[type=submit]");
        if (btn) btn.disabled = true;
        fetch(C.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({ _subject: subject }, fields))
        }).then(function (r) {
          if (r.ok) {
            form.reset();
            if (status) { status.textContent = "Thank you. Your message is on its way to Jo. She replies within a day or two."; status.dataset.state = "ok"; }
          } else { throw new Error("bad status"); }
        }).catch(function () {
          if (status) { status.textContent = "That didn't send. Please WhatsApp Jo instead."; status.dataset.state = "err"; }
        }).finally(function () { if (btn) btn.disabled = false; });
      } else {
        /* no endpoint yet: open the visitor's email app pre-filled */
        var body = Object.keys(fields).map(function (k) { return k + ": " + fields[k]; }).join("\n");
        window.location.href = "mailto:" + (C.email || "") +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        if (status) { status.textContent = "Your email app should open with the message ready to send."; status.dataset.state = "ok"; }
      }
    });
  });

  /* ---------- Google Maps embed ---------- */
  var mapHost = document.getElementById("map-embed");
  if (mapHost) {
    var mf = document.createElement("iframe");
    mf.src = "https://www.google.com/maps?q=" + encodeURIComponent(C.mapQuery || "Jo's Kiln Westbourne") + "&output=embed";
    mf.title = "Map showing Jo's Kiln, 79 Poole Road, Westbourne";
    mf.loading = "lazy";
    mf.referrerPolicy = "no-referrer-when-downgrade";
    mapHost.appendChild(mf);
  }
  document.querySelectorAll("[data-maps-link]").forEach(function (el) {
    el.setAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.mapQuery || ""));
  });

  /* ---------- crossfading gallery tiles ---------- */
  document.querySelectorAll(".tile-fade").forEach(function (tf) {
    var slides = tf.querySelectorAll("img");
    if (slides.length < 2 || reduced) return;
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove("is-active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("is-active");
    }, 4500);
  });

  /* ---------- looping gallery video: stop for reduced-motion visitors ---------- */
  if (reduced) {
    document.querySelectorAll("video[autoplay]").forEach(function (v) {
      v.removeAttribute("autoplay"); v.pause(); v.setAttribute("controls", "");
    });
  }

  /* ---------- reveal on scroll ---------- */
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }
})();
