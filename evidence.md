# Evidence Record: Touch Codex

## Feature Classification & Reconstruction Basis

| Feature Group | Evidence Kind | Basis & Reconstruction Method |
| :--- | :--- | :--- |
| **Tier 1: Human Fingertip** (`finger-tissue`) | Features visible in a photograph / anatomical data | Reconstructed from anatomical cross-sections of distal phalanx, lofted across 8 elliptical profiles with pulp deformation against glass. Proportions marked as estimated. |
| **Tier 1: Bioelectric Field** (`bioelectric-field`) | A concept with no physical form | Modeled as an illustrative radial array of parabolic dielectric field lines disturbing the mutual capacitance plane. |
| **Tier 2: Oleophobic Coating** (`oleophobic-layer`) | A concept with no physical form / molecular layer | Represented as an ultra-thin boundary plane with micro-stipple texture at the contact zone. |
| **Tier 2: Aluminosilicate Glass** (`glass-cover`) | Supplied geometry or dimensions | 0.50 mm chemically strengthened cover glass with 2.5D corner edge radii and polished bevel chamfers. |
| **Tier 2: OCA Elastomer** (`oca-elastomer`) | Supplied geometry or dimensions | 0.125 mm optically clear adhesive elastomer plate ($n = 1.49$). |
| **Tier 3: Tx ITO Diamond Mesh** (`ito-tx-grid`) | Supplied geometry or dimensions | 3.8 mm pitch diamond transmit electrode grid with perimeter interconnect buses. |
| **Tier 3: Dielectric Isolation** (`dielectric-spacer`) | Supplied geometry or dimensions | 0.05 mm cyclic olefin polymer spacer sheet with mechanical registration notches. |
| **Tier 3: Rx ITO Diamond Mesh** (`ito-rx-grid`) | Supplied geometry or dimensions | Orthogonal vertical diamond sensor chains measuring mutual capacitance drop $\Delta C_m$. |
| **Tier 3: Touch FPC Flex Tail** (`touch-fpc-tail`) | Supplied geometry or dimensions | Polyimide flex cable with anisotropic conductive film (ACF) heat-seal bonds. |
| **Tier 4: Circular Polarizer** (`circular-polarizer`) | Supplied geometry or dimensions | Linear polarizer laminated to quarter-wave ($\lambda/4$) retarder film with $45^\circ$ fast-axis engraving. |
| **Tier 4: Thin-Film Encapsulation** (`tfe-barrier`) | Supplied geometry or dimensions | Inorganic $Al_2O_3$ / organic polymer multilayer barrier with stepped seal perimeter. |
| **Tier 4: OLED Subpixel Matrix** (`oled-subpixels`) | Supplied geometry or dimensions | Authentic Diamond PenTile subpixel aperture layout (Red 625nm, Green 530nm, Blue 465nm). |
| **Tier 4: LTPO TFT Backplane** (`ltpo-tft-backplane`) | Supplied geometry or dimensions | Low-Temperature Polycrystalline Oxide driving circuit (gate lines, data lines, storage capacitors). |
| **Tier 4: Polyimide Substrate** (`display-substrate`) | Supplied geometry or dimensions | 10 $\mu\text{m}$ flexible base carrier film. |
| **Tier 5: Graphite Heat Spreader** (`graphite-spreader`) | Supplied geometry or dimensions | 25 $\mu\text{m}$ anisotropic pyrolytic graphite foil with laser-cut component apertures. |
| **Tier 5: Vapor Chamber** (`vapor-chamber`) | Supplied geometry or dimensions | Sintered copper planar heat pipe ($0.35\,\text{mm}$) with capillary wick columns and vapor cavity. |
| **Tier 5: Logic Board PCB** (`logic-board`) | Supplied geometry or dimensions | 10-layer High-Density Interconnect (HDI) logic board with surface-mount passive arrays. |
| **Tier 5: SoC Interposer & BGA** (`soc-package`) | Supplied geometry or dimensions | Flip-chip BGA substrate with regular micro solder ball grid array. |
| **Tier 5: 3nm Silicon Die** (`silicon-die`) | Supplied geometry or dimensions | 3nm GAAFET processor die with engraved floorplan (Neural Engine, GPU vector cores, L1/L2 SRAM). |
| **Tier 5: Aluminum Unibody Chassis** (`aluminum-chassis`) | Supplied geometry or dimensions | 5-axis CNC machined 6000-series aluminum enclosure with pocketing, speaker ports, and screw bosses. |
| **Tier 5: Chassis Fasteners** (`chassis-fasteners`) | Supplied geometry or dimensions | Metric M1.2 $\times 2.5\,\text{mm}$ Torx T3 black-oxide machine screws with assembly trails. |
| **Tier 6: Hardware IRQ** (`software-irq`) | A concept with no physical form | Suspended concept plate with engraved interrupt register vector and driver routing arrows. |
| **Tier 6: Spring Damping Physics** (`software-physics`) | A concept with no physical form | Suspended concept plate with engraved differential equation $\ddot{x} + 2\zeta\omega\dot{x} + \omega^2 x = 0$ and damped curve. |
| **Tier 6: UI Framebuffer & Glyph** (`software-framebuffer`) | A concept with no physical form | Suspended concept plate displaying SDF vector contour metrics and tactile button geometry. |

---

## Rebuild and Proof Commands

```sh
# Compile standalone interactive viewer to dist/index.html
node tools/teardown/scripts/build-viewer.cjs drawing.json dist/index.html

# Run geometric and occlusion verification proof
node tools/teardown/scripts/proof.cjs drawing.json

# Serve the compiled viewer locally
npx serve dist -l 3000
```
