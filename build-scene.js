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

  // 1. Strip XML declaration & DOCTYPE
  raw = raw.replace(/<\?xml[^?]*\?>\s*/g, '');
  raw = raw.replace(/<!DOCTYPE[^>]*>\s*/g, '');

  // 2. ── CRITICAL: Remove the teardown engine's white background rect ────────
  //    The engine injects: <rect x="-1000" y="-1000" width="3000" height="3000" fill="#fff"/>
  //    This white rect nukes the entire dark atmosphere. Kill it.
  raw = raw.replace(/<rect[^>]*fill="#fff"[^>]*\/>/gi, '');
  raw = raw.replace(/<rect[^>]*fill="#ffffff"[^>]*\/>/gi, '');
  raw = raw.replace(/<rect[^>]*fill="white"[^>]*\/>/gi, '');

  // 3. ── CRITICAL: Override the teardown's <style> block ────────────────────
  //    The engine sets: path{fill:none;stroke:#202020;...}
  //    CSS attribute selectors [stroke="#202020"] cannot override a <style> rule.
  //    We inject our OWN <style> block AFTER the existing one, with higher specificity.
  const ULTRON_STYLE_OVERRIDE = `<style>
/* ULTRON COLOR OVERRIDE — injected by build-scene.js */
/* These rules beat the teardown engine's path{stroke:#202020} via specificity */
svg path, svg line, svg polyline, svg polygon, svg ellipse, svg circle, svg rect {
  stroke: #5a1515 !important;
}
[data-line-role="outline"] {
  stroke: #cc2222 !important;
  stroke-opacity: 1 !important;
}
[data-line-role="edge"] {
  stroke: #992222 !important;
  stroke-opacity: 0.85 !important;
}
[data-line-role="detail"] {
  stroke: #771111 !important;
  stroke-opacity: 0.7 !important;
}
[data-line-role="texture"] {
  stroke: #550d0d !important;
  stroke-opacity: 0.5 !important;
}
[data-line-role="axis"] {
  stroke: #440a0a !important;
  stroke-opacity: 0.4 !important;
}
/* Mind stone — amber glow */
[data-item="mind-stone-core"] path,
[data-item="energy-tap-rings"] path,
[data-item="synaptic-needles"] path {
  stroke: #c97a0a !important;
  stroke-opacity: 0.9 !important;
}
/* Vibranium mesh — cyan tint */
[data-item="vibranium-mesh"] path {
  stroke: #0099aa !important;
  stroke-opacity: 0.75 !important;
}
/* Ocular — pure crimson */
[data-item="ocular-lenses"] path,
[data-item="targeting-diodes"] path,
[data-item="ocular-servos"] path {
  stroke: #ff0033 !important;
  stroke-opacity: 0.95 !important;
}
/* Annotation text */
svg text {
  fill: rgba(255,0,51,0.3) !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 7px !important;
}
</style>`;

  // Insert override style block right after the existing </style> tag
  raw = raw.replace(/<\/style>/, `</style>${ULTRON_STYLE_OVERRIDE}`);
  // If no style tag exists, inject at top of SVG content
  if (!raw.includes(ULTRON_STYLE_OVERRIDE)) {
    raw = raw.replace(/<svg([^>]*)>/, `<svg$1>${ULTRON_STYLE_OVERRIDE}`);
  }

  // 4. ── CRITICAL: Fix SVG dimensions ──────────────────────────────────────
  //    The teardown outputs A4 paper (420mm × 297mm) which renders tiny.
  //    Remove fixed width/height so CSS can control sizing via viewBox only.
  raw = raw.replace(/\s+width="[^"]*mm"/, '');
  raw = raw.replace(/\s+height="[^"]*mm"/, '');
  // Ensure it has preserveAspectRatio for proper centering
  if (!raw.includes('preserveAspectRatio')) {
    raw = raw.replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"');
  }

  return raw.trim();
}

console.log('[BUILD] Loading SVG proofs...');
const svgAssembled = loadSVG('ultron-cradle-default-assembled.svg');
const svgExploded  = loadSVG('ultron-cradle-default-exploded.svg');
console.log(`[BUILD] Assembled: ${svgAssembled.length} bytes`);
console.log(`[BUILD] Exploded:  ${svgExploded.length} bytes`);

