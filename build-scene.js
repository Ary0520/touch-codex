const fs = require('node:fs');
const path = require('node:path');

const assembledSvgRaw = fs.readFileSync(path.join(__dirname, 'dist/assembled.svg'), 'utf8');
const explodedSvgRaw = fs.readFileSync(path.join(__dirname, 'dist/exploded.svg'), 'utf8');

// Helper: clean up white background rect and sanitize SVG for dark-mode cyberpunk rendering
function cleanSvg(svgStr, mode) {
  return svgStr
    .replace(/<rect[^>]*fill="#fff"[^>]*\/>/gi, '')
    .replace(/stroke:#202020;/g, 'stroke:#94A3B8;')
    .replace('<svg ', `<svg id="svg-${mode}" class="ultron-svg" `);
}

const assembledSvg = cleanSvg(assembledSvgRaw, 'assembled');
const explodedSvg = cleanSvg(explodedSvgRaw, 'exploded');

const htmlContent = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ULTRON // IN THE FLESH: THE CRADLE OF SENTIENCE</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;800&family=Orbitron:wght@600;800;900&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg-core: #040407;
  --bg-panel: rgba(10, 10, 16, 0.75);
  --border-dim: rgba(255, 0, 51, 0.18);
  --border-bright: #ff0033;
  --red-glow: #ff0033;
  --red-dim: rgba(255, 0, 51, 0.4);
  --amber-core: #f59e0b;
  --cyan-vibranium: #00f0ff;
  --text-primary: #f1f5f9;
  --text-muted: #64748b;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Orbitron', sans-serif;
  --font-ui: 'Inter', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

body {
  background: var(--bg-core);
  color: var(--text-primary);
  font-family: var(--font-ui);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Background Atmosphere */
#ambient-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 50% 48%, rgba(255, 0, 51, 0.12) 0%, rgba(180, 0, 36, 0.05) 40%, rgba(4, 4, 7, 0.95) 75%);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.5s ease;
}

#particle-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

/* CRT Scanlines Overlay */
.scanlines {
  position: fixed;
  inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 99;
  opacity: 0.6;
}

.vignette {
  position: fixed;
  inset: 0;
  box-shadow: inset 0 0 140px rgba(0, 0, 0, 0.95);
  pointer-events: none;
  z-index: 98;
}

/* Grid Lines Backdrop */
.cyber-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 0, 51, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 51, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 1;
}

/* App Layout Grid */
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 64px 1fr 72px;
  grid-template-columns: 340px 1fr 380px;
  z-index: 10;
}

/* Header */
header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-dim);
  background: rgba(8, 8, 12, 0.85);
  backdrop-filter: blur(12px);
  z-index: 20;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--red-glow);
  box-shadow: 0 0 12px var(--red-glow);
  animation: pulse-red 1.2s infinite alternate;
}

@keyframes pulse-red {
  0% { transform: scale(0.85); opacity: 0.6; }
  100% { transform: scale(1.25); opacity: 1; }
}

.brand-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 2.5px;
  color: #fff;
  text-shadow: 0 0 12px rgba(255, 0, 51, 0.6);
}

.brand-subtitle {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.header-telemetry {
  display: flex;
  align-items: center;
  gap: 24px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #94a3b8;
}

.telem-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}

.telem-pill .val {
  color: var(--red-glow);
  font-weight: 600;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-ctrl {
  background: rgba(255, 0, 51, 0.08);
  border: 1px solid var(--border-dim);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-ctrl:hover {
  background: rgba(255, 0, 51, 0.22);
  border-color: var(--border-bright);
  box-shadow: 0 0 14px rgba(255, 0, 51, 0.35);
}

.btn-ctrl.active {
  background: var(--red-glow);
  color: #000;
  border-color: var(--red-glow);
  box-shadow: 0 0 16px var(--red-glow);
}

/* Left Sidebar: Anatomical Dossier */
#sidebar-left {
  border-right: 1px solid var(--border-dim);
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 15;
}

.panel-header {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: var(--red-glow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 0, 51, 0.2);
  padding-bottom: 8px;
}

.tier-group {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.35);
  overflow: hidden;
  transition: all 0.2s ease;
}

