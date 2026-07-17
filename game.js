/* =========================================================
   ACADEMIA DE DIBUJO - game.js
   Juego hecho con JavaScript puro y la API de Canvas.
   Cada función tiene un comentario corto explicando su tarea.
   Ideal para estudiar cómo funciona un Game Loop simple.
   ========================================================= */

// --- 1. Referencias a elementos del HTML que vamos a usar ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- Carga de imágenes ---
const chicaImage = new Image();
chicaImage.src = 'img/personaje.png';

const followerImage = new Image();
followerImage.src = 'img/item.png';

const pincelImage = new Image();
pincelImage.src = 'img/cuadro-de-arte.png';

const materialImage = new Image();
materialImage.src = 'img/los-amigos-v1.png';

const enemyImage = new Image();
enemyImage.src = 'img/enemigo.png';

const fondoAcademiaImage = new Image();
let fondoAcademiaReady = false;
fondoAcademiaImage.onload = () => {
  fondoAcademiaReady = true;
};
fondoAcademiaImage.src = 'img/fondo-academia.png';

// --- Carga de sonidos ---
const disparoSound = new Audio('sfx/disparo.mp3');
const golpeChismesSound = new Audio('sfx/golpe-chismes.mp3');
const sonidoAmigosSound = new Audio('sfx/sonido-amigos.mp3');
const sonidoPincelesSound = new Audio('sfx/sonido-pinceles.mp3');
const sonidoDeCuadrosSound = new Audio('sfx/sonido-de-cuadros.mp3');

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  [disparoSound, golpeChismesSound, sonidoAmigosSound, sonidoPincelesSound, sonidoDeCuadrosSound].forEach((sound) => {
    if (!sound) return;
    sound.muted = false;
    sound.volume = 1;
    try {
      sound.load();
    } catch (error) {
      // Ignoramos errores de carga en navegadores restrictivos.
    }
  });
}

function playSound(sound) {
  if (!sound) return;

  unlockAudio();

  try {
    sound.currentTime = 0;
    const playPromise = sound.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        try {
          const fallback = sound.cloneNode(true);
          fallback.volume = 1;
          fallback.play().catch(() => {});
        } catch (error) {}
      });
    }
  } catch (error) {
    // Se ignora para no interrumpir el juego.
  }
}

const scoreValueEl = document.getElementById("scoreValue");
const levelValueEl = document.getElementById("levelValue");
const energyFillEl = document.getElementById("energyFill");
const energyBarEl = document.getElementById("energyBar");

const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const pauseOverlay = document.getElementById("pauseOverlay");
const finalScoreText = document.getElementById("finalScoreText");

const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const resumeBtn = document.getElementById("resumeBtn");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnPower = document.getElementById("btnPower");
const btnPause = document.getElementById("btnPause");

// --- 2. "state" guarda TODO lo que cambia mientras se juega ---
// Tenerlo junto en un objeto facilita reiniciar el juego.
const state = {
  width: 0,          // ancho del canvas en pixeles "de pantalla"
  height: 0,         // alto del canvas en pixeles "de pantalla"
  running: false,    // ¿el juego está activo?
  paused: false,     // ¿está en pausa?
  score: 0,
  level: 1,
  energy: 100,
  spawnTimer: 0,     // cuenta el tiempo para crear el próximo objeto
  powerCooldown: 0,  // tiempo que falta para volver a disparar el poder
  items: [],         // followers, pinceles y materiales que caen
  enemies: [],       // chismes que hay que esquivar o destruir
  bolts: [],         // disparos del poder especial
  player: {
    x: 0,
    y: 0,
    w: 44,
    h: 44,
    speed: 500,       // pixeles por segundo
  },
};

// Qué tecla o botón está siendo presionado ahora mismo
const input = { left: false, right: false };

