# Para Harumi - Feliz Cumpleanos

Pagina regalo de Frank para Harumi. Un QR en la carta lleva a esta pagina,
que reproduce el audio de Frank leyendo su carta.

**URL:** https://ardalaxdown.github.io/harumi-cumpleanos/

## Estructura

| Archivo | Que hace |
|---|---|
| `index.html` | Pagina principal (portada -> reproductor de audio) |
| `styles.css` | Estilo: dorado + turquesa (colores de Chamber) sobre verde casino, naipes y fichas |
| `app.js` | Transicion de pantallas y controles del audio |
| `qr.html` | Generador de QR (para imprimir en la carta): botones de imprimir / descargar SVG / PNG |
| `audio/carta.wav` | Audio de PRUEBA (voz sintetica) |
| `audio/carta.mp3` | Aca va el audio real de Frank (**tiene prioridad** sobre el WAV) |

## Como cambiar el audio cuando llegue el real

1. Guarda el audio real como `audio/carta.mp3` (si viene en m4a o wav, tambien sirve;
   renombrar a `carta.mp3` solo si en realidad es mp3).
2. Sube el archivo al repositorio:
   - GitHub > repositorio > **Add file > Upload files** > arrastra el archivo > **Commit changes**.
3. En ~1 minuto la pagina ya reproduce el audio nuevo.
   **No hace falta tocar codigo**: el HTML primero busca `carta.mp3` y solo si no existe
   usa el `carta.wav` de prueba.

## Como generar / imprimir el QR

1. Abre `qr.html` (localmente o en la pagina ya publicada).
2. Boton **Imprimir** para imprimir directo, o **Descargar PNG/SVG** para llevarlo a una
   imprenta (el PNG sale en 1200px, suficiente para la carta).

## Notas tecnicas

- Subida de archivos: GitHub API (curl), Pages activada desde la API.
- El QR apunta a `https://ardalaxdown.github.io/harumi-cumpleanos/`.
- Si cambias la URL (renombras el repo), regenera el QR.
