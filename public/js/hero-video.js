/*
 * Netec – Hero-Hintergrundvideo
 * Spielt einen Ausschnitt eines YouTube-Videos stumm in Schleife ab
 * (Start/Ende aus data-start / data-end am #hero-video Element).
 * Das Foto darunter bleibt sichtbar, bis das Video wirklich läuft, und
 * ist der Fallback auf kleinen Bildschirmen, bei "reduzierter Bewegung"
 * oder Datensparmodus.
 *
 * Später besser: den Ausschnitt als MP4/WebM selbst hosten (schneller,
 * ohne YouTube-Cookies). Dann reicht ein <video autoplay muted loop playsinline>.
 */
(function () {
  "use strict";

  var wrap = document.getElementById("hero-video");
  if (!wrap) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var smallScreen = window.matchMedia("(max-width: 767px)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || smallScreen || saveData) return;

  var id = wrap.getAttribute("data-youtube-id");
  var start = parseFloat(wrap.getAttribute("data-start")) || 0;
  var end = parseFloat(wrap.getAttribute("data-end")) || 0;
  var DELAY_MS = 3000; // erst 3 Sekunden nur das Foto zeigen
  var t0 = Date.now();
  var player, timer;

  function loop() {
    clearInterval(timer);
    timer = setInterval(function () {
      if (!player || !player.getCurrentTime) return;
      if (end && player.getCurrentTime() >= end - 0.25) player.seekTo(start, true);
    }, 200);
  }

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("hero-video-player", {
      host: "https://www.youtube-nocookie.com",
      videoId: id,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 0, mute: 1, controls: 0, disablekb: 1, fs: 0,
        modestbranding: 1, rel: 0, playsinline: 1, iv_load_policy: 3,
        start: Math.floor(start), end: Math.ceil(end),
      },
      events: {
        onReady: function (e) {
          e.target.mute();
          var wait = Math.max(0, DELAY_MS - (Date.now() - t0));
          setTimeout(function () {
            e.target.seekTo(start, true);
            e.target.playVideo();
          }, wait);
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            wrap.classList.remove("opacity-0");
            loop();
          } else if (e.data === YT.PlayerState.ENDED) {
            e.target.seekTo(start, true);
            e.target.playVideo();
          }
        },
      },
    });
  };

  var s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  s.async = true;
  document.head.appendChild(s);
})();
