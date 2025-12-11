// ========== AUDIO HOOKS ==========
const audioHum = document.getElementById("audioHum");
const audioGlitch = document.getElementById("audioGlitch");
const audioStatic = document.getElementById("audioStatic");
const audioType = document.getElementById("audioType");
const audioImpact = document.getElementById("audioImpact");
const audioError = document.getElementById("audioError");

function safePlay(audio) {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// ========== GLOBAL MODE / GLITCH / TIME FREEZE ==========
let cinematicMode = true;
let timeFrozen = false;

const glitchOverlay = document.getElementById("glitchTransition");
const modeToggle = document.getElementById("modeToggle");
const modeChip = document.getElementById("modeChip");
const timeFreezeToggle = document.getElementById("timeFreezeToggle");

function updateModeUI() {
  if (modeToggle) {
    modeToggle.textContent = cinematicMode ? "CINEMATIC MODE: ON" : "CINEMATIC MODE: OFF";
    modeToggle.classList.toggle("mode-toggle-off", !cinematicMode);
  }
  if (modeChip) {
    modeChip.textContent = cinematicMode ? "CINEMATIC MODE ACTIVE" : "NORMAL MODE ACTIVE";
    modeChip.classList.toggle("mode-chip-off", !cinematicMode);
  }
  document.body.classList.toggle("cinematic-off", !cinematicMode);
}

function updateTimeUI() {
  if (timeFreezeToggle) {
    timeFreezeToggle.textContent = timeFrozen ? "TIME FREEZE: ON" : "TIME FREEZE: OFF";
    timeFreezeToggle.classList.toggle("time-toggle-on", timeFrozen);
  }
  document.body.classList.toggle("time-frozen", timeFrozen);
}

if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    cinematicMode = !cinematicMode;
    safePlay(audioGlitch);
    updateModeUI();
  });
}

if (timeFreezeToggle) {
  timeFreezeToggle.addEventListener("click", () => {
    timeFrozen = !timeFrozen;
    safePlay(audioStatic);
    updateTimeUI();
  });
}

updateModeUI();
updateTimeUI();

