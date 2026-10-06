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
    void destino.offsetWidth;
    destino.classList.add("activa");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  btnAbrir.addEventListener("click", function () {
    irA(pantallaAudio);
  });

  btnVolver.addEventListener("click", function () {
    reproduccionDeseada = false;
    audio.pause();
    irA(portada);
  });

  // ---------- fuentes de audio ----------
  // Se elige la fuente comprobando con HEAD si el mp3 real ya existe;
  // si no, se usa el wav de prueba. Si una fuente falla al reproducir,
  // se avanza a la siguiente (manejo explicito, sin <source>, para que
  // iOS tambien funcione).
  var FUENTES = ["audio/carta.mp3", "audio/carta.wav"];
  var idx = -1;
  var agotadas = false;
  var reproduccionDeseada = false;

  function cargarDesde(i) {
    idx = i;
    audio.src = FUENTES[i];
    audio.load();
  }

  function arrancar() {
    agotadas = false;
    aviso.hidden = true;
    fetch(FUENTES[0], { method: "HEAD" })
      .then(function (r) {
        cargarDesde(r.ok ? 0 : 1);
      })
      .catch(function () {
        cargarDesde(1);
      });
  }

  audio.addEventListener("error", function () {
    if (idx >= 0 && idx < FUENTES.length - 1) {
      cargarDesde(idx + 1);
    } else {
      agotadas = true;
      document.body.classList.remove("sonando");
      btnPlay.setAttribute("aria-label", "Reproducir audio");
      aviso.hidden = false;
    }
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

  function intentarPlay() {
    if (agotadas) {
      aviso.hidden = false;
      return;
    }
    var p = audio.play();
    if (p && p.catch) {
      p.catch(function (err) {
        var n = err && err.name;
        if (n === "NotAllowedError") {
          // iOS exige gesto: el usuario toca de nuevo y ya funciona
          reproduccionDeseada = false;
          document.body.classList.remove("sonando");
          aviso.hidden = false;
        } else if (n !== "AbortError" && agotadas) {
          aviso.hidden = false;
        }
      });
    }
  }

  btnPlay.addEventListener("click", function () {
    aviso.hidden = true;
    var reproduciendo = !audio.paused && !audio.ended;
    if (reproduciendo) {
      reproduccionDeseada = false;
      audio.pause();
      return;
    }
    reproduccionDeseada = true;
    if (agotadas || idx < 0) {
      arrancar();
    }
    intentarPlay();
  });

  audio.addEventListener("loadedmetadata", function () {
    tTotal.textContent = fmt(audio.duration);
    pintar();
    if (reproduccionDeseada) {
      intentarPlay();
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
    reproduccionDeseada = false;
    audio.currentTime = 0;
    document.body.classList.remove("sonando");
    btnPlay.setAttribute("aria-label", "Reproducir audio");
    pintar();
  });

  audio.addEventListener("timeupdate", pintar);

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

  // carga inicial de la fuente disponible
  arrancar();
})();