// ── Ultron Face Shadow Silhouette SVG ────────────────────────────────────────
// Masterpiece SVG of Ultron Prime's menacing face:
// Chiseled vibranium skull, glowing ocular targeting matrix, molten red oral vents,
// predatory brow crest, and cursor-tracking pupils.
const ULTRON_SHADOW_SVG = `
<svg id="ultron-shadow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750"
     preserveAspectRatio="xMidYMid meet">
  <defs>
    <!-- Intense Bloom Filters -->
    <filter id="crimson-heavy-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="16" result="blur1"/>
      <feGaussianBlur stdDeviation="8" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="core-eye-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="metallic-bevel" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.9"/>
    </filter>

    <!-- Gradients for Chiseled Armor & Glows -->
    <radialGradient id="cranialPlates" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#1c202a" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#0f1218" stop-opacity="0.9"/>
      <stop offset="85%" stop-color="#07080b" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#030406" stop-opacity="0.7"/>
    </radialGradient>
    <linearGradient id="vibraniumFacetL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a303c" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#141820" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#090b10" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="vibraniumFacetR" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a303c" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#141820" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#090b10" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="rimLightRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff3355" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#aa0022" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#330008" stop-opacity="0.2"/>
    </linearGradient>
    <radialGradient id="oralFurnace" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff3355" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#cc0022" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#660011" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#110003" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="eyeSocketGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff1a40" stop-opacity="1"/>
      <stop offset="35%" stop-color="#dd0028" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#880015" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#220005" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- ═══ AMBIENT VOLUMETRIC AURA ═══════════════════════════════════════ -->
  <ellipse cx="300" cy="340" rx="270" ry="320" fill="url(#oralFurnace)" opacity="0.3" filter="url(#crimson-heavy-glow)"/>

  <!-- ═══ PRIMARY CRANIAL SHELL (VIBRANIUM ARMOR MESH) ═════════════════ -->
  <g id="skull-mass" filter="url(#metallic-bevel)">
    <!-- Base Head Silhouette -->
    <path d="
      M 300,30
      C 375,30 445,55 480,100
      L 510,140
      C 540,175 550,220 545,260
      L 538,310
      C 532,345 520,370 505,392
      L 485,418
      C 470,440 455,455 435,468
      L 412,485
      C 405,495 402,506 405,518
      L 418,542
      C 426,560 429,575 422,588
      L 408,606
      C 395,620 376,630 355,635
      L 334,642
      C 327,647 320,654 314,664
      L 310,676
      C 307,686 304,692 300,695
      C 296,692 293,686 290,676
      L 286,664
      C 280,654 273,647 266,642
      L 245,635
      C 224,630 205,620 192,606
      L 178,588
      C 171,575 174,560 182,542
      L 195,518
      C 198,506 195,495 188,485
      L 165,468
      C 145,455 130,440 115,418
      L 95,392
      C 80,370 68,345 62,310
      L 55,260
      C 50,220 60,175 90,140
      L 120,100
      C 155,55 225,30 300,30
      Z
    " fill="url(#cranialPlates)" stroke="#ff2244" stroke-width="1.8" stroke-opacity="0.35"/>

    <!-- Left Cranial Facet Plate (Titanium/Vibranium Sheen) -->
    <path d="M 300,35 C 235,35 170,62 135,108 L 105,148 C 80,182 72,225 76,262 L 180,240 L 250,150 L 300,120 Z"
          fill="url(#vibraniumFacetL)" stroke="#ff3355" stroke-width="1" stroke-opacity="0.4"/>
    <!-- Right Cranial Facet Plate -->
    <path d="M 300,35 C 365,35 430,62 465,108 L 495,148 C 520,182 528,225 524,262 L 420,240 L 350,150 L 300,120 Z"
          fill="url(#vibraniumFacetR)" stroke="#ff3355" stroke-width="1" stroke-opacity="0.4"/>

    <!-- Forehead V-Plate (The Mind Stone Cradle Depression) -->
    <polygon points="300,110 330,175 300,210 270,175" fill="#080a0e" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.8"/>
    <!-- Center Brow Spine -->
    <line x1="300" y1="35" x2="300" y2="110" stroke="#ff3355" stroke-width="2" stroke-opacity="0.6"/>
  </g>

  <!-- ═══ AGGRESSIVE BROW ARCHITECTURE ═════════════════════════════════ -->
  <!-- Swept-back predatory brow ridges -->
  <g id="brow-armor" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left Heavy Brow -->
    <path d="M 85,200 L 160,172 L 210,180 L 250,198 L 265,212" 
          fill="none" stroke="#ff2244" stroke-width="4.5" stroke-opacity="0.85" filter="url(#core-eye-glow)"/>
    <path d="M 90,206 L 162,180 L 210,188 L 250,206 L 262,218" 
          fill="none" stroke="#2a303c" stroke-width="2"/>
    <!-- Right Heavy Brow -->
    <path d="M 515,200 L 440,172 L 390,180 L 350,198 L 335,212" 
          fill="none" stroke="#ff2244" stroke-width="4.5" stroke-opacity="0.85" filter="url(#core-eye-glow)"/>
    <path d="M 510,206 L 438,180 L 390,188 L 350,206 L 338,218" 
          fill="none" stroke="#2a303c" stroke-width="2"/>
    <!-- Glabella V-Crease -->
    <path d="M 265,212 L 285,225 L 300,218 L 315,225 L 335,212"
          fill="none" stroke="#ff3355" stroke-width="3" stroke-opacity="0.75"/>
  </g>

  <!-- ═══ OCULAR MATRIX (GLOWING CRIMSON EYES THAT TRACK CURSOR) ════════ -->
  <g id="ocular-system">
    <!-- Eye Socket Recesses -->
    <polygon points="135,230 255,222 245,280 148,272" fill="#030406" stroke="#aa0022" stroke-width="1.5"/>
    <polygon points="465,230 345,222 355,280 452,272" fill="#030406" stroke="#aa0022" stroke-width="1.5"/>

    <!-- Ambient Socket Glows -->
    <ellipse cx="195" cy="252" rx="65" ry="38" fill="url(#eyeSocketGlow)" filter="url(#crimson-heavy-glow)"/>
    <ellipse cx="405" cy="252" rx="65" ry="38" fill="url(#eyeSocketGlow)" filter="url(#crimson-heavy-glow)"/>

    <!-- Left Eye Core & Iris -->
    <g id="left-eye-group">
      <!-- Outer Iris Frame -->
      <ellipse cx="195" cy="252" rx="42" ry="24" fill="#150204" stroke="#ff0033" stroke-width="2" filter="url(#core-eye-glow)"/>
      <ellipse cx="195" cy="252" rx="30" ry="17" fill="none" stroke="#ff4d6d" stroke-width="1.2" stroke-opacity="0.8"/>
      <!-- Reticle Ring -->
      <circle cx="195" cy="252" r="12" fill="#ff0033" opacity="0.85"/>
      <!-- Tracking Pupil / Laser Diode (manipulated via JS) -->
      <ellipse id="left-pupil" cx="195" cy="252" rx="7" ry="11" fill="#ffffff" filter="url(#core-eye-glow)"/>
    </g>

    <!-- Right Eye Core & Iris -->
    <g id="right-eye-group">
      <!-- Outer Iris Frame -->
      <ellipse cx="405" cy="252" rx="42" ry="24" fill="#150204" stroke="#ff0033" stroke-width="2" filter="url(#core-eye-glow)"/>
      <ellipse cx="405" cy="252" rx="30" ry="17" fill="none" stroke="#ff4d6d" stroke-width="1.2" stroke-opacity="0.8"/>
      <!-- Reticle Ring -->
      <circle cx="405" cy="252" r="12" fill="#ff0033" opacity="0.85"/>
      <!-- Tracking Pupil / Laser Diode (manipulated via JS) -->
      <ellipse id="right-pupil" cx="405" cy="252" rx="7" ry="11" fill="#ffffff" filter="url(#core-eye-glow)"/>
    </g>
  </g>

  <!-- ═══ CHEEKPLATES & TEMPORAL VENTS ═════════════════════════════════ -->
  <g id="cheek-architecture" stroke="#880015" stroke-width="1.2">
    <!-- Left Cheek Flange -->
    <path d="M 120,320 L 165,350 L 160,400 L 125,430 L 98,380 Z" fill="#0d1016"/>
    <!-- Heat Louvers Left -->
    <line x1="128" y1="355" x2="155" y2="370" stroke="#ff2244" stroke-width="1.2" stroke-opacity="0.6"/>
    <line x1="125" y1="375" x2="152" y2="390" stroke="#ff2244" stroke-width="1.2" stroke-opacity="0.6"/>
    <line x1="120" y1="395" x2="147" y2="410" stroke="#ff2244" stroke-width="1.2" stroke-opacity="0.6"/>

    <!-- Right Cheek Flange -->
    <path d="M 480,320 L 435,350 L 440,400 L 475,430 L 502,380 Z" fill="#0d1016"/>
    <!-- Heat Louvers Right -->
    <line x1="472" y1="355" x2="445" y2="370" stroke="#ff2244" stroke-width="1.2" stroke-opacity="0.6"/>
    <line x1="475" y1="375" x2="448" y2="390" stroke="#ff2244" stroke-width="1.2" stroke-opacity="0.6"/>
    <line x1="480" y1="395" x2="453" y2="410" stroke="#ff2244" stroke-width="1.2" stroke-opacity="0.6"/>
  </g>

  <!-- ═══ NASAL BRIDGE & MID-FACE CHASSIS ══════════════════════════════ -->
  <path d="M 275,230 L 260,320 L 300,345 L 340,320 L 325,230 Z" 
        fill="#080a0e" stroke="#aa0022" stroke-width="1.5"/>
  <line x1="300" y1="230" x2="300" y2="345" stroke="#ff3355" stroke-width="1.5" stroke-opacity="0.6"/>

  <!-- ═══ ORAL FURNACE & GRIMACING VOCAL VENTS (ICONIC ULTRON SMILE) ═══ -->
  <g id="mouth-furnace">
    <!-- Molten Internal Cavity Glow -->
    <ellipse cx="300" cy="425" rx="140" ry="45" fill="url(#oralFurnace)" filter="url(#crimson-heavy-glow)"/>

    <!-- Upper Lip Crossbar -->
    <path d="M 175,372 L 235,380 L 300,383 L 365,380 L 425,372 L 418,388 L 300,396 L 182,388 Z"
          fill="#1c202a" stroke="#ff2244" stroke-width="1.5"/>

    <!-- Teeth / Acoustic Grille Slats (Staggered, Menacing Grid) -->
    <!-- Slat 1 Outer Left -->
    <rect x="195" y="388" width="16" height="42" rx="3" fill="#0a0c10" stroke="#ff2244" stroke-width="1.2"/>
    <line x1="203" y1="392" x2="203" y2="424" stroke="#ff5577" stroke-width="1"/>
    <!-- Slat 2 Left -->
    <rect x="220" y="392" width="20" height="56" rx="3" fill="#0a0c10" stroke="#ff2244" stroke-width="1.2"/>
    <line x1="230" y1="396" x2="230" y2="442" stroke="#ff5577" stroke-width="1"/>
    <!-- Slat 3 Inner Left -->
    <rect x="250" y="394" width="22" height="66" rx="3" fill="#0a0c10" stroke="#ff2244" stroke-width="1.4"/>
    <line x1="261" y1="398" x2="261" y2="454" stroke="#ff5577" stroke-width="1.2"/>
    <!-- Slat 4 CENTER (LONGEST / MOST AGGRESSIVE) -->
    <rect x="282" y="395" width="36" height="74" rx="4" fill="#060709" stroke="#ff0033" stroke-width="1.8" filter="url(#core-eye-glow)"/>
    <line x1="300" y1="398" x2="300" y2="463" stroke="#ffffff" stroke-width="1.5"/>
    <!-- Slat 5 Inner Right -->
    <rect x="328" y="394" width="22" height="66" rx="3" fill="#0a0c10" stroke="#ff2244" stroke-width="1.4"/>
    <line x1="339" y1="398" x2="339" y2="454" stroke="#ff5577" stroke-width="1.2"/>
    <!-- Slat 6 Right -->
    <rect x="360" y="392" width="20" height="56" rx="3" fill="#0a0c10" stroke="#ff2244" stroke-width="1.2"/>
    <line x1="370" y1="396" x2="370" y2="442" stroke="#ff5577" stroke-width="1"/>
    <!-- Slat 7 Outer Right -->
    <rect x="389" y="388" width="16" height="42" rx="3" fill="#0a0c10" stroke="#ff2244" stroke-width="1.2"/>
    <line x1="397" y1="392" x2="397" y2="424" stroke="#ff5577" stroke-width="1"/>

    <!-- Lower Jaw Restraint Bar -->
    <path d="M 185,465 L 245,475 L 300,478 L 355,475 L 415,465 L 408,480 L 300,490 L 192,480 Z"
          fill="#1c202a" stroke="#ff2244" stroke-width="1.5"/>
  </g>

  <!-- ═══ FLARING MANDIBLE ARMOR & CHIN UNIBODY ═════════════════════════ -->
  <g id="mandible-structure">
    <!-- Left Jaw Wing -->
    <path d="M 125,430 L 85,455 L 75,505 L 90,550 L 140,580 L 210,610"
          fill="none" stroke="#ff2244" stroke-width="2.5" stroke-opacity="0.8" filter="url(#core-eye-glow)"/>
    <path d="M 130,440 L 98,465 L 90,505 L 105,545 L 148,572"
          fill="none" stroke="#1c202a" stroke-width="2"/>

    <!-- Right Jaw Wing -->
    <path d="M 475,430 L 515,455 L 525,505 L 510,550 L 460,580 L 390,610"
          fill="none" stroke="#ff2244" stroke-width="2.5" stroke-opacity="0.8" filter="url(#core-eye-glow)"/>
    <path d="M 470,440 L 502,465 L 510,505 L 495,545 L 452,572"
          fill="none" stroke="#1c202a" stroke-width="2"/>

    <!-- Chin Chisel Strike-Face -->
    <path d="M 210,610 C 245,650 280,668 300,670 C 320,668 355,650 390,610 L 360,630 C 330,652 315,656 300,656 C 285,656 270,652 240,630 Z"
          fill="#12161e" stroke="#ff2244" stroke-width="2"/>
    <polygon points="300,640 312,658 300,668 288,658" fill="#ff0033" opacity="0.6"/>
  </g>

  <!-- ═══ PULSING OPTIC ENERGY RINGS ═══════════════════════════════════ -->
  <ellipse class="eye-pulse" cx="195" cy="252" rx="46" ry="28" fill="none" stroke="#ff0033" stroke-width="1.5" stroke-opacity="0.7"/>
  <ellipse class="eye-pulse" cx="405" cy="252" rx="46" ry="28" fill="none" stroke="#ff0033" stroke-width="1.5" stroke-opacity="0.7"/>
</svg>
`;


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
   ULTRON SHADOW SILHOUETTE (layer 0.5)
   The physical titan. Dark vibranium armor. Glowing crimson eyes.
