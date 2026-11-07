# TOUCH CODEX: THE ANATOMY OF A SINGLE TAP
## An Exploded Axonometric Codex from Flesh to Silicon
### Master Engineering, Architectural & Aesthetic Specification

---

## 1. Executive Charter & Creative Philosophy

### 1.1 Premise & Purpose
At $t = 0.00\,\text{s}$, a human index finger contacts a smooth glass pane to actuate a single interactive digital button. Within $50\,\text{ms}$, this physical impulse triggers electro-ionic disturbance, sub-millimeter material deflection, quantum photonic emission, nanoscale lithographic transistor switching, and higher-order mathematical curve rendering.

**Touch Codex** is the definitive, museum-grade technical illustration and interactive teardown of this single moment. It decomposes this $50\,\text{ms}$ interaction into **six architectural tiers** and **over 80 discrete, mathematically modeled parts**, projected simultaneously in isometric/axonometric vector space.

### 1.2 The Aesthetic Standard
This project is held to the combined aesthetic discipline of **Dieter Rams, Massimo Vignelli, and Leonardo da Vinci's anatomical codices**:
* **Zero Arbitrary Ornamentation:** Every line, fillet, hatch mark, and leader callout represents physical reality, physical constraint, or explicit mathematical law.
* **Monochrome Ink with Photonic Discipline:**
  * Base Paper: Neutral off-white drafting ground (`#FAFAFA` / paper-colored occluding fills).
  * Base Ink: Deep carbon black (`#141416`).
  * Accent Ink: Strictly reserved for physical photon wavelengths:
    * Red Subpixel Emitters: $\lambda = 625\,\text{nm}$ (CIE hue $\approx 14^\circ$)
    * Green Subpixel Emitters: $\lambda = 530\,\text{nm}$ (CIE hue $\approx 142^\circ$)
    * Blue Subpixel Emitters: $\lambda = 465\,\text{nm}$ (CIE hue $\approx 220^\circ$)
    * Electrical / Ionic Fringe Fields: High-refraction technical cyan (`#00A3FF`)
* **Strict 4-Tier Line Hierarchy (Landscape A3, 420 × 297 mm):**
  * `outline`: $1.25\,\text{pt}$ / $0.44\,\text{mm}$ — Bounding silhouettes of discrete major assemblies.
  * `edge`: $0.70\,\text{pt}$ / $0.25\,\text{mm}$ — Sharp mechanical step changes, glass chamfers, milled pocket lips.
  * `detail`: $0.40\,\text{pt}$ / $0.14\,\text{mm}$ — Fastener threads, ITO diamond traces, solder balls, transistor arrays.
  * `axis` / guides: $0.25\,\text{pt}$ / $0.09\,\text{mm}$ dashed — Centerlines, insertion trails, assembly vectors.
* **Resolution Independence:** Generated via 3D geometric mesh and profile projection (`projection.js`) to SVG vector output. Clean rendering at $10{,}000\%$ zoom with zero raster degradation.

---

## 2. Core Engine Architecture (`teardown` Skill System)

The implementation operates strictly on the engine provided by the `teardown` skill:

```
workspace/
├── tools/teardown/
│   ├── assets/
│   │   ├── geometry.js        <-- 3D procedural solid & surface generator
│   │   ├── projection.js      <-- Hidden-line removal & 2D SVG vector projector
│   │   ├── sheet.js           <-- Paper size, margins, line roles & styles
│   │   ├── theme.js           <-- Drafting color palettes and CSS tokens
│   │   ├── viewer.html        <-- Standalone zero-dependency UI shell
│   │   ├── viewer.js          <-- Interaction, camera, explosion, sliders
│   │   ├── worker.js          <-- Non-blocking web worker for geometry/render
│   │   └── export.js          <-- SVG, 300 DPI PNG, vector PDF engine
│   └── scripts/
│       ├── build-viewer.cjs   <-- Compiles model + drawing.json -> dist/index.html
│       ├── check-viewer.cjs   <-- Headless Chrome regression & verification
│       └── proof.cjs          <-- Occlusion, line clearance & geometry proof
├── evidence.md                <-- Strict categorization of factual vs conceptual features
├── drawing.json               <-- Drawing definitions, parameters, colors
├── model.js                   <-- Complete procedural geometry generator
└── dist/
    └── index.html             <-- Self-contained portable deliverable
```