/* ---------------------------------------------------------
   3. AJUSTAR EL TAMAÑO DEL CANVAS
   Hace que el juego se vea nítido y correcto en cualquier
   pantalla (celular o computadora).
   --------------------------------------------------------- */
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // escala todo el dibujo al dpr

  state.width = rect.width;
  state.height = rect.height;

  // Mantiene a la jugadora pegada abajo y dentro de la pantalla
  state.player.y = state.height - state.player.h - 14;
  state.player.x = Math.min(state.player.x, state.width - state.player.w);
}

/* ---------------------------------------------------------
   4. REINICIAR EL JUEGO (variables al valor inicial)
   --------------------------------------------------------- */
function resetGame() {
  state.score = 0;
  state.level = 1;
  state.energy = 100;
  state.spawnTimer = 0;
  state.powerCooldown = 0;
  state.items = [];
  state.enemies = [];
  state.bolts = [];
  state.player.x = state.width / 2 - state.player.w / 2;
  updateHUD();
}

/* ---------------------------------------------------------
   5. ACTUALIZAR EL MARCADOR (puntos, nivel, energía)
   --------------------------------------------------------- */
function updateHUD() {
  scoreValueEl.textContent = state.score;
  levelValueEl.textContent = state.level;
  const clampedEnergy = Math.max(0, Math.min(100, state.energy));
  energyFillEl.style.width = clampedEnergy + "%";
  energyBarEl.setAttribute("aria-valuenow", Math.round(clampedEnergy));
}

/* ---------------------------------------------------------
   6. CREAR UN OBJETO QUE CAE (follower, pincel, material o chisme)
   Elige un tipo al azar según probabilidades y lo agrega
   a la lista correspondiente (items o enemies).
   --------------------------------------------------------- */
function spawnFallingThing() {
  const roll = Math.random();
  const size = 30;
  const x = Math.random() * (state.width - size);
  const baseSpeed = 90 + state.level * 14;

  // Probabilidad de que aparezca un "chisme" (enemigo) sube con el nivel
  const enemyChance = Math.min(0.4, 0.2 + state.level * 0.02);

  if (roll < enemyChance) {
    state.enemies.push({
      type: "chisme",
      x, y: -size, size,
      speed: baseSpeed * 1.1,
    });
    return;
  }

  // Si no es enemigo, decide qué tipo de objeto bueno cae
  const pick = Math.random();
  let type = "follower";
  if (pick > 0.66) type = "material";
  else if (pick > 0.33) type = "pincel";

  state.items.push({ type, x, y: -size, size, speed: baseSpeed });
}

/* ---------------------------------------------------------
   7. DISPARAR EL PODER ESPECIAL
   Crea un "rayo de inspiración" que sube y destruye chismes.
   --------------------------------------------------------- */
function firePower() {
  if (state.powerCooldown > 0 || !state.running || state.paused) return;

  state.bolts.push({
    x: state.player.x + state.player.w / 2 - 4,
    y: state.player.y,
    w: 8,
    h: 22,
    speed: 480,
  });

  playSound(disparoSound);

  state.powerCooldown = 0.55; // segundos antes de poder disparar otra vez
}

/* ---------------------------------------------------------
   8. MOVER TODO (jugadora, objetos, enemigos, disparos)
   "dt" es el tiempo transcurrido desde el frame anterior.
   --------------------------------------------------------- */
function update(dt) {
  // --- mover a la jugadora según las teclas/botones presionados ---
  if (input.left) state.player.x -= state.player.speed * dt;
  if (input.right) state.player.x += state.player.speed * dt;
  state.player.x = Math.max(0, Math.min(state.width - state.player.w, state.player.x));

  // --- bajar el enfriamiento del poder especial ---
  if (state.powerCooldown > 0) state.powerCooldown -= dt;

  // --- crear objetos nuevos cada cierto tiempo ---
  state.spawnTimer += dt;
  const spawnInterval = Math.max(0.45, 1.1 - state.level * 0.05);
  if (state.spawnTimer >= spawnInterval) {
    state.spawnTimer = 0;
    spawnFallingThing();
  }

  moveFallingList(state.items, dt);
  moveFallingList(state.enemies, dt);

  // --- mover los disparos del poder hacia arriba ---
  state.bolts.forEach((b) => (b.y -= b.speed * dt));
  state.bolts = state.bolts.filter((b) => b.y + b.h > 0);

  checkCollisions();

  // --- subir de nivel según los puntos acumulados ---
  state.level = 1 + Math.floor(state.score / 120);

  // --- terminar el juego si la energía llega a cero ---
  if (state.energy <= 0) {
    endGame();
  }

  updateHUD();
}

