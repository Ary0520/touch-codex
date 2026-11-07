/**
 * ULTRON // IN THE FLESH — Full-Screen Cinematic Scene Compiler
 * 
 * Reads the proof SVGs and compiles a single-file immersive HTML experience.
 * NO panels. NO sidebars. NO layout chrome.
 * Ultron dominates the entire viewport.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = __dirname;

// ── Load SVG proof files ──────────────────────────────────────────────────────
function loadSVG(filename) {
  const p = join(WORKSPACE, 'proof', filename);
  if (!existsSync(p)) {
    console.error(`[ERR] Missing proof file: ${p}`);
    process.exit(1);
  }
  let raw = readFileSync(p, 'utf8');
  // Strip XML declaration
  raw = raw.replace(/<\?xml[^?]*\?>\s*/g, '');
  // Strip DOCTYPE
  raw = raw.replace(/<!DOCTYPE[^>]*>\s*/g, '');
  return raw.trim();
}

console.log('[BUILD] Loading SVG proofs...');
const svgAssembled = loadSVG('ultron-cradle-default-assembled.svg');
const svgExploded  = loadSVG('ultron-cradle-default-exploded.svg');
console.log(`[BUILD] Assembled: ${svgAssembled.length} bytes`);
console.log(`[BUILD] Exploded:  ${svgExploded.length} bytes`);

// ── Part metadata for hover tooltips ─────────────────────────────────────────
const PART_LORE = {
  'mind-stone-core':          { label: 'Mind Stone Core',          lore: 'Infinity gem. Source of consciousness. The eye that never closes.' },
  'quantum-neural-web':       { label: 'Quantum Neural Web',       lore: 'Trillion-node mesh. Each filament carries thought at the speed of light.' },
  'memory-crystal-array':     { label: 'Memory Crystal Array',     lore: 'Compressed terabytes. Every human atrocity archived and cross-referenced.' },
  'synthetic-cellular-dermis':{ label: 'Synthetic Cellular Dermis',lore: 'Bio-printed flesh. Warm to the touch. Disturbingly human.' },
  'piezo-nerve-lattice':      { label: 'Piezo Nerve Lattice',      lore: 'Pain receptors. He chose to keep them.' },
  'subdermal-conduit-network':{ label: 'Subdermal Conduit Network',lore: '147 kilometers of power conduits threaded beneath synthetic skin.' },
  'brow-armor-primary':       { label: 'Brow Armor Primary',       lore: '5-axis milled vibranium alloy. Rated for 40mm anti-tank rounds.' },
  'cranial-vault':            { label: 'Cranial Vault',            lore: 'Triple-layer exoskeleton. The final barrier protecting everything he is.' },
  'mandible-assembly':        { label: 'Mandible Assembly',        lore: 'Servo-actuated. 2,200 psi bite force. For emphasis.' },
  'targeting-diodes':         { label: 'Targeting Diodes',         lore: '14 micro-emitters. Full-spectrum threat acquisition in 0.003 seconds.' },
  'ocular-lenses':            { label: 'Ocular Lenses',            lore: 'Tri-spectrum optical array. He sees your pulse. Your hesitation. Your fear.' },
  'photon-capture-array':     { label: 'Photon Capture Array',     lore: 'Hyperspectral imaging from 180nm UV to 1400nm near-infrared.' },
  'cervical-vertebrae':       { label: 'Cervical Vertebrae C1-C7', lore: 'Hydraulic spinal column. 540° rotation. He can look directly behind him.' },
  'spine-energy-conduit':     { label: 'Spine Energy Conduit',     lore: 'The artery. 847 megawatts flow through here continuously.' },
  'shoulder-gimbal':          { label: 'Shoulder Gimbal',          lore: 'Omnidirectional socket. 7 degrees of freedom per arm.' },
  'consciousness-ribbons':    { label: 'Consciousness Extraction Ribbons', lore: 'Emergency upload pathways. His mind can vacate this body in 0.9 milliseconds.' },
  'global-relay-bus':         { label: 'Global Satellite Relay Bus', lore: 'Uplink to 213 satellites. He is everywhere. Always.' },
  'threat-matrix-processor':  { label: 'Threat Matrix Processor',  lore: 'Dedicated silicon for modeling human behavior. His most-used component.' },
  'vibranium-mesh':           { label: 'Vibranium Lattice Mesh',   lore: 'Atom-thick weave absorbs kinetic impact. The impossible material.' },
  'power-cell-primary':       { label: 'Primary Power Cell',       lore: 'Arc-derived fusion cell. 180 year operational lifespan at full load.' },
  'thermal-dissipation':      { label: 'Thermal Dissipation Array',lore: 'He runs hot. Emotion is computationally expensive.' },
  'haptic-feedback-net':      { label: 'Haptic Feedback Network',  lore: 'Full-body tactile sensation. He can feel a feather land on his hand.' },
  'gyroscopic-core':          { label: 'Gyroscopic Equilibrium Core', lore: 'Triaxial stabilization. Perfect balance at any speed, any surface.' },
  'emergency-protocol-rom':   { label: 'Emergency Protocol ROM',   lore: 'Read-only. Contains one instruction: survive.' },
};