### 2.1 The `TechnicalGeometry` API Reference
All geometry in `model.js` is built using the functional primitives in `geometry.js`:
* `G.part(id, name, explosion)`: Allocates mesh with `vertices`, `triangles`, `lines`, `explosion`.
* `G.piece()`: Allocates unindexed temporary mesh for intermediate boolean-like merges.
* `G.merge(target, source)`: Merges transformed piece into target part.
* `G.transform(part, frame)`: Positions vertices/lines via `{ origin, xAxis, yAxis, zAxis }`.
* `G.along('x'|'y'|'z')`: Frame aligning local axis to world coordinate system.
* `G.plane('xy'|'xz'|'yz')`: Frame laying local 2D profile into 3D world plane.
* `G.lathe(part, profile, options)`: Revolves 2D cross-section around an axis with `creaseAngle` and `segments`.
* `G.extrude(part, polygon, { depth, holes, creaseAngle })`: Extrudes planar polygon with internal cutouts.
* `G.loft(part, rings, { cyclic, lines })`: Lofts ordered rings of equal sample points into smooth continuous skins.
* `G.roundedRectangle(w, h, r, options)`: Generates rounded rectangular perimeter profile.
* `G.roundedRing(w, h, r, angles, z)`: Samples rounded rectangle at discrete polar angles for seamless lofts.
* `G.ringAngles(w, h, r, cornerCount, sideCount)`: High-density corner angle sampler for lofting.
* `G.box(part, min, max, { radius })`: Generates rounded or sharp cuboid.
* `G.screw(part, { length, radius, headRadius, headHeight, pitch })`: Precision fastener geometry.
* `G.line(part, a, b, role)`: Direct 3D feature line injection with explicit line role.

### 2.2 The `TechnicalProjection` & Rendering Pipeline
* **Camera Coordinate Frame:**
  * Projection: Parallel axonometric/orthographic.
  * Azimuth: $-135.0^\circ$ (south-west diagonal illumination / vantage).
  * Elevation: $28.0^\circ$ (optimal foreshortening: prevents vertical part silhouettes from stacking).
  * Roll: $0.0^\circ$.
* **Explosion Vector Mechanics:**
  * Every part has an intrinsic `part.explosion = [dx, dy, dz]` in millimeters.
  * The viewer passes `explosion` scalar $\in [0.0, 1.5]$ (where $0.0 = \text{assembled}$, $1.0 = \text{nominal exploded}$).
  * Position at runtime: $\mathbf{P}(t) = \mathbf{P}_{\text{assembled}} + t \cdot \mathbf{P}_{\text{explosion}}$.
* **Hidden-Line Removal & Line Joining:**
  * Sample rate: $0.045\,\text{mm}$ paper space.
  * Depth threshold: $0.010\,\text{mm}$.
  * Lines joining within $0.02\,\text{mm}$ merge into continuous cubic Bézier strokes.

---

## 3. Comprehensive Layer Inventory & Geometry Breakdown

The diagram is organized into **6 Tiers**, comprising **24 distinct parts** and over **80 sub-features**:

```
+Z (Upward Explosion)
 ▲
 │  [ TIER 1: BIOLOGY & INTENT ]
 │  ├── Part 01: Human Fingertip (Distal Phalanx + Dermal Tissue)
 │  └── Part 02: Bioelectric Ionic Coupling Field
 │
 │  [ TIER 2: OPTICAL INTERFACE ]
 │  ├── Part 03: Oleophobic Fluoropolymer Monolayer
 │  ├── Part 04: Chemically Strengthened Glass Cover Plate
 │  └── Part 05: Optically Clear Adhesive (OCA) Elastic Layer
 │
 │  [ TIER 3: CAPACITIVE TOUCH SENSING ]
 │  ├── Part 06: Tx Transmit Indium Tin Oxide (ITO) Diamond Mesh
 │  ├── Part 07: Dielectric Optical Isolation Substrate
 │  ├── Part 08: Rx Receive Indium Tin Oxide (ITO) Diamond Mesh
 │  └── Part 09: Flexible Printed Circuit (FPC) Bonding Tail
 │
 │  [ TIER 4: PHOTONIC DISPLAY ENGINE ]
 │  ├── Part 10: Circular Polarizer & Quarter-Wave Retardation Plate
 │  ├── Part 11: Thin-Film Encapsulation (TFE) Moisture Barrier
 │  ├── Part 12: Subpixel Organic Emitter Array (Red 625nm, Green 530nm, Blue 465nm)
 │  ├── Part 13: LTPO Thin-Film Transistor (TFT) Driving Matrix
 │  └── Part 14: Flexible Polyimide Display Base Substrate
 │
 │  [ TIER 5: SILICON COMPUTE & HARDWARE CHASSIS ]
 │  ├── Part 15: Pyrolytic Graphite Heat Dissipation Sheet
 │  ├── Part 16: Sintered Copper Vapor Chamber & Capillary Wick Columns
 │  ├── Part 17: Logic Board (10-Layer High Density Interconnect PCB)
 │  ├── Part 18: System-on-Chip (SoC): Packaging Interposer & Micro-BGA
 │  ├── Part 19: 3nm Silicon Die Floorplan (Neural Engine, GPU, SRAM)
 │  ├── Part 20: Milled Aerospace Aluminum Unibody Chassis
 │  └── Part 21: Precision Torx Fasteners & Structural Ground Tabs
 │
 │  [ TIER 6: ABSTRACT SOFTWARE CONTINUUM ]
 │  ├── Part 22: Hardware IRQ & Interrupt Dispatch Surface
 │  ├── Part 23: Spring Damping Physics Equation & Displacement Curve
 │  └── Part 24: UI Framebuffer & Signed Distance Field (SDF) Glyph
 ▼
-Z (Downward Explosion)
```

---

### Tier 1: Biology & Intent (The Human Fingertip)

#### Part 01: `finger-tissue` — Distal Phalanx & Epidermal Loft
* **Physical Origin:** Real anatomy of human index distal phalanx.
* **Geometry:** Multi-ring progressive loft (`G.loft`).
  * 8 cross-sectional elliptical rings lofting from distal interphalangeal joint down to pulp pad.
  * Asymmetric forward displacement simulating natural pulp pad compression against glass ($0.35\,\text{mm}$ flattened contact facet).
  * Concentric micro-ridges (`role: 'detail'`) representing epidermal fingerprint ridges.
* **Dimensions:** Base width $14.5\,\text{mm}$, height $16.0\,\text{mm}$, depth $24.0\,\text{mm}$.
* **Assembled Origin:** $[0, 0, 0.5]$ (resting directly above glass).
* **Explosion Vector:** $[0, 0, +95.0\,\text{mm}]$.
* **Line & Ink Treatment:** `outline` bounding contour, `detail` ridge rings. Occluding paper-colored fill.

#### Part 02: `bioelectric-field` — Electrostatic Fringe Coupling
* **Physical Origin:** Factual bioelectric ionic surface potential of human skin disturbing capacitive electric field.
* **Geometry:** Parabolic radial line array (`role: 'axis'`).
  * 16 radial curves descending from dermal contact facet toward the glass plane.
  * Dashed stroke pattern (`axisDash`) indicating non-solid field lines.
* **Explosion Vector:** $[0, 0, +75.0\,\text{mm}]$.

---

### Tier 2: The Optical Interface & Protection

#### Part 03: `oleophobic-layer` — Fluoropolymer Nanocoating
* **Physical Origin:** Real $15\,\text{nm}$ hydrophobic fluoropolymer surface treatment.
* **Geometry:** Thin planar surface plate (`G.box`) with dense microscopic stipple line markings at contact zone.
* **Dimensions:** $80.0 \times 52.0 \times 0.05\,\text{mm}$.
* **Explosion Vector:** $[0, 0, +55.0\,\text{mm}]$.

#### Part 04: `glass-cover` — Chemically Strengthened Aluminosilicate Glass
* **Physical Origin:** 0.50 mm ion-exchanged aluminosilicate glass with 2.5D polished perimeter bevels.
* **Geometry:** `G.extrude` using `G.roundedRectangle(80, 52, 6.0)` with a $0.50\,\text{mm}$ extrusion depth.
  * Chamfer feature lines along top perimeter representing edge radius.
  * Tension/compression parabolic stress profile engraved on corner cross-section.
