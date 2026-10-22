(function () {
  document.querySelectorAll("[data-notes]").forEach(function (section) {
    var pages = window.SITE_DATA.notes[section.dataset.notes];
    if (!pages) return;

    var current = 0;
    var page = section.querySelector(".slavic-notes-page");
    var eyebrow = page.querySelector(".eyebrow");
    var pagination = section.querySelector(".slavic-notes-pagination");
    var numbers = Array.from(pagination.querySelectorAll(".slavic-notes-number"));
    var arrows = Array.from(pagination.querySelectorAll(".slavic-notes-arrow"));

    function render() {
      var item = pages[current];
      eyebrow.textContent = "СТРАНИЦА " + (current + 1) + " ИЗ " + pages.length;
      var heading = document.createElement("h2");
      heading.textContent = item.title;
      var content = [heading];
      item.paragraphs.forEach(function (text) {
        var paragraph = document.createElement("p");
        paragraph.textContent = text;
        content.push(paragraph);
      });
      if (item.items.length) {
        var list = document.createElement("ul");
        item.items.forEach(function (entry) {
          var listItem = document.createElement("li");
          if (entry.label) {
            var label = document.createElement("strong");
            label.textContent = entry.label + ": ";
            listItem.append(label);
          }
          listItem.append(document.createTextNode(entry.text));
          list.append(listItem);
        });
        content.push(list);
      }
      page.replaceChildren(eyebrow, ...content);
      numbers.forEach(function (button, index) {
        var active = index === current;
        button.classList.toggle("is-active", active);
        if (active) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
      });
      arrows[0].disabled = current === 0;
      arrows[1].disabled = current === pages.length - 1;
    }

    numbers.forEach(function (button, index) {
      button.addEventListener("click", function () {
        current = index;
        render();
      });
    });
    arrows[0].addEventListener("click", function () {
      current = Math.max(0, current - 1);
      render();
    });
    arrows[1].addEventListener("click", function () {
      current = Math.min(pages.length - 1, current + 1);
      render();
    });
    render();
  });
})();
