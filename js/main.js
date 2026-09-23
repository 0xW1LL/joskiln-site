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

  /* ---------- time-limited notices ----------
     Any element with data-until="YYYY-MM-DD" deletes itself the day after
     that date, so a notice can never quietly rot on the site. Extend one by
     changing its date; end it early by deleting the block. ------------- */
  document.querySelectorAll("[data-until]").forEach(function (el) {
    var until = new Date(el.getAttribute("data-until") + "T23:59:59");
    if (!isNaN(until.getTime()) && Date.now() > until.getTime()) el.remove();
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
  if (embedHost && C.baluuTimetableSlug) {
    /* Baluu's timetable web component: script + custom element */
    var bs = document.createElement("script");
    bs.src = "https://webcomponents.baluu.io/v4/baluu-widgets.umd.js";
    bs.async = true;
    document.head.appendChild(bs);
    var bt = document.createElement("baluu-timetable");
    bt.setAttribute("business-slug", C.baluuTimetableSlug);
    bt.setAttribute("api-url", C.baluuApiUrl || "https://api.bff.baluu.io");
    embedHost.appendChild(bt);
    if (embedFallback) embedFallback.style.display = "none";
  } else if (embedHost && C.baluuEmbedUrl) {
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
  function startFade(tf) {
    var slides = tf.querySelectorAll("img");
    if (slides.length < 2 || reduced) return;
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove("is-active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("is-active");
    }, 4500);
  }
  document.querySelectorAll(".tile-fade").forEach(startFade);

  /* ---------- Jo's own galleries (kept from /admin) ----------
     If Jo has saved a gallery in the admin page, its tiles replace
     the hand-picked ones baked into the HTML. Grids she has not
     touched fall through to the Instagram feed (when wired) and
     then to the baked-in photos. Nothing here can break the page:
     any failure just leaves the HTML as it is. */
  function buildTile(t) {
    var fig = document.createElement("figure");
    var caption = t.caption || "";
    var alt = t.alt || caption || "A piece from the studio";
    if (t.type === "video") {
      var v = document.createElement("video");
      v.src = t.src;
      if (t.poster) v.poster = t.poster;
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.preload = "metadata";
      v.setAttribute("aria-label", alt);
      if (reduced) { v.setAttribute("controls", ""); }
      else { v.autoplay = true; v.setAttribute("autoplay", ""); }
      fig.appendChild(v);
    } else if (t.type === "pair" && t.src2) {
      var wrap = document.createElement("div");
      wrap.className = "tile-fade";
      [t.src, t.src2].forEach(function (s, i) {
        var im = document.createElement("img");
        im.src = s; im.alt = i === 0 ? alt : ""; im.loading = "lazy";
        if (i === 0) im.className = "is-active";
        wrap.appendChild(im);
      });
      fig.appendChild(wrap);
      startFade(wrap);
    } else {
      var img = document.createElement("img");
      img.src = t.src; img.alt = alt; img.loading = "lazy";
      if (t.nocrop) img.className = "no-crop";
      fig.appendChild(img);
    }
    if (caption) {
      var fc = document.createElement("figcaption");
      fc.textContent = caption;
      fig.appendChild(fc);
    }
    return fig;
  }
  var jkGrids = document.querySelectorAll("[data-gallery]");
  if (jkGrids.length) {
    fetch("/api/gallery-list", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || data.empty || !data.galleries) return;
        jkGrids.forEach(function (grid) {
          var g = data.galleries[grid.getAttribute("data-gallery")];
          if (!g || !g.tiles || !g.tiles.length) return;
          grid.removeAttribute("data-ig-grid"); /* Jo's picks win over Instagram */
          grid.innerHTML = "";
          g.tiles.forEach(function (t) { grid.appendChild(buildTile(t)); });
          var note = grid.parentElement && grid.parentElement.querySelector(".auto-note");
          if (note) note.textContent = "Jo keeps this gallery up to date herself, fresh from the studio";
        });
      })
      .catch(function () { /* keep the baked-in photos */ });
  }

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
