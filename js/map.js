(function () {
  var section = document.querySelector(".map-section");
  if (!section) return;

  var cities = window.SITE_DATA.mapCities;
  var icons = window.SITE_ICONS;
  var esc = window.Site.esc;
  var dialog = section.querySelector("dialog.map-popup");
  var points = section.querySelectorAll(".map-point");
  var selected = null;
  var factIndex = 0;

  function renderPoints() {
    points.forEach(function (point, index) {
      var isSelected = selected !== null && cities[index].title === selected.title;
      point.classList.toggle("selected", isSelected);
      point.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function renderDialog() {
    if (!selected) {
      dialog.innerHTML = "";
      return;
    }
    dialog.innerHTML =
      '<button class="map-popup-close" aria-label="Закрыть окно">' + icons.mapClose + "</button>" +
      '<div class="map-detail-top"><span>ГОРОД НА КАРТЕ</span><span class="map-detail-ornament">✳</span></div>' +
      "<h3>" + esc(selected.title) + "</h3>" +
      (selected.image ? '<img class="map-city-image" src="' + selected.image + '" alt="' + esc(selected.title) + '" />' : "") +
      "<dl><div><dt>Год основания</dt><dd>" + esc(selected.founded) + "</dd></div>" +
      "<div><dt>Историческая территория</dt><dd>" + esc(selected.history) + "</dd></div></dl>" +
      '<p class="map-fact">' + esc(selected.facts[factIndex]) + "</p>" +
      '<button class="map-next-fact">Ещё факт ' + icons.arrowRight16 + "</button>";
  }

  function closeDialog() {
    dialog.close();
  }

  points.forEach(function (point, index) {
    point.addEventListener("click", function () {
      selected = cities[index];
      factIndex = 0;
      renderPoints();
      renderDialog();
      if (!dialog.open) dialog.showModal();
    });
  });

  dialog.addEventListener("click", function (event) {
    var target = event.target;
    if (target === dialog) {
      closeDialog();
      return;
    }
    if (!(target instanceof Element)) return;
    if (target.closest(".map-popup-close")) {
      closeDialog();
      return;
    }
    if (target.closest(".map-next-fact") && selected) {
      factIndex = (factIndex + 1) % selected.facts.length;
      renderDialog();
    }
  });

  dialog.addEventListener("close", function () {
    selected = null;
    factIndex = 0;
    renderPoints();
    renderDialog();
  });
})();
