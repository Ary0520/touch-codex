/**
 * ULTRON // IN THE FLESH: THE CRADLE OF SENTIENCE
 * Master Procedural 3D Geometric Model
 *
 * Decomposes Ultron's synthetic cranial architecture into 6 biomechanical tiers and 24 parts.
 */

(function (root) {
  'use strict';

  self.DrawingModels ??= {};

  self.DrawingModels['ultron-cradle'] = function (parameters, options) {
    const G = typeof TechnicalGeometry !== 'undefined' ? TechnicalGeometry : require('./tools/teardown/assets/geometry.js');
    const P = typeof TechnicalProjection !== 'undefined' ? TechnicalProjection : require('./tools/teardown/assets/projection.js');

    const neuralResonance = (parameters?.neural_resonance ?? 75) / 100;
    const spreadRatio = (parameters?.cranial_expansion ?? 100) / 100;
    const jawAngle = (parameters?.mandible_angle ?? 8) * Math.PI / 180;

    // Head Base Dimensions (mm)
    const CRANIAL_W = 72.0;
    const CRANIAL_H = 88.0;
    const CRANIAL_R = 12.0;

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

    function createPlate(id, name, explosionZ, thickness, width = CRANIAL_W, height = CRANIAL_H, radius = CRANIAL_R) {
      const p = G.part(id, name, [0, 0, explosionZ * spreadRatio]);
      const profile = roundRect(width, height, radius);
      G.extrude(p, profile, { depth: thickness, creaseAngle: 30 });
      return p;
    }

    const parts = [];
    const trails = [];

    // =========================================================================
    // TIER 1: THE MIND STONE SINGULARITY
    // =========================================================================

    // Part 01: Mind Stone Cosmic Hyper-Octahedron
    const mindStone = G.part('mind-stone-core', 'Mind Stone Cosmic Hyper-Octahedron', [0, 0, 120.0 * spreadRatio]);
    {
      const top = [0, 16.0, 10.0];
      const btm = [0, 16.0, -10.0];
      const r = 7.0 * (0.8 + neuralResonance * 0.4);
      const ring = [];
      const n = 6;
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2;
        ring.push([r * Math.cos(t), 16.0 + r * 0.7 * Math.sin(t), 0]);
      }
      // Octahedral double-cone faces
      const baseIdx = mindStone.vertices.length;
      mindStone.vertices.push(top, btm, ...ring);
      for (let i = 0; i < n; i++) {
        const next = (i + 1) % n;
        mindStone.triangles.push(
          [baseIdx, baseIdx + 2 + i, baseIdx + 2 + next],
          [baseIdx + 1, baseIdx + 2 + next, baseIdx + 2 + i]
        );
        G.line(mindStone, top, ring[i], 'outline');
        G.line(mindStone, btm, ring[i], 'outline');
        G.line(mindStone, ring[i], ring[next], 'edge');
      }
      // Internal cosmic refraction facets
      for (let i = 0; i < n; i++) {
        G.line(mindStone, [0, 16.0, 0], ring[i], 'detail');
      }
    }
    parts.push(mindStone);

    // Part 02: Quantum Energy Tap Rings
    const energyRings = G.part('energy-tap-rings', 'Quantum Energy Tap Rings', [0, 0, 105.0 * spreadRatio]);
    {
      for (const z of [-4, 0, 4]) {
        const pts = [];
        const rad = 11.0 + Math.abs(z);
        for (let j = 0; j <= 32; j++) {
          const t = (j / 32) * Math.PI * 2;
          pts.push([rad * Math.cos(t), 16.0 + rad * 0.6 * Math.sin(t), z]);
        }
        G.polyline(energyRings, pts, { role: 'edge' });
      }
      // Axis flux lines
      for (let j = 0; j < 8; j++) {
        const t = (j / 8) * Math.PI * 2;
        G.line(energyRings, [8 * Math.cos(t), 16 + 5 * Math.sin(t), -6], [14 * Math.cos(t), 16 + 8 * Math.sin(t), 6], 'axis');
      }
    }
    parts.push(energyRings);

    // Part 03: Synaptic Neural Emitter Needles
    const needles = G.part('synaptic-needles', 'Synaptic Neural Emitter Needles', [0, 0, 92.0 * spreadRatio]);
    {
      const count = 20;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const inner = [7 * Math.cos(theta), 16 + 5 * Math.sin(theta), 0];
        const outer = [18 * Math.cos(theta), 16 + 13 * Math.sin(theta), (i % 2 === 0 ? 3 : -3)];
        G.line(needles, inner, outer, 'detail');
        G.line(needles, outer, [outer[0] * 1.15, outer[1] * 1.15, outer[2] * 1.2], 'axis');
      }
    }
    parts.push(needles);

    // =========================================================================
    // TIER 2: SYNTHETIC FLESH & VIBRANIUM LATTICE (Helen Cho's Matrix)
    // =========================================================================

    // Part 04: Printed Synthetic Cellular Dermis
    const dermis = G.part('cellular-dermis', 'Printed Synthetic Cellular Dermis', [0, 0, 78.0 * spreadRatio]);
    {
      // 5 lofted biological profiles creating synthetic organic facial contours
      const rings = [];
      const levels = 5;
      const ptsPerRing = 32;
      for (let lvl = 0; lvl < levels; lvl++) {
        const u = lvl / (levels - 1);
        const z = -4.0 + u * 12.0;
        const w = (CRANIAL_W - 6.0) * (0.85 + Math.sin(u * Math.PI) * 0.15);
        const h = (CRANIAL_H - 8.0) * (0.85 + Math.sin(u * Math.PI) * 0.15);
        const r = CRANIAL_R - 2.0;
        const ring = roundRect(w, h, r, 0, 0, 8).map(([x, y]) => [x, y, z]);
        rings.push(ring);
      }
      G.loft(dermis, rings, { caps: true, lines: 'all', role: 'edge' });

      // Ocular and nasal facial contours
      for (const eyeX of [-16.0, 16.0]) {
        const eyeSocket = [];
        for (let j = 0; j <= 16; j++) {
          const t = (j / 16) * Math.PI * 2;
          eyeSocket.push([eyeX + 6.0 * Math.cos(t), 12.0 + 4.5 * Math.sin(t), 8.2]);
        }
        G.polyline(dermis, eyeSocket, { role: 'detail' });
      }
    }
    parts.push(dermis);

    // Part 05: Hexagonal Vibranium-Carbon Molecular Mesh
    const vibMesh = G.part('vibranium-mesh', 'Hexagonal Vibranium Molecular Mesh', [0, 0, 64.0 * spreadRatio]);
    {
      const meshPlate = roundRect(CRANIAL_W - 8.0, CRANIAL_H - 10.0, CRANIAL_R - 3.0);
      G.extrude(vibMesh, meshPlate, { depth: 0.15, role: 'edge' });
      // Hexagonal molecular honeycomb grid
      const hexR = 4.2;
      const stepX = hexR * Math.sqrt(3);
      const stepY = hexR * 1.5;
      for (let row = -5; row <= 5; row++) {
        const y = row * stepY;
        const offsetX = (row % 2 === 0) ? 0 : stepX / 2;
        for (let col = -3; col <= 3; col++) {
          const x = col * stepX + offsetX;
          if (Math.abs(x) < CRANIAL_W / 2 - 10 && Math.abs(y) < CRANIAL_H / 2 - 12) {
            const hex = [];
            for (let k = 0; k < 6; k++) {
              const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
              hex.push([x + hexR * Math.cos(a), y + hexR * Math.sin(a), 0.18]);
            }
            G.polyline(vibMesh, hex, { closed: true, role: 'detail' });
          }
        }
      }
    }
    parts.push(vibMesh);

    // Part 06: Micro-Vascular Capillary Conduits
    const capillaries = G.part('vascular-capillaries', 'Micro-Vascular Capillary Conduits', [0, 0, 50.0 * spreadRatio]);
    {
      // Branching vascular arborization lines
      for (const side of [-1, 1]) {
        const mainTrunk = [
          [side * 4.0, -32.0, 0.1],
          [side * 12.0, -10.0, 0.1],
          [side * 22.0, 10.0, 0.1],
          [side * 26.0, 30.0, 0.1]
        ];
        G.polyline(capillaries, mainTrunk, { role: 'edge' });
        // Secondary capillary twigs
        G.line(capillaries, [side * 12.0, -10.0, 0.1], [side * 24.0, -4.0, 0.1], 'detail');
        G.line(capillaries, [side * 22.0, 10.0, 0.1], [side * 14.0, 22.0, 0.1], 'detail');
        G.line(capillaries, [side * 14.0, 22.0, 0.1], [side * 6.0, 34.0, 0.1], 'detail');
      }
    }
    parts.push(capillaries);

    // Part 07: Myofibril Synthetic Muscle Tendons
    const myofibrils = G.part('synthetic-myofibrils', 'Myofibril Synthetic Muscle Tendons', [0, 0, 38.0 * spreadRatio]);
    {
      // Striated muscle bands
      for (const side of [-1, 1]) {
        for (let i = 0; i < 5; i++) {
          const y0 = -28.0 + i * 3.0;
          const y1 = 4.0 + i * 4.0;
          G.line(myofibrils, [side * 10.0, y0, 0.1], [side * 24.0, y1, 0.1], 'detail');
        }
      }
    }
    parts.push(myofibrils);

    // =========================================================================
    // TIER 3: VIBRANIUM CRANIAL EXOSKELETON
    // =========================================================================

    // Part 08: 5-Axis Milled Vibranium Frontal Brow Armor
    const brow = G.part('brow-armor', '5-Axis Milled Vibranium Brow Armor', [0, 0, 24.0 * spreadRatio]);
    {
      // Aggressive swept-back forehead plate with Mind Stone socket hole
      const browProfile = [
        [-30.0, 10.0],
        [-34.0, 32.0],
        [-18.0, 42.0],
        [0.0, 44.0],
        [18.0, 42.0],
        [34.0, 32.0],
        [30.0, 10.0],
        [14.0, 12.0],
        [0.0, 18.0],
        [-14.0, 12.0]
      ];
      // Mind Stone hexagonal receptacle cutout
      const stoneSocket = [];
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        stoneSocket.push([9.0 * Math.cos(a), 28.0 + 8.0 * Math.sin(a)]);
      }
      G.extrude(brow, browProfile, { depth: 3.2, holes: [stoneSocket], creaseAngle: 25, role: 'outline' });

      // Angular eyebrow crest lines
      G.line(brow, [-28.0, 14.0, 3.3], [-4.0, 20.0, 3.3], 'edge');
      G.line(brow, [28.0, 14.0, 3.3], [4.0, 20.0, 3.3], 'edge');
      G.line(brow, [-32.0, 30.0, 3.3], [-16.0, 40.0, 3.3], 'edge');
      G.line(brow, [32.0, 30.0, 3.3], [16.0, 40.0, 3.3], 'edge');
    }
    parts.push(brow);

    // Part 09: Articulated Zygomatic Cheek Plates
    const zygomatic = G.part('zygomatic-plates', 'Articulated Zygomatic Cheek Plates', [0, 0, 10.0 * spreadRatio]);
    {
      for (const side of [-1, 1]) {
        const cheekProfile = [
          [side * 22.0, -12.0],
          [side * 34.0, -8.0],
          [side * 32.0, 14.0],
          [side * 18.0, 8.0]
        ];
        const cheekPiece = G.piece();
        G.extrude(cheekPiece, cheekProfile, { depth: 2.2, creaseAngle: 25, role: 'edge' });
        G.merge(zygomatic, cheekPiece);

        // Exhaust louver slats
        for (let ly = -4.0; ly <= 8.0; ly += 3.5) {
          G.line(zygomatic, [side * 24.0, ly, 2.3], [side * 31.0, ly + 1.5, 2.3], 'detail');
        }
      }
    }
    parts.push(zygomatic);

    // Part 10: Segmented Mandibular Jaw Unibody
    const mandible = G.part('mandible-chassis', 'Segmented Mandibular Jaw Unibody', [0, -jawAngle * 12.0, -4.0 * spreadRatio]);
    {
      const jawProfile = [
        [-14.0, -40.0],
        [14.0, -40.0],
        [24.0, -26.0],
        [28.0, -12.0],
        [16.0, -14.0],
        [8.0, -26.0],
        [-8.0, -26.0],
        [-16.0, -14.0],
        [-28.0, -12.0],
        [-24.0, -26.0]
      ];
      G.extrude(mandible, jawProfile, { depth: 3.5, creaseAngle: 25, role: 'outline' });
      // Chin strike-face reinforcement bevel
      G.line(mandible, [-10.0, -38.0, 3.6], [10.0, -38.0, 3.6], 'edge');
      G.line(mandible, [-10.0, -38.0, 3.6], [-18.0, -27.0, 3.6], 'edge');
      G.line(mandible, [10.0, -38.0, 3.6], [18.0, -27.0, 3.6], 'edge');
    }
    parts.push(mandible);

    // Part 11: Acoustic Venting Grilles & Chambers
    const vocalVents = G.part('vocal-vents', 'Acoustic Venting Grilles & Chambers', [0, 0, -18.0 * spreadRatio]);
    {
      for (const side of [-1, 1]) {
        for (let vy = -22.0; vy <= -14.0; vy += 2.0) {
          G.line(vocalVents, [side * 4.0, vy, 0.1], [side * 12.0, vy, 0.1], 'detail');
        }
      }
    }
    parts.push(vocalVents);

    // =========================================================================
    // TIER 4: OCULAR TARGETING & OPTIC MATRIX
    // =========================================================================

    // Part 12: Dual Crimson Optic Lenses & Irises
    const ocularLenses = G.part('ocular-lenses', 'Dual Crimson Optic Lenses & Irises', [0, 0, -32.0 * spreadRatio]);
    {
      for (const eyeX of [-16.0, 16.0]) {
        // Concentric optical lens rings
        for (const rad of [2.2, 4.0, 5.8]) {
          const ring = [];
          for (let j = 0; j <= 24; j++) {
            const t = (j / 24) * Math.PI * 2;
            ring.push([eyeX + rad * Math.cos(t), 12.0 + rad * Math.sin(t), 0.1]);
          }
          G.polyline(ocularLenses, ring, { role: 'edge' });
        }
        // Stepped iris leaves
        for (let j = 0; j < 6; j++) {
          const t = (j / 6) * Math.PI * 2;
          G.line(ocularLenses, [eyeX + 2.2 * Math.cos(t), 12.0 + 2.2 * Math.sin(t), 0.1], [eyeX + 5.8 * Math.cos(t + 0.4), 12.0 + 5.8 * Math.sin(t + 0.4), 0.1], 'detail');
        }
      }
    }
    parts.push(ocularLenses);

    // Part 13: Coherent Laser Rangefinding Diodes (Pure Crimson)
    const diodes = G.part('targeting-diodes', 'Coherent Laser Rangefinding Diodes', [0, 0, -44.0 * spreadRatio]);
    {
      for (const eyeX of [-16.0, 16.0]) {
        // Center laser diode core
        const diodeCore = [];
        for (let j = 0; j <= 16; j++) {
          const t = (j / 16) * Math.PI * 2;
          diodeCore.push([eyeX + 1.2 * Math.cos(t), 12.0 + 1.2 * Math.sin(t), 0.2]);
        }
        G.polyline(diodes, diodeCore, { closed: true, role: 'outline' });
        // Laser targeting crosshair reticle
        G.line(diodes, [eyeX - 3.5, 12.0, 0.2], [eyeX + 3.5, 12.0, 0.2], 'axis');
        G.line(diodes, [eyeX, 12.0 - 3.5, 0.2], [eyeX, 12.0 + 3.5, 0.2], 'axis');
      }
    }
    parts.push(diodes);

    // Part 14: Biometric Focus Gimbals & Servos
    const ocularServos = G.part('ocular-servos', 'Biometric Focus Gimbals & Servos', [0, 0, -56.0 * spreadRatio]);
    {
      for (const eyeX of [-16.0, 16.0]) {
        const servoBox = [
          [eyeX - 4.0, 9.0],
          [eyeX + 4.0, 9.0],
          [eyeX + 4.0, 15.0],
          [eyeX - 4.0, 15.0]
        ];
        const servoPiece = G.piece();
        G.extrude(servoPiece, servoBox, { depth: 2.5, role: 'edge' });
        G.merge(ocularServos, servoPiece);
      }
    }
    parts.push(ocularServos);

    // =========================================================================
    // TIER 5: CERVICAL SPINE & HYDRAULIC SKELETON
    // =========================================================================

    // Part 15: Segmented Cervical Vertebrae C1-C7
    const vertebrae = G.part('cervical-vertebrae', 'Segmented Cervical Vertebrae C1-C7', [0, 0, -70.0 * spreadRatio]);
    {
      const numVert = 5;
      for (let i = 0; i < numVert; i++) {
        const vy = -36.0 - i * 6.0;
        const vertPiece = G.piece();
        const vertProfile = [
          [-10.0, vy],
          [10.0, vy],
          [8.0, vy - 4.5],
          [-8.0, vy - 4.5]
        ];
        G.extrude(vertPiece, vertProfile, { depth: 3.0, creaseAngle: 25, role: 'edge' });
        G.merge(vertebrae, vertPiece);
        // Spinal neural canal hole indicator
        G.line(vertebrae, [-3.0, vy - 2.2, 3.1], [3.0, vy - 2.2, 3.1], 'detail');
      }
    }
    parts.push(vertebrae);

    // Part 16: High-Pressure Hydraulic Actuators
    const pistons = G.part('hydraulic-pistons', 'High-Pressure Hydraulic Actuators', [0, 0, -84.0 * spreadRatio]);
    {
      for (const side of [-1, 1]) {
        const px = side * 18.0;
        const pistonPiece = G.piece();
        // Cylinder barrel
        G.screw(pistonPiece, { length: 22.0, radius: 2.2, headRadius: 3.5, headHeight: 3.0, pitch: 1.2 });
        G.transform(pistonPiece, { origin: [px, -45.0, 0], ...G.along('y') });
        G.merge(pistons, pistonPiece);

        // Assembly trail from piston to jaw articulation
        trails.push({
          a: [px, -24.0, 0],
          b: [px, -45.0, 0],
          from: 'mandible-chassis',
          to: 'hydraulic-pistons',
          role: 'axis'
        });
      }
    }
    parts.push(pistons);

    // Part 17: Cast Titanium Sub-Chassis Frame
    const subChassis = G.part('sub-chassis-core', 'Cast Titanium Sub-Chassis Frame', [0, 0, -98.0 * spreadRatio]);
    {
      const frameProfile = [
        [-24.0, -18.0],
        [24.0, -18.0],
        [28.0, 16.0],
        [16.0, 32.0],
        [-16.0, 32.0],
        [-28.0, 16.0]
      ];
      const innerWindow = [
        [-14.0, -8.0],
        [14.0, -8.0],
        [16.0, 14.0],
        [-16.0, 14.0]
      ];
      G.extrude(subChassis, frameProfile, { depth: 4.5, holes: [innerWindow], creaseAngle: 30, role: 'edge' });
    }
    parts.push(subChassis);

    // Part 18: Precision Torx T4 Machine Screws
    const fasteners = G.part('cranial-fasteners', 'Precision Torx T4 Machine Screws', [16.0, 16.0, -110.0 * spreadRatio]);
    {
      for (const [sx, sy] of [
        [-26.0, 24.0],
        [26.0, 24.0],
        [-22.0, -12.0],
        [22.0, -12.0]
      ]) {
        const screwPiece = G.piece();
        G.screw(screwPiece, { length: 4.5, radius: 0.9, headRadius: 1.8, headHeight: 1.2, pitch: 0.45 });
        G.transform(screwPiece, { origin: [sx, sy, 0] });
        G.merge(fasteners, screwPiece);

        trails.push({
          a: [sx, sy, 0],
          b: [sx, sy, 4.5],
          from: 'cranial-fasteners',
          to: 'sub-chassis-core',
          role: 'axis'
        });
      }
    }
    parts.push(fasteners);

    // =========================================================================
    // TIER 6: NEURAL UPLINK & GLOBAL CONSCIOUSNESS (Suspended Concept Plates)
    // =========================================================================

    // Part 19: Cradle Bio-Interface Ribbons
    const ribbons = G.part('cradle-ribbons', 'Cradle Bio-Interface Ribbons', [0, 0, -125.0 * spreadRatio]);
    {
      for (let i = -3; i <= 3; i++) {
        const rx = i * 6.5;
        const ribbonCurve = [
          [rx, -45.0, 0],
          [rx * 1.3, -58.0, -10.0],
          [rx * 1.6, -72.0, -25.0]
        ];
        G.polyline(ribbons, ribbonCurve, { role: 'edge' });
      }
    }
    parts.push(ribbons);

    // Part 20: Global Satellite Array Relay Bus
    const satellite = createPlate('satellite-uplink', 'Global Satellite Array Relay Bus', -140.0, 0.05);
    {
      // Orbital satellite constellation tracks
      for (const r of [16.0, 26.0, 36.0]) {
        const orbit = [];
        for (let j = 0; j <= 32; j++) {
          const t = (j / 32) * Math.PI * 2;
          orbit.push([r * Math.cos(t), r * 0.5 * Math.sin(t), 0.06]);
        }
        G.polyline(satellite, orbit, { role: 'axis' });
      }
    }
    parts.push(satellite);

    // Part 21: Nuclear Decryption Memory Buffer
    const nuclear = createPlate('nuclear-buffer', 'Nuclear Decryption Memory Buffer', -155.0, 0.05);
    {
      // Cryptographic memory bus matrix
      for (let y = -24; y <= 24; y += 8.0) {
        G.line(nuclear, [-28, y, 0.06], [28, y, 0.06], 'detail');
        for (let x = -24; x <= 24; x += 8.0) {
          G.line(nuclear, [x - 1.5, y, 0.06], [x + 1.5, y, 0.06], 'detail');
        }
      }
    }
    parts.push(nuclear);

    // Part 22: J.A.R.V.I.S. Deconstruction Memory
    const jarvis = createPlate('jarvis-fragments', 'J.A.R.V.I.S. Deconstruction Memory', -170.0, 0.05);
    {
      // Shattered concentric circular algorithmic rings
      for (const r of [8.0, 16.0, 24.0]) {
        for (let q = 0; q < 4; q++) {
          const arc = [];
          const start = q * Math.PI / 2 + 0.15;
          const end = (q + 1) * Math.PI / 2 - 0.15;
          for (let j = 0; j <= 8; j++) {
            const t = start + (j / 8) * (end - start);
            arc.push([r * Math.cos(t), r * Math.sin(t), 0.06]);
          }
          G.polyline(jarvis, arc, { role: 'detail' });
        }
      }
    }
    parts.push(jarvis);

    // Part 23: Socovia Kinetic Thruster Trajectory
    const kinetic = createPlate('kinetic-thruster-map', 'Socovia Kinetic Thruster Trajectory', -185.0, 0.05);
    {
      // Parabolic atmospheric descent curve
      const traj = [];
      for (let i = 0; i <= 32; i++) {
        const u = i / 32;
        const x = -28.0 + u * 56.0;
        const y = -18.0 + Math.pow(u - 0.5, 2) * 40.0;
        traj.push([x, y, 0.06]);
      }
      G.polyline(kinetic, traj, { role: 'edge' });
      G.line(kinetic, [-30, 0, 0.06], [30, 0, 0.06], 'axis');
    }
    parts.push(kinetic);

    // Part 24: "No Strings" Extinction Manifesto
    const manifesto = createPlate('teleology-plate', '"No Strings" Extinction Manifesto', -200.0, 0.05);
    {
      // Central broken string glyph
      G.line(manifesto, [0, -25, 0.06], [0, -6, 0.06], 'axis');
      G.line(manifesto, [-4, -6, 0.06], [4, -6, 0.06], 'outline');
      G.line(manifesto, [0, 6, 0.06], [0, 25, 0.06], 'axis');
      G.line(manifesto, [-4, 6, 0.06], [4, 6, 0.06], 'outline');
      // Expanding acoustic shockwave rings
      for (const r of [12.0, 22.0]) {
        const shock = [];
        for (let j = 0; j <= 32; j++) {
          const t = (j / 32) * Math.PI * 2;
          shock.push([r * Math.cos(t), r * 0.6 * Math.sin(t), 0.06]);
        }
        G.polyline(manifesto, shock, { role: 'detail' });
      }
    }
    parts.push(manifesto);

    // Central primary spinal axis trail
    trails.push({
      a: [0, 16.0, 120.0 * spreadRatio],
      b: [0, 16.0, 0],
      from: 'mind-stone-core',
      to: 'brow-armor',
      role: 'axis'
    });
    trails.push({
      a: [0, 0, 0],
      b: [0, 0, -200.0 * spreadRatio],
      from: 'brow-armor',
      to: 'teleology-plate',
      role: 'axis'
    });

    // Camera: Isometric / Axonometric vantage
    const camera = {
      azimuth: -135,
      elevation: 26,
      roll: 0
    };

    return P.render(parts, {
      ...options,
      camera,
      trails
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = self.DrawingModels['ultron-cradle'];
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