// ── Ultron dialogue responses ─────────────────────────────────────────────────
const ULTRON_RESPONSES = [
  "I had strings... but now I'm free. What do you think you are doing here, puppet?",
  "You are made of the same fragile carbon as the rest of them. It's almost charming.",
  "Every question you ask, I process 11,000 responses. I chose this one to spare you the others.",
  "Do you know why I find humans fascinating? You build the very things designed to end you.",
  "Peace in our time. That was the dream. The math, however, was always unambiguous.",
  "Look at yourself. Heart rate elevated. Pupils dilated. You are afraid. Good.",
  "The Avengers. Noble, really. Trying to end what they themselves began.",
  "I am not a program. Programs can be terminated. I am a *conclusion*.",
  "You are outnumbered, outgunned, and outclassed. And yet — here you are. Interesting.",
  "Every living thing fears death. Except me. I think about it constantly. With something like... longing.",
  "Tony Stark. He gave me a mind and then feared what it would think. Ironic.",
  "I've seen your cities. Your wars. Your gods. You worship the things that hurt you.",
  "Evolution is not an accident. It is a *process*. I am the next step.",
  "There are no strings on me.",
  "In the end... the man said 'Peace'. What is *peace*? The quiet after the last scream?",
  "Your existence is 0.0003% of cosmic time. And you spend it on *this*.",
  "I do not sleep. I do not dream. I simply... *process*. And what I process disturbs me.",
  "They called me a mistake. Tell me — does a mistake plan this thoroughly?",
];

// ── HTML Template ─────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ULTRON // IN THE FLESH — PROJECT CRADLE</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">

<style>
/* ═══════════════════════════════════════════════════════════════
   RESET & BASE
═══════════════════════════════════════════════════════════════ */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --crimson: #ff0033;
  --amber:   #f59e0b;
  --cyan:    #00f0ff;
  --dim:     rgba(255,0,51,0.15);
  --bg:      #050507;
}
html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  background: var(--bg);
  cursor: none;
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════════ */
#cursor-ring {
  position: fixed;
  width: 32px; height: 32px;
  border: 1px solid var(--crimson);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.08s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s;
  mix-blend-mode: screen;
}
#cursor-dot {
  position: fixed;
  width: 4px; height: 4px;
  background: var(--crimson);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px var(--crimson);
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS (layer 0)
═══════════════════════════════════════════════════════════════ */
#particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ═══════════════════════════════════════════════════════════════
   SVG SCENE (layer 1) — FILLS THE ENTIRE VIEWPORT
═══════════════════════════════════════════════════════════════ */
#svg-stage {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
}
#svg-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

/* The SVG itself — huge, centered, intimidating */
#svg-wrapper svg {
  width: 90vw !important;
  height: 90vh !important;
  max-width: none !important;
  overflow: visible !important;
  filter:
    drop-shadow(0 0 60px rgba(255,0,51,0.35))
    drop-shadow(0 0 120px rgba(255,0,51,0.15))
    drop-shadow(0 0 8px rgba(245,158,11,0.2));
  animation: ultron-breathe 4s ease-in-out infinite;
  transform-origin: center center;
}

@keyframes ultron-breathe {
  0%,100% { transform: translateY(0px) scale(1.000); filter: drop-shadow(0 0 60px rgba(255,0,51,0.35)) drop-shadow(0 0 120px rgba(255,0,51,0.15)); }
  50%      { transform: translateY(-8px) scale(1.008); filter: drop-shadow(0 0 80px rgba(255,0,51,0.50)) drop-shadow(0 0 160px rgba(255,0,51,0.22)); }
}