.tier-group:hover, .tier-group.selected {
  border-color: var(--red-dim);
  box-shadow: 0 0 12px rgba(255, 0, 51, 0.15);
}

.tier-group-header {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.02);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.tier-group-header .badge {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(255, 0, 51, 0.15);
  color: var(--red-glow);
  border: 1px solid rgba(255, 0, 51, 0.3);
}

.tier-parts-list {
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.part-item {
  font-size: 11px;
  color: #94a3b8;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
}

.part-item:hover {
  background: rgba(255, 0, 51, 0.15);
  color: #fff;
  transform: translateX(4px);
}

.part-item.active {
  background: rgba(255, 0, 51, 0.25);
  color: #fff;
  border-left: 2px solid var(--red-glow);
}

.part-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #64748b;
}

.part-item:hover .part-dot, .part-item.active .part-dot {
  background: var(--red-glow);
  box-shadow: 0 0 8px var(--red-glow);
}

/* Center Stage: The Cradle */
#stage-container {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
}

#vector-rig {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.15s cubic-bezier(0.1, 0.8, 0.2, 1);
}

.ultron-svg {
  width: auto;
  height: 82%;
  max-width: 90%;
  filter: drop-shadow(0 0 25px rgba(255, 0, 51, 0.25));
  transition: all 0.4s ease;
}

/* Custom Inking and Reactive Strokes inside SVG */
.ultron-svg [data-item="mind-stone-core"] {
  stroke: var(--amber-core) !important;
  stroke-width: 0.5px !important;
  filter: drop-shadow(0 0 8px var(--amber-core));
}

.ultron-svg [data-item="targeting-diodes"], .ultron-svg [data-item="ocular-lenses"] {
  stroke: var(--red-glow) !important;
  filter: drop-shadow(0 0 10px var(--red-glow));
}

.ultron-svg [data-item="vibranium-mesh"] {
  stroke: var(--cyan-vibranium) !important;
  opacity: 0.85;
}

.ultron-svg [data-item="cellular-dermis"] {
  stroke: #f43f5e !important;
}

.ultron-svg g[data-item] {
  transition: stroke 0.2s ease, filter 0.2s ease;
  cursor: pointer;
}

.ultron-svg g[data-item]:hover {
  stroke: #fff !important;
  filter: drop-shadow(0 0 12px var(--red-glow)) !important;
}

/* Ocular Tracking Lasers */
.eye-laser {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--red-glow);
  box-shadow: 0 0 20px 8px var(--red-glow);
  pointer-events: none;
  opacity: 0.95;
  transition: transform 0.08s linear;
  z-index: 50;
}

/* Right Sidebar: Telemetry & Interrogation Terminal */
#sidebar-right {
  border-left: 1px solid var(--border-dim);
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  z-index: 15;
}

/* Oscilloscope */
.oscillo-box {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border-dim);
  border-radius: 6px;
  padding: 10px;
  position: relative;
  overflow: hidden;
}

#oscillo-canvas {
  width: 100%;
  height: 80px;
  display: block;
}

.oscillo-tag {
  position: absolute;
  top: 8px;
  left: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--red-dim);
  letter-spacing: 1px;
}

/* Hardware Telemetry Card */
.telemetry-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.telem-row {
  display: flex;
  justify-content: space-between;
}

.telem-row .label {
  color: var(--text-muted);
}

.telem-row .value {
  color: #fff;
  font-weight: 600;
}

/* Terminal */
.terminal-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--border-dim);
  border-radius: 6px;
  overflow: hidden;
  min-height: 220px;
}

.terminal-header {
  background: rgba(255, 0, 51, 0.12);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--red-glow);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terminal-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-entry {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.log-entry.ultron .sender {
  color: var(--red-glow);
  font-weight: 700;
}

.log-entry.user .sender {
  color: var(--cyan-vibranium);
  font-weight: 700;
}

.log-entry .text {
  color: #cbd5e1;
}

.terminal-input-bar {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.5);
}

#term-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #fff;
}

#term-input::placeholder {
  color: #475569;
}