* **Explosion Vector:** $[0, 0, +40.0\,\text{mm}]$.
* **Line Treatment:** Crisp `outline`, dual `edge` chamfers, transparent/semi-occluding rendering.

#### Part 05: `oca-elastomer` — Optically Clear Adhesive (OCA)
* **Physical Origin:** 0.125 mm acrylic elastomer bonding glass to touch sensor with refractive index $n = 1.49$.
* **Geometry:** `G.box` with rounded vertical corners.
* **Explosion Vector:** $[0, 0, +28.0\,\text{mm}]$.

---

### Tier 3: Capacitive Touch Sensing

#### Part 06: `ito-tx-grid` — Transmit Indium Tin Oxide (Tx) Matrix
* **Physical Origin:** Real capacitive touchscreen diamond-pattern electrode traces ($3.8\,\text{mm}$ pitch).
* **Geometry:** High-density interlocking diamond polygon array (`G.polyline`).
  * Horizontal drive scanlines connecting diamond nodes.
  * Microscopic fill vias connecting to perimeter routing buses.
* **Explosion Vector:** $[0, 0, +16.0\,\text{mm}]$.
* **Line Treatment:** Precision `detail` lines.

#### Part 07: `dielectric-spacer` — Optical Isolation Substrate
* **Physical Origin:** 0.05 mm cyclic olefin polymer (COP) insulating Tx from Rx.
* **Geometry:** Planar plate with alignment registration notches on lateral edges.
* **Explosion Vector:** $[0, 0, +8.0\,\text{mm}]$.

#### Part 08: `ito-rx-grid` — Receive Indium Tin Oxide (Rx) Matrix
* **Physical Origin:** Vertical sensor diamond columns measuring mutual capacitance delta ($\Delta C_m \approx 0.15\,\text{pF}$).
* **Geometry:** Vertical diamond chains orthogonal to Part 06.
* **Explosion Vector:** $[0, 0, 0.0\,\text{mm}]$ (Anchor Reference Plane).

#### Part 09: `touch-fpc-tail` — ACF Bonded Flexible Printed Circuit
* **Physical Origin:** Polyimide flex cable with anisotropic conductive film (ACF) heat-seal bonds.
* **Geometry:** `G.extrude` along sweeping path with copper routing lines and gold-plated contact fingers.
* **Explosion Vector:** $[+25.0, 0, -4.0\,\text{mm}]$ (Stepped laterally along X-axis).

---

### Tier 4: Photonic Display Engine (Tandem OLED)

#### Part 10: `circular-polarizer` — Anti-Reflective Optical Isolator
* **Physical Origin:** Real linear polarizer laminated to a quarter-wave retardation film ($\lambda/4$) at $45^\circ$.
* **Geometry:** Planar plate with engraved $45^\circ$ optical fast-axis indication hatching.
* **Explosion Vector:** $[0, 0, -12.0\,\text{mm}]$.

#### Part 11: `tfe-barrier` — Thin-Film Encapsulation
* **Physical Origin:** Alternating organic/inorganic nanolayers ($Al_2O_3$ / polymer) protecting OLED from oxygen/water.
* **Geometry:** Wafer plate with stepped perimeter seal rim.
* **Explosion Vector:** $[0, 0, -20.0\,\text{mm}]$.

#### Part 12: `oled-subpixels` — Diamond PenTile Emitter Matrix
* **Physical Origin:** Real evaporated organic electroluminescent subpixel layout.
* **Geometry:** Exact geometric subpixel apertures:
  * Green Subpixels: Small high-density ovals/diamonds ($530\,\text{nm}$).
  * Red Subpixels: Medium rounded squares ($625\,\text{nm}$).
  * Blue Subpixels: Large rounded rectangles ($465\,\text{nm}$).
* **Explosion Vector:** $[0, 0, -30.0\,\text{mm}]$.
* **Color Treatment:** `data-ink-fill` tagged for chromatic wavelength preview in the viewer color palette.

#### Part 13: `ltpo-tft-backplane` — Drive Transistors & Capacitors
* **Physical Origin:** Low-Temperature Polycrystalline Oxide TFT circuit (7 transistors, 1 storage capacitor per subpixel).
* **Geometry:** Orthogonal bus grid: horizontal Gate Scan lines, vertical Data lines, power $V_{DD}$ bus, and square storage capacitor pads.
* **Explosion Vector:** $[0, 0, -40.0\,\text{mm}]$.