// Mueve una lista de objetos que caen y elimina los que salen de pantalla
function moveFallingList(list, dt) {
  for (const obj of list) {
    obj.y += obj.speed * dt;
  }
  // Quita de la lista los objetos que ya salieron por abajo de la pantalla
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].y > state.height + 40) list.splice(i, 1);
  }
}

/* ---------------------------------------------------------
   9. DETECTAR CHOQUES (colisiones)
   Compara rectángulos/círculos para saber si se tocan.
   --------------------------------------------------------- */
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function checkCollisions() {
  const p = state.player;

  // --- jugadora contra objetos buenos (followers, pinceles, materiales) ---
  for (let i = state.items.length - 1; i >= 0; i--) {
    const item = state.items[i];
    if (rectsOverlap(p.x, p.y, p.w, p.h, item.x, item.y, item.size, item.size)) {
      collectItem(item.type);
      state.items.splice(i, 1);
    }
  }

  // --- jugadora contra chismes (enemigos) ---
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    if (rectsOverlap(p.x, p.y, p.w, p.h, enemy.x, enemy.y, enemy.size, enemy.size)) {
      playSound(golpeChismesSound);
      state.energy -= 55; // duele chocar con un chisme
      state.enemies.splice(i, 1);
    }
  }

  // --- disparos del poder contra chismes ---
  for (let i = state.bolts.length - 1; i >= 0; i--) {
    const bolt = state.bolts[i];
    for (let j = state.enemies.length - 1; j >= 0; j--) {
      const enemy = state.enemies[j];
      if (rectsOverlap(bolt.x, bolt.y, bolt.w, bolt.h, enemy.x, enemy.y, enemy.size, enemy.size)) {
        state.enemies.splice(j, 1);
        state.bolts.splice(i, 1);
        state.score += 5; // bonus por destruir un chisme
        break;
      }
    }
  }
}

// Aplica el efecto de recoger un objeto bueno según su tipo
function collectItem(type) {
  if (type === "follower") {
    playSound(sonidoDeCuadrosSound);
    state.score += 10;
    state.energy = Math.min(100, state.energy + 6);
  } else if (type === "pincel") {
    playSound(sonidoPincelesSound);
    state.score += 50;
    state.energy = Math.min(100, state.energy + 9);
  } else if (type === "material") {
    playSound(sonidoAmigosSound);
    state.score += 20;
    state.energy = Math.min(100, state.energy + 12);
  }
}

/* ---------------------------------------------------------
   10. TERMINAR EL JUEGO
   --------------------------------------------------------- */
function endGame() {
  state.running = false;
  finalScoreText.textContent = "Puntos obtenidos: " + state.score;
  gameOverOverlay.classList.remove("hidden");
}

/* ===========================================================
   DIBUJO: cada función pinta una parte del juego en el canvas
   =========================================================== */

// Limpia el fondo del canvas en cada frame
function drawBackground() {
  ctx.clearRect(0, 0, state.width, state.height);

  if (fondoAcademiaReady && fondoAcademiaImage.complete && fondoAcademiaImage.naturalWidth > 0) {
    ctx.drawImage(fondoAcademiaImage, 0, 0, state.width, state.height);
    return;
  }

  // Un degradado suave para simular el estudio de arte
  const grad = ctx.createLinearGradient(0, 0, 0, state.height);
  grad.addColorStop(0, "#241d3d");
  grad.addColorStop(1, "#120e1c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, state.width, state.height);

  // Líneas punteadas verticales, como un cuaderno de dibujo
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 20; x < state.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, state.height);
    ctx.stroke();
  }
}