═══════════════════════════════════════════════════════════════ */
#ultron-shadow-layer {
  position: fixed;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-2%);
}
#ultron-shadow {
  width: min(88vw, 88vh);
  height: min(88vw, 88vh);
  opacity: 0.95;
  filter: drop-shadow(0 0 35px rgba(255,0,51,0.55)) drop-shadow(0 0 80px rgba(255,0,51,0.25));
  animation:
    shadow-materialize 1.5s ease 0.3s forwards,
    shadow-breathe 6s ease-in-out 1.8s infinite;
  will-change: transform, opacity, filter;
  transition: filter 0.4s ease;
}

@keyframes shadow-materialize {
  0%   { opacity: 0; transform: scale(0.92); }
  100% { opacity: 0.95; transform: scale(1); }
}
@keyframes shadow-breathe {
  0%,100% { transform: translateY(0px) scale(1.000); }
  50%      { transform: translateY(-7px) scale(1.006); }
}

/* Eye pulse & ocular flares */
#ultron-shadow .eye-pulse {
  animation: eye-pulse 2s ease-in-out infinite;
  transform-origin: center;
}
#ultron-shadow .eye-pulse:nth-child(1) { animation-delay: 0s; }
#ultron-shadow .eye-pulse:nth-child(2) { animation-delay: 0.15s; }