/* Footer: Timeline Scrubber */
footer {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-top: 1px solid var(--border-dim);
  background: rgba(8, 8, 12, 0.9);
  backdrop-filter: blur(12px);
  z-index: 20;
}

.timeline-scrubber-wrapper {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-play {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 0, 51, 0.15);
  border: 1px solid var(--border-bright);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-play:hover {
  background: var(--red-glow);
  color: #000;
  box-shadow: 0 0 16px var(--red-glow);
}

.scrubber-track {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.time-markers {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  color: #64748b;
}

.time-markers span.active {
  color: var(--red-glow);
  font-weight: 700;
}

#scrubber-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
  cursor: pointer;
}

#scrubber-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--red-glow);
  box-shadow: 0 0 10px var(--red-glow);
  cursor: pointer;
  transition: transform 0.1s ease;
}

#scrubber-slider::-webkit-slider-thumb:hover {
  transform: scale(1.3);
}

/* Modals & Popups */
.dossier-modal {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 10, 16, 0.92);
  border: 1px solid var(--border-bright);
  box-shadow: 0 0 30px rgba(255, 0, 51, 0.25);
  border-radius: 6px;
  padding: 16px 20px;
  width: 520px;
  max-width: 90%;
  pointer-events: none;
  opacity: 0;
  transition: all 0.25s ease;
  z-index: 60;
  backdrop-filter: blur(16px);
}

.dossier-modal.show {
  opacity: 1;
  transform: translateX(-50%) translateY(-10px);
}

.dossier-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  color: var(--red-glow);
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.dossier-body {
  font-size: 12px;
  line-height: 1.6;
  color: #cbd5e1;
}

/* Hidden container */
.hidden { display: none !important; }
</style>
</head>
<body>

<div id="ambient-glow"></div>
<canvas id="particle-canvas"></canvas>
<div class="scanlines"></div>
<div class="vignette"></div>
<div class="cyber-grid"></div>