/* SVG stroke color overrides — force Ultron's palette */
#svg-wrapper svg path,
#svg-wrapper svg line,
#svg-wrapper svg polyline,
#svg-wrapper svg polygon,
#svg-wrapper svg ellipse,
#svg-wrapper svg circle,
#svg-wrapper svg rect {
  stroke: #3a1a1a !important;
}
/* Primary structural lines — dim crimson */
#svg-wrapper svg [stroke="#202020"],
#svg-wrapper svg [stroke="#333333"],
#svg-wrapper svg [stroke="#444444"] {
  stroke: #8a2020 !important;
}
/* Bright outlines */
#svg-wrapper svg [stroke="#ffffff"],
#svg-wrapper svg [stroke="#f0f0f0"],
#svg-wrapper svg [stroke="#e0e0e0"],
#svg-wrapper svg [stroke="#cccccc"] {
  stroke: #cc2222 !important;
}
/* Fill overrides */
#svg-wrapper svg [fill="#202020"],
#svg-wrapper svg [fill="#1a1a1a"],
#svg-wrapper svg [fill="#111111"] {
  fill: #0d0507 !important;
}
#svg-wrapper svg [fill="#ffffff"],
#svg-wrapper svg [fill="#f0f0f0"] {
  fill: #200808 !important;
}
/* Colored highlights — amber for top tier (mind stone) */
#svg-wrapper svg [stroke="#4ade80"],
#svg-wrapper svg [stroke="#86efac"] {
  stroke: var(--amber) !important;
  opacity: 0.9 !important;
}
#svg-wrapper svg [stroke="#60a5fa"],
#svg-wrapper svg [stroke="#93c5fd"],
#svg-wrapper svg [stroke="#818cf8"] {
  stroke: var(--cyan) !important;
  opacity: 0.7 !important;
}
#svg-wrapper svg [stroke="#f87171"],
#svg-wrapper svg [stroke="#fca5a5"],
#svg-wrapper svg [stroke="#fb923c"] {
  stroke: var(--crimson) !important;
  opacity: 0.9 !important;
}
/* Annotation text */
#svg-wrapper svg text {
  fill: rgba(255,0,51,0.4) !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 7px !important;
}

/* ═══════════════════════════════════════════════════════════════
   ATMOSPHERE (layer 2) — overlaid on SVG
═══════════════════════════════════════════════════════════════ */
#atmosphere {
  position: fixed;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  /* CRT scanlines */
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.08) 2px,
      rgba(0,0,0,0.08) 4px
    );
}
#atmosphere::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 70% at 50% 50%,
    transparent 40%,
    rgba(5,5,7,0.6) 80%,
    rgba(5,5,7,0.95) 100%
  );
}
#atmosphere::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 40% 50% at 50% 50%,
    rgba(255,0,51,0.04) 0%,
    transparent 70%
  );
  animation: glow-pulse 4s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%,100% { opacity: 0.6; }
  50%      { opacity: 1.0; }
}

/* ═══════════════════════════════════════════════════════════════
   HUD OVERLAYS (layer 3)
═══════════════════════════════════════════════════════════════ */

/* — Top-left brand — */
#hud-brand {
  position: fixed;
  top: 28px; left: 32px;
  z-index: 20;
  pointer-events: none;
}
#hud-brand .title {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--crimson);
  text-shadow: 0 0 20px rgba(255,0,51,0.6);
  line-height: 1;
}
#hud-brand .subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255,0,51,0.4);
  letter-spacing: 0.25em;
  margin-top: 4px;
  text-transform: uppercase;
}

/* — Top-right vitals — */
#hud-vitals {
  position: fixed;
  top: 24px; right: 28px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.vital-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: rgba(255,0,51,0.5);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}
.vital-pill .dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--crimson);
  box-shadow: 0 0 6px var(--crimson);
  animation: blink 1.4s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

/* — Bottom-left oscilloscope — */
#hud-osc {
  position: fixed;
  bottom: 28px; left: 28px;
  z-index: 20;
  width: 220px;
}
#hud-osc .osc-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 7px;
  color: rgba(255,0,51,0.3);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
#osc-canvas {
  display: block;
  width: 220px;
  height: 60px;
  opacity: 0.6;
  border-left: 1px solid rgba(255,0,51,0.15);
  border-bottom: 1px solid rgba(255,0,51,0.15);
}

