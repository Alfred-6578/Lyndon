(function () {
  var WHATSAPP_NUMBER = "2348037101216";

  // Mobile menu
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  var setMenu = function (open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  // Project filters
  var filters = document.querySelectorAll(".filter");
  var tiles = document.querySelectorAll("[data-cat]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      var f = btn.dataset.filter;
      tiles.forEach(function (t) { t.hidden = f !== "all" && t.dataset.cat !== f; });
    });
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Form → WhatsApp
  var form = document.getElementById("leadForm");
  if (!form) return;

  document.querySelectorAll("[data-abroad]").forEach(function (a) {
    a.addEventListener("click", function () { form.elements.abroad.checked = true; });
  });

  var errorEl = document.getElementById("formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var el = form.elements;
    var missing = [el.name, el.phone].filter(function (input) {
      var bad = !input.value.trim();
      input.classList.toggle("is-invalid", bad);
      return bad;
    });
    if (missing.length) {
      errorEl.textContent = "Please add your name and WhatsApp number.";
      errorEl.hidden = false;
      missing[0].focus();
      return;
    }
    errorEl.hidden = true;

    var needs = Array.prototype.map.call(form.querySelectorAll('input[name="needs"]:checked'), function (c) { return c.value; });
    var lines = ["Hello Lyndon Signature Plus, I'd like a quote.", ""];
    var add = function (label, value) { if (value && value.trim()) lines.push("*" + label + ":* " + value.trim()); };
    add("Name", el.name.value);
    add("WhatsApp", el.phone.value);
    add("Project location", el.location.value);
    add("Type of space", el.type.value);
    if (needs.length) add("Needs", needs.join(", "));
    add("Stage", el.stage.value);
    if (el.abroad.checked) add("Note", "I live outside Nigeria");
    add("Details", el.message.value);

    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
  });
  form.querySelectorAll("input").forEach(function (i) {
    i.addEventListener("input", function () { i.classList.remove("is-invalid"); });
  });
})();