// Dibuja a la jugadora usando su imagen
function drawPlayer() {
  const p = state.player;
  ctx.drawImage(chicaImage, p.x, p.y, p.w, p.h);
}

// Ayuda a dibujar rectángulos con esquinas redondeadas
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Dibuja un follower usando la imagen
function drawFollower(item) {
  ctx.drawImage(followerImage, item.x, item.y, item.size, item.size);
}

// Dibuja un pincel usando la imagen
function drawPincel(item) {
  ctx.drawImage(pincelImage, item.x, item.y, item.size, item.size);
}

// Dibuja materiales artísticos usando la imagen
function drawMaterial(item) {
  ctx.drawImage(materialImage, item.x, item.y, item.size, item.size);
}

// Dibuja un "chisme" (enemigo) usando su imagen
function drawChisme(enemy) {
  ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.size, enemy.size);
}

// Dibuja los disparos del poder especial (rayitos de inspiración)
function drawBolts() {
  state.bolts.forEach((b) => {
    const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#b98bff");
    ctx.fillStyle = grad;
    roundRect(b.x, b.y, b.w, b.h, 4);
    ctx.fill();
  });
}

// Junta todas las funciones de dibujo en un solo frame
function draw() {
  drawBackground();

  state.items.forEach((item) => {
    if (item.type === "follower") drawFollower(item);
    else if (item.type === "pincel") drawPincel(item);
    else drawMaterial(item);
  });

  state.enemies.forEach(drawChisme);
  drawBolts();
  drawPlayer();
}

/* ---------------------------------------------------------
   11. EL GAME LOOP (bucle principal del juego)
   El navegador llama a esta función muchas veces por segundo.
   --------------------------------------------------------- */
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = Math.min(0.05, (timestamp - lastTime) / 1000 || 0);
  lastTime = timestamp;

  if (state.running && !state.paused) {
    update(dt);
  }
  draw();

  requestAnimationFrame(gameLoop);
}

/* ===========================================================
   12. CONTROLES: teclado (PC) y botones táctiles (celular)
   =========================================================== */

// --- Teclado ---
window.addEventListener("keydown", (e) => {
  unlockAudio();
  if (e.key === "ArrowLeft") input.left = true;
  if (e.key === "ArrowRight") input.right = true;
  if (e.key === " ") {
    e.preventDefault(); // evita que la página baje con la barra espaciadora
    firePower();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") input.left = false;
  if (e.key === "ArrowRight") input.right = false;
});

// --- Botones táctiles: se usa pointerdown/pointerup para que ---
// --- funcionen igual con dedo (celular) o clic (computadora) ---
function holdButton(button, onStart, onEnd) {
  button.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    onStart();
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((evt) => {
    button.addEventListener(evt, () => onEnd());
  });
}

holdButton(btnLeft, () => (input.left = true), () => (input.left = false));
holdButton(btnRight, () => (input.right = true), () => (input.right = false));

btnPower.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  unlockAudio();
  firePower();
});

btnPause.addEventListener("click", () => {
  if (!state.running) return;
  state.paused = !state.paused;
  pauseOverlay.classList.toggle("hidden", !state.paused);
});

resumeBtn.addEventListener("click", () => {
  state.paused = false;
  pauseOverlay.classList.add("hidden");
});

// --- Botón de inicio: empieza una partida nueva ---
startBtn.addEventListener("click", () => {
  unlockAudio();
  startOverlay.classList.add("hidden");
  resetGame();
  state.running = true;
});

// --- Botón de reintentar: vuelve a jugar tras perder ---
retryBtn.addEventListener("click", () => {
  unlockAudio();
  gameOverOverlay.classList.add("hidden");
  resetGame();
  state.running = true;
});

/* ---------------------------------------------------------
   13. ARRANQUE: preparar el canvas y lanzar el bucle
   --------------------------------------------------------- */
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
resetGame();
requestAnimationFrame(gameLoop);