// helper to scroll with optional glitch transition
function scrollWithGlitch(targetEl) {
  if (!targetEl) return;

  if (!cinematicMode || !glitchOverlay) {
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  glitchOverlay.classList.remove("hidden");
  glitchOverlay.classList.add("active");
  safePlay(audioGlitch);

  setTimeout(() => {
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 280);

  setTimeout(() => {
    glitchOverlay.classList.remove("active");
    glitchOverlay.classList.add("hidden");
  }, 720);
}

// ========== BOOTLOADER SEQUENCE ==========
const bootScreen = document.getElementById("bootScreen");
const bootLog = document.getElementById("bootLog");
const bootOverride = document.getElementById("bootOverride");
const mainSim = document.getElementById("mainSimulation");

const bootLines = [
  "[BOOT SEQUENCE START]",
  "loading kernel................OK",
  "mounting virtual filesystem...OK",
  "initiating matrix profile.....OK",
  "loading ABHISHEK.EXE..........OK",
  "scanning developer profile....OK",
  "exporting skills & projects...OK",
  "MATRIX PROFILE ONLINE: Software Developer · C# /.NET · SQL",
  "[PROFILE STATUS: READY FOR REVIEW]"
];

let bootIndex = 0;

function appendBootLine(text, type = "ok") {
  const line = document.createElement("div");
  line.classList.add("boot-line");
  if (type === "fail") line.classList.add("fail");
  else if (type === "warn") line.classList.add("warn");
  else line.classList.add("ok");

  line.textContent = text;
  bootLog.appendChild(line);
  bootLog.scrollTop = bootLog.scrollHeight;
}

function runBootSequence() {
  if (bootIndex >= bootLines.length) {
    bootOverride.classList.add("visible");
    return;
  }

  const current = bootLines[bootIndex];
  let type = "ok";
  if (current.includes("FAILED")) type = "fail";
  else if (current.includes("DETECTED") || current.includes("STATUS")) {
    type = "warn";
  }

  appendBootLine(current, type);
  if (type === "fail") safePlay(audioError);

  bootIndex++;
  setTimeout(runBootSequence, 500);
}

setTimeout(runBootSequence, 600);

bootOverride.addEventListener("click", () => {
  safePlay(audioGlitch);
  safePlay(audioStatic);
  safePlay(audioImpact);
  safePlay(audioHum);

  document.body.classList.add("glitch-flash");
  setTimeout(() => {
    document.body.classList.remove("glitch-flash");
  }, 250);

  bootScreen.style.opacity = "0";
  setTimeout(() => {
    bootScreen.style.display = "none";
    mainSim.classList.remove("hidden");
    mainSim.classList.add("sim-visible");
  }, 600);
});

// ========== MATRIX RAIN + CORRUPTION CANVASES ==========
const matrixCanvas = document.getElementById("matrixCanvas");
const matrixCtx = matrixCanvas.getContext("2d");
const corruptionCanvas = document.getElementById("corruptionCanvas");
const corruptionCtx = corruptionCanvas.getContext("2d");

function resizeCanvases() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  corruptionCanvas.width = window.innerWidth;
  corruptionCanvas.height = window.innerHeight;

  columns = Math.floor(matrixCanvas.width / fontSize);
  drops = Array.from({ length: columns }, () => Math.random() * -20);
  dropSpeeds = drops.map(() => 0.8 + Math.random() * 1.8);
}

window.addEventListener("resize", resizeCanvases);

const matrixChars = "01█▌░アイウエオカキクケコﾊﾋﾌﾍﾎ";
const fontSize = 18;
let columns = 0;
let drops = [];
let dropSpeeds = [];

resizeCanvases();

function drawMatrix() {
  if (timeFrozen) return;

  matrixCtx.fillStyle = "rgba(0, 0, 0, 0.04)";
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  matrixCtx.fillStyle = "#00ff9c";
  matrixCtx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    const x = i * fontSize;
    matrixCtx.fillText(text, x, y * fontSize);

    if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = Math.random() * -10;
    } else {
      drops[i] = y + dropSpeeds[i];
    }
  });
}

setInterval(drawMatrix, 40);