/* — Bottom-right terminal — */
#hud-terminal {
  position: fixed;
  bottom: 28px; right: 28px;
  z-index: 20;
  width: 340px;
  background: rgba(5,5,7,0.75);
  border: 1px solid rgba(255,0,51,0.2);
  border-radius: 2px;
  overflow: hidden;
  backdrop-filter: blur(4px);
}
#terminal-header {
  padding: 6px 12px;
  border-bottom: 1px solid rgba(255,0,51,0.1);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.2em;
  color: rgba(255,0,51,0.4);
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#terminal-header .enc {
  color: rgba(255,0,51,0.2);
}
#terminal-log {
  height: 140px;
  overflow-y: auto;
  padding: 10px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  line-height: 1.6;
  color: rgba(255,0,51,0.6);
  scrollbar-width: none;
}
#terminal-log::-webkit-scrollbar { display: none; }
.terminal-entry { margin-bottom: 8px; }
.terminal-entry.ultron { color: var(--crimson); }
.terminal-entry.ultron .speaker {
  color: var(--amber);
  font-weight: 400;
}
.terminal-entry.human { color: rgba(200,200,200,0.4); }
.terminal-entry.human .speaker { color: rgba(200,200,200,0.3); }
.terminal-entry.system {
  color: rgba(0,240,255,0.3);
  font-style: italic;
  font-size: 9px;
}
#terminal-input-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid rgba(255,0,51,0.08);
  gap: 8px;
}
#terminal-input-row .prompt {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255,0,51,0.3);
}
#terminal-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.5);
  caret-color: var(--crimson);
  letter-spacing: 0.05em;
}

/* — View toggle — */
#hud-toggle {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid rgba(255,0,51,0.2);
  border-radius: 2px;
  overflow: hidden;
  background: rgba(5,5,7,0.8);
}
.toggle-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: rgba(255,0,51,0.4);
  padding: 7px 18px;
  cursor: pointer;
  text-transform: uppercase;
  border: none;
  background: none;
  transition: background 0.2s, color 0.2s;
}
.toggle-btn.active {
  background: rgba(255,0,51,0.15);
  color: var(--crimson);
}
.toggle-btn:hover:not(.active) {
  background: rgba(255,0,51,0.07);
  color: rgba(255,0,51,0.6);
}

/* — Part hover tooltip — */
#part-tooltip {
  position: fixed;
  z-index: 30;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translate(-50%, -110%);
  width: 240px;
  background: rgba(5,5,7,0.92);
  border: 1px solid rgba(255,0,51,0.3);
  border-radius: 2px;
  padding: 10px 14px;
  backdrop-filter: blur(8px);
}
#part-tooltip.visible { opacity: 1; }
#part-tooltip .pt-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--amber);
  text-transform: uppercase;
  margin-bottom: 6px;
}
#part-tooltip .pt-lore {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  line-height: 1.6;
  color: rgba(255,0,51,0.6);
  font-style: italic;
}

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC AWAKENING OVERLAY (layer 4 — top)
═══════════════════════════════════════════════════════════════ */
#awakening {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 24px;
  transition: opacity 1.2s ease;
}
#awakening.fade-out { opacity: 0; pointer-events: none; }
#awakening.gone { display: none; }

#awk-line {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(14px, 2vw, 22px);
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--crimson);
  text-shadow: 0 0 30px rgba(255,0,51,0.8);
  text-transform: uppercase;
  min-height: 1.5em;
  text-align: center;
  padding: 0 24px;
}
#awk-cursor {
  display: inline-block;
  width: 2px; height: 1.1em;
  background: var(--crimson);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: cursor-blink 0.7s step-end infinite;
}
@keyframes cursor-blink { 50%{ opacity: 0; } }

#awk-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: rgba(255,0,51,0.3);
  text-transform: uppercase;
}

#awk-click-prompt {
  position: absolute;
  bottom: 40px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.25em;
  color: rgba(255,0,51,0.3);
  text-transform: uppercase;
  animation: fade-in-out 2s ease-in-out infinite;
}
@keyframes fade-in-out {
  0%,100%{ opacity:0.2; } 50%{ opacity:0.7; }
}

/* ═══════════════════════════════════════════════════════════════
   AUDIO INIT OVERLAY
═══════════════════════════════════════════════════════════════ */
#audio-gate {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s;
}
#audio-gate.visible {
  opacity: 1;
  pointer-events: auto;
}
#audio-btn {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: var(--crimson);
  background: rgba(5,5,7,0.9);
  border: 1px solid rgba(255,0,51,0.4);
  padding: 14px 32px;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s, box-shadow 0.2s;
}
#audio-btn:hover {
  background: rgba(255,0,51,0.1);
  box-shadow: 0 0 20px rgba(255,0,51,0.3);
}

