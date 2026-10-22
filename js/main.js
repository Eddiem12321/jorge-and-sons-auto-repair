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

  /* ---------- Background video ----------
     Muted clips behind the Home and Services headers. Each header has a short
     playlist: every clip plays for a few seconds, then crossfades to the next,
     and the list repeats. Videos only play while on screen, can be paused with
     the button, and are skipped for reduced motion and Data Saver, where the
     still image stays instead. */
  var saveData = navigator.connection && navigator.connection.saveData;
  if (!reduceMotion && !saveData) {
    document.querySelectorAll(".bg-video").forEach(initBgVideo);
  }

  function initBgVideo(video) {
    var section = video.closest("section");
    var toggle = section.querySelector(".video-toggle");
    var size = window.innerWidth >= 1200 ? "data-lg" : "data-md";
    var clips = (video.getAttribute(size) || "").trim().split(/\s+/).filter(Boolean);
    var clipSeconds = parseFloat(video.getAttribute("data-clip-seconds") || "9");
    var players = [video];
    var active = 0, index = 0, switching = false, userPaused = false, onScreen = false;
    if (!clips.length) return;

    // A second, stacked video preloads the next clip so each switch is a crossfade
    if (clips.length > 1) {
      players.push(video.parentNode.appendChild(video.cloneNode(false)));
    } else {
      video.loop = true;
    }

    function play(p) {
      var r = p.play();
      if (r && r.catch) r.catch(function () {});
    }

    function load(p, i) {
      p.preload = "auto";
      p.src = clips[i % clips.length];
    }

    function advance() {
      if (switching || players.length < 2) return;
      switching = true;
      var current = players[active];
      var upcoming = players[1 - active];
      active = 1 - active;
      index += 1;
      upcoming.currentTime = 0;
      current.classList.remove("is-front");
      upcoming.classList.add("is-ready", "is-front");
      if (!userPaused && onScreen) play(upcoming);
      // After the fade, park the old clip and preload the one after next
      setTimeout(function () {
        current.classList.remove("is-ready");
        current.pause();
        load(current, index + 1);
        switching = false;
      }, 1100);
    }

    players.forEach(function (p, n) {
      p.muted = true;
      p.addEventListener("playing", function () {
        if (n !== active) return;
        p.classList.add("is-ready", "is-front");
        if (toggle) toggle.hidden = false;
        if (players[1] && !players[1].getAttribute("src")) load(players[1], 1);
      });
      p.addEventListener("timeupdate", function () {
        if (n === active && p.currentTime >= clipSeconds) advance();
      });
      p.addEventListener("ended", function () {
        if (n === active) advance();
      });
    });

    // Start downloading the first clip only once the page itself has finished loading
    function start() {
      load(video, 0);
      if (onScreen && !userPaused) play(video);
    }
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    if (toggle) {
      toggle.addEventListener("click", function () {
        userPaused = !userPaused;
        if (userPaused) players[active].pause(); else play(players[active]);
        toggle.classList.toggle("is-paused", userPaused);
        toggle.setAttribute("aria-label", userPaused ? "Play background video" : "Pause background video");
      });
    }

    // Only play while the header is on screen, to save battery and data
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen && !userPaused) play(players[active]);
        else players[active].pause();
      }).observe(section);
    } else {
      onScreen = true;
      play(video);
    }
  }

  /* ---------- Highlight today's hours (contact page) ---------- */
  var today = new Date().getDay();
  document.querySelectorAll(".hours li[data-days]").forEach(function (li) {
    var days = li.getAttribute("data-days").split(",").map(Number);
    if (days.indexOf(today) !== -1) li.classList.add("is-today");
  });

  /* ---------- Contact form: prefill the service picked on the Services page ---------- */
  var pickedService = new URLSearchParams(window.location.search).get("service");
  var messageField = document.getElementById("message");
  if (pickedService && messageField && !messageField.value) {
    messageField.value = pickedService.slice(0, 120);
  }

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
