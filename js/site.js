(function () {
  var data = window.SITE_DATA;
  var icons = window.SITE_ICONS;
  var favoritesKey = "favorite-lectures";

  function readFavorites() {
    try {
      var value = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function paintFavorites() {
    var favorites = readFavorites();
    document.querySelectorAll(".lecture-card").forEach(function (card) {
      var button = card.querySelector(".lecture-favorite");
      var title = card.querySelector("h2");
      if (!button || !title) return;
      var active = favorites.includes(title.textContent);
      button.classList.toggle("is-favorite", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;
    var favoriteButton = target.closest(".lecture-favorite");
    if (!favoriteButton) return;
    var title = favoriteButton.closest(".lecture-card")?.querySelector("h2")?.textContent;
    if (!title) return;
    var favorites = readFavorites();
    localStorage.setItem(favoritesKey, JSON.stringify(
      favorites.includes(title) ? favorites.filter(function (item) { return item !== title; }) : favorites.concat(title)
    ));
    paintFavorites();
  });

  var searchBox = document.querySelector(".header-search");
  if (searchBox && data) {
    var button = searchBox.querySelector("button");
    button.addEventListener("click", function () {
      var input = searchBox.querySelector('input[type="search"]');
      if (input) {
        input.remove();
        searchBox.querySelector(".header-search-results")?.remove();
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Открыть поиск");
        button.innerHTML = icons.search;
        return;
      }
      input = document.createElement("input");
      input.type = "search";
      input.placeholder = "Поиск";
      input.setAttribute("aria-label", "Поиск по сайту");
      button.before(input);
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Закрыть поиск");
      button.innerHTML = icons.headerClose;
      input.focus();
      input.addEventListener("input", function () {
        searchBox.querySelector(".header-search-results")?.remove();
        var query = input.value.trim().toLocaleLowerCase("ru").replace(/ё/g, "е");
        if (!query) return;
        var results = data.searchPages.filter(function (page) {
          return (page.title + " " + page.text).toLocaleLowerCase("ru").replace(/ё/g, "е").includes(query);
        }).slice(0, 10);
        var list = document.createElement("div");
        list.className = "header-search-results";
        if (!results.length) {
          list.textContent = "Ничего не найдено";
        } else {
          results.forEach(function (result) {
            var link = document.createElement("a");
            link.href = result.to;
            link.textContent = result.title;
            list.append(link);
          });
        }
        searchBox.append(list);
      });
    });
  }

  document.querySelectorAll(".footer-bottom a[href='/']").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  if (document.querySelector(".lecture-grid") && location.hash) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "center" });
  }
  paintFavorites();
  window.Site = { esc: function (value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  } };
})();