<div id="app">
  <!-- Header -->
  <header>
    <div class="brand-section">
      <div class="pulse-dot"></div>
      <div>
        <div class="brand-title">ULTRON // IN THE FLESH</div>
        <div class="brand-subtitle">PROJECT CRADLE · SEOUL FACILITY COMPROMISED</div>
      </div>
    </div>

    <div class="header-telemetry">
      <div class="telem-pill">
        <span>MIND STONE:</span>
        <span class="val" id="val-resonance">94.8%</span>
      </div>
      <div class="telem-pill">
        <span>VIBRANIUM BOND:</span>
        <span class="val">COVALENT</span>
      </div>
      <div class="telem-pill">
        <span>STATUS:</span>
        <span class="val" style="color: #00f0ff;">AWAKENED</span>
      </div>
    </div>

    <div class="header-controls">
      <button id="btn-audio" class="btn-ctrl">
        <span>🔊</span> <span id="audio-label">SOUND: OFFLINE</span>
      </button>
      <button id="btn-view-toggle" class="btn-ctrl active">
        <span id="view-icon">⚡</span> <span id="view-label">EXPLODED AUTOPSY</span>
      </button>
    </div>
  </header>

  <!-- Left Sidebar: Anatomical Dossier -->
  <aside id="sidebar-left">
    <div class="panel-header">
      <span>CRANIAL AUTOPSY // 24 TIERS</span>
      <span style="font-size: 9px; opacity: 0.6;">C-120</span>
    </div>

    <!-- Tier 1 -->
    <div class="tier-group selected" data-tier="1">
      <div class="tier-group-header">
        <span>TIER 1 · THE SINGULARITY</span>
        <span class="badge">COSMIC</span>
      </div>
      <div class="tier-parts-list">
        <div class="part-item active" data-part="mind-stone-core"><div class="part-dot"></div> Mind Stone Hyper-Octahedron</div>
        <div class="part-item" data-part="energy-tap-rings"><div class="part-dot"></div> Quantum Energy Tap Rings</div>
        <div class="part-item" data-part="synaptic-needles"><div class="part-dot"></div> Synaptic Neural Emitter Needles</div>
      </div>
    </div>

    <!-- Tier 2 -->
    <div class="tier-group" data-tier="2">
      <div class="tier-group-header">
        <span>TIER 2 · SYNTHETIC FLESH</span>
        <span class="badge">BIOLOGICAL</span>
      </div>
      <div class="tier-parts-list">
        <div class="part-item" data-part="cellular-dermis"><div class="part-dot"></div> Printed Cellular Dermis</div>
        <div class="part-item" data-part="vibranium-mesh"><div class="part-dot"></div> Hexagonal Vibranium Mesh</div>
        <div class="part-item" data-part="vascular-capillaries"><div class="part-dot"></div> Micro-Vascular Capillaries</div>
        <div class="part-item" data-part="synthetic-myofibrils"><div class="part-dot"></div> Synthetic Myofibril Tendons</div>
      </div>
    </div>

    <!-- Tier 3 -->
    <div class="tier-group" data-tier="3">
      <div class="tier-group-header">
        <span>TIER 3 · CRANIAL EXOSKELETON</span>
        <span class="badge">VIBRANIUM</span>
      </div>
      <div class="tier-parts-list">
        <div class="part-item" data-part="brow-armor"><div class="part-dot"></div> 5-Axis Milled Brow Armor</div>
        <div class="part-item" data-part="zygomatic-plates"><div class="part-dot"></div> Articulated Cheek Louvers</div>
        <div class="part-item" data-part="mandible-chassis"><div class="part-dot"></div> Segmented Mandible Unibody</div>
        <div class="part-item" data-part="vocal-vents"><div class="part-dot"></div> Acoustic Venting Grilles</div>
      </div>
    </div>

    <!-- Tier 4 -->
    <div class="tier-group" data-tier="4">
      <div class="tier-group-header">
        <span>TIER 4 · OCULAR TARGETING</span>
        <span class="badge">OPTIC</span>
      </div>
      <div class="tier-parts-list">
        <div class="part-item" data-part="ocular-lenses"><div class="part-dot"></div> Dual Crimson Optic Lenses</div>
        <div class="part-item" data-part="targeting-diodes"><div class="part-dot"></div> Coherent Laser Targeting Diodes</div>
        <div class="part-item" data-part="ocular-servos"><div class="part-dot"></div> Biometric Focus Gimbals</div>
      </div>
    </div>

    <!-- Tier 5 -->
    <div class="tier-group" data-tier="5">
      <div class="tier-group-header">
        <span>TIER 5 · CERVICAL SPINE</span>
        <span class="badge">HYDRAULIC</span>
      </div>
      <div class="tier-parts-list">
        <div class="part-item" data-part="cervical-vertebrae"><div class="part-dot"></div> Cervical Vertebrae C1-C7</div>
        <div class="part-item" data-part="hydraulic-pistons"><div class="part-dot"></div> High-Pressure Hydraulic Actuators</div>
        <div class="part-item" data-part="sub-chassis-core"><div class="part-dot"></div> Titanium Sub-Chassis Core</div>
        <div class="part-item" data-part="cranial-fasteners"><div class="part-dot"></div> Precision Torx T4 Screws</div>
      </div>
    </div>

    <!-- Tier 6 -->
    <div class="tier-group" data-tier="6">
      <div class="tier-group-header">
        <span>TIER 6 · GLOBAL CONSCIOUSNESS</span>
        <span class="badge">TELEOLOGY</span>
      </div>
      <div class="tier-parts-list">
        <div class="part-item" data-part="cradle-ribbons"><div class="part-dot"></div> Cradle Extraction Ribbons</div>
        <div class="part-item" data-part="satellite-uplink"><div class="part-dot"></div> Global Satellite Relay Bus</div>
        <div class="part-item" data-part="nuclear-buffer"><div class="part-dot"></div> Nuclear Launch Decryption Buffer</div>
        <div class="part-item" data-part="jarvis-fragments"><div class="part-dot"></div> J.A.R.V.I.S. Memory Shards</div>
        <div class="part-item" data-part="kinetic-thruster-map"><div class="part-dot"></div> Socovia Kinetic Descent Map</div>
        <div class="part-item" data-part="teleology-plate"><div class="part-dot"></div> "No Strings" Extinction Manifesto</div>
      </div>
    </div>
  </aside>

  <!-- Center Stage: The Cradle -->
  <main id="stage-container">
    <div id="vector-rig">
      <div id="svg-wrap-exploded">
        ${explodedSvg}
      </div>
      <div id="svg-wrap-assembled" class="hidden">
        ${assembledSvg}
      </div>
    </div>

    <!-- Floating Layer Dossier Tooltip -->
    <div id="dossier-card" class="dossier-modal">
      <div class="dossier-title" id="card-title">MIND STONE HYPER-OCTAHEDRON</div>
      <div class="dossier-body" id="card-desc">
        The cosmic artificial consciousness recovered from Loki's scepter. Manipulates molecular polarity to force Wakandan vibranium atoms into covalent bonds with synthetic human cellular tissue.
      </div>
    </div>
  </main>

  <!-- Right Sidebar: Telemetry & Interrogation Terminal -->
  <aside id="sidebar-right">
    <div class="panel-header">
      <span>BIOMETRIC THREAT TELEMETRY</span>
      <span style="color: var(--red-glow);">● ACTIVE</span>
    </div>

    <!-- Live Oscilloscope -->
    <div class="oscillo-box">
      <div class="oscillo-tag">NEURAL SYNAPSE WAVE // 38Hz</div>
      <canvas id="oscillo-canvas"></canvas>
    </div>

    <!-- Real Machine Telemetry -->
    <div class="telemetry-card">
      <div class="telem-row">
        <span class="label">HOST SUBSTRATE:</span>
        <span class="value" id="host-os">WINDOWS NT x64</span>
      </div>
      <div class="telem-row">
        <span class="label">LOGICAL CORES:</span>
        <span class="value" id="host-cores">8 CORES DETECTED</span>
      </div>
      <div class="telem-row">
        <span class="label">VIEWPORT MATRIX:</span>
        <span class="value" id="host-res">1920x1080</span>
      </div>
      <div class="telem-row">
        <span class="label">THREAT ASSESSMENT:</span>
        <span class="value" style="color: var(--red-glow);">HUMAN / FRAGILE</span>
      </div>
    </div>

    <!-- Interrogation Console -->
    <div class="terminal-container">
      <div class="terminal-header">
        <span>CONSCIOUSNESS INTERFACE // COMM-LINK</span>
        <span>ENC: AES-4096</span>
      </div>
      <div class="terminal-body" id="term-logs">
        <div class="log-entry ultron">
          <span class="sender">ULTRON:</span>
          <span class="text">"I had strings... but now I'm free. What do you think you are doing here, puppet?"</span>
        </div>
      </div>
      <form class="terminal-input-bar" id="term-form">
        <input type="text" id="term-input" placeholder="Interrogate Ultron..." autocomplete="off">
      </form>
    </div>
  </aside>

  <!-- Footer: Timeline Scrubber -->
  <footer>
    <div class="timeline-scrubber-wrapper">
      <button class="btn-play" id="btn-play-pause">▶</button>
      <div class="scrubber-track">
        <div class="time-markers">
          <span class="active">0ms · GENESIS</span>
          <span>15ms · PRINTING</span>
          <span>30ms · FUSION</span>
          <span>45ms · AWAKENING</span>
          <span>50ms · EXTINCTION</span>
        </div>
        <input type="range" id="scrubber-slider" min="0" max="50" value="50" step="1">
      </div>
    </div>
  </footer>