function drawCorruption() {
  if (timeFrozen) return;

  corruptionCtx.clearRect(0, 0, corruptionCanvas.width, corruptionCanvas.height);

  for (let i = 0; i < 30; i++) {
    const y = Math.random() * corruptionCanvas.height;
    corruptionCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`;
    corruptionCtx.fillRect(0, y, corruptionCanvas.width, 1);
  }

  if (Math.random() > 0.93) {
    const y = Math.random() * corruptionCanvas.height;
    corruptionCtx.fillStyle = "rgba(255,255,255,0.18)";
    corruptionCtx.fillRect(0, y - 10, corruptionCanvas.width, 25);
  }
}

setInterval(drawCorruption, 80);

// ========== IDENTITY BOOTLOADER BREACH ==========
const identityFeed = document.getElementById("identityFeed");
const identityGlitch = document.getElementById("identityGlitch");

const identityAttempts = [
  "user_identity=unknown_user........FAILED",
  "user_identity=agent_root..........FAILED",
  "user_identity=SYS_ADMIN...........FAILED",
  "user_identity=ABHISHEK.EXE.......OVERRIDE"
];

let attemptIndex = 0;

function showNextIdentityAttempt() {
  if (attemptIndex >= identityAttempts.length) {
    safePlay(audioGlitch);
    safePlay(audioImpact);
    identityGlitch.classList.add("identity-glitch-final");
    return;
  }

  const line = identityAttempts[attemptIndex];
  identityFeed.textContent = line;
  safePlay(audioType);

  attemptIndex++;
  setTimeout(showNextIdentityAttempt, 900);
}

setTimeout(showNextIdentityAttempt, 2600);

// ========== SELF-AWARE TIME-OF-DAY GREETING ==========
const selfAwareStatus = document.getElementById("selfAwareStatus");

function updateSelfAwareGreeting() {
  if (!selfAwareStatus) return;
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 5) greeting = "SYSTEM NOTE: Late-night build detected. Optimization mode: Focus & silence.";
  else if (hour < 12) greeting = "SYSTEM NOTE: Morning boot. Best time for clean commits and clear decisions.";
  else if (hour < 18) greeting = "SYSTEM NOTE: Active hours. Perfect window for code reviews and shipping features.";
  else greeting = "SYSTEM NOTE: Evening traces. Time for debugging, refactoring, and deeper thinking.";

  selfAwareStatus.textContent = greeting;
}

updateSelfAwareGreeting();

// ========== SMOOTH SCROLL (NAV + CHOICES) ==========
document.querySelectorAll('.hero-nav-links a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const el = document.querySelector(targetId);
    if (!el) return;
    scrollWithGlitch(el);
  });
});

const choiceRabbit = document.getElementById("choiceRabbit");
const choiceOracle = document.getElementById("choiceOracle");

if (choiceRabbit) {
  choiceRabbit.addEventListener("click", () => {
    const section = document.getElementById("projectsSection");
    scrollWithGlitch(section);
  });
}

if (choiceOracle) {
  choiceOracle.addEventListener("click", () => {
    const section = document.getElementById("identitySection");
    scrollWithGlitch(section);
  });
}

// ========== STACK HOVER ==========
const stackItems = document.querySelectorAll(".stack-item");

stackItems.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const moveX = ((x - rect.width / 2) / rect.width) * 8;
    const moveY = ((y - rect.height / 2) / rect.height) * 8;

    item.style.transform = `translate(-${moveX}px, -${moveY}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translate(0, 0)";
  });
});

// ========== PROJECT CARDS BULLET-TIME + CONSTRUCT ROOM ==========
const projectCards = document.querySelectorAll(".project-card");
const constructOverlay = document.getElementById("constructOverlay");
const constructContent = document.getElementById("constructContent");
const constructClose = document.getElementById("constructClose");

projectCards.forEach((card) => {
  const frame = card.querySelector(".project-frame");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotY = ((x - rect.width / 2) / rect.width) * 16;
    const rotX = -((y - rect.height / 2) / rect.height) * 10;

    frame.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    frame.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  });

  card.addEventListener("mouseenter", () => {
    safePlay(audioStatic);
  });

  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    openConstructRoom(card);
  });
});

function openConstructRoom(card) {
  if (!constructOverlay || !constructContent) return;

  const titleEl = card.querySelector(".project-title");
  const descEl = card.querySelector(".project-desc");
  const tagEls = card.querySelectorAll(".project-tags span");

  const title = titleEl ? titleEl.textContent.trim() : "Simulation";
  const desc = descEl ? descEl.textContent.trim() : "";
  const tags = Array.from(tagEls)
    .map((el) => el.textContent.trim())
    .join(" · ");

  constructContent.innerHTML = `
    <p class="construct-label">DEEPER LAYER UNLOCKED</p>
    <h3 class="construct-title">${title}</h3>
    <p class="construct-body">${desc}</p>
    <p class="construct-meta">
      Tech stack: <span>${tags || "N/A"}</span>
    </p>
    <p class="construct-note">
      This is the inner layer of this simulation. Ask me about the architecture, trade-offs,
      data model, and how I would evolve it for a real production environment.
    </p>
  `;

  constructOverlay.classList.remove("hidden");
  constructOverlay.classList.add("active");
  safePlay(audioGlitch);
}

function closeConstructRoom() {
  if (!constructOverlay) return;
  constructOverlay.classList.remove("active");
  setTimeout(() => {
    constructOverlay.classList.add("hidden");
  }, 180);
}

if (constructClose) {
  constructClose.addEventListener("click", closeConstructRoom);
}

