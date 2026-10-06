(function () {
  "use strict";

  var portada = document.getElementById("portada");
  var pantallaAudio = document.getElementById("audio-pantalla");
  var btnAbrir = document.getElementById("btn-abrir");
  var btnVolver = document.getElementById("btn-volver");
  var btnPlay = document.getElementById("btn-play");
  var audio = document.getElementById("audio-carta");
  var barra = document.getElementById("barra");
  var llena = document.getElementById("llena");
  var punto = document.getElementById("punto");
  var tActual = document.getElementById("t-actual");
  var tTotal = document.getElementById("t-total");
  var aviso = document.getElementById("aviso");

  function irA(destino) {
    var actual = document.querySelector(".pantalla.activa");
    if (actual) {
      actual.classList.remove("activa");
      actual.style.display = "none";
    }
    destino.style.display = "flex";
    // fuerza reflow para que la animacion arranque desde el principio
    void destino.offsetWidth;
    destino.classList.add("activa");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  btnAbrir.addEventListener("click", function () {
    irA(pantallaAudio);
  });

  btnVolver.addEventListener("click", function () {
    audio.pause();
    irA(portada);
  });

  // ---------- reproductor ----------
  function fmt(seg) {
    if (!isFinite(seg) || seg < 0) seg = 0;
    var m = Math.floor(seg / 60);
    var s = Math.floor(seg % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function pintar() {
    var dur = audio.duration || 0;
    var pct = dur ? (audio.currentTime / dur) * 100 : 0;
    llena.style.width = pct + "%";
    punto.style.left = pct + "%";
    tActual.textContent = fmt(audio.currentTime);
  }

  btnPlay.addEventListener("click", function () {
    aviso.hidden = true;
    if (audio.paused) {
      var p = audio.play();
      if (p && p.catch) {
        p.catch(function () {
          aviso.hidden = false;
        });
      }
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", function () {
    document.body.classList.add("sonando");
    btnPlay.setAttribute("aria-label", "Pausar audio");
  });

  audio.addEventListener("pause", function () {
    document.body.classList.remove("sonando");
    btnPlay.setAttribute("aria-label", "Reproducir audio");
  });

  audio.addEventListener("ended", function () {
    audio.currentTime = 0;
    pintar();
  });

  audio.addEventListener("loadedmetadata", function () {
    tTotal.textContent = fmt(audio.duration);
    pintar();
  });

  audio.addEventListener("timeupdate", pintar);

  audio.addEventListener("error", function () {
    aviso.hidden = false;
  });

  // buscar posicion al tocar/mover la barra
  var arrastrando = false;

  function buscar(e) {
    var r = barra.getBoundingClientRect();
    var x = (e.clientX !== undefined ? e.clientX : 0) - r.left;
    var ratio = Math.min(1, Math.max(0, x / r.width));
    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
      pintar();
    }
  }

  barra.addEventListener("pointerdown", function (e) {
    arrastrando = true;
    barra.setPointerCapture(e.pointerId);
    buscar(e);
  });

  barra.addEventListener("pointermove", function (e) {
    if (arrastrando) buscar(e);
  });

  barra.addEventListener("pointerup", function () {
    arrastrando = false;
  });

  barra.addEventListener("pointercancel", function () {
    arrastrando = false;
  });
})();