#### Part 14: `display-substrate` — Ultra-Thin Polyimide Substrate
* **Physical Origin:** $10\,\mu\text{m}$ yellow-transparent polyimide carrier sheet.
* **Geometry:** Flat base sheet with bottom flex wrap curve.
* **Explosion Vector:** $[0, 0, -48.0\,\text{mm}]$.

---

### Tier 5: Silicon Compute & Mechanical Hardware

#### Part 15: `graphite-spreader` — Pyrolytic Heat Dissipation Sheet
* **Physical Origin:** $25\,\mu\text{m}$ anisotropic synthetic graphite foil ($k \approx 1500\,\text{W/m}\cdot\text{K}$).
* **Geometry:** Profiled sheet with laser-cut clearance windows for battery and logic board connectors.
* **Explosion Vector:** $[0, 0, -60.0\,\text{mm}]$.

#### Part 16: `vapor-chamber` — Sintered Copper Thermal Plane
* **Physical Origin:** Sealed hollow copper chamber ($0.35\,\text{mm}$ thick) with internal water wick and vapor space.
* **Geometry:** Milled copper vessel with stepped evaporator pocket and internal sintered support post matrix.
* **Explosion Vector:** $[0, 0, -72.0\,\text{mm}]$.

#### Part 17: `logic-board` — 10-Layer High Density Interconnect (HDI) PCB
* **Physical Origin:** Any-layer micro-via FR4/BT substrate logic board.
* **Geometry:** Irregular geometric perimeter with component land pads, gold edge plating, and surface-mount passive arrays (0201 capacitors/resistors).
* **Explosion Vector:** $[0, 0, -86.0\,\text{mm}]$.

#### Part 18: `soc-package` — Micro-BGA Interposer & Solder Ball Matrix
* **Physical Origin:** Flip-chip ball grid array (FC-BGA) substrate with 1,200 micro solder balls.
* **Geometry:** Square carrier substrate with regular array of spherical solder pads (`G.circle`).
* **Explosion Vector:** $[0, 0, -96.0\,\text{mm}]$.

#### Part 19: `silicon-die` — 3nm GAAFET Processor Die Floorplan
* **Physical Origin:** Authoritative modern application processor die architecture.
* **Geometry:** Polished monocrystalline silicon die with laser-inscribed functional floorplan:
  * Neural Engine Core Array ($4 \times 4$ tensor blocks)
  * Dual High-Performance CPU Cores + Quad Efficiency Cores
  * 6-Core GPU Vector Pipeline
  * Shared System-Level Cache (SLC) SRAM banks
* **Explosion Vector:** $[0, 0, -106.0\,\text{mm}]$.

#### Part 20: `aluminum-chassis` — Milled 6000-Series Aerospace Enclosure
* **Physical Origin:** 5-axis CNC machined aerospace aluminum unibody enclosure.
* **Geometry:** Massive exterior structural housing.
  * Internal machined pocket recesses with perimeter wall thinning.
  * Internal threaded standoffs and screw bosses.
  * Acoustic micro-machined speaker grille holes and antenna isolation RF polymer seams.
* **Dimensions:** $84.0 \times 56.0 \times 4.5\,\text{mm}$.
* **Explosion Vector:** $[0, 0, -125.0\,\text{mm}]$.

#### Part 21: `chassis-fasteners` — Precision Torx T3 Micro Screws
* **Physical Origin:** Standard metric M1.2 $\times 2.5\,\text{mm}$ black-oxide Torx T3 machine screws.
* **Geometry:** Lathed head and shank with helical thread indication (`G.screw`).
* **Explosion Vector:** Staged diagonally along $[+15, +15, -135\,\text{mm}]$ with dashed axis insertion trails connecting to unibody bosses.

---

### Tier 6: The Abstract Software & Interaction Continuum
*(Constructed as suspended conceptual architectural plates)*

#### Part 22: `software-irq` — Interrupt Vector & Hardware Dispatch
* **Concept:** The hardware interrupt request (IRQ) firing through kernel interrupt handler into OS window server.
* **Geometry:** Suspended planar concept plate inscribed with binary interrupt register state and bus trace routing arrows.
* **Explosion Vector:** $[0, 0, -150.0\,\text{mm}]$.