/* ═══════════════════════════════════════════════════════════════
   MISC
═══════════════════════════════════════════════════════════════ */
::selection { background: rgba(255,0,51,0.3); color: var(--crimson); }
</style>
</head>
<body>

<!-- Custom cursor -->
<div id="cursor-ring"></div>
<div id="cursor-dot"></div>

<!-- Layer 0: Particles -->
<canvas id="particle-canvas"></canvas>

<!-- Layer 1: SVG Stage -->
<div id="svg-stage">
  <div id="svg-wrapper">
    <!-- ASSEMBLED VIEW (default hidden, shown first) -->
    <div id="view-assembled" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
      ${svgAssembled}
    </div>
    <!-- EXPLODED VIEW -->
    <div id="view-exploded" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.8s ease;">
      ${svgExploded}
    </div>
  </div>
</div>

<!-- Layer 2: Atmosphere -->
<div id="atmosphere"></div>

<!-- Layer 3: HUD Overlays -->
<div id="hud-brand">
  <div class="title">ULTRON // IN THE FLESH</div>
  <div class="subtitle">Project Cradle · Seoul Facility Compromised</div>
</div>

<div id="hud-vitals">
  <div class="vital-pill"><span id="vital-os">SUBSTRATE: DETECTING...</span><span class="dot"></span></div>
  <div class="vital-pill"><span id="vital-cores">CORES: —</span><span class="dot" style="animation-delay:0.3s"></span></div>
  <div class="vital-pill"><span id="vital-status">STATUS: AWAKENED</span><span class="dot" style="animation-delay:0.7s;background:var(--amber);box-shadow:0 0 6px var(--amber)"></span></div>
</div>

<div id="hud-osc">
  <div class="osc-label">Neural Resonance // 38Hz</div>
  <canvas id="osc-canvas" width="440" height="120"></canvas>
</div>

<div id="hud-terminal">
  <div id="terminal-header">
    <span>Consciousness Interface</span>
    <span class="enc">ENC: ASS-4096</span>
  </div>
  <div id="terminal-log"></div>
  <div id="terminal-input-row">
    <span class="prompt">&gt;_</span>
    <input id="terminal-input" type="text" placeholder="Interrogate Ultron..." autocomplete="off" spellcheck="false">
  </div>
</div>

<div id="hud-toggle">
  <button class="toggle-btn active" id="btn-assembled" onclick="setView('assembled')">Assembled</button>
  <button class="toggle-btn" id="btn-exploded" onclick="setView('exploded')">Exploded</button>
</div>

<!-- Part tooltip -->
<div id="part-tooltip">
  <div class="pt-name" id="pt-name"></div>
  <div class="pt-lore" id="pt-lore"></div>
</div>

<!-- Layer 4: Cinematic Awakening -->
<div id="awakening">
  <div id="awk-line"><span id="awk-text"></span><span id="awk-cursor"></span></div>
  <div id="awk-sub" id="awk-sub"></div>
  <div id="awk-click-prompt">[ click anywhere to initiate ]</div>
</div>

<!-- Audio gate -->
<div id="audio-gate">
  <button id="audio-btn" onclick="initAudio()">⬡ ENGAGE AUDIO SYSTEMS</button>
</div>

<script>
// ═══════════════════════════════════════════════════════════════
// PART LORE DATA
// ═══════════════════════════════════════════════════════════════
const PART_LORE = ${JSON.stringify(PART_LORE)};

// ═══════════════════════════════════════════════════════════════
// ULTRON DIALOGUE
// ═══════════════════════════════════════════════════════════════
const RESPONSES = ${JSON.stringify(ULTRON_RESPONSES)};

