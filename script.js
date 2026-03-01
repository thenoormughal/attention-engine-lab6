//sound effect

let soundOn = false;
const soundBtn = document.getElementById("soundBtn");
let audioCtx = null;

function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function beep(freq = 880, duration = 0.08, type = "sine", gainVal = 0.06) {
    if (!soundOn) return;
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainVal;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    setTimeout(() => osc.stop(), duration * 1000);
}

soundBtn.addEventListener("click", async () => {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? "Sound: ON" : "Sound: OFF";
    if (soundOn) { ensureAudio(); if (audioCtx.state === "suspended") await audioCtx.resume(); }
    beep(660, 0.09, "triangle", 0.07);
});


// custom cursor

const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
});


// 3D  tilt

const heroCard = document.getElementById("heroCard");
document.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    const rotateX = (-dy * 6).toFixed(2);
    const rotateY = (dx * 8).toFixed(2);
    heroCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.addEventListener("mouseleave", () => {
    heroCard.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg)`;
});


// typing effect

const typingEl = document.getElementById("typing");
const titleEl = document.getElementById("glitchTitle");

const typingText = "ATTENTION ENGINE 4.0";
let tIndex = 0;

function typeEffect() {
    if (tIndex < typingText.length) {
        typingEl.textContent += typingText.charAt(tIndex);
        tIndex++;
        setTimeout(typeEffect, 65);
    }
}
window.addEventListener("load", typeEffect);

// glitch brust

function glitchBurst(target) {
    target.classList.remove("glitch-burst");
    void target.offsetWidth;
    target.classList.add("glitch-burst");
    beep(980, 0.05, "square", 0.03);
}

// auto glitch
function randomGlitchLoop() {
    const next = Math.floor(1700 + Math.random() * 2600);
    setTimeout(() => {
        glitchBurst(titleEl);
        randomGlitchLoop();
    }, next);
}
randomGlitchLoop();

// glitch overlay
const overlayText = document.getElementById("overlayText");
const overlayWords = ["hold.", "focus.", "don’t blink.", "pattern break.", "stay…"];
setInterval(() => {
    overlayText.textContent = overlayWords[Math.floor(Math.random() * overlayWords.length)];
    glitchBurst(overlayText);
}, 2200);

// 2-sec scan

const startBtn = document.getElementById("startBtn");
const chaosBtn = document.getElementById("chaosBtn");
const scanBar = document.getElementById("scanBar");
const scanResult = document.getElementById("scanResult");

let chaosOn = false;

chaosBtn.addEventListener("click", () => {
    chaosOn = !chaosOn;
    chaosBtn.textContent = chaosOn ? "Chaos Mode: ON" : "Toggle Chaos";
    document.body.style.filter = chaosOn ? "contrast(1.08) saturate(1.25)" : "none";
    glitchBurst(chaosBtn);
});

startBtn.addEventListener("click", () => {
    scanBar.style.width = "0%";
    scanResult.textContent = "Scanning attention span…";
    glitchBurst(scanResult);

    const duration = 2000;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const pct = Math.min(100, (elapsed / duration) * 100);
        scanBar.style.width = pct + "%";

        if (soundOn && pct % 20 < 1) beep(520 + pct * 3, 0.04, "sine", 0.03);

        if (chaosOn && pct > 35 && pct < 85) {
            scanResult.textContent = (Math.random() > 0.5)
                ? "Your brain is searching for meaning…"
                : "Pattern interrupted. Curiosity triggered.";
        }

        if (elapsed < duration) requestAnimationFrame(tick);
        else {
            scanResult.textContent = "✅ Verified: You stayed 2 seconds. Scroll to continue.";
            glitchBurst(scanResult);
        }
    }
    requestAnimationFrame(tick);
});

//mini game

const arena = document.getElementById("arena");
const orb = document.getElementById("orb");
const arenaOverlay = document.getElementById("arenaOverlay");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const unlockPill = document.getElementById("unlockPill");
const verifiedBadge = document.getElementById("verifiedBadge");
const gameStart = document.getElementById("gameStart");
const gameReset = document.getElementById("gameReset");

let score = 0;
let timeLeft = 10;
let gameRunning = false;
let timerId = null;

function placeOrbRandom() {
    const rect = arena.getBoundingClientRect();
    const pad = 55;
    const x = Math.random() * (rect.width - pad) + 10;
    const y = Math.random() * (rect.height - pad) + 10;
    orb.style.left = x + "px";
    orb.style.top = y + "px";
    orb.style.transform = "translate(0,0)";
}

function updateUI() {
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
}

function unlockVerified() {
    unlockPill.innerHTML = "Status: <b>Unlocked</b>";
    verifiedBadge.textContent = "✅ VERIFIED: Unlocked (Game Completed)";
    verifiedBadge.classList.add("unlocked");
    glitchBurst(verifiedBadge);
    beep(440, 0.1, "triangle", 0.08);
    beep(660, 0.12, "triangle", 0.08);
    beep(880, 0.14, "triangle", 0.08);
}

function endGame(msg) {
    gameRunning = false;
    clearInterval(timerId);
    arenaOverlay.textContent = msg;
    arenaOverlay.style.display = "flex";
}

gameStart.addEventListener("click", () => {
    score = 0;
    timeLeft = 10;
    gameRunning = true;
    arenaOverlay.style.display = "none";
    updateUI();
    placeOrbRandom();

    beep(600, 0.08, "sine", 0.06);

    clearInterval(timerId);
    timerId = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            endGame("Time up! Try again.");
            beep(220, 0.12, "square", 0.05);
        }
    }, 1000);
});

gameReset.addEventListener("click", () => {
    score = 0;
    timeLeft = 10;
    updateUI();
    endGame("Click “Start Game” to begin");
    unlockPill.innerHTML = "Status: <b>Locked</b>";
    verifiedBadge.textContent = "🔒 VERIFIED: Locked (Play game)";
    verifiedBadge.classList.remove("unlocked");
});

orb.addEventListener("click", (e) => {
    if (!gameRunning) return;
    score++;
    updateUI();
    glitchBurst(orb);
    beep(880, 0.05, "sine", 0.05);

    if (score >= 5) {
        unlockVerified();
        endGame("Unlocked! Scroll to submit the form ↓");
        document.getElementById("form").scrollIntoView({ behavior: "smooth" });
    } else {
        placeOrbRandom();
    }
});


// matrix effect

const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const letters = "ATTENTIONENGINE01";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff66";
    ctx.font = fontSize + "px monospace";

    columns = Math.floor(canvas.width / fontSize);
    if (drops.length !== columns) drops = Array(columns).fill(1);

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.96) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// revel scroll

const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            glitchBurst(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.16 });

revealEls.forEach(el => observer.observe(el));


// Form validation

const form = document.getElementById("mainForm");
const successMsg = document.getElementById("successMsg");

function setError(id, msg) { document.getElementById(id).textContent = msg; }
function clearErrors() {
    ["nameError", "emailError", "interestError", "messageError", "agreeError"].forEach(id => setError(id, ""));
    successMsg.textContent = "";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const interest = document.getElementById("interest").value;
    const message = document.getElementById("message").value.trim();
    const agree = document.getElementById("agree").checked;

    let valid = true;

    if (name.length < 3) { setError("nameError", "Name must be at least 3 characters."); valid = false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("emailError", "Enter a valid email address."); valid = false; }
    if (!interest) { setError("interestError", "Please select your interest."); valid = false; }
    if (message.length < 10) { setError("messageError", "Message must be at least 10 characters."); valid = false; }
    if (!agree) { setError("agreeError", "You must confirm before submitting."); valid = false; }

    if (valid) {
        successMsg.textContent = "✅ Submitted successfully! (Take screenshot for proof)";
        glitchBurst(successMsg);
        beep(660, 0.09, "triangle", 0.08);
        form.reset();
    } else {
        glitchBurst(form);
        beep(180, 0.12, "square", 0.05);
    }
});