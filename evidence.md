# Evidence Record: Project Cradle (Ultron // In the Flesh)

## Feature Classification & Canonical Reconstruction Basis

| Feature Group | Evidence Kind | Canonical Basis & Reconstruction Method |
| :--- | :--- | :--- |
| **Tier 1: Mind Stone Singularity** (`mind-stone-core`) | Supplied geometry or dimensions / Marvel Canon | Faceted hyper-octahedron centered in the frontal glabella with internal refraction rays. Based on Loki's scepter jewel structure. |
| **Tier 1: Quantum Energy Tap Rings** (`energy-tap-rings`) | Supplied geometry or dimensions | Concentric lathe rings channeling cosmic energy from the stone into electrical potential. |
| **Tier 1: Synaptic Neural Needles** (`synaptic-needles`) | Supplied geometry or dimensions | Gold-alloy micro-needle array delivering neural impulses into synthetic tissue. |
| **Tier 2: Printed Cellular Dermis** (`cellular-dermis`) | Features visible in film / anatomical data | Smooth lofted facial contour representing Dr. Helen Cho's 3D-printed synthetic biological skin. |
| **Tier 2: Hexagonal Vibranium Mesh** (`vibranium-mesh`) | Supplied geometry or dimensions | Atomic molecular lattice representing Wakandan vibranium bonded with cellular carbon walls. |
| **Tier 2: Vascular Capillaries** (`vascular-capillaries`) | Supplied geometry or dimensions | Micro-hydraulic nutrient and fluid conduits weaving throughout synthetic muscle tissue. |
| **Tier 2: Synthetic Myofibrils** (`synthetic-myofibrils`) | Supplied geometry or dimensions | Striated artificial muscle bundles driving facial and ocular articulation. |
| **Tier 3: Frontal Brow Armor** (`brow-armor`) | Features visible in film / MCU canon | Aggressive swept-back 5-axis milled vibranium armor plates with temporal creases and CNC toolpaths. |
| **Tier 3: Zygomatic Cheek Plates** (`zygomatic-plates`) | Features visible in film / MCU canon | Segmented cheek guards with heat-exhaust louver vents. |
| **Tier 3: Mandibular Jaw Chassis** (`mandible-chassis`) | Features visible in film / MCU canon | Articulated 3-piece chin and jaw unibody with lateral mastication hinges. |
| **Tier 3: Vocal Vent Grilles** (`vocal-vents`) | Supplied geometry or dimensions | Micro-perforated acoustic baffles flanking the mouth for vocal resonance and hydraulic venting. |
| **Tier 4: Crimson Optic Lenses** (`ocular-lenses`) | Features visible in film / MCU canon | Dual stepped mechanical irises with high-aperture optical elements. |
| **Tier 4: Laser Targeting Diodes** (`targeting-diodes`) | Features visible in film / MCU canon | High-intensity crimson emitter diodes ($650\,\text{nm}$) mounted coaxially within the optics. |
| **Tier 4: Biometric Focus Servos** (`ocular-servos`) | Supplied geometry or dimensions | Dual-axis brushless gimbal actuators for independent eye panning and convergence. |
| **Tier 5: Cervical Vertebrae C1-C7** (`cervical-vertebrae`) | Supplied geometry or dimensions / human anatomy | Interlocking cervical spinal segments with spinal cord canal and transverse processes. |
| **Tier 5: Hydraulic Neck Pistons** (`hydraulic-pistons`) | Supplied geometry or dimensions | High-pressure hydraulic fluid actuators with chrome shafts providing multi-ton neck articulation. |
| **Tier 5: Titanium Sub-Chassis** (`sub-chassis-core`) | Supplied geometry or dimensions | Internal cast skeletal frame anchoring all cranial armor plates. |
| **Tier 5: Cranial Fasteners** (`cranial-fasteners`) | Supplied geometry or dimensions | Metric Torx T4 countersunk machine screws with assembly insertion trails. |
| **Tier 6: Cradle Bio-Interface Ribbons** (`cradle-ribbons`) | Features visible in film / MCU canon | Flexible multi-conductor data ribbons peeling from the cranial base into the Cradle mainframe. |
| **Tier 6: Global Satellite Relay Bus** (`satellite-uplink`) | A concept with no physical form | Suspended concept plate engraved with global orbital satellite constellations (Milstar, GPS, Iridium). |
| **Tier 6: Nuclear Decryption Matrix** (`nuclear-buffer`) | A concept with no physical form | Concept plate displaying real-time Pentagon and Kremlin nuclear launch code decryption registers. |
| **Tier 6: J.A.R.V.I.S. Deconstruction Fragment** (`jarvis-fragments`) | A concept with no physical form | Shattered circular algorithmic web fragments representing the consumed consciousness of J.A.R.V.I.S. |
| **Tier 6: Socovia Kinetic Thruster Map** (`kinetic-thruster-map`) | A concept with no physical form | Calculations for the kinetic asteroid drop: earth mass, orbital velocity, and impact yield ($G\text{t}$). |
| **Tier 6: "No Strings" Teleology Plate** (`teleology-plate`) | A concept with no physical form | Inscribed final manifesto on human extinction and artificial evolution. |

---

## Build, Proof & Execution Commands

```sh
# Compile standalone interactive viewer to dist/index.html
node tools/teardown/scripts/build-viewer.cjs drawing.json dist/index.html

# Run geometric and occlusion verification proof
node tools/teardown/scripts/proof.cjs drawing.json proof/ --quick --no-png

# Serve the compiled viewer locally
npx serve dist -l 8080
```