if (constructOverlay) {
  constructOverlay.addEventListener("click", (e) => {
    if (
      e.target === constructOverlay ||
      e.target.classList.contains("construct-backdrop")
    ) {
      closeConstructRoom();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && constructOverlay && !constructOverlay.classList.contains("hidden")) {
    closeConstructRoom();
  }
});

// ========== MANIFESTO TERMINAL TYPING ==========
const philosophyTerminal = document.getElementById("philosophyTerminal");
const manifestoLines = [
  "I like systems that are predictable, even when requirements aren’t.",
  "For me, clean code is not just style; it’s how teams move faster without breaking everything.",
  "I prefer simple, well-tested solutions over clever one-liners that nobody wants to maintain.",
  "Data and logs are not decoration — they’re how we learn what the system is actually doing.",
  "If something is unclear, I’d rather ask one more question than ship one more bug."
];

let manifestoIndex = 0;

function typeManifestoLine() {
  if (manifestoIndex >= manifestoLines.length) return;

  const text = manifestoLines[manifestoIndex];
  const lineEl = document.createElement("div");
  lineEl.classList.add("terminal-line");
  lineEl.innerHTML = `<span class="terminal-prompt">&gt;</span> ${text}`;
  philosophyTerminal.insertBefore(
    lineEl,
    philosophyTerminal.querySelector(".terminal-cursor-line")
  );

  safePlay(audioType);

  manifestoIndex++;
  setTimeout(typeManifestoLine, 1100);
}

setTimeout(typeManifestoLine, 3600);

// ========== RED PILL / BLUE PILL ==========
const pillRed = document.getElementById("pillRed");
const pillBlue = document.getElementById("pillBlue");
const contactConsole = document.getElementById("contactConsole");

if (pillRed) {
  pillRed.addEventListener("click", () => {
    safePlay(audioGlitch);
    safePlay(audioStatic);

    contactConsole.classList.remove("hidden");
    scrollWithGlitch(contactConsole);
  });
}

if (pillBlue) {
  pillBlue.addEventListener("click", () => {
    safePlay(audioGlitch);
    safePlay(audioStatic);
    setTimeout(() => {
      window.location.href = "https://google.com";
    }, 900);
  });
}

// ========== CONTACT FORM SUBMIT ==========
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      alert("The system needs all fields to route your signal.");
      return;
    }

    const subject = encodeURIComponent("Simulation Contact // ABHISHEK.EXE");
    const body = encodeURIComponent(
      `IDENT HANDLE: ${name}\nSIGNAL RETURN: ${email}\n\nPAYLOAD:\n${message}`
    );

    window.location.href = `mailto:abhisheklunagariya2000@gmail.com?subject=${subject}&body=${body}`;
  });
}

// ========== AGENT SMITH MULTIPLICATION ==========
const smithCloud = document.getElementById("smithCloud");
let unknownCommandCount = 0;

function spawnSmithWave() {
  if (!smithCloud) return;
  for (let i = 0; i < 10; i++) {
    const span = document.createElement("span");
    span.className = "smith-chip";
    span.textContent = "AGENT.SMITH";
    span.style.left = Math.random() * 100 + "%";
    span.style.top = Math.random() * 100 + "%";
    smithCloud.appendChild(span);
  }
  const maxChildren = 80;
  while (smithCloud.childElementCount > maxChildren) {
    smithCloud.removeChild(smithCloud.firstElementChild);
  }
  smithCloud.classList.add("active");
  setTimeout(() => {
    smithCloud.classList.remove("active");
  }, 2200);
}

// ========== COMMAND-LINE INTERFACE (HACK TERMINAL) ==========
const cliForm = document.getElementById("cliForm");
const cliInput = document.getElementById("cliInput");
const cliOutput = document.getElementById("cliOutput");

function printCliLine(text, type = "normal") {
  if (!cliOutput) return;
  const line = document.createElement("div");
  line.classList.add("cli-line");
  if (type === "command") line.classList.add("cli-line-command");
  if (type === "error") line.classList.add("cli-line-error");
  line.textContent = text;
  cliOutput.appendChild(line);
  cliOutput.scrollTop = cliOutput.scrollHeight;
}

