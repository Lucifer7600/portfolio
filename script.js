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

// ========== BOOTLOADER SEQUENCE ==========
const bootScreen = document.getElementById("bootScreen");
const bootLog = document.getElementById("bootLog");
const bootOverride = document.getElementById("bootOverride");
const mainSim = document.getElementById("mainSimulation");

const bootLines = [
  "[BOOT SEQUENCE START]",
  "loading kernel................OK",
  "mounting virtual filesystem...OK",
  "initiating neural bridge......FAILED",
  "attempting auto-patch.........FAILED",
  "injecting fallback identity...FAILED",
  "scanning for anomalies........DETECTED",
  "ABHISHEK.EXE has bypassed system integrity.",
  "[SYSTEM CORRUPTION: 7%]"
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
  else if (current.includes("DETECTED") || current.includes("CORRUPTION")) {
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

// richer Matrix set: digits + symbols + pseudo-katakana
const matrixChars = "01█▌░アイウエオカキクケコﾊﾋﾌﾍﾎ";
const fontSize = 18;
let columns = 0;
let drops = [];
let dropSpeeds = [];

resizeCanvases();

function drawMatrix() {
  // lighter trail so the rain stays visible under sections
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


// White noise corruption
function drawCorruption() {
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

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('.hero-nav-links a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const el = document.querySelector(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

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

// ========== PROJECT CARDS BULLET-TIME ==========
const projectCards = document.querySelectorAll(".project-card");

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

pillRed.addEventListener("click", () => {
  safePlay(audioGlitch);
  safePlay(audioStatic);

  contactConsole.classList.remove("hidden");
  contactConsole.scrollIntoView({ behavior: "smooth", block: "center" });
});

pillBlue.addEventListener("click", () => {
  safePlay(audioGlitch);
  safePlay(audioStatic);
  setTimeout(() => {
    window.location.href = "https://google.com";
  }, 900);
});

// ========== CONTACT FORM SUBMIT ==========
const contactForm = document.getElementById("contactForm");

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
