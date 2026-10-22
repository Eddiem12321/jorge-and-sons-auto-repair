/* Jorge & Sons Auto Repair: small progressive enhancements (vanilla JS, no dependencies). */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var desktop = window.matchMedia("(min-width: 900px)");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close with Escape and return focus to the button
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    // Close when clicking outside the header
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".site-header")) {
        setMenu(false);
      }
    });

    // Reset when resizing up to desktop
    var onChange = function (mq) { if (mq.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- Gentle fade-in on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scroll-scrubbed video ----------
     The video plays while you scroll: down moves it forward, stopping pauses
     it, and up plays it backward, all while the page scrolls normally.
     Skipped for reduced motion and Data Saver, where the poster image stays. */
  var saveData = navigator.connection && navigator.connection.saveData;
  if (!reduceMotion && !saveData) {
    document.querySelectorAll("[data-scrub]").forEach(initScrub);
  }

  function initScrub(track) {
    var video = track.querySelector(".scrub-video");
    if (!video) return;
    var start = parseFloat(video.getAttribute("data-start") || "0");
    var end = 0, current = start, target = start;
    var seeking = false, ready = false, visible = true, raf = 0;
    var src = window.innerWidth >= 1200 ? video.getAttribute("data-src-lg") : video.getAttribute("data-src-md");

    video.muted = true;

    function progress() {
      var rect = track.getBoundingClientRect();
      var headerBottom = document.querySelector(".site-header").getBoundingClientRect().bottom;
      var distance = track.offsetHeight;
      var p = distance > 0 ? (headerBottom - rect.top) / distance : 0;
      return Math.min(1, Math.max(0, p));
    }

    function update() {
      var p = progress();
      track.style.setProperty("--p", p.toFixed(4));
      if (end) target = start + (end - start) * p;
    }

    function seek(t) {
      seeking = true;
      video.currentTime = t;
    }

    // Ease toward the scroll position so fast flicks still look smooth,
    // and only ask for a new frame once the last seek has finished.
    function tick() {
      raf = 0;
      if (!end) return;
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.01) current = target;
      if (!seeking && Math.abs(video.currentTime - current) > 0.015) seek(current);
      if (current !== target) raf = requestAnimationFrame(tick);
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    video.addEventListener("seeked", function () {
      seeking = false;
      if (!ready) {
        ready = true;
        video.classList.add("is-ready");
      }
      schedule();
    });

    video.addEventListener("loadedmetadata", function () {
      var dataEnd = parseFloat(video.getAttribute("data-end") || "0");
      end = dataEnd && dataEnd < video.duration ? dataEnd : video.duration - 0.05;
      update();
      current = target;
      seek(current);
    });

    // Download the whole clip up front so scrubbing (especially backward) is instant
    fetch(src).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.blob();
    }).then(function (blob) {
      video.src = URL.createObjectURL(blob);
    }).catch(function () {
      video.preload = "auto";
      video.src = src;
    });

    window.addEventListener("scroll", function () {
      if (!visible) return;
      update();
      schedule();
    }, { passive: true });
    window.addEventListener("resize", function () { update(); schedule(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) { update(); schedule(); }
      }).observe(track);
    }
    update();
  }

  /* ---------- Highlight today's hours (contact page) ---------- */
  var today = new Date().getDay();
  document.querySelectorAll(".hours li[data-days]").forEach(function (li) {
    var days = li.getAttribute("data-days").split(",").map(Number);
    if (days.indexOf(today) !== -1) li.classList.add("is-today");
  });

  /* ---------- Contact form: front-end validation + confirmation ---------- */
  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");

  if (form && success) {
    var fields = form.querySelectorAll("input, textarea");

    function mark(el) {
      var wrap = el.closest(".field");
      if (!wrap) return;
      var ok = el.validity.valid; // (checkValidity() would re-fire "invalid")
      wrap.classList.toggle("is-invalid", !ok);
      wrap.classList.toggle("is-valid", ok && el.value.trim() !== "");
      el.setAttribute("aria-invalid", ok ? "false" : "true");
    }

    fields.forEach(function (el) {
      // Trim whitespace-only answers so "   " doesn't count as filled in
      el.addEventListener("blur", function () {
        if (el.value.trim() === "") el.value = "";
        if (el.dataset.touched) mark(el);
      });
      el.addEventListener("input", function () {
        if (el.dataset.touched) mark(el);
      });
      // Fires when the browser's built-in validation rejects a field on submit
      el.addEventListener("invalid", function () {
        el.dataset.touched = "1";
        mark(el);
      });
      el.addEventListener("change", function () {
        el.dataset.touched = "1";
        mark(el);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      fields.forEach(function (el) {
        if (el.value.trim() === "") el.value = "";
        el.dataset.touched = "1";
        mark(el);
      });

      if (!form.checkValidity()) {
        // Show the browser's native message on the first problem field
        form.reportValidity();
        return;
      }

      // No back end: show the on-page confirmation instead of sending anywhere
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.classList.add("is-visible");
      success.focus();
    });
  }
})();