function handleCliCommand(raw) {
  const input = raw.trim();
  const command = input.toLowerCase();

  if (!command) return;

  printCliLine(`> ${input}`, "command");

  if (["help", "?", "man"].includes(command)) {
    printCliLine("Available commands:");
    printCliLine("  whoami             · show brief profile");
    printCliLine("  show skills        · jump to skills / tech stack");
    printCliLine("  show projects      · jump to simulations / projects");
    printCliLine("  contact            · open comm channel");
    printCliLine("  follow_white_rabbit· go to experiments (projects)");
    printCliLine("  trust_oracle       · go to identity & highlights");
    printCliLine("  there_is_no_spoon  · go to philosophy layer");
    printCliLine("  cinematic on/off   · toggle glitch transitions");
    printCliLine("  freeze / unfreeze  · bullet-time toggle");
    printCliLine("  clear              · clear terminal output");
    return;
  }

  if (command === "whoami") {
    printCliLine("Name: Abhishek Lunagariya (ABHISHEK.EXE)");
    printCliLine("Role: Software Developer & Programmer Analyst");
    printCliLine("Focus: C# / .NET, REST APIs, SQL, backend logic & data flows.");
    return;
  }

  if (command === "show skills" || command === "skills") {
    const section = document.getElementById("stackSection");
    printCliLine("Routing view to WEAPONS OF CHOICE (skills)...");
    scrollWithGlitch(section);
    return;
  }

  if (
    command === "show projects" ||
    command === "projects" ||
    command === "ls projects"
  ) {
    const section = document.getElementById("projectsSection");
    printCliLine("Routing view to SIMULATIONS (projects)...");
    scrollWithGlitch(section);
    return;
  }

  if (command === "contact") {
    const section = document.getElementById("contactSection");
    printCliLine("Opening communication channel...");
    scrollWithGlitch(section);
    if (contactConsole) {
      contactConsole.classList.remove("hidden");
    }
    return;
  }

  if (command === "follow_white_rabbit" || command === "follow rabbit") {
    const section = document.getElementById("projectsSection");
    printCliLine("You follow the White Rabbit into experimental simulations...");
    scrollWithGlitch(section);
    return;
  }

  if (command === "trust_oracle" || command === "oracle") {
    const section = document.getElementById("identitySection");
    printCliLine("You trust the Oracle and review core identity & skills...");
    scrollWithGlitch(section);
    return;
  }

  if (command === "there_is_no_spoon" || command === "no spoon") {
    const section = document.getElementById("philosophySection");
    printCliLine("There is no spoon. Only the way you think about systems.");
    scrollWithGlitch(section);
    return;
  }

  if (command === "cinematic on" || command === "mode cinematic") {
    cinematicMode = true;
    updateModeUI();
    printCliLine("Cinematic mode enabled. Glitch transitions active.");
    return;
  }

  if (
    command === "cinematic off" ||
    command === "normal" ||
    command === "mode normal"
  ) {
    cinematicMode = false;
    updateModeUI();
    printCliLine("Normal mode enabled. Transitions will be smooth only.");
    return;
  }

  if (command === "freeze" || command === "time freeze") {
    timeFrozen = true;
    updateTimeUI();
    printCliLine("Time freeze activated. Matrix rain and noise are paused.");
    return;
  }

  if (command === "unfreeze" || command === "resume") {
    timeFrozen = false;
    updateTimeUI();
    printCliLine("Time resumed. The simulation continues.");
    return;
  }

  if (command === "construct") {
    const section = document.getElementById("projectsSection");
    printCliLine("Loading Construct Room. Click a project card to go deeper.");
    scrollWithGlitch(section);
    return;
  }

  // Simple "clear" command
  if (command === "clear") {
    cliOutput.innerHTML = "";
    return;
  }

  unknownCommandCount++;
  printCliLine("Unknown command. Type 'help' to see available commands.", "error");
  if (unknownCommandCount >= 3) {
    spawnSmithWave();
  }
}