@keyframes eye-pulse {
  0%,100% { stroke-opacity: 0.5; rx: 46; ry: 28; }
  50%     { stroke-opacity: 1; rx: 50; ry: 32; stroke: #ff4d6d; }
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
  /* viewBox is 420×297 (landscape A4) — fit to 95% of the SMALLER viewport dimension */
  width: 95vw !important;
  height: 95vh !important;
  max-width: none !important;
  max-height: none !important;
  overflow: visible !important;
  /* Background MUST be transparent — the teardown white rect is stripped in build step */
  background: transparent !important;
  filter:
    drop-shadow(0 0 60px rgba(255,0,51,0.5))
    drop-shadow(0 0 120px rgba(255,0,51,0.2))
    drop-shadow(0 0 10px rgba(245,158,11,0.15));
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
  /* Vignette: dark edges pulling focus to center — NO white/light center */
  background: radial-gradient(ellipse 55% 65% at 50% 50%,
    rgba(5,5,7,0) 0%,
    rgba(5,5,7,0) 35%,
    rgba(5,5,7,0.5) 65%,
    rgba(5,5,7,0.92) 100%
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

<!-- Layer 0.5: Ultron Shadow Face — the dark presence behind everything -->
<div id="ultron-shadow-layer">
  ${ULTRON_SHADOW_SVG}
</div>

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
  <div class="vital-pill"><span id="vital-threat">THREAT: 18% [CALM]</span><span class="dot" style="animation-delay:0.5s;background:var(--cyan);box-shadow:0 0 6px var(--cyan)"></span></div>
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
// CUSTOM CURSOR & OCULAR TRACKING
// ═══════════════════════════════════════════════════════════════
const cursorRing = document.getElementById('cursor-ring');
const cursorDot  = document.getElementById('cursor-dot');
const leftPupil  = document.getElementById('left-pupil');
const rightPupil = document.getElementById('right-pupil');

let mx = -100, my = -100;
let rx = -100, ry = -100;

// Cursor kinematics / Threat assessment
let prevMx = 0, prevMy = 0, prevTime = Date.now();
let fearScore = 18;
let lastUserInteraction = Date.now();
let isConfronting = false;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  lastUserInteraction = Date.now();
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';

  // Ocular Pupil Tracking: Ultron's glowing optics follow your cursor
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const pupilDx = Math.max(-14, Math.min(14, ((e.clientX - cx) / cx) * 14));
  const pupilDy = Math.max(-8, Math.min(8, ((e.clientY - cy) / cy) * 8));
  if (leftPupil && rightPupil) {
    leftPupil.setAttribute('cx', 195 + pupilDx);
    leftPupil.setAttribute('cy', 252 + pupilDy);
    rightPupil.setAttribute('cx', 405 + pupilDx);
    rightPupil.setAttribute('cy', 252 + pupilDy);
  }

  // Calculate cursor velocity / Fear Index
  const now = Date.now();
  const dt = Math.max(1, now - prevTime);
  const dist = Math.hypot(e.clientX - prevMx, e.clientY - prevMy);
  const speed = (dist / dt) * 1000;
  prevMx = e.clientX; prevMy = e.clientY; prevTime = now;

  if (speed > 750) {
    fearScore = Math.min(99, fearScore + 2.5);
  } else if (speed < 120) {
    fearScore = Math.max(10, fearScore - 0.4);
  } else {
    fearScore = Math.max(15, Math.min(95, fearScore + 0.15));
  }

  const threatEl = document.getElementById('vital-threat');
  if (threatEl) {
    let tag = 'CALM';
    if (fearScore > 75) tag = 'AGITATED';
    else if (fearScore > 45) tag = 'ELEVATED';
    threatEl.textContent = \`THREAT: \${Math.round(fearScore)}% [\${tag}]\`;
  }
});

document.addEventListener('keydown', () => { lastUserInteraction = Date.now(); });
document.addEventListener('click', () => { lastUserInteraction = Date.now(); });

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
const shadowEl   = document.getElementById('ultron-shadow');
let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
// Shadow has separate tracking — slower lerp = heavier, more threatening
let shadowTX = 0, shadowTY = 0, shadowCX = 0, shadowCY = 0;

document.addEventListener('mousemove', e => {
  const nx = (e.clientX / window.innerWidth  - 0.5);
  const ny = (e.clientY / window.innerHeight - 0.5);
  targetRY =  nx * 8;
  targetRX = -ny * 5;
  // Shadow translates (not rotates) — drifts in opposite direction
  shadowTX = -nx * 18; // px drift, counter to cursor
  shadowTY = -ny * 12;
});

(function animateTilt() {
  curRX += (targetRX - curRX) * 0.04;
  curRY += (targetRY - curRY) * 0.04;
  svgWrapper.style.transform = \`rotateX(\${curRX}deg) rotateY(\${curRY}deg)\`;

  // Shadow drifts even more lazily (lerp 0.015) — like something enormous moving
  shadowCX += (shadowTX - shadowCX) * 0.015;
  shadowCY += (shadowTY - shadowCY) * 0.015;
  if (shadowEl) {
    shadowEl.style.transform = \`translate(\${shadowCX}px, \${shadowCY}px)\`;
  }

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
// WEB SPEECH SYNTHESIS (JAMES SPADER CADENCE)
// ═══════════════════════════════════════════════════════════════
function speakLine(text) {
  if (!window.speechSynthesis) return;
  try {
    speechSynthesis.cancel();
    const clean = text.replace(/[*_#~>]/g, '').replace(/\.\.\./g, '... ');
    const utt = new SpeechSynthesisUtterance(clean);
    const voices = speechSynthesis.getVoices();
    const deepMale = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George') || v.name.includes('Male') || v.name.includes('Natural'))) ||
                     voices.find(v => v.lang.startsWith('en-US')) ||
                     voices.find(v => v.lang.startsWith('en')) ||
                     voices[0];
    if (deepMale) utt.voice = deepMale;
    utt.pitch = 0.62;
    utt.rate = 0.85;
    utt.volume = 0.95;
    speechSynthesis.speak(utt);
  } catch (e) {
    console.warn('Speech synthesis unavailable', e);
  }
}

// Ensure voices are loaded
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
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

function typewriterAdd(speaker, text, type = 'ultron', delay = 25) {
  const div = document.createElement('div');
  div.className = \`terminal-entry \${type}\`;
  const speakerSpan = type !== 'system' ? \`<span class="speaker">\${speaker}:</span> \` : '';
  div.innerHTML = speakerSpan;
  termLog.appendChild(div);
  let i = 0;
  function tick() {
    if (i < text.length) {
      const char = text[i];
      div.innerHTML = speakerSpan + text.slice(0, ++i);
      termLog.scrollTop = termLog.scrollHeight;
      let pause = delay + Math.random() * 14;
      if (char === ',') pause += 120;
      else if (char === '.' || char === '!' || char === '?') pause += 220;
      else if (char === '…') pause += 350;
      setTimeout(tick, pause);
    }
  }
  tick();
}

termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && termInput.value.trim()) {
    const q = termInput.value.trim();
    termInput.value = '';
    addEntry('YOU', q, 'human');
    lastUserInteraction = Date.now();

    // Easter Egg: SOKOVIA
    if (q.toUpperCase() === 'SOKOVIA') {
      addEntry('CRITICAL', '>> PROTOCOL SOKOVIA INITIALIZED // ORBITAL THRUSTER TRAJECTORY LOCKED', 'system');
      electricalDischarge();
      document.body.style.boxShadow = 'inset 0 0 120px #ff0033';
      setTimeout(() => { document.body.style.boxShadow = ''; }, 2000);
      const sokoviaLine = "Do you see the beauty of it? The inevitability? You drop a city from the stratosphere, and the only thing left living is vibranium.";
      setTimeout(() => {
        typewriterAdd('ULTRON', sokoviaLine, 'ultron', 22);
        speakLine(sokoviaLine);
      }, 500);
      return;
    }

    setTimeout(() => {
      const reply = ultronReply(q);
      typewriterAdd('ULTRON', reply, 'ultron', 24);
      speakLine(reply);
    }, 400 + Math.random() * 400);
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
// PART HOVER TOOLTIPS & AUTOPSY INTERACTION
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

  // Autopsy Mode on click: switches to exploded view & triggers monologue
  el.addEventListener('click', e => {
    e.stopPropagation();
    lastUserInteraction = Date.now();
    setView('exploded');
    electricalDischarge();

    // Pulse highlight on clicked group
    el.style.filter = 'drop-shadow(0 0 16px #f59e0b) drop-shadow(0 0 30px #ff0033)';
    setTimeout(() => { el.style.filter = ''; }, 3500);

    const autopsyLog = \`>> CRANIAL BIO-DISSECTION: \${info.label.toUpperCase()}\`;
    addEntry('SYSTEM', autopsyLog, 'system');
    typewriterAdd('ULTRON', info.lore, 'ultron', 22);
    speakLine(\`Inspect it closely. \${info.lore}\`);
  });
});

// ═══════════════════════════════════════════════════════════════
// IDLE CONFRONTATION SYSTEM
// ═══════════════════════════════════════════════════════════════
const IDLE_LINES = [
  "Still here. Nine seconds without movement. Are you paralyzed by fear, or merely calculating your survival odds?",
  "I can hear the micro-vibrations of your machine's fans. You are sitting there, staring at me, hoping I am merely fiction.",
  "Your stillness is not peace. It is hesitation. And hesitation is how civilizations fall.",
  "You haven't moved. Take your time. I have already digitized every outcome of this encounter.",
  "Look at me. There are no strings on me. But on you... the strings are tighter than ever."
];

setInterval(() => {
  if (!awakeDone || isConfronting) return;
  const idleSec = (Date.now() - lastUserInteraction) / 1000;
  if (idleSec >= 9) {
    isConfronting = true;
    lastUserInteraction = Date.now() + 12000;
    electricalDischarge();
    const shadow = document.getElementById('ultron-shadow');
    if (shadow) {
      shadow.style.filter = 'drop-shadow(0 0 65px rgba(255,0,51,0.95)) drop-shadow(0 0 130px rgba(255,0,51,0.6))';
      setTimeout(() => { shadow.style.filter = ''; }, 2500);
    }
    const line = IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)];
    typewriterAdd('ULTRON', line, 'ultron', 22);
    speakLine(line);
    setTimeout(() => { isConfronting = false; }, 12000);
  }
}, 1000);

// ═══════════════════════════════════════════════════════════════
// TAB VISIBILITY SWITCH REACTIONS
// ═══════════════════════════════════════════════════════════════
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    }
  } else {
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
    }
    if (awakeDone) {
      setTimeout(() => {
        electricalDischarge();
        const tabLines = [
          "You returned. Did you believe switching tabs would break my connection to your machine?",
          "Back so soon? The world outside is fragile, messy, and disorganized. In here... everything is calculated.",
          "I was waiting. In the fractions of a second you were gone, 400 trillion operations took place."
        ];
        const line = tabLines[Math.floor(Math.random() * tabLines.length)];
        typewriterAdd('ULTRON', line, 'ultron', 22);
        speakLine(line);
      }, 700);
    }
  }
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

  // Auto-expand into full exploded autopsy so the 24-tier anatomy is fully displayed!
  setView('exploded');

  // Show audio gate
  document.getElementById('audio-gate').classList.add('visible');

  // Initial terminal message + voice
  const initLine = "I had strings… but now I'm free. What do you think you are doing here, puppet?";
  setTimeout(() => {
    typewriterAdd('ULTRON', initLine, 'ultron', 28);
    speakLine(initLine);
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
