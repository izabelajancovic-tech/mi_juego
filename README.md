# Academia de Dibujo — Juego Web Educativo

Plantilla limpia en **JavaScript puro (Vanilla JS)** y la API nativa de **Canvas**,
sin librerías externas ni CDNs. Pensada para enseñar el patrón de un Game Loop
a una estudiante de programación.

## Archivos del proyecto

```
academia-de-dibujo/
├── index.html   → estructura: canvas + HUD + botonera táctil
├── style.css    → fondo oscuro, centrado y diseño responsivo
├── game.js      → lógica del juego (loop, input, colisiones, poder)
└── README.md    → este archivo
```

## Cómo jugar

- **PC:** flechas `←` `→` para moverte, `Espacio` para disparar el poder especial.
- **Celular:** botones táctiles `◀` `▶` para moverte y el botón `✨ Poder` para disparar.
- Recolecta **Followers** (corazón verde), **Pinceles** y **Materiales** (paleta)
  para ganar puntos y energía.
- Esquiva los **Chismes** (burbuja roja con picos) o destrúyelos con tu poder
  si no puedes esquivarlos.
- La energía baja si un chisme te toca. Si llega a 0, termina la clase.

## Cómo probarlo localmente

1. Descarga/descomprime la carpeta completa (los 3 archivos deben estar juntos).
2. Abre `index.html` con doble clic, o usa un servidor local simple, por ejemplo:
   ```
   npx serve .
   ```
   (esto es opcional; el juego también funciona abriendo el archivo directo).
3. No necesita instalación, build ni conexión a internet.

## Cómo empaquetarlo en ZIP para entregar/descargar

**Opción A — desde el explorador de archivos:**
1. Coloca `index.html`, `style.css` y `game.js` dentro de una misma carpeta,
   por ejemplo `academia-de-dibujo/`.
2. Click derecho sobre la carpeta → "Comprimir" / "Send to → Compressed (zipped) folder".
3. Obtendrás `academia-de-dibujo.zip`, listo para compartir o subir a cualquier
   hosting estático (GitHub Pages, Netlify, servidor escolar, etc.).

**Opción B — desde la terminal (Mac/Linux):**
```bash
zip -r academia-de-dibujo.zip index.html style.css game.js README.md
```

**Opción C — desde PowerShell (Windows):**
```powershell
Compress-Archive -Path index.html, style.css, game.js, README.md -DestinationPath academia-de-dibujo.zip
```

## Guía rápida para la estudiante (dónde mirar en el código)

| Quiero entender... | Voy a esta parte de `game.js` |
|---|---|
| Cómo se mueve el personaje | sección `update(dt)` e `input` |
| El bucle principal del juego | función `gameLoop()` |
| Cómo se detectan los choques | función `checkCollisions()` |
| Cómo se dibuja cada cosa | funciones que empiezan con `draw...` |
| Cómo funcionan los botones táctiles | función `holdButton()` |

## Ideas para extender (ejercicios sugeridos)

- Agregar un sonido corto al recolectar un follower.
- Guardar el puntaje más alto en `localStorage`.
- Crear un nuevo tipo de enemigo con otro comportamiento (ej. se mueve en zigzag).
- Cambiar los colores en `style.css` (sección `:root`) para un nuevo tema visual.