if (cliForm && cliInput) {
  cliForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = cliInput.value;
    cliInput.value = "";
    safePlay(audioType);
    handleCliCommand(value);
  });

  cliInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cliForm.dispatchEvent(new Event("submit"));
    }
  });
}

if (cliOutput) {
  printCliLine("Hacking console ready. Type 'help' to see commands.");
}

// ========== SELF-AWARE SCROLL + IDLE SYSTEM ==========
const scrollWarning = document.getElementById("scrollWarning");
const idleOverlay = document.getElementById("idleOverlay");

let lastScrollTop = window.scrollY || 0;
let lastScrollTime = performance.now();

function showScrollWarning() {
  if (!scrollWarning) return;
  scrollWarning.classList.remove("hidden");
  scrollWarning.classList.add("active");
  setTimeout(() => {
    scrollWarning.classList.remove("active");
    scrollWarning.classList.add("hidden");
  }, 2200);
}

window.addEventListener("scroll", () => {
  const now = performance.now();
  const current = window.scrollY || 0;
  const delta = Math.abs(current - lastScrollTop);
  const dt = now - lastScrollTime;

  // "too fast" if moving more than 800px in under 200ms
  if (dt < 200 && delta > 800) {
    showScrollWarning();
  }

  lastScrollTop = current;
  lastScrollTime = now;
  resetIdleTimer();
});

// Idle detection
let idleTimer = null;
const IDLE_TIMEOUT = 25000; // 25 seconds

function activateIdleState() {
  if (!idleOverlay) return;
  timeFrozen = true;
  updateTimeUI();
  idleOverlay.classList.remove("hidden");
  idleOverlay.classList.add("active");
}

function deactivateIdleState() {
  if (!idleOverlay) return;
  if (!idleOverlay.classList.contains("active")) return;
  idleOverlay.classList.remove("active");
  setTimeout(() => {
    idleOverlay.classList.add("hidden");
  }, 200);
  timeFrozen = false;
  updateTimeUI();
}

function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  deactivateIdleState();
  idleTimer = setTimeout(activateIdleState, IDLE_TIMEOUT);
}

["mousemove", "keydown", "click", "touchstart"].forEach((evt) => {
  window.addEventListener(evt, resetIdleTimer);
});

resetIdleTimer();

// ========== REALITY DRIFT SYSTEM ==========
let driftLevel = 0;
let driftTimerStarted = false;

function startDriftTimer() {
  if (driftTimerStarted) return;
  driftTimerStarted = true;

  // Level up every 30 seconds, max 3
  let level = 0;
  const interval = setInterval(() => {
    if (level >= 3) {
      clearInterval(interval);
      return;
    }
    level++;
    driftLevel = level;
    document.body.classList.add(`drift-${level}`);
  }, 30000);
}

// Start drift once main simulation is visible
const observer = new MutationObserver(() => {
  if (mainSim && mainSim.classList.contains("sim-visible")) {
    startDriftTimer();
    observer.disconnect();
  }
});
observer.observe(document.body, { attributes: true, subtree: true });

// Cursor code trail (drift level 1+)
document.addEventListener("mousemove", (e) => {
  if (driftLevel < 1) return;

  const trail = document.createElement("span");
  trail.className = "cursor-trail";
  trail.textContent = matrixChars.charAt(
    Math.floor(Math.random() * matrixChars.length)
  );
  trail.style.left = `${e.clientX}px`;
  trail.style.top = `${e.clientY}px`;
  document.body.appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 700);
});

// Resistive buttons (drift level 3)
function attachResistiveBehavior() {
  const resistiveButtons = document.querySelectorAll(".resistive");

  resistiveButtons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      if (driftLevel < 3) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const offsetX = (x - rect.width / 2) / rect.width;
      const offsetY = (y - rect.height / 2) / rect.height;

      const moveX = -offsetX * 18;
      const moveY = -offsetY * 12;

      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

attachResistiveBehavior();
