---
schemaVersion: 1
scope: workspace
updatedAt: "2026-07-09T16:28:35.652Z"
workspaceName: "Academia-de-Dibujo-Juego-Web"
---

# Project Memory

## Project Overview
- Juego de navegador educativo tipo "Academia de Dibujo" en Vanilla JS + Canvas nativo, sin librerías ni CDNs.
- Pensado también como material didáctico: código muy comentado para enseñar a una estudiante de programación.
- Debe funcionar responsivo en PC (teclado) y móvil (botones táctiles en pantalla).

## Current State
- Proyecto completo y verificado con preview (0 errores de consola, 0 errores de assets).
- 5 archivos entregados: `index.html`, `style.css`, `game.js`, `README.md`, `DESIGN.md`.
- Mecánicas implementadas: movimiento izquierda/derecha del personaje, recolección de items (Followers, Pinceles, materiales artísticos = energía/puntos), enemigos a esquivar (Chismes, etc.), botón de poder especial que dispara y destruye enemigos.
- Controles: flechas de teclado (PC) + botones táctiles en pantalla (móvil).

## Artifacts
- `index.html`: contiene el `<canvas>` del juego y la botonera táctil (izquierda, derecha, disparo especial) debajo, para móvil.
- `style.css`: fondo oscuro estético, canvas centrado en pantalla, botones táctiles adaptados/responsivos.
- `game.js`: game loop, dibujo del personaje (cuadrado = "chica"), spawn de items/enemigos, manejo de disparos, detección de colisiones, input de teclado y de botones táctiles.
- `README.md`: instrucciones para empaquetar el proyecto en ZIP y ejecutarlo localmente.
- `DESIGN.md`: creado para cumplir requisito de plataforma (mínimo Google-compatible: versión, nombre, colores, tipografía, rounded, spacing, Overview). Es el artefacto de diseño autoritativo.

## Design Direction
- Estética oscura, minimalista, orientada a legibilidad de canvas de juego sobre fondo oscuro.
- Personaje jugador representado como cuadrado de color (placeholder abstracto de "chica"), sin sprites/bitmaps.
- UI de controles táctiles simple, botones grandes pensados para touch en móvil.
- Sin librerías externas ni CDNs: 100% Vanilla JS + Canvas API nativa.

## User Feedback
- Usuario pidió explícitamente: código muy comentado en forma corta y sencilla, apto para enseñar a una estudiante de programación.
- Pidió que el proyecto sea descargable/empaquetable en formato ZIP.
- Pidió estrictamente Vanilla JS + Canvas nativo, sin librerías ni CDNs.
- Pidió estructura en 3 archivos independientes mínimos (index.html, style.css, game.js); se entregaron 2 adicionales (README, DESIGN.md) como soporte.

## Decisions
- Personaje jugador: cuadrado de color, ubicado en parte inferior de pantalla, movimiento horizontal (izquierda/derecha) únicamente.
- Ítems recolectables (energía/puntos): Followers, Pinceles, materiales artísticos.
- Enemigos a esquivar: Chismes y similares.
- Mecánica de disparo especial vía botón en pantalla para destruir enemigos no esquivables.
- Sin frameworks, sin dependencias externas, sin CDNs.
- Entrega estructurada en archivos separados (no un solo bundle).

## Open Questions
- No se definieron valores exactos de balance de juego (velocidad, puntaje por item, vidas, dificultad progresiva) — quedaron con valores por defecto razonables del desarrollador.
- No se aclaró si se requieren sprites/imágenes reales a futuro o si el placeholder de cuadrado es definitivo.

## Next Steps
- Si el usuario pide iterar: ajustar balance de dificultad, agregar sonidos, o mejorar el "cuadrado" con más detalle visual (aún vanilla canvas).
- Confirmar que el usuario pudo descargar/empaquetar el ZIP sin problemas.

## Promotion Candidates For DESIGN.md
- Paleta de fondo oscuro estético usada en canvas y contenedor.
- Estilo de botones táctiles (tamaño, radio, espaciado) para HUD móvil.
- Estas ya deberían estar reflejadas en DESIGN.md (creado en esta sesión); validar que sea consistente con futuras iteraciones.

## Recent History
- 2026-07-09: Creación inicial completa del juego "Academia de Dibujo" (index.html, style.css, game.js, README.md, DESIGN.md). Preview verificado sin errores. Único warning fue un bloqueo externo de red del inspector (ERR_BLOCKED_BY_CLIENT), no atribuible al código del proyecto.