/**
 * Touch Codex: The Anatomy of a Single Tap
 * Master Procedural 3D Geometric Model
 *
 * Decomposes a 50ms touch interaction into 6 architectural tiers and 24 parts.
 */

(function (root) {
  'use strict';

  self.DrawingModels ??= {};

  self.DrawingModels['touch-codex'] = function (parameters, options) {
    const G = typeof TechnicalGeometry !== 'undefined' ? TechnicalGeometry : require('./tools/teardown/assets/geometry.js');
    const P = typeof TechnicalProjection !== 'undefined' ? TechnicalProjection : require('./tools/teardown/assets/projection.js');

    const touchForce = parameters?.touch_force ?? 3.0;
    const spreadRatio = (parameters?.layer_spread ?? 100) / 100;

    // Base Dimensions (in mm)
    const W = 80.0; // Display Width
    const H = 52.0; // Display Height
    const R = 6.0;  // Corner Radius
    const CHASSIS_W = 84.0;
    const CHASSIS_H = 56.0;
    const CHASSIS_R = 7.0;

    // Helper: generate clean 2D rounded rectangle profile
    function roundRect(w, h, r, cx = 0, cy = 0, pointsPerQuarter = 8) {
      const qx = w / 2 - r;
      const qy = h / 2 - r;
      const pts = [];
      const corners = [
        [qx, -qy, -Math.PI / 2],
        [qx, qy, 0],
        [-qx, qy, Math.PI / 2],
        [-qx, -qy, Math.PI]
      ];
      for (const [x, y, startAngle] of corners) {
        for (let i = 0; i <= pointsPerQuarter; i++) {
          const t = startAngle + (i / pointsPerQuarter) * (Math.PI / 2);
          pts.push([cx + x + r * Math.cos(t), cy + y + r * Math.sin(t)]);
        }
      }
      return pts;
    }

    // Helper: generate plate with thickness
    function createPlate(id, name, explosionZ, thickness, width = W, height = H, radius = R) {
      const p = G.part(id, name, [0, 0, explosionZ * spreadRatio]);
      const profile = roundRect(width, height, radius);
      G.extrude(p, profile, { depth: thickness, creaseAngle: 30 });
      return p;
    }

    const parts = [];
    const trails = [];

    // =========================================================================
    // TIER 1: BIOLOGY & INTENT (The Human Fingertip & Bioelectric Field)
    // =========================================================================

    // Part 01: Human Fingertip Loft
    const finger = G.part('finger-tissue', 'Human Distal Phalanx & Pulp', [0, 0, 95.0 * spreadRatio]);
    {
      const rings = [];
      const numRings = 7;
      const ringPts = 32;
      const compression = Math.min(1.2, 0.2 + touchForce * 0.1);

      for (let i = 0; i < numRings; i++) {
        const u = i / (numRings - 1);
        const z = 0.5 + u * 24.0;
        // Asymmetric pulp pad curvature:
        const rx = 5.5 + Math.sin(u * Math.PI * 0.8) * 4.0;
        const ry = (6.0 + Math.sin(u * Math.PI * 0.8) * 5.0) * (u === 0 ? (1 - compression * 0.2) : 1);
        const cy = -u * 4.0; // slight forward tilt
        const ring = [];
        for (let j = 0; j < ringPts; j++) {
          const t = (j / ringPts) * Math.PI * 2;
          ring.push([rx * Math.cos(t), cy + ry * Math.sin(t), z]);
        }
        rings.push(ring);
      }
      G.loft(finger, rings, { caps: true, lines: 'all', role: 'edge' });

      // Epidermal fingerprint friction ridges (concentric detail ovals on pad)
      for (let r = 1.5; r <= 4.5; r += 0.8) {
        const whorl = [];
        for (let j = 0; j <= 24; j++) {
          const t = (j / 24) * Math.PI * 2;
          whorl.push([r * Math.cos(t), r * 1.3 * Math.sin(t), 0.52]);
        }
        G.polyline(finger, whorl, { role: 'detail' });
      }
    }
    parts.push(finger);

    // Part 02: Bioelectric Ionic Coupling Field
    const bioField = G.part('bioelectric-field', 'Bioelectric Ionic Coupling Field', [0, 0, 75.0 * spreadRatio]);
    {
      const count = 16;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const rTop = 5.0;
        const rBottom = 12.0;
        const xTop = rTop * Math.cos(theta);
        const yTop = rTop * 1.2 * Math.sin(theta);
        const xBottom = rBottom * Math.cos(theta);
        const yBottom = rBottom * 1.2 * Math.sin(theta);
        // Parabolic field curve
        const curvePts = [
          [xTop, yTop, 6.0],
          [xTop * 1.1 + (xBottom - xTop) * 0.4, yTop * 1.1 + (yBottom - yTop) * 0.4, 3.0],
          [xBottom, yBottom, 0.0]
        ];
        G.polyline(bioField, curvePts, { role: 'axis' });
      }
    }
    parts.push(bioField);

    // =========================================================================
    // TIER 2: OPTICAL INTERFACE (Nanocoating & Cover Glass)
    // =========================================================================

    // Part 03: Fluoropolymer Oleophobic Nanocoating
    const oleo = createPlate('oleophobic-layer', 'Fluoropolymer Nanocoating', 55.0, 0.05);
    {
      // Micro-stipple indication in center contact region
      for (let dx = -8; dx <= 8; dx += 2.5) {
        for (let dy = -6; dy <= 6; dy += 2.5) {
          G.line(oleo, [dx - 0.4, dy, 0.06], [dx + 0.4, dy, 0.06], 'detail');
        }
      }
    }
    parts.push(oleo);

    // Part 04: Chemically Strengthened Aluminosilicate Cover Glass
    const glass = createPlate('glass-cover', 'Aluminosilicate Cover Glass (0.5mm)', 40.0, 0.50);
    {
      // 2.5D bevel chamfer lines on perimeter
      const innerBevel = roundRect(W - 1.2, H - 1.2, R - 0.6);
      G.polyline(glass, innerBevel.map(([x, y]) => [x, y, 0.50]), { closed: true, role: 'detail' });
      // Corner tension stress profile markings
      G.line(glass, [W / 2 - R, H / 2, 0.25], [W / 2, H / 2 - R, 0.25], 'axis');
    }
    parts.push(glass);

    // Part 05: Optically Clear Adhesive (OCA)
    const oca = createPlate('oca-elastomer', 'Optically Clear Adhesive (OCA)', 28.0, 0.125, W - 1.0, H - 1.0, R - 0.5);
    parts.push(oca);

    // =========================================================================
    // TIER 3: CAPACITIVE TOUCH SENSING (Tx/Rx Diamond Matrices)
    // =========================================================================

    // Part 06: Transmit ITO Diamond Matrix (Tx)
    const itoTx = G.part('ito-tx-grid', 'Transmit ITO Diamond Matrix (Tx)', [0, 0, 16.0 * spreadRatio]);
    {
      const txPlate = roundRect(W - 2.0, H - 2.0, R - 1.0);
      G.extrude(itoTx, txPlate, { depth: 0.04, role: 'edge' });
      // Diamond electrode rows
      const pitchX = 7.0;
      const pitchY = 7.0;
      for (let y = -18; y <= 18; y += pitchY) {
        G.line(itoTx, [-32, y, 0.05], [32, y, 0.05], 'detail');
        for (let x = -28; x <= 28; x += pitchX) {
          const diamond = [
            [x, y - 2.5, 0.05],
            [x + 2.5, y, 0.05],
            [x, y + 2.5, 0.05],
            [x - 2.5, y, 0.05]
          ];
          G.polyline(itoTx, diamond, { closed: true, role: 'detail' });
        }
      }
    }
    parts.push(itoTx);

    // Part 07: Dielectric Optical Isolation Substrate
    const dielectric = createPlate('dielectric-spacer', 'Optical Isolation Substrate', 8.0, 0.05, W - 2.0, H - 2.0, R - 1.0);
    {
      // Optical registration marks
      for (const [mx, my] of [[-35, 0], [35, 0]]) {
        G.line(dielectric, [mx - 1.5, my, 0.06], [mx + 1.5, my, 0.06], 'axis');
        G.line(dielectric, [mx, my - 1.5, 0.06], [mx, my + 1.5, 0.06], 'axis');
      }
    }
    parts.push(dielectric);

    // Part 08: Receive ITO Diamond Matrix (Rx) - Anchor Plane at Z = 0
    const itoRx = G.part('ito-rx-grid', 'Receive ITO Diamond Matrix (Rx)', [0, 0, 0.0]);
    {
      const rxPlate = roundRect(W - 2.0, H - 2.0, R - 1.0);
      G.extrude(itoRx, rxPlate, { depth: 0.04, role: 'edge' });
      // Vertical orthogonal diamond sensor columns
      const pitchX = 7.0;
      const pitchY = 7.0;
      for (let x = -28; x <= 28; x += pitchX) {
        G.line(itoRx, [x, -20, 0.05], [x, 20, 0.05], 'detail');
        for (let y = -17.5; y <= 17.5; y += pitchY) {
          const diamond = [
            [x, y - 2.2, 0.05],
            [x + 2.2, y, 0.05],
            [x, y + 2.2, 0.05],
            [x - 2.2, y, 0.05]
          ];
          G.polyline(itoRx, diamond, { closed: true, role: 'detail' });
        }
      }
    }
    parts.push(itoRx);

    // Part 09: ACF Bonded Touch FPC Flex Tail (lateral explosion along +X)
    const fpc = G.part('touch-fpc-tail', 'ACF Bonded Touch FPC Flex', [25.0, 0, -4.0 * spreadRatio]);
    {
      const fpcProfile = [
        [37.0, -10.0],
        [46.0, -10.0],
        [46.0, 10.0],
        [37.0, 10.0]
      ];
      G.extrude(fpc, fpcProfile, { depth: 0.10, role: 'edge' });
      // Gold-plated contact fingers
      for (let fy = -8.0; fy <= 8.0; fy += 2.0) {
        G.line(fpc, [43.0, fy, 0.11], [45.5, fy, 0.11], 'detail');
      }
    }
    parts.push(fpc);

    // =========================================================================
    // TIER 4: PHOTONIC DISPLAY ENGINE (Tandem OLED Stack)
    // =========================================================================

    // Part 10: Anti-Reflective Circular Polarizer
    const polarizer = createPlate('circular-polarizer', 'Anti-Reflective Circular Polarizer', -12.0, 0.10, W - 3.0, H - 3.0, R - 1.5);
    {
      // 45-degree optical fast-axis indication lines
      for (let d = -20; d <= 20; d += 8) {
        G.line(polarizer, [d - 10, d - 10, 0.11], [d + 10, d + 10, 0.11], 'detail');
      }
    }
    parts.push(polarizer);

    // Part 11: Thin-Film Encapsulation (TFE)
    const tfe = createPlate('tfe-barrier', 'Thin-Film Encapsulation (TFE)', -22.0, 0.05, W - 3.0, H - 3.0, R - 1.5);
    parts.push(tfe);

    // Part 12: Diamond PenTile OLED Subpixel Emitters
    const oled = G.part('oled-subpixels', 'Diamond PenTile Subpixel Emitters', [0, 0, -34.0 * spreadRatio]);
    {
      const oledBase = roundRect(W - 4.0, H - 4.0, R - 2.0);
      G.extrude(oled, oledBase, { depth: 0.05, role: 'edge' });
      // Diamond PenTile layout of Green, Red, Blue apertures
      const stepX = 5.0;
      const stepY = 5.0;
      for (let x = -26; x <= 26; x += stepX) {
        for (let y = -16; y <= 16; y += stepY) {
          // Green subpixel (small diamond at center)
          const gDiamond = [
            [x, y - 0.7, 0.06],
            [x + 0.7, y, 0.06],
            [x, y + 0.7, 0.06],
            [x - 0.7, y, 0.06]
          ];
          G.polyline(oled, gDiamond, { closed: true, role: 'detail' });

          // Red subpixel (offset top-left)
          const rBox = [
            [x - 1.8, y + 1.2, 0.06],
            [x - 0.8, y + 1.2, 0.06],
            [x - 0.8, y + 2.2, 0.06],
            [x - 1.8, y + 2.2, 0.06]
          ];
          G.polyline(oled, rBox, { closed: true, role: 'detail' });

          // Blue subpixel (offset bottom-right)
          const bBox = [
            [x + 0.8, y - 2.4, 0.06],
            [x + 2.0, y - 2.4, 0.06],
            [x + 2.0, y - 1.2, 0.06],
            [x + 0.8, y - 1.2, 0.06]
          ];
          G.polyline(oled, bBox, { closed: true, role: 'detail' });
        }
      }
    }
    parts.push(oled);

    // Part 13: LTPO Thin-Film Transistor Backplane
    const ltpo = createPlate('ltpo-tft-backplane', 'LTPO Thin-Film Transistor Backplane', -46.0, 0.08, W - 4.0, H - 4.0, R - 2.0);
    {
      // Gate scan lines & storage capacitor array
      for (let y = -18; y <= 18; y += 4.5) {
        G.line(ltpo, [-33, y, 0.09], [33, y, 0.09], 'detail');
      }
      for (let x = -30; x <= 30; x += 6.0) {
        G.line(ltpo, [x, -20, 0.09], [x, 20, 0.09], 'detail');
      }
    }
    parts.push(ltpo);

    // Part 14: Polyimide Base Carrier Film
    const polyimide = createPlate('display-substrate', 'Polyimide Base Carrier Film', -56.0, 0.05, W - 4.0, H - 4.0, R - 2.0);
    parts.push(polyimide);

    // =========================================================================
    // TIER 5: SILICON COMPUTE & HARDWARE CHASSIS
    // =========================================================================

    // Part 15: Pyrolytic Graphite Heat Spreader
    const graphite = createPlate('graphite-spreader', 'Pyrolytic Graphite Heat Spreader', -68.0, 0.06, W - 3.0, H - 3.0, R - 1.5);
    parts.push(graphite);

    // Part 16: Sintered Copper Vapor Chamber
    const vapor = createPlate('vapor-chamber', 'Sintered Copper Vapor Chamber', -82.0, 0.40, W - 2.0, H - 2.0, R - 1.5);
    {
      // Internal capillary wick post matrix markings
      for (let x = -28; x <= 28; x += 8.0) {
        for (let y = -16; y <= 16; y += 8.0) {
          G.line(vapor, [x - 1.0, y, 0.41], [x + 1.0, y, 0.41], 'detail');
          G.line(vapor, [x, y - 1.0, 0.41], [x, y + 1.0, 0.41], 'detail');
        }
      }
    }
    parts.push(vapor);

    // Part 17: 10-Layer HDI Logic Board PCB
    const pcb = G.part('logic-board', '10-Layer HDI Logic Board PCB', [0, 0, -98.0 * spreadRatio]);
    {
      const pcbProfile = [
        [-38.0, -23.0],
        [38.0, -23.0],
        [38.0, 5.0],
        [20.0, 5.0],
        [20.0, 23.0],
        [-38.0, 23.0]
      ];
      G.extrude(pcb, pcbProfile, { depth: 0.80, role: 'edge' });
      // Component pads (resistors, capacitors, connector headers)
      for (let py = -18; py <= 0; py += 3.5) {
        G.line(pcb, [-34, py, 0.82], [-28, py, 0.82], 'detail');
        G.line(pcb, [-25, py, 0.82], [-19, py, 0.82], 'detail');
      }
    }
    parts.push(pcb);

    // Part 18: Micro-BGA Interposer Substrate
    const socBga = G.part('soc-package', 'Micro-BGA Interposer Substrate', [0, 0, -110.0 * spreadRatio]);
    {
      const bgaProfile = [
        [-9.0, -9.0],
        [9.0, -9.0],
        [9.0, 9.0],
        [-9.0, 9.0]
      ];
      G.extrude(socBga, bgaProfile, { depth: 0.40, role: 'edge' });
      // Micro solder ball array (represented as detail circles on bottom face)
      for (let bx = -7.5; bx <= 7.5; bx += 2.5) {
        for (let by = -7.5; by <= 7.5; by += 2.5) {
          G.line(socBga, [bx - 0.4, by, 0.0], [bx + 0.4, by, 0.0], 'detail');
        }
      }
    }
    parts.push(socBga);

    // Part 19: 3nm GAAFET Processor Die Floorplan
    const silicon = G.part('silicon-die', '3nm GAAFET Processor Die Floorplan', [0, 0, -120.0 * spreadRatio]);
    {
      const dieProfile = [
        [-6.5, -6.5],
        [6.5, -6.5],
        [6.5, 6.5],
        [-6.5, 6.5]
      ];
      G.extrude(silicon, dieProfile, { depth: 0.25, role: 'edge' });

      // Engraved floorplan core subdivisions
      // Neural Engine (4x4 tensor matrix quadrant)
      const npu = [
        [-5.5, 1.0, 0.26],
        [-1.0, 1.0, 0.26],
        [-1.0, 5.5, 0.26],
        [-5.5, 5.5, 0.26]
      ];
      G.polyline(silicon, npu, { closed: true, role: 'detail' });
      // GPU Vector Pipeline
      const gpu = [
        [1.0, 1.0, 0.26],
        [5.5, 1.0, 0.26],
        [5.5, 5.5, 0.26],
        [1.0, 5.5, 0.26]
      ];
      G.polyline(silicon, gpu, { closed: true, role: 'detail' });
      // CPU Cores & L2 SRAM Cache
      const cpu = [
        [-5.5, -5.5, 0.26],
        [5.5, -5.5, 0.26],
        [5.5, -0.5, 0.26],
        [-5.5, -0.5, 0.26]
      ];
      G.polyline(silicon, cpu, { closed: true, role: 'detail' });
    }
    parts.push(silicon);

    // Part 20: Milled 6000-Series Aerospace Aluminum Unibody Chassis
    const chassis = G.part('aluminum-chassis', 'Milled 6000-Series Aluminum Chassis', [0, 0, -140.0 * spreadRatio]);
    {
      const outerProfile = roundRect(CHASSIS_W, CHASSIS_H, CHASSIS_R);
      const innerPocket = roundRect(CHASSIS_W - 5.0, CHASSIS_H - 5.0, CHASSIS_R - 2.5);
      // Main machined pocket
      G.extrude(chassis, outerProfile, { depth: 4.5, holes: [innerPocket], creaseAngle: 30, role: 'edge' });

      // Pocket floor base plate
      const floorProfile = roundRect(CHASSIS_W - 4.8, CHASSIS_H - 4.8, CHASSIS_R - 2.4);
      const floorPiece = G.piece();
      G.extrude(floorPiece, floorProfile, { depth: 0.8, role: 'edge' });
      G.merge(chassis, floorPiece);

      // 4 Internal threaded mounting standoffs/bosses
      const bossRadius = 1.6;
      for (const [bx, by] of [
        [-CHASSIS_W / 2 + 5.5, -CHASSIS_H / 2 + 5.5],
        [CHASSIS_W / 2 - 5.5, -CHASSIS_H / 2 + 5.5],
        [CHASSIS_W / 2 - 5.5, CHASSIS_H / 2 - 5.5],
        [-CHASSIS_W / 2 + 5.5, CHASSIS_H / 2 - 5.5]
      ]) {
        const bossProfile = [];
        for (let j = 0; j < 16; j++) {
          const t = (j / 16) * Math.PI * 2;
          bossProfile.push([bx + bossRadius * Math.cos(t), by + bossRadius * Math.sin(t)]);
        }
        const bossPiece = G.piece();
        G.extrude(bossPiece, bossProfile, { depth: 3.5, role: 'detail' });
        G.merge(chassis, bossPiece);
      }
    }
    parts.push(chassis);

    // Part 21: Precision Torx T3 Machine Screws (staged diagonally)
    const screws = G.part('chassis-fasteners', 'Precision Torx T3 Machine Screws', [15.0, 15.0, -155.0 * spreadRatio]);
    {
      for (const [sx, sy] of [
        [-CHASSIS_W / 2 + 5.5, -CHASSIS_H / 2 + 5.5],
        [CHASSIS_W / 2 - 5.5, -CHASSIS_H / 2 + 5.5],
        [CHASSIS_W / 2 - 5.5, CHASSIS_H / 2 - 5.5],
        [-CHASSIS_W / 2 + 5.5, CHASSIS_H / 2 - 5.5]
      ]) {
        const screwPiece = G.piece();
        G.screw(screwPiece, { length: 2.8, radius: 0.6, headRadius: 1.2, headHeight: 0.8, pitch: 0.35 });
        G.transform(screwPiece, { origin: [sx, sy, 0] });
        G.merge(screws, screwPiece);

        // Trail connecting screw to chassis standoff
        trails.push({
          a: [sx, sy, 0],
          b: [sx, sy, 3.5],
          from: 'chassis-fasteners',
          to: 'aluminum-chassis',
          role: 'axis'
        });
      }
    }
    parts.push(screws);

    // =========================================================================
    // TIER 6: ABSTRACT SOFTWARE CONTINUUM (Suspended Architectural Plates)
    // =========================================================================

    // Part 22: Hardware IRQ & Interrupt Dispatch Surface
    const irqPlate = createPlate('software-irq', 'Hardware IRQ & Interrupt Dispatch', -170.0, 0.05, W - 6.0, H - 6.0, R - 2.5);
    {
      // Engraved interrupt dispatch bus arrows
      for (let iy = -12; iy <= 12; iy += 6.0) {
        G.line(irqPlate, [-25, iy, 0.06], [25, iy, 0.06], 'detail');
        G.line(irqPlate, [22, iy - 1.5, 0.06], [25, iy, 0.06], 'detail');
        G.line(irqPlate, [22, iy + 1.5, 0.06], [25, iy, 0.06], 'detail');
      }
    }
    parts.push(irqPlate);

    // Part 23: Spring-Damper Dynamics (dx/dt)
    const physicsPlate = createPlate('software-physics', 'Spring-Damper Dynamics (dx/dt)', -185.0, 0.05, W - 6.0, H - 6.0, R - 2.5);
    {
      // Engraved damped harmonic oscillation curve: x(t) = exp(-zeta * w * t) * cos(wd * t)
      const curve = [];
      const samples = 48;
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * 4.0 * Math.PI;
        const x = -26.0 + (i / samples) * 52.0;
        const decay = Math.exp(-0.25 * t);
        const y = 8.0 * decay * Math.cos(t);
        curve.push([x, y, 0.06]);
      }
      G.polyline(physicsPlate, curve, { role: 'edge' });
      // Equilibrium reference centerline
      G.line(physicsPlate, [-28, 0, 0.06], [28, 0, 0.06], 'axis');
    }
    parts.push(physicsPlate);

    // Part 24: UI Compositor & SDF Vector Glyph
    const framebuffer = createPlate('software-framebuffer', 'UI Compositor & SDF Vector Glyph', -200.0, 0.05, W - 6.0, H - 6.0, R - 2.5);
    {
      // Rendered interactive tactile button outline
      const btnW = 34.0;
      const btnH = 16.0;
      const btnR = 5.0;
      const btnProfile = roundRect(btnW, btnH, btnR);
      G.polyline(framebuffer, btnProfile.map(([x, y]) => [x, y, 0.06]), { closed: true, role: 'outline' });

      // Corner radius metric indicator arcs
      const offsetArc = roundRect(btnW + 2.4, btnH + 2.4, btnR + 1.2);
      G.polyline(framebuffer, offsetArc.map(([x, y]) => [x, y, 0.06]), { closed: true, role: 'detail' });
    }
    parts.push(framebuffer);

    // =========================================================================
    // Primary Vertical Centerline Trail
    // =========================================================================
    trails.push({
      a: [0, 0, 24.0],
      b: [0, 0, 0.0],
      from: 'finger-tissue',
      to: 'ito-rx-grid',
      role: 'axis'
    });
    trails.push({
      a: [0, 0, 0.0],
      b: [0, 0, -200.0 * spreadRatio],
      from: 'ito-rx-grid',
      to: 'software-framebuffer',
      role: 'axis'
    });

    // Camera: Isometric / Axonometric vantage
    const camera = {
      azimuth: -135,
      elevation: 28,
      roll: 0
    };

    return P.render(parts, {
      ...options,
      camera,
      trails
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = self.DrawingModels['touch-codex'];
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
