---
version: alpha
name: Academia de Dibujo Design System
---

## Overview
Juego web educativo (Vanilla JS + Canvas) sobre una academia de dibujo.
La estética es oscura y estilo "cuaderno de arte nocturno": fondo morado
casi negro, acentos rosa/violeta para la jugadora y su poder, y colores
cálidos (dorado, verde menta) para objetos coleccionables. Diseño mobile-first
con botonera táctil de mínimo 56px y soporte completo de teclado en PC.

## Colors
- background (`--bg-deep`): `#16121f` — fondo general del body.
- canvas-gradient-top (`--bg-canvas-a`): `#201a33`
- canvas-gradient-bottom (`--bg-canvas-b`): `#120e1c`
- surface (`--surface`): `#241d38` — HUD, botones táctiles, overlays.
- surface-border (`--surface-border`): `#3c3159`
- text (`--text-main`): `#f3ecff` — texto principal, casi blanco con tinte violeta.
- muted (`--text-muted`): `#a99bc9` — texto secundario/hints.
- accent (`--accent`): `#ff7ad9` — color de la jugadora, CTAs primarios.
- accent-soft (`--accent-soft`): `#ffb0e6` — valores destacados del HUD.
- gold (`--gold`): `#ffcf5c` — materiales artísticos, moño del personaje.
- success (`--success`): `#6be3b0` — followers, barra de energía (extremo alto).
- danger (`--danger`): `#ff5c73` — enemigos "chismes".
- power (`--power`): `#b98bff` — disparo del poder especial.

## Typography
- font-display: `"Trebuchet MS", "Segoe UI", sans-serif` — usada en todo el juego
  (títulos de overlay, HUD, botones). Elegida por ser redondeada, amigable y
  disponible sin CDN.
- Escala fluida con `clamp()` para títulos de overlay (`1.3rem`–`1.8rem`).
- Etiquetas HUD en mayúsculas, `0.68rem`, `letter-spacing: 0.06em`.

## Rounded
- radius-lg: `20px` — marco del canvas.
- radius-md: `12px` — HUD, botones táctiles.
- pill: `999px` — botones primarios (`.btn-primary`) y barra de energía.

## Spacing
- Contenedor de juego (`.game-wrap`) usa `clamp(0.75rem, 3vw, 1.5rem)` de padding
  y `gap: 0.75rem` entre HUD / canvas / controles.
- Botones táctiles: mínimo 56×56px (objetivo táctil accesible).
- Botones primarios: mínimo 44px de alto (objetivo táctil accesible).

## Components
- **HUD** (`.hud`): tarjeta superior con puntos, barra de energía y nivel.
- **Canvas frame** (`.canvas-frame`): contenedor con `aspect-ratio: 3/4`,
  degradado y sombra; centra el juego en cualquier pantalla.
- **Overlay** (`.overlay`): pantalla de inicio / pausa / fin de juego, fondo
  semitransparente con blur sobre el canvas.
- **btn-primary**: CTA principal en overlays (rosa→violeta, texto oscuro).
- **touch-btn**: botón táctil cuadrado para mover/pausar; variante
  `touch-btn-power` con acento violeta para el disparo especial.
- **Personaje jugador**: cuadrado rosa redondeado con moño dorado y mejillas,
  representa a "la Chica" de la academia; se dibuja con Canvas puro (sin bitmaps).
