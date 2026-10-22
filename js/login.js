(function () {
  var tabs = document.querySelectorAll("[data-auth-tab]");
  var panels = document.querySelectorAll("[data-auth-panel]");
  var title = document.getElementById("registration-title");

  function showTab(name) {
    tabs.forEach(function (tab) {
      var active = tab.dataset.authTab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active) title.textContent = tab.dataset.title;
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.dataset.authPanel !== name;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      showTab(tab.dataset.authTab);
    });
  });

  showTab(new URLSearchParams(window.location.search).get("mode") === "login" ? "login" : "signup");
})();