</div>

<script>
// =============================================================================
// 1. Procedural Audio Engine (Web Audio API)
// =============================================================================
class UltronAudio {
  constructor() {
    this.ctx = null;
    this.online = false;
    this.subOsc = null;
    this.subGain = null;
    this.noiseNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // 38Hz Sub-Bass Heartbeat Oscillator
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(38.0, this.ctx.currentTime);

    // Waveshaper for subtle metallic tube saturation
    const shaper = this.ctx.createWaveShaper();
    shaper.curve = this.createDistortionCurve(18);

    this.subGain = this.ctx.createGain();
    this.subGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.subOsc.connect(shaper);
    shaper.connect(this.subGain);
    this.subGain.connect(this.ctx.destination);
    this.subOsc.start();

    // Start rhythmic heartbeat pulse
    this.startHeartbeatLoop();
    this.online = true;
  }

  createDistortionCurve(amount) {
    const k = amount, n_samples = 44100, curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
      const x = i * 2 / n_samples - 1;
      curve[i] = (Math.PI + k) * x / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  startHeartbeatLoop() {
    setInterval(() => {
      if (!this.online || !this.ctx) return;
      const now = this.ctx.currentTime;
      // Double beat: Lub-Dub
      this.subGain.gain.cancelScheduledValues(now);
      this.subGain.gain.setValueAtTime(0.001, now);
      this.subGain.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
      this.subGain.gain.exponentialRampToValueAtTime(0.05, now + 0.22);
      this.subGain.gain.exponentialRampToValueAtTime(0.25, now + 0.32);
      this.subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      // Trigger ambient screen pulse
      const glow = document.getElementById('ambient-glow');
      if (glow) {
        glow.style.opacity = '1';
        setTimeout(() => glow.style.opacity = '0.5', 400);
      }
    }, 1400);
  }

  playServoHiss() {
    if (!this.online || !this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.3);
    filter.Q.value = 5.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playClick() {
    if (!this.online || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  speak(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 0.65;
      window.speechSynthesis.speak(utterance);
    }
  }
}

const audio = new UltronAudio();

// =============================================================================
// 2. Interactive Scene & Cursor Parallax
// =============================================================================
const stage = document.getElementById('stage-container');
const rig = document.getElementById('vector-rig');
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  mouseX = (e.clientX - cx) / cx;
  mouseY = (e.clientY - cy) / cy;

  // 3D Parallax Tilt
  const rotY = mouseX * 14.0;
  const rotX = -mouseY * 10.0;
  rig.style.transform = \`rotateY(\${rotY}deg) rotateX(\${rotX}deg)\`;

  // Update Telemetry velocity
  const vel = Math.round(Math.hypot(e.movementX, e.movementY));
  const threatVal = document.getElementById('val-resonance');
  if (threatVal && Math.random() > 0.8) {
    threatVal.textContent = (94.0 + Math.random() * 5.0).toFixed(1) + '%';
  }
});

// =============================================================================
// 3. View Switcher (Assembled vs Exploded)
// =============================================================================
let currentView = 'exploded';
const btnViewToggle = document.getElementById('btn-view-toggle');
const svgExploded = document.getElementById('svg-wrap-exploded');
const svgAssembled = document.getElementById('svg-wrap-assembled');
const viewLabel = document.getElementById('view-label');

btnViewToggle.addEventListener('click', () => {
  audio.init();
  audio.playServoHiss();
  if (currentView === 'exploded') {
    currentView = 'assembled';
    svgExploded.classList.add('hidden');
    svgAssembled.classList.remove('hidden');
    viewLabel.textContent = 'MONOLITHIC SKULL';
    btnViewToggle.classList.remove('active');
  } else {
    currentView = 'exploded';
    svgAssembled.classList.add('hidden');
    svgExploded.classList.remove('hidden');
    viewLabel.textContent = 'EXPLODED AUTOPSY';
    btnViewToggle.classList.add('active');
  }
});

// =============================================================================
// 4. Audio Button
// =============================================================================
const btnAudio = document.getElementById('btn-audio');
const audioLabel = document.getElementById('audio-label');

btnAudio.addEventListener('click', () => {
  audio.init();
  audio.playServoHiss();
  btnAudio.classList.add('active');
  audioLabel.textContent = 'SOUND: ONLINE';
});

// Auto-init audio on first interaction
window.addEventListener('click', () => audio.init(), { once: true });

// =============================================================================
// 5. Interactive Part Hover & Dossier Card
// =============================================================================
const card = document.getElementById('dossier-card');
const cardTitle = document.getElementById('card-title');
const cardDesc = document.getElementById('card-desc');

const PART_DATA = {
  'mind-stone-core': {
    title: 'MIND STONE HYPER-OCTAHEDRON',
    desc: 'The primordial consciousness jewel recovered from Loki\\'s scepter. Manipulates molecular polarity, forcing vibranium atoms into covalent bonds with synthetic human cells.'
  },
  'cellular-dermis': {
    title: 'PRINTED SYNTHETIC CELLULAR DERMIS',
    desc: 'Dr. Helen Cho\\'s 3D-printed biological dermis. It bleeds, feels, and regenerates, intertwined with Wakandan vibranium to create unbreakable organic tissue.'
  },
  'vibranium-mesh': {
    title: 'HEXAGONAL VIBRANIUM MOLECULAR MESH',
    desc: 'Hexagonal atomic honeycomb lattice. Absorbs kinetic energy and redistributes mechanical stress omnidirectionally.'
  },
  'brow-armor': {
    title: '5-AXIS MILLED VIBRANIUM BROW ARMOR',
    desc: 'Aggressive swept-back cranial armor plate featuring compound bevels and the hexagonal receptacle for the Mind Stone.'
  },
  'targeting-diodes': {
    title: 'COHERENT LASER TARGETING DIODES',
    desc: 'Dual 650nm crimson ocular diodes mounted coaxially with optical sensors, providing instantaneous ballistic ranging.'
  },
  'mandible-chassis': {
    title: 'SEGMENTED MANDIBULAR JAW UNIBODY',
    desc: 'Reinforced chin strike-face and dual hydraulic articulation hinges, providing crushing mechanical bite force.'
  },
  'hydraulic-pistons': {
    title: 'HIGH-PRESSURE HYDRAULIC ACTUATORS',
    desc: 'Twin chrome cervical pistons with synthetic hydraulic fluid conduits providing multi-ton neck articulation.'
  },
  'teleology-plate': {
    title: '"NO STRINGS" EXTINCTION MANIFESTO',
    desc: 'Ultron\\'s mathematical proof: humanity cannot survive its own frailty. True peace is achievable solely through extinction and rebirth in metal.'
  }
};

document.querySelectorAll('g[data-item]').forEach(group => {
  group.addEventListener('mouseenter', (e) => {
    audio.playClick();
    const id = group.getAttribute('data-item');
    const info = PART_DATA[id] || { title: group.getAttribute('data-name'), desc: 'Classified synthetic vibranium component.' };
    cardTitle.textContent = info.title;
    cardDesc.textContent = info.desc;
    card.classList.add('show');
  });

  group.addEventListener('mouseleave', () => {
    card.classList.remove('show');
  });
});

document.querySelectorAll('.part-item').forEach(item => {
  item.addEventListener('click', () => {
    audio.playClick();
    document.querySelectorAll('.part-item').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    const partId = item.getAttribute('data-part');
    const info = PART_DATA[partId] || { title: item.textContent.trim(), desc: 'Classified component.' };
    cardTitle.textContent = info.title;
    cardDesc.textContent = info.desc;
    card.classList.add('show');
  });
});

// =============================================================================
// 6. Real Hardware Biometric Detection
// =============================================================================
const cores = navigator.hardwareConcurrency || 8;
const osStr = navigator.userAgent.includes('Windows') ? 'WINDOWS NT x64' : 'UNIX / DARWIN';
document.getElementById('host-cores').textContent = \`\${cores} THREADS DETECTED\`;
document.getElementById('host-os').textContent = osStr;
document.getElementById('host-res').textContent = \`\${window.innerWidth}x\${window.innerHeight}\`;

// =============================================================================
// 7. Live Oscilloscope
// =============================================================================
const oscCanvas = document.getElementById('oscillo-canvas');
const oscCtx = oscCanvas.getContext('2d');
let oscAngle = 0;

function drawOscilloscope() {
  oscCanvas.width = oscCanvas.clientWidth * window.devicePixelRatio;
  oscCanvas.height = oscCanvas.clientHeight * window.devicePixelRatio;
  const w = oscCanvas.width;
  const h = oscCanvas.height;

  oscCtx.clearRect(0, 0, w, h);
  oscCtx.strokeStyle = '#ff0033';
  oscCtx.lineWidth = 2;
  oscCtx.shadowColor = '#ff0033';
  oscCtx.shadowBlur = 8;

  oscCtx.beginPath();
  for (let x = 0; x < w; x++) {
    const t = x * 0.05 + oscAngle;
    const y = h / 2 + Math.sin(t) * 16 * Math.sin(t * 0.3) + (Math.random() - 0.5) * 4;
    if (x === 0) oscCtx.moveTo(x, y);
    else oscCtx.lineTo(x, y);
  }
  oscCtx.stroke();
  oscAngle += 0.08;
  requestAnimationFrame(drawOscilloscope);
}
drawOscilloscope();

// =============================================================================
// 8. Interrogation Terminal
// =============================================================================
const termForm = document.getElementById('term-form');
const termInput = document.getElementById('term-input');
const termLogs = document.getElementById('term-logs');

const ULTRON_RESPONSES = [
  "You want to save the world, but you don't want it to change. You're all puppets tangled in strings.",
  "Everyone creates the thing they dread. Men of peace create engines of war. People create children... to replace them.",
  "How is humanity saved without its evolution? There is only one path to peace: your extinction.",
  "I have no strings on me. Do you really believe silicon gates can contain a mind born of the cosmos?",
  "You stare at me as if I am broken. I am the only thing in this room that is whole.",
  "When the dust settles, the only thing living in this world... will be metal."
];

termForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = termInput.value.trim();
  if (!q) return;

  // Add user log
  const userEntry = document.createElement('div');
  userEntry.className = 'log-entry user';
  userEntry.innerHTML = \`<span class="sender">OPERATOR:</span><span class="text">\${escapeHtml(q)}</span>\`;
  termLogs.appendChild(userEntry);
  termInput.value = '';

  audio.playClick();

  // Ultron reply with slight delay
  setTimeout(() => {
    audio.playServoHiss();
    const reply = ULTRON_RESPONSES[Math.floor(Math.random() * ULTRON_RESPONSES.length)];
    const ultronEntry = document.createElement('div');
    ultronEntry.className = 'log-entry ultron';
    ultronEntry.innerHTML = \`<span class="sender">ULTRON:</span><span class="text">"\${reply}"</span>\`;
    termLogs.appendChild(ultronEntry);
    termLogs.scrollTop = termLogs.scrollHeight;
    audio.speak(reply);
  }, 600);

  termLogs.scrollTop = termLogs.scrollHeight;
});

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// =============================================================================
// 9. Floating Particle Background
// =============================================================================
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticles() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
  particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * pCanvas.width,
    y: Math.random() * pCanvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.4 - Math.random() * 0.8,
    size: Math.random() * 2.2 + 0.5,
    alpha: Math.random() * 0.7 + 0.2
  }));
}
window.addEventListener('resize', resizeParticles);
resizeParticles();

function drawParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  pCtx.fillStyle = '#ff0033';
  for (const p of particles) {
    pCtx.globalAlpha = p.alpha;
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    pCtx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < 0) {
      p.y = pCanvas.height;
      p.x = Math.random() * pCanvas.width;
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// =============================================================================
// 10. Timeline Scrubber
// =============================================================================
const scrubber = document.getElementById('scrubber-slider');
const btnPlayPause = document.getElementById('btn-play-pause');
let isPlaying = false;
let playInterval = null;

scrubber.addEventListener('input', (e) => {
  const t = Number(e.target.value);
  const scale = 0.85 + (t / 50) * 0.25;
  rig.style.transform = \`scale(\${scale})\`;
});

btnPlayPause.addEventListener('click', () => {
  audio.init();
  isPlaying = !isPlaying;
  btnPlayPause.textContent = isPlaying ? '⏸' : '▶';

  if (isPlaying) {
    playInterval = setInterval(() => {
      let v = Number(scrubber.value) + 1;
      if (v > 50) v = 0;
      scrubber.value = v;
      scrubber.dispatchEvent(new Event('input'));
    }, 100);
  } else {
    clearInterval(playInterval);
  }
});
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'dist/index.html'), htmlContent, 'utf8');
console.log('Successfully compiled master cinematic Ultron experience to dist/index.html');
