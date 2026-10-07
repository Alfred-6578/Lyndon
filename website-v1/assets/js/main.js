(function () {
  var WHATSAPP_NUMBER = "2348037101216";

  // Sticky header shadow
  var header = document.querySelector(".header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 10); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  var setMenu = function (open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Gallery filters
  var filters = document.querySelectorAll(".filter");
  var tiles = document.querySelectorAll(".tile");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.dataset.filter;
      tiles.forEach(function (t) { t.classList.toggle("is-hidden", f !== "all" && t.dataset.cat !== f); });
    });
  });

  // Journey / package buttons pre-fill the form
  var form = document.getElementById("leadForm");
  var goToForm = function (journey, focusNeeds) {
    form.elements.journey.value = journey;
    if (focusNeeds === "Signature Complete" || journey === "I need everything") {
      var box = form.querySelector('input[value="Complete Transformation"]');
      if (box) box.checked = true;
    }
    if (journey === "I'm abroad" && !form.elements.challenge.value) {
      form.elements.challenge.value = "Managing the project remotely";
    }
    if (journey === "I'm building") form.elements.stage.value = "Building";
    if (journey === "I'm renovating") form.elements.stage.value = "Renovating";
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 700);
  };
  document.querySelectorAll("[data-journey]").forEach(function (b) {
    b.addEventListener("click", function () { goToForm(b.dataset.journey); });
  });
  document.querySelectorAll("[data-package]").forEach(function (b) {
    b.addEventListener("click", function () { goToForm("Package: " + b.dataset.package, b.dataset.package); });
  });
  document.querySelectorAll("[data-journey-link]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); goToForm(a.dataset.journeyLink); });
  });

  // Form → WhatsApp
  var errorEl = document.getElementById("formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var el = form.elements;
    var missing = [];
    [el.name, el.phone].forEach(function (input) {
      var bad = !input.value.trim();
      input.classList.toggle("is-invalid", bad);
      if (bad) missing.push(input);
    });
    if (missing.length) {
      errorEl.textContent = "Please add your name and WhatsApp number.";
      errorEl.hidden = false;
      missing[0].focus();
      return;
    }
    errorEl.hidden = true;

    var needs = Array.prototype.map.call(form.querySelectorAll('input[name="needs"]:checked'), function (c) { return c.value; });
    var lines = [
      "Hello Lyndon Signature Plus, I'd like to request a project consultation.",
      "",
      "*Name:* " + el.name.value.trim(),
      "*WhatsApp:* " + el.phone.value.trim()
    ];
    var add = function (label, value) { if (value && value.trim()) lines.push("*" + label + ":* " + value.trim()); };
    add("Email", el.email.value);
    add("Location", el.location.value);
    add("Journey", el.journey.value);
    add("Project type", el.type.value);
    add("Stage", el.stage.value);
    if (needs.length) add("Needs", needs.join(", "));
    add("Biggest challenge", el.challenge.value);
    add("Budget", el.budget.value);
    add("Timeline", el.timeline.value);
    add("Details", el.message.value);

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });
  form.querySelectorAll("input").forEach(function (i) {
    i.addEventListener("input", function () { i.classList.remove("is-invalid"); });
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
