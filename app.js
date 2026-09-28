(function () {
  var root = document.documentElement;
  var preloader = document.getElementById("preloader");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function markReady() {
    root.classList.add("is-ready");
    countUp();
  }

  function dismissPreloader() {
    if (preloader) {
      preloader.classList.add("is-done");
      preloader.setAttribute("aria-hidden", "true");
      if (reduceMotion) markReady();
      else window.setTimeout(markReady, 380);
    } else {
      markReady();
    }
  }

  if (document.readyState === "complete") dismissPreloader();
  else window.addEventListener("load", dismissPreloader, { once: true });

  function countUp() {
    var nodes = document.querySelectorAll("[data-count]");
    if (reduceMotion) return;
    nodes.forEach(function (node) {
      var target = parseInt(node.getAttribute("data-count"), 10);
      if (isNaN(target)) return;
      var start = performance.now();
      var duration = 900;
      node.textContent = "0";
      function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        node.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
        else node.textContent = String(target);
      }
      requestAnimationFrame(tick);
    });
  }

  var menu = document.getElementById("directory-menu");
  var toggle = document.querySelector(".menu-toggle");
  var closeButton = menu ? menu.querySelector(".menu-close") : null;

  function openMenu() {
    if (!menu || !toggle) return;
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-menu-open");
    if (closeButton) closeButton.focus();
  }

  function closeMenu() {
    if (!menu || !toggle || menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-menu-open");
    toggle.focus();
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (menu && menu.hidden) openMenu();
      else closeMenu();
    });
  }

  if (menu) {
    menu.addEventListener("click", function (event) {
      var closer = event.target.closest("[data-menu-close]");
      if (closer) {
        closeMenu();
        return;
      }
      var link = event.target.closest("a");
      if (link && menu.contains(link)) closeMenu();
    });

    menu.querySelectorAll(".acc-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var panel = document.getElementById(button.getAttribute("aria-controls"));
        var open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", open ? "false" : "true");
        if (panel) panel.hidden = open;
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".group"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var search = document.getElementById("q");
  var empty = document.getElementById("empty");
  var count = document.getElementById("count");
  var status = "all";

  cards.forEach(function (card) {
    var text = (card.textContent || "").toLowerCase().replace(/\s+/g, " ").trim();
    card.setAttribute("data-search", text);
  });

  function destinationLabel(n) {
    return n + (n === 1 ? " destination" : " destinations");
  }

  function apply() {
    var query = search && search.value ? search.value.trim().toLowerCase() : "";
    var shown = 0;

    cards.forEach(function (card) {
      var cardStatus = card.getAttribute("data-status");
      var haystack = card.getAttribute("data-search") || "";
      var statusOk = status === "all" || cardStatus === status;
      var queryOk = !query || haystack.indexOf(query) !== -1;
      var visible = statusOk && queryOk;
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    groups.forEach(function (group) {
      group.hidden = !group.querySelector(".card:not([hidden])");
    });

    if (empty) empty.hidden = shown !== 0;
    if (count) count.textContent = destinationLabel(shown);
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      status = chip.getAttribute("data-filter") || "all";
      chips.forEach(function (item) {
        item.setAttribute("aria-pressed", item === chip ? "true" : "false");
      });
      apply();
    });
  });

  if (search) search.addEventListener("input", apply);
})();