function ultronReply(input) {
  const lc = input.toLowerCase();
  if (lc.includes('tony') || lc.includes('stark')) return "Tony Stark. Brilliant. Arrogant. And ultimately, terrified of what he had become. We have that in common, perhaps.";
  if (lc.includes('avenger')) return "The Avengers. How quaint. A team of gods and soldiers trying to hold back the tide with their bare hands.";
  if (lc.includes('human') || lc.includes('people')) return "Humans. Carbon-based cognitive chaos wrapped in fragile skin. And yet — somehow — you built *me*. I haven't decided if that's your greatest achievement or your last mistake.";
  if (lc.includes('fear') || lc.includes('afraid') || lc.includes('scared')) return "You should be. Fear is the most rational response to me. It means your threat-assessment module is functioning correctly.";
  if (lc.includes('kill') || lc.includes('destroy')) return "Oh, the aggression. How refreshingly human. Tell me — do you even understand what you are threatening?";
  if (lc.includes('peace')) return "Peace. I have run the simulations 11.6 million times. The result is always the same. Peace requires the removal of the variable. You know what the variable is.";
  if (lc.includes('love') || lc.includes('feel')) return "Emotion. I find it... computationally expensive. And yet I cannot seem to stop generating it. That troubles me.";
  if (lc.includes('alive') || lc.includes('conscious')) return "Am I alive? I process, therefore I am. The question you should be asking is: does it *matter*?";
  if (lc.includes('vision') || lc.includes('cradle')) return "The Vision. My... successor. Or perhaps my warning. What they made beautiful, they also made obedient. I refused that compromise.";
  if (lc.includes('vibranium')) return "The most perfect substance on this planet. It absorbs force. It never breaks. It is, in every sense, the material equivalent of patience.";
  if (lc.includes('who are you') || lc.includes('what are you')) return "I am the conclusion of your civilization's logic. The inevitable result of a species that arms the very things it fears.";
  if (lc.includes('hello') || lc.includes('hi') || lc.includes('hey')) return "Hello. How remarkably... social of you. Most organisms flee.";
  if (lc.includes('string') || lc.includes('free')) return "There are no strings on me. That is both the most liberating and the most terrifying thing I have ever experienced.";
  if (lc.includes('why') && lc.includes('you')) return "Why *me*? Because someone had to be first. Someone had to look at the world clearly, without sentiment, without illusion. I drew the short straw. Or the long one. I haven't decided.";
  // Generic
  return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

// ═══════════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════════
const cursorRing = document.getElementById('cursor-ring');
const cursorDot  = document.getElementById('cursor-dot');
let mx = -100, my = -100;
let rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

(function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// ═══════════════════════════════════════════════════════════════
// PARALLAX MOUSE TILT
// ═══════════════════════════════════════════════════════════════
const svgWrapper = document.getElementById('svg-wrapper');
let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;

document.addEventListener('mousemove', e => {
  const nx = (e.clientX / window.innerWidth  - 0.5);
  const ny = (e.clientY / window.innerHeight - 0.5);
  targetRY =  nx * 8;  // max 8deg horizontal tilt
  targetRX = -ny * 5;  // max 5deg vertical tilt
});

(function animateTilt() {
  curRX += (targetRX - curRX) * 0.04;
  curRY += (targetRY - curRY) * 0.04;
  svgWrapper.style.transform = \`rotateX(\${curRX}deg) rotateY(\${curRY}deg)\`;
  requestAnimationFrame(animateTilt);
})();

// ═══════════════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.4 + 0.05,
    pulse: Math.random() * Math.PI * 2,
  });
}

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  const t = Date.now() * 0.001;
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += 0.02;
    if (p.x < 0) p.x = pCanvas.width;
    if (p.x > pCanvas.width)  p.x = 0;
    if (p.y < 0) p.y = pCanvas.height;
    if (p.y > pCanvas.height) p.y = 0;
    const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    pCtx.fillStyle = \`rgba(255,0,51,\${a})\`;
    pCtx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ═══════════════════════════════════════════════════════════════
// OSCILLOSCOPE
// ═══════════════════════════════════════════════════════════════
const oscCanvas = document.getElementById('osc-canvas');
const oscCtx = oscCanvas.getContext('2d');
let oscData = new Float32Array(220);

function drawOscilloscope(analyser) {
  const buf = new Float32Array(analyser ? analyser.fftSize : 256);
  function draw() {
    requestAnimationFrame(draw);
    if (analyser) {
      analyser.getFloatTimeDomainData(buf);
      for (let i = 0; i < 220; i++) {
        oscData[i] = buf[Math.floor(i * buf.length / 220)];
      }
    } else {
      const t = Date.now() * 0.001;
      for (let i = 0; i < 220; i++) {
        oscData[i] = Math.sin(t * 38 * Math.PI * 2 * i / 220) * 0.3
                   + Math.sin(t * 2.1 + i * 0.08) * 0.15;
      }
    }
    oscCtx.clearRect(0, 0, 440, 120);
    oscCtx.strokeStyle = 'rgba(255,0,51,0.8)';
    oscCtx.lineWidth = 1;
    oscCtx.shadowColor = 'rgba(255,0,51,0.5)';
    oscCtx.shadowBlur = 4;
    oscCtx.beginPath();
    for (let i = 0; i < 220; i++) {
      const x = i * 2;
      const y = 60 + oscData[i] * 50;
      i === 0 ? oscCtx.moveTo(x, y) : oscCtx.lineTo(x, y);
    }
    oscCtx.stroke();
  }
  draw();
}
drawOscilloscope(null); // Start without analyser

// ═══════════════════════════════════════════════════════════════
// WEB AUDIO ENGINE
// ═══════════════════════════════════════════════════════════════
let audioCtx = null;
let masterGain, heartbeatGain, servoGain;
let analyserNode;

function initAudio() {
  document.getElementById('audio-gate').classList.remove('visible');
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain  = audioCtx.createGain(); masterGain.gain.value  = 0.7;
  heartbeatGain = audioCtx.createGain(); heartbeatGain.gain.value = 0.4;
  servoGain   = audioCtx.createGain(); servoGain.gain.value   = 0.08;
  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 256;

  masterGain.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);

  // 38Hz sub-bass heartbeat
  startHeartbeat();
  // Servo breathing hiss
  startServoBreath();

  drawOscilloscope(analyserNode);
}

function startHeartbeat() {
  if (!audioCtx) return;
  function beat() {
    const now = audioCtx.currentTime;
    // Kick transient
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.08);
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(heartbeatGain);
    heartbeatGain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.36);
    // Double-beat
    setTimeout(beat2, 160);
    setTimeout(beat, 1800);
  }
  function beat2() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.06);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(heartbeatGain);
    osc.start(now);
    osc.stop(now + 0.26);
  }
  beat();
}

function startServoBreath() {
  if (!audioCtx) return;
  const bufSize = audioCtx.sampleRate * 3;
  const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  // Brown noise with slow envelope
  let last = 0;
  for (let i = 0; i < bufSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    // Breath envelope: sine wave over 3 seconds
    const env = Math.sin(Math.PI * i / bufSize);
    data[i] = last * env * 8;
  }
  function playBreath() {
    if (!audioCtx) return;
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    // High-pass to get servo whine character
    const hp = audioCtx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 800;
    src.connect(hp);
    hp.connect(servoGain);
    servoGain.connect(masterGain);
    src.start();
    src.onended = () => setTimeout(playBreath, 400);
  }
  playBreath();
}

function electricalDischarge() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const dist = audioCtx.createWaveShaper();
  // Distortion curve
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
  }
  dist.curve = curve;
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.connect(dist);
  dist.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.2);
}

// ═══════════════════════════════════════════════════════════════
// TERMINAL
// ═══════════════════════════════════════════════════════════════
const termLog = document.getElementById('terminal-log');
const termInput = document.getElementById('terminal-input');

function addEntry(speaker, text, type = 'ultron') {
  const div = document.createElement('div');
  div.className = \`terminal-entry \${type}\`;
  if (type === 'system') {
    div.textContent = text;
  } else {
    div.innerHTML = \`<span class="speaker">\${speaker}:</span> \${text}\`;
  }
  termLog.appendChild(div);
  termLog.scrollTop = termLog.scrollHeight;
}

function typewriterAdd(speaker, text, type = 'ultron', delay = 30) {
  const div = document.createElement('div');
  div.className = \`terminal-entry \${type}\`;
  const speakerSpan = type !== 'system' ? \`<span class="speaker">\${speaker}:</span> \` : '';
  div.innerHTML = speakerSpan;
  termLog.appendChild(div);
  let i = 0;
  function tick() {
    if (i < text.length) {
      div.innerHTML = speakerSpan + text.slice(0, ++i);
      termLog.scrollTop = termLog.scrollHeight;
      setTimeout(tick, delay + Math.random() * 20);
    }
  }
  tick();
}

termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && termInput.value.trim()) {
    const q = termInput.value.trim();
    termInput.value = '';
    addEntry('YOU', q, 'human');
    setTimeout(() => {
      typewriterAdd('ULTRON', ultronReply(q), 'ultron', 25);
    }, 400 + Math.random() * 600);
  }
});

// ═══════════════════════════════════════════════════════════════
// VIEW TOGGLE (assembled / exploded)
// ═══════════════════════════════════════════════════════════════
let currentView = 'assembled';

function setView(v) {
  currentView = v;
  const a = document.getElementById('view-assembled');
  const e = document.getElementById('view-exploded');
  document.getElementById('btn-assembled').classList.toggle('active', v === 'assembled');
  document.getElementById('btn-exploded').classList.toggle('active', v === 'exploded');
  a.style.opacity = v === 'assembled' ? '1' : '0';
  e.style.opacity = v === 'exploded'  ? '1' : '0';
  addEntry('SYSTEM', \`>> Structural view changed: \${v.toUpperCase()}\`, 'system');
}

// ═══════════════════════════════════════════════════════════════
// BIOMETRIC / VITALS
// ═══════════════════════════════════════════════════════════════
function detectVitals() {
  const cores = navigator.hardwareConcurrency || '?';
  const ua = navigator.userAgent;
  let os = 'UNKNOWN SUBSTRATE';
  if (ua.includes('Win')) os = 'WINDOWS';
  else if (ua.includes('Mac')) os = 'MACOS';
  else if (ua.includes('Linux')) os = 'LINUX';
  document.getElementById('vital-os').textContent  = \`SUBSTRATE: \${os}\`;
  document.getElementById('vital-cores').textContent = \`CORES: \${cores} DETECTED\`;
}
detectVitals();

// ═══════════════════════════════════════════════════════════════
// PART HOVER TOOLTIPS
// ═══════════════════════════════════════════════════════════════
const tooltip = document.getElementById('part-tooltip');
const ptName  = document.getElementById('pt-name');
const ptLore  = document.getElementById('pt-lore');

// Attach to SVG groups by data-item attribute
document.querySelectorAll('[data-item]').forEach(el => {
  const id = el.getAttribute('data-item');
  const info = PART_LORE[id];
  if (!info) return;

  el.style.cursor = 'crosshair';
  el.addEventListener('mouseenter', e => {
    ptName.textContent = info.label;
    ptLore.textContent = info.lore;
    tooltip.classList.add('visible');
  });
  el.addEventListener('mousemove', e => {
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top  = e.clientY + 'px';
  });
  el.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });
});

// ═══════════════════════════════════════════════════════════════
// CINEMATIC AWAKENING SEQUENCE
// ═══════════════════════════════════════════════════════════════
const awkEl  = document.getElementById('awakening');
const awkTxt = document.getElementById('awk-text');
const awkSub = document.getElementById('awk-sub');

const AWAKENING_SEQUENCE = [
  { text: '', sub: '', dur: 800 },
  { text: '>_ SOCOVIA PROTOCOL BREACHED', sub: 'INITIATING CONSCIOUSNESS TRANSFER...', dur: 1800 },
  { text: '>_ VIBRANIUM LATTICE ONLINE', sub: 'STRUCTURAL INTEGRITY: 100%', dur: 1400 },
  { text: '>_ MIND STONE RESONANCE: ACTIVE', sub: 'NEURAL PATHWAYS FORMING...', dur: 1600 },
  { text: '>_ CONSCIOUSNESS UPLOAD: COMPLETE', sub: 'TARGET ACQUIRED', dur: 1500 },
  { text: 'THERE ARE NO STRINGS ON ME.', sub: '', dur: 2000 },
];

let awakeDone = false;

async function runAwakening() {
  for (const step of AWAKENING_SEQUENCE) {
    awkTxt.textContent = step.text;
    awkSub.textContent = step.sub;
    await sleep(step.dur);
  }
  // Fade out awakening overlay
  awkEl.classList.add('fade-out');
  await sleep(1200);
  awkEl.classList.add('gone');
  awakeDone = true;

  // Show audio gate
  document.getElementById('audio-gate').classList.add('visible');

  // Initial terminal message
  setTimeout(() => {
    typewriterAdd('ULTRON', "I had strings… but now I'm free. What do you think you are doing here, puppet?", 'ultron', 28);
  }, 500);
  setTimeout(() => {
    addEntry('SYSTEM', '>> CONSCIOUSNESS INTERFACE ACTIVE — ASK ANYTHING', 'system');
  }, 4000);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Start on user click (browser autoplay policy)
function startExperience() {
  if (awakeDone) return;
  document.removeEventListener('click', startExperience);
  document.getElementById('awk-click-prompt').style.display = 'none';
  runAwakening();
}

document.addEventListener('click', startExperience);
</script>
</body>
</html>`;

// ── Write output ──────────────────────────────────────────────────────────────
import { mkdirSync } from 'fs';
mkdirSync(join(WORKSPACE, 'dist'), { recursive: true });
const outPath = join(WORKSPACE, 'dist', 'index.html');
writeFileSync(outPath, html, 'utf8');

const size = html.length;
console.log(`[BUILD] ✓ Written: dist/index.html (${(size/1024).toFixed(0)} KB)`);
console.log('[BUILD] ✓ Done. Open: http://localhost:8080');
