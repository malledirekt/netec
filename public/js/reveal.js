/*
 * Netec – sanftes Einblenden beim Scrollen.
 * Elemente mit [data-reveal] erscheinen, sobald sie in den Sichtbereich kommen.
 * Ohne JavaScript oder bei "reduzierter Bewegung" ist alles sofort sichtbar.
 */
(function () {
  "use strict";
  var els = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  // Geschwister leicht versetzt einblenden
  els.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
    var i = sibs.indexOf(el);
    if (sibs.length > 1 && i > 0) el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();
