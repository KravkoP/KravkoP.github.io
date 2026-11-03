// Progressive enhancement only: every link and all text work without this file.
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  // The app catalog is the single source: counts and the hero icon wall come from its cards.
  var cards = document.querySelectorAll(".grid .card");
  if (cards.length) {
    var counts = { apps: cards.length, docs: document.querySelectorAll(".grid .card-links a").length };
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = counts[el.getAttribute("data-count")];
    });
    var tilt = document.querySelector(".wall-tilt");
    if (tilt) {
      var COLUMNS = 3, ICON_STEP = 146, MIN_LOOP = 800; // icon + gap, and px each marquee half must cover
      var sets = [[], [], []];
      cards.forEach(function (c, i) { sets[i % COLUMNS].push(c.querySelector(".app-icon").getAttribute("src")); });
      sets.forEach(function (set) {
        if (!set.length) return;
        var col = document.createElement("div");
        col.className = "wall-col";
        // Two identical halves keep the loop seamless at -50%.
        var total = 2 * Math.ceil(MIN_LOOP / (set.length * ICON_STEP));
        for (var n = 0; n < total; n++) {
          set.forEach(function (src) {
            var img = new Image(128, 128);
            img.alt = "";
            img.src = src;
            col.appendChild(img);
          });
        }
        tilt.appendChild(col);
      });
    }
  }

  // Theme toggle. Follows the system until the visitor chooses.
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  function saved() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
  function apply() {
    var t = saved();
    if (t) root.setAttribute("data-theme", t); else root.removeAttribute("data-theme");
    root.setAttribute("data-mode", t || (systemDark.matches ? "dark" : "light"));
  }
  apply();
  systemDark.addEventListener("change", apply);
  document.querySelectorAll(".theme-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-mode") === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", next); } catch (e) { root.setAttribute("data-theme", next); root.setAttribute("data-mode", next); return; }
      apply();
    });
  });

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }

  // Cursor spotlight on cards
  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--x", e.clientX - r.left + "px");
      c.style.setProperty("--y", e.clientY - r.top + "px");
    });
  });

  // App filter
  var filters = document.querySelectorAll(".filter");
  var items = document.querySelectorAll("[data-cat]");
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      filters.forEach(function (o) { o.setAttribute("aria-pressed", o === f ? "true" : "false"); });
      var cat = f.getAttribute("data-filter");
      items.forEach(function (i) {
        i.hidden = cat !== "all" && i.getAttribute("data-cat") !== cat;
        i.classList.add("in");
      });
    });
  });

  // Copy email
  document.querySelectorAll(".btn-copy").forEach(function (b) {
    var label = b.querySelector("span");
    var initial = label.textContent;
    b.addEventListener("click", function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(b.getAttribute("data-copy")).then(function () {
        label.textContent = "Copied";
        setTimeout(function () { label.textContent = initial; }, 1800);
      });
    });
  });

  // Policy pages: reading progress and active contents entry
  var progress = document.querySelector(".progress");
  if (progress) {
    var tick = false;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.setProperty("--read", max > 0 ? Math.min(1, h.scrollTop / max) : 0);
      tick = false;
    };
    window.addEventListener("scroll", function () {
      if (!tick) { tick = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
  var tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove("active"); });
        if (byId[e.target.id]) byId[e.target.id].classList.add("active");
      });
    }, { rootMargin: "-12% 0px -75% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();
