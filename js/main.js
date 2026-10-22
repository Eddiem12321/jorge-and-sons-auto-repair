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
