(function () {
  var data = window.SITE_DATA;
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

  var mainNav = document.querySelector(".site-header .main-nav");
  var searchBox = document.querySelector(".header-search");
  var closeHeaderSearch;
  if (searchBox && data) {
    var button = searchBox.querySelector("button");
    closeHeaderSearch = function () {
      searchBox.querySelector('input[type="search"]')?.remove();
      mainNav.querySelector('input[type="search"]')?.remove();
      searchBox.querySelector(".header-search-results")?.remove();
      mainNav.querySelector(".header-search-results")?.remove();
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Открыть поиск");
      button.innerHTML = '<span class="icon icon-search" aria-hidden="true"></span>';
    };
    button.addEventListener("click", function () {
      var input = searchBox.querySelector('input[type="search"]') || mainNav.querySelector('input[type="search"]');
      if (input) {
        closeHeaderSearch();
        if (window.matchMedia("(max-width: 710px)").matches) setMenu(false);
        return;
      }
      input = document.createElement("input");
      input.type = "search";
      input.placeholder = "Поиск";
      input.setAttribute("aria-label", "Поиск по сайту");
      var isMobile = window.matchMedia("(max-width: 710px)").matches;
      if (isMobile) {
        mainNav.prepend(input);
        setMenu(true);
      } else {
        button.before(input);
      }
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Закрыть поиск");
      button.innerHTML = '<span class="icon icon-close" aria-hidden="true"></span>';
      input.focus();
      input.addEventListener("input", function () {
        var resultsContainer = input.parentElement;
        resultsContainer.querySelector(".header-search-results")?.remove();
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
        resultsContainer.append(list);
      });
    });
  }
  var headerActions = document.querySelector(".site-header .header-actions");
  if (mainNav && headerActions) {
    var menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "menu-toggle";
    menuButton.setAttribute("aria-label", "Открыть меню");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = "<span></span><span></span><span></span>";
    headerActions.append(menuButton);

    var setMenu = function (open) {
      mainNav.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    };
    menuButton.addEventListener("click", function (event) {
      event.stopPropagation();
      var isOpen = mainNav.classList.contains("is-open");
      if (isOpen) closeHeaderSearch?.();
      setMenu(!isOpen);
    });
    document.addEventListener("click", function (event) {
      if (!mainNav.contains(event.target) && !headerActions.contains(event.target)) {
        closeHeaderSearch?.();
        setMenu(false);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
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
