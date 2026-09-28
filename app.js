(function () {
  var preloader = document.getElementById("preloader");

  function dismissPreloader() {
    if (!preloader) return;
    preloader.classList.add("is-done");
    preloader.setAttribute("aria-hidden", "true");
  }

  if (document.readyState === "complete") dismissPreloader();
  else window.addEventListener("load", dismissPreloader, { once: true });

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
