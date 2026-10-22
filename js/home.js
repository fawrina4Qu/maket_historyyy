(function () {
  var hero = document.querySelector(".hero");
  if (!hero) return;

  var slides = window.SITE_DATA.slides;
  var images = hero.querySelectorAll(".hero-slide");
  var dots = hero.querySelectorAll(".hero-dots button");
  var caption = hero.querySelector(".hero-caption span");
  var active = 0;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function render() {
    images.forEach(function (image, index) {
      var isActive = index === active;
      image.className = isActive ? "hero-slide is-active" : "hero-slide";
      if (isActive) {
        image.setAttribute("src", slides[index]);
      } else {
        image.removeAttribute("src");
      }
      image.setAttribute("aria-hidden", String(!isActive));
      image.setAttribute("fetchpriority", isActive ? "high" : "auto");
    });
    dots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === active);
    });
    caption.textContent = pad(active + 1) + " / " + pad(slides.length);
    var preload = new Image();
    preload.src = slides[(active + 1) % slides.length];
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      active = index;
      render();
    });
  });

  setInterval(function () {
    active = (active + 1) % slides.length;
    render();
  }, 6000);

  render();
})();