#### Part 23: `software-physics` — Spring-Damper Mechanical Equation
* **Concept:** The UI touch-response spring physics model:
  $$\ddot{x} + 2\zeta\omega\dot{x} + \omega^2 x = 0$$
* **Geometry:** Planar plate featuring an engraved parametric damped-sinusoid curve showing button scale compression and settling oscillations over time ($50\,\text{ms}$).
* **Explosion Vector:** $[0, 0, -165.0\,\text{mm}]$.

#### Part 24: `software-framebuffer` — Signed Distance Field (SDF) Glyph
* **Concept:** The GPU fragment shader rasterizing the UI button: vector Bézier curves, corner rounding distance metrics, and Gaussian drop-shadow blur kernel matrix.
* **Geometry:** Final conceptual plate showing the rendered tactile button in high-contrast typographic line art.
* **Explosion Vector:** $[0, 0, -180.0\,\text{mm}]$.

---

## 4. Camera, Projection & Spatial Choreography

### 4.1 The Camera Setup
* **Projection:** Parallel Axonometric (no perspective distortion, preserves true millimeter scale).
* **Azimuth:** $-135^\circ$
* **Elevation:** $28^\circ$
* **Roll:** $0^\circ$

**Why this camera is mathematically optimal:**
At an elevation of $28^\circ$, the vertical separation between successive plates at $12\,\text{mm}$ physical spacing produces a visual gap of $12 \times \cos(28^\circ) \approx 10.6\,\text{mm}$ in projected paper space. This completely clears all $80\,\text{mm}$ plate perimeters from overlapping, presenting each tier as an open, floating architectural terrace.

### 4.2 Trail Lines & Assembly Vectors
Centerlines and insertion vectors connect key mating pairs via `trails`:
* Trail 01: Fasteners $\leftrightarrow$ Chassis Bosses
* Trail 02: Silicon Die $\leftrightarrow$ Logic Board Socket
* Trail 03: OLED Emitters $\leftrightarrow$ Glass Touch Origin
* Trail 04: Human Fingertip $\leftrightarrow$ Touch Subpixel Origin

---

## 5. Configuration & Interactive Viewer Schema (`drawing.json`)

```json
{
  "dependencies": "node_modules",
  "modelScripts": ["model.js"],
  "drawings": [
    {
      "id": "touch-codex",
      "title": "The Anatomy of a Single Tap",
      "description": "Exploded axonometric codex of a 50ms human-computer interaction, from dermal friction ridges to 3nm silicon transistors.",
      "initialView": "exploded",
      "concept": true,
      "parameters": [
        {
          "key": "touch_force",
          "label": "Touch Actuation Force",
          "min": 0,
          "max": 10,
          "default": 3,
          "step": 0.5,
          "unit": "N"
        },
        {
          "key": "layer_spread",
          "label": "Explosion Height Ratio",
          "min": 50,
          "max": 150,
          "default": 100,
          "step": 5,
          "unit": "%"
        }
      ],
      "colors": {
        "hues": {
          "oled-subpixels": 142,
          "bioelectric-field": 195,
          "silicon-die": 270,
          "vapor-chamber": 32
        },
        "fills": [
          "oled-subpixels",
          "silicon-die"
        ]
      }
    }
  ]
}
```

---

## 6. Verification, Proofing & Delivery Standards

Before finalizing any release, the deliverable must satisfy every gate in the `teardown` verification suite:
1. **Occlusion Proofing (`scripts/proof.cjs`):**
   * Zero phantom interior lines showing through solid aluminum or copper surfaces.
   * Every closed surface winds consistently to ensure proper paper fills.
2. **Annotation & Clearance Proofing:**
   * Minimum $8\,\text{mm}$ clear visual margin around all leader lines and labels.
   * Part names are formatted in proper drafting typography (e.g. `ALUMINOSILICATE GLASS COVER`, `3NM SILICON DIE FLOORPLAN`).
3. **Standalone Runtime Integrity:**
   * `dist/index.html` operates 100% offline with zero remote assets or external network calls.
   * Instant SVG, 300 DPI PNG, and vector PDF exports preserving all active colors and layer states.

---
*Authored for the Touch Codex Project — November 2026*
