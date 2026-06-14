import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Unit, UnitForm } from '../interfaces/unit.interfaces';

// ─────────────────────────────────────────────────────────────────────────────
// SPPU First Year Engineering — 2019 Pattern
// Unit data sourced from official SPPU syllabus documents and verified against
// published textbooks (Technical Publications, studymedia.in, mitu.co.in).
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_UNITS: Unit[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // Engineering Mathematics – I  (107001)  |  Semester 1
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-math1-u1',
    name: 'Differential Calculus',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Medium',
    description:
      'Rolle\'s theorem, Lagrange\'s and Cauchy\'s mean value theorems, Taylor\'s series and Maclaurin\'s series expansion of standard functions, indeterminate forms, and L\'Hôpital\'s rule with evaluation of limits. Application to error estimation in engineering computations.',
  },
  {
    id: 'fe-math1-u2',
    name: 'Fourier Series',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Hard',
    description:
      'Periodic functions and Dirichlet\'s conditions for Fourier series convergence. Full-range and half-range Fourier series expansions, harmonic analysis from tabulated data, Parseval\'s identity, and engineering applications in signal analysis and wave representation.',
  },
  {
    id: 'fe-math1-u3',
    name: 'Partial Differentiation',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Medium',
    description:
      'Functions of several variables, partial derivatives, Euler\'s theorem on homogeneous functions, partial derivative of composite functions, total derivative, change of independent variables, and Jacobians and their applications in coordinate transformations.',
  },
  {
    id: 'fe-math1-u4',
    name: 'Applications of Partial Differentiation',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Hard',
    description:
      'Errors and approximations using differentials, maxima and minima of functions of two variables, Lagrange\'s method of undetermined multipliers for constrained optimisation, and applications in engineering design and analysis.',
  },
  {
    id: 'fe-math1-u5',
    name: 'Matrices and Linear Algebra',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Medium',
    description:
      'Rank of a matrix, echelon form, solution of systems of linear equations (consistent and inconsistent). Eigenvalues and eigenvectors, Cayley-Hamilton theorem, linear and orthogonal transformations, diagonalisation, and applications to engineering systems.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Engineering Physics  (107002)  |  Semester 1
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-phy-u1',
    name: 'Wave Optics',
    subjectId: 'fe-phy',
    subjectName: 'Engineering Physics',
    difficulty: 'Medium',
    description:
      'Electromagnetic spectrum and wave nature of light. Interference: thin films of uniform thickness and wedge shape (with derivation), testing optical flatness, anti-reflection coatings. Diffraction: single slit, diffraction grating, Rayleigh\'s criterion for resolution. Polarisation: Malus\'s law, double refraction, engineering applications.',
  },
  {
    id: 'fe-phy-u2',
    name: 'Laser and Optical Fibre',
    subjectId: 'fe-phy',
    subjectName: 'Engineering Physics',
    difficulty: 'Medium',
    description:
      'Laser fundamentals: stimulated emission, population inversion, optical resonator, characteristics. Types: semiconductor (single hetero-junction), CO₂ gas laser. Applications in holography, IT, industrial cutting, and medical fields. Optical fibre: structure, acceptance angle, numerical aperture, step-index and graded-index types, attenuation, and fibre-optic communication systems.',
  },
  {
    id: 'fe-phy-u3',
    name: 'Quantum Mechanics',
    subjectId: 'fe-phy',
    subjectName: 'Engineering Physics',
    difficulty: 'Hard',
    description:
      'Wave-particle duality and de Broglie hypothesis. Phase velocity and group velocity. Heisenberg\'s uncertainty principle. Wave function and its physical significance. Time-independent and time-dependent Schrödinger equations. Particle in an infinitely deep potential well. Quantum tunnelling and introductory concepts in quantum computing.',
  },
  {
    id: 'fe-phy-u4',
    name: 'Semiconductor Physics',
    subjectId: 'fe-phy',
    subjectName: 'Engineering Physics',
    difficulty: 'Medium',
    description:
      'Energy band theory of solids: conductors, semiconductors, and insulators. Fermi-Dirac distribution function and Fermi level. Intrinsic and extrinsic semiconductors, carrier concentration. PN junction formation, depletion layer, diode equation, and I-V characteristics. Solar cell operation and efficiency. Hall effect and its applications.',
  },
  {
    id: 'fe-phy-u5',
    name: 'Magnetism and Superconductivity',
    subjectId: 'fe-phy',
    subjectName: 'Engineering Physics',
    difficulty: 'Medium',
    description:
      'Origin of magnetism, classification of magnetic materials (diamagnetic, paramagnetic, ferromagnetic) by permeability, B-H curve, hysteresis. Technological applications in transformers and magnetic storage. Superconductivity: zero resistance, critical temperature and field, Meissner effect, Type I and Type II superconductors, BCS theory (overview), Josephson effect, and SQUID applications.',
  },
  {
    id: 'fe-phy-u6',
    name: 'Non-Destructive Testing and Nanotechnology',
    subjectId: 'fe-phy',
    subjectName: 'Engineering Physics',
    difficulty: 'Hard',
    description:
      'Non-destructive testing (NDT) methods: acoustic emission, ultrasonic testing, radiography (X-ray and gamma ray), and magnetic particle inspection — principles and engineering applications. Nanotechnology: quantum confinement effects, size-dependent properties of nanomaterials, synthesis methods, and applications in medicine, electronics, energy, and defence.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Systems in Mechanical Engineering  (107003)  |  Semester 1
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-sme-u1',
    name: 'Energy Sources and Conversion',
    subjectId: 'fe-sme',
    subjectName: 'Systems in Mechanical Engineering',
    difficulty: 'Easy',
    description:
      'Classification and overview of energy sources: thermal, hydropower, nuclear, solar, geothermal, wind, hydrogen, biomass, and tidal. Energy conversion devices — pumps, blowers, compressors, and turbines — with concepts of input, output, and efficiency. Environmental and economic considerations of each energy source.',
  },
  {
    id: 'fe-sme-u2',
    name: 'Introduction to Thermal Engineering',
    subjectId: 'fe-sme',
    subjectName: 'Systems in Mechanical Engineering',
    difficulty: 'Medium',
    description:
      'Zeroth, first, and second laws of thermodynamics with engineering significance. Concept of heat engines, heat pumps, and refrigerators with COP. Heat transfer mechanisms: conduction, convection, and radiation. Two-stroke and four-stroke engines (petrol, diesel, and CNG) — working principles, PV diagrams, and comparison.',
  },
  {
    id: 'fe-sme-u3',
    name: 'Vehicles and Their Specifications',
    subjectId: 'fe-sme',
    subjectName: 'Systems in Mechanical Engineering',
    difficulty: 'Easy',
    description:
      'Classification of vehicles by load capacity, application, and fuel type. Vehicle specifications: engine displacement, power, torque, gear ratios, and fuel efficiency. Introduction to engine components and their functions. Modern vehicle technologies: electric vehicles (EV), hybrid vehicles, and their cost-benefit analysis.',
  },
  {
    id: 'fe-sme-u4',
    name: 'Vehicle Systems',
    subjectId: 'fe-sme',
    subjectName: 'Systems in Mechanical Engineering',
    difficulty: 'Medium',
    description:
      'Chassis layouts and their significance in vehicle design. Steering system: types and working. Suspension system: objectives and types. Braking system: hydraulic and pneumatic brakes, ABS. Cooling system: air and water cooling. Fuel injection systems. Power transmission from engine to wheels. Safety features: airbags and crash structures.',
  },
  {
    id: 'fe-sme-u5',
    name: 'Introduction to Manufacturing',
    subjectId: 'fe-sme',
    subjectName: 'Systems in Mechanical Engineering',
    difficulty: 'Medium',
    description:
      'Conventional manufacturing processes: casting (sand, die, investment), forging, and sheet metal operations. Metal cutting fundamentals: turning, milling, drilling, and tool geometry. Modern manufacturing: additive manufacturing principles, 3D printing technologies (FDM, SLA), and introduction to CNC programming and operation.',
  },
  {
    id: 'fe-sme-u6',
    name: 'Engineering Mechanisms and Domestic Appliances',
    subjectId: 'fe-sme',
    subjectName: 'Systems in Mechanical Engineering',
    difficulty: 'Easy',
    description:
      'Basic mechanical mechanisms: pumps (centrifugal, reciprocating), compressors, springs, gears (types and applications), belt-pulley and chain-sprocket drives, valves, and levers. Identification and working of these mechanisms in everyday domestic appliances — washing machines, fans, refrigerators, vacuum cleaners, water heaters, and bicycles.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Basic Electrical Engineering  (103004)  |  Semester 1
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-bee-u1',
    name: 'Elementary Concepts and DC Circuits',
    subjectId: 'fe-bee',
    subjectName: 'Basic Electrical Engineering',
    difficulty: 'Easy',
    description:
      'Fundamental quantities: resistance, EMF, current, potential difference. Ohm\'s law and power in DC circuits. Overview of electrical power systems (generation, transmission, distribution). Network classification, series-parallel simplification, star-delta transformation. Kirchhoff\'s voltage and current laws, loop and nodal analysis. Superposition, Thevenin\'s, and Norton\'s theorems.',
  },
  {
    id: 'fe-bee-u2',
    name: 'Electromagnetism',
    subjectId: 'fe-bee',
    subjectName: 'Basic Electrical Engineering',
    difficulty: 'Medium',
    description:
      'Magnetic field concepts: flux density, field strength, permeability, MMF, and reluctance. Analysis of simple series magnetic circuits. Electromagnetic induction: Faraday\'s laws, Lenz\'s law, Fleming\'s right-hand rule. Self-inductance, mutual inductance, coefficient of coupling, and energy stored in a magnetic field.',
  },
  {
    id: 'fe-bee-u3',
    name: 'AC Fundamentals',
    subjectId: 'fe-bee',
    subjectName: 'Basic Electrical Engineering',
    difficulty: 'Medium',
    description:
      'Generation of single-phase sinusoidal voltages and currents. Definitions: cycle, period, frequency, instantaneous, peak, average, and RMS values. Peak factor and form factor. Phase difference, lagging and leading quantities, and phasor representation. Rectangular and polar forms. Behaviour of pure R, L, and C elements in AC circuits.',
  },
  {
    id: 'fe-bee-u4',
    name: 'AC Circuits and Three-Phase Systems',
    subjectId: 'fe-bee',
    subjectName: 'Basic Electrical Engineering',
    difficulty: 'Hard',
    description:
      'Series and parallel R-L, R-C, and R-L-C circuits: impedance, phasor diagrams, power factor, active/reactive/apparent power. Series resonance: Q-factor and bandwidth. Three-phase supply: advantages, balanced star and delta connections, line and phase quantities, and power measurement in balanced loads.',
  },
  {
    id: 'fe-bee-u5',
    name: 'Introduction to Electric Machines',
    subjectId: 'fe-bee',
    subjectName: 'Basic Electrical Engineering',
    difficulty: 'Medium',
    description:
      'Single-phase transformer: construction, working principle, EMF equation, transformation ratio, types of losses, voltage regulation, and efficiency at various loads. DC motors: principle, back EMF, and types (series, shunt). Three-phase induction motor: rotating magnetic field, slip, and torque-speed characteristics. Single-phase motors: split-phase, capacitor-start, and capacitor-run types.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Programming and Problem Solving  (107005)  |  Semester 1
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-pps-u1',
    name: 'Problem Solving and Algorithm Design',
    subjectId: 'fe-pps',
    subjectName: 'Programming and Problem Solving',
    difficulty: 'Easy',
    description:
      'Problem-solving methodology: understanding, devising a plan, carrying it out, and reviewing. Algorithms: definition, properties, and design techniques. Flowcharts: symbols, construction, and tracing. Pseudocode conventions. Program development cycle (problem definition, analysis, coding, testing, documentation). Introduction to computational thinking.',
  },
  {
    id: 'fe-pps-u2',
    name: 'Python Programming Basics',
    subjectId: 'fe-pps',
    subjectName: 'Programming and Problem Solving',
    difficulty: 'Easy',
    description:
      'Introduction to Python: features, applications, and the Python ecosystem. IDLE and script mode. Variables, identifiers, and keywords. Primitive data types: int, float, complex, bool, str. Operators: arithmetic, relational, logical, bitwise, assignment, and precedence. Input/output functions: input(), print(), and type casting.',
  },
  {
    id: 'fe-pps-u3',
    name: 'Control Structures',
    subjectId: 'fe-pps',
    subjectName: 'Programming and Problem Solving',
    difficulty: 'Easy',
    description:
      'Decision-making statements: if, if-else, if-elif-else, and nested conditionals. Iterative constructs: while loop, for loop (with range), and do-while equivalent. Nested loops and loop control statements: break, continue, and pass. Practical programs: number patterns, prime numbers, factorial, Fibonacci series.',
  },
  {
    id: 'fe-pps-u4',
    name: 'Functions and Modules',
    subjectId: 'fe-pps',
    subjectName: 'Programming and Problem Solving',
    difficulty: 'Medium',
    description:
      'Defining and calling functions. Parameters: positional, keyword, default, and variable-length (*args, **kwargs). Return values and multiple return. Scope and lifetime of variables (local vs global). Recursive functions and classic recursive algorithms. Lambda expressions. Importing and using standard library modules (math, random, os).',
  },
  {
    id: 'fe-pps-u5',
    name: 'Data Structures',
    subjectId: 'fe-pps',
    subjectName: 'Programming and Problem Solving',
    difficulty: 'Medium',
    description:
      'Lists: creation, indexing, slicing, mutability, and built-in methods (append, insert, remove, sort). Tuples: immutability and use cases. Sets: union, intersection, difference, and membership. Dictionaries: key-value pairs, CRUD operations, and iteration. String methods: split, join, strip, replace, format, and f-strings.',
  },
  {
    id: 'fe-pps-u6',
    name: 'Object-Oriented Programming and File Handling',
    subjectId: 'fe-pps',
    subjectName: 'Programming and Problem Solving',
    difficulty: 'Hard',
    description:
      'OOP concepts: classes, objects, constructors (__init__), instance and class variables, methods. Pillars of OOP: encapsulation, inheritance (single and multiple), polymorphism, and method overriding. Exception handling: try-except-else-finally, raising exceptions. File I/O: opening, reading (read, readline, readlines), writing, and appending to text files.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Engineering Mathematics – II  (107008)  |  Semester 2
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-math2-u1',
    name: 'First-Order Differential Equations',
    subjectId: 'fe-math2',
    subjectName: 'Engineering Mathematics – II',
    difficulty: 'Medium',
    description:
      'Definition, order, and degree of differential equations. Formation of differential equations. Solutions of variable-separable, exact, linear (integrating-factor method), and Bernoulli\'s differential equations. Reducible types. Applications: orthogonal trajectories, Newton\'s law of cooling, electrical circuits.',
  },
  {
    id: 'fe-math2-u2',
    name: 'Integral Calculus',
    subjectId: 'fe-math2',
    subjectName: 'Engineering Mathematics – II',
    difficulty: 'Hard',
    description:
      'Reduction formulae for powers of sine, cosine, and their products. Beta and Gamma functions: definitions, properties, and inter-relation. Differentiation under the integral sign (Leibniz rule). Error function (erf) and complementary error function (erfc). Applications to engineering problems involving definite integrals.',
  },
  {
    id: 'fe-math2-u3',
    name: 'Curve Tracing and Solid Geometry',
    subjectId: 'fe-math2',
    subjectName: 'Engineering Mathematics – II',
    difficulty: 'Medium',
    description:
      'Tracing of Cartesian, polar, and parametric curves: symmetry, asymptotes, intercepts, and key points. Rectification of curves (arc length). Introduction to 3D coordinate systems: Cartesian, spherical polar, and cylindrical. Equations of spheres, cylinders, and standard conicoids.',
  },
  {
    id: 'fe-math2-u4',
    name: 'Fourier Series and Applications',
    subjectId: 'fe-math2',
    subjectName: 'Engineering Mathematics – II',
    difficulty: 'Hard',
    description:
      'Review of Dirichlet\'s conditions. Full-range and half-range Fourier series for functions with arbitrary period. Fourier series of even and odd functions. Harmonic analysis using tabulated data. Applications to periodic engineering signals, wave equations, and heat conduction problems.',
  },
  {
    id: 'fe-math2-u5',
    name: 'Numerical Methods and Statistics',
    subjectId: 'fe-math2',
    subjectName: 'Engineering Mathematics – II',
    difficulty: 'Hard',
    description:
      'Numerical solutions of algebraic and transcendental equations: bisection, Newton-Raphson, and secant methods. Numerical integration: trapezoidal rule and Simpson\'s 1/3 and 3/8 rules. Statistical measures: mean, variance, and standard deviation. Probability distributions: binomial, Poisson, and normal (Gaussian). Curve fitting and linear regression.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Engineering Chemistry  (107009)  |  Semester 2
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-chem-u1',
    name: 'Water Technology',
    subjectId: 'fe-chem',
    subjectName: 'Engineering Chemistry',
    difficulty: 'Easy',
    description:
      'Impurities in water and their effects. Hardness: types (temporary/permanent), units, and EDTA determination method with numericals. Alkalinity of water and its determination. Boiler problems caused by hard water: scale, sludge, priming, foaming, and caustic embrittlement. Treatment methods: lime-soda process, zeolite process, ion exchange (demineralization). Purification by reverse osmosis, electrodialysis, and atmospheric water generation.',
  },
  {
    id: 'fe-chem-u2',
    name: 'Instrumental Methods of Analysis',
    subjectId: 'fe-chem',
    subjectName: 'Engineering Chemistry',
    difficulty: 'Medium',
    description:
      'Electrochemical methods: types of reference electrodes (calomel electrode), indicator electrodes (glass electrode), and ion-selective electrodes. Conductometry: conductance measurement and conductometric titrations. Potentiometry: pH measurement using glass electrode, pHmetry standardisation. UV-visible spectroscopy: Beer\'s law, Lambert\'s law, Beer-Lambert law, electronic transitions, spectrophotometer instrumentation, and analytical applications.',
  },
  {
    id: 'fe-chem-u3',
    name: 'Advanced Engineering Materials',
    subjectId: 'fe-chem',
    subjectName: 'Engineering Chemistry',
    difficulty: 'Medium',
    description:
      'Polymers: addition and condensation polymerisation mechanisms. Thermoplastics vs thermosetting plastics with examples (PVC, nylon, bakelite, epoxy). Engineering plastics: polycarbonate, PTFE, and kevlar. Specialty polymers: conducting polymers and biodegradable polymers. Nanomaterials: zero-D (quantum dots), one-D (CNTs), two-D (graphene) classification. Properties, synthesis (top-down and bottom-up), and applications in electronics, medicine, and energy.',
  },
  {
    id: 'fe-chem-u4',
    name: 'Energy Sources and Fuels',
    subjectId: 'fe-chem',
    subjectName: 'Engineering Chemistry',
    difficulty: 'Medium',
    description:
      'Definition and classification of fuels (solid, liquid, gaseous). Calorific value: gross and net CV, Dulong\'s formula. Solid fuels: coal types, proximate and ultimate analysis with numericals. Liquid fuels: petroleum composition, fractional distillation, cracking (thermal and catalytic), octane number, cetane number. Alternative fuels: power alcohol, biodiesel, and hydrogen. Hydrogen gas as fuel: production and storage. Lithium-ion batteries: construction, working, advantages, and applications.',
  },
  {
    id: 'fe-chem-u5',
    name: 'Corrosion and Its Prevention',
    subjectId: 'fe-chem',
    subjectName: 'Engineering Chemistry',
    difficulty: 'Hard',
    description:
      'Corrosion definition and economic significance. Dry (chemical) corrosion: oxidation, hydrogen evolution, and oxygen absorption mechanisms. Wet (electrochemical) corrosion: galvanic cell, differential aeration cell, and waterline corrosion. Factors affecting corrosion rate. Prevention methods: cathodic protection (sacrificial anode and impressed current), metallic coatings (galvanising, tinning, electroplating), and protective paints and anti-corrosive coatings.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Basic Electronics Engineering  (107006)  |  Semester 2
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-bele-u1',
    name: 'Semiconductor Diodes and Rectifiers',
    subjectId: 'fe-bele',
    subjectName: 'Basic Electronics Engineering',
    difficulty: 'Easy',
    description:
      'PN junction formation: depletion layer, barrier potential, and biasing (forward and reverse). Diode I-V characteristics, diode equation, and ideal vs practical diode. Rectifiers: half-wave, full-wave centre-tap, and bridge rectifiers — circuit analysis, waveforms, and performance parameters (ripple factor, efficiency, PIV). Filter circuits: shunt capacitor and LC filters. Zener diode: characteristics, zener breakdown, and voltage regulator circuit.',
  },
  {
    id: 'fe-bele-u2',
    name: 'Bipolar Junction Transistors (BJT)',
    subjectId: 'fe-bele',
    subjectName: 'Basic Electronics Engineering',
    difficulty: 'Medium',
    description:
      'BJT construction: NPN and PNP, regions, and current components. Configurations: Common Base (CB), Common Emitter (CE), and Common Collector (CC) — input/output characteristics, current gain (α, β, γ) relationships. DC biasing circuits: fixed bias and voltage divider bias for stability. Operating point (Q-point). Transistor as a switch: saturation and cut-off regions. BJT as an amplifier: small-signal model and voltage gain.',
  },
  {
    id: 'fe-bele-u3',
    name: 'Field Effect Transistors (FET)',
    subjectId: 'fe-bele',
    subjectName: 'Basic Electronics Engineering',
    difficulty: 'Medium',
    description:
      'JFET: construction, operation, drain and transfer characteristics, transconductance (gm). MOSFET: enhancement and depletion types, n-channel and p-channel MOSFETs, drain characteristics. CMOS technology and its advantages in digital ICs. Biasing of FETs. Small-signal model of MOSFET. Comparison of BJT and FET for switching and amplification applications.',
  },
  {
    id: 'fe-bele-u4',
    name: 'Operational Amplifiers',
    subjectId: 'fe-bele',
    subjectName: 'Basic Electronics Engineering',
    difficulty: 'Hard',
    description:
      'Ideal op-amp characteristics: infinite gain, infinite input impedance, zero output impedance, infinite bandwidth. Practical parameters: CMRR, slew rate, and offset voltage. Inverting amplifier, non-inverting amplifier, and voltage follower. Summing amplifier, difference amplifier. Integrator and differentiator circuits with waveform analysis. Comparator: zero-crossing and threshold detection. Applications in signal processing and instrumentation.',
  },
  {
    id: 'fe-bele-u5',
    name: 'Digital Electronics Fundamentals',
    subjectId: 'fe-bele',
    subjectName: 'Basic Electronics Engineering',
    difficulty: 'Medium',
    description:
      'Number systems: binary, octal, hexadecimal — conversion and arithmetic. Binary codes: BCD, Gray code, and ASCII. Boolean algebra: postulates, theorems, De Morgan\'s theorems, and simplification. Logic gates: AND, OR, NOT, NAND, NOR, XOR, XNOR — truth tables and universal gates. Combinational circuits: half and full adders, multiplexer, and demultiplexer. Sequential circuits: SR, JK, D, and T flip-flops.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Engineering Graphics  (102012)  |  Semester 2
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-eg-u1',
    name: 'Fundamentals of Engineering Drawing',
    subjectId: 'fe-eg',
    subjectName: 'Engineering Graphics',
    difficulty: 'Easy',
    description:
      'Need and scope of engineering drawing. BIS conventions: sheet sizes, title block, borders. Types of lines and their applications. Lettering and numbering standards. Dimensioning: principles, methods, and conventions. Simple geometric constructions: bisecting lines and angles, polygons (inscribed and circumscribed), and introduction to scales.',
  },
  {
    id: 'fe-eg-u2',
    name: 'Introduction to Computer-Aided Drafting (CAD)',
    subjectId: 'fe-eg',
    subjectName: 'Engineering Graphics',
    difficulty: 'Easy',
    description:
      'Evolution and significance of CAD over manual drafting. CAD software interface: toolbars, command line, coordinate systems (absolute, relative, polar). 2D drafting commands: LINE, CIRCLE, ARC, RECTANGLE, POLYGON. Editing commands: TRIM, EXTEND, OFFSET, MIRROR, ARRAY, ROTATE. Annotation: dimensioning and text tools. Introduction to 3D modelling concepts.',
  },
  {
    id: 'fe-eg-u3',
    name: 'Engineering Curves',
    subjectId: 'fe-eg',
    subjectName: 'Engineering Graphics',
    difficulty: 'Medium',
    description:
      'Conic sections: eccentricity method to construct ellipse, parabola, and hyperbola; their engineering significance (parabolic reflectors, elliptical arches). Special curves: Archimedean and logarithmic spirals. Helix for cone and cylinder. Rolling curves: involute (gear tooth profile), cycloid (motion analysis), and epicycloid and hypocycloid.',
  },
  {
    id: 'fe-eg-u4',
    name: 'Orthographic Projection',
    subjectId: 'fe-eg',
    subjectName: 'Engineering Graphics',
    difficulty: 'Hard',
    description:
      'Principles of orthographic projection. First angle (European) and third angle (American) projection methods and their symbols. Projection of points, lines, and planes in various positions relative to reference planes. Projection of regular solids (prisms, pyramids, cylinders, cones) in simple and oblique positions. Reading and interpreting multi-view drawings.',
  },
  {
    id: 'fe-eg-u5',
    name: 'Isometric and Perspective Projections',
    subjectId: 'fe-eg',
    subjectName: 'Engineering Graphics',
    difficulty: 'Medium',
    description:
      'Isometric projection: isometric scale, isometric axes and planes. Drawing isometric projections of prisms, pyramids, cylinders, cones, and their combinations. Converting orthographic views to isometric views. Oblique projection: cavalier and cabinet methods. Introduction to perspective projection: one-point and two-point perspectives and their use in architectural representation.',
  },
  {
    id: 'fe-eg-u6',
    name: 'Development of Lateral Surfaces',
    subjectId: 'fe-eg',
    subjectName: 'Engineering Graphics',
    difficulty: 'Hard',
    description:
      'Concept of lateral surface development and its industrial applications (sheet metal fabrication, packaging). Parallel-line development: prisms and cylinders. Radial-line development: pyramids and cones. Development of lateral surfaces of solids cut by oblique planes (section planes). Practical applications: duct joints, hoppers, funnel shapes.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Engineering Mechanics  (107011)  |  Semester 2
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fe-em-u1',
    name: 'Resolution and Composition of Forces',
    subjectId: 'fe-em',
    subjectName: 'Engineering Mechanics',
    difficulty: 'Easy',
    description:
      'Fundamental principles of statics. Force systems: collinear, concurrent, parallel, and general coplanar. Resolution and composition of forces: component method and graphical method. Resultant of concurrent coplanar forces. Moment of a force about a point, Varignon\'s theorem. Couple and moment of a couple. Resultant of parallel and general coplanar force systems. Equivalent force-couple systems.',
  },
  {
    id: 'fe-em-u2',
    name: 'Distributed Forces, Centroids, and Friction',
    subjectId: 'fe-em',
    subjectName: 'Engineering Mechanics',
    difficulty: 'Medium',
    description:
      'Centroid of lines, areas, and volumes: first moment of area, centroid of standard shapes (triangle, semicircle, quarter circle). Centroid of composite plane figures and wire bends. Moment of inertia of standard shapes; parallel-axis and perpendicular-axis theorems; MI of composite figures. Laws of dry friction (Coulomb\'s laws). Angle of friction, angle of repose. Applications: block on inclined planes, wedges, ladder friction, and belt friction.',
  },
  {
    id: 'fe-em-u3',
    name: 'Equilibrium of Rigid Bodies',
    subjectId: 'fe-em',
    subjectName: 'Engineering Mechanics',
    difficulty: 'Medium',
    description:
      'Conditions of equilibrium for coplanar force systems. Free body diagrams (FBD): types of supports (pin, roller, fixed) and reactions. Equilibrium of concurrent, parallel, and general coplanar forces. Two-force and three-force members. Beam reactions for simply supported, overhanging, and cantilever beams under various load types (point, UDL, UVL). Introduction to 3D equilibrium.',
  },
  {
    id: 'fe-em-u4',
    name: 'Analysis of Structures',
    subjectId: 'fe-em',
    subjectName: 'Engineering Mechanics',
    difficulty: 'Hard',
    description:
      'Perfect, imperfect, and redundant frames. Analysis of plane trusses: method of joints and method of sections — determination of member forces (tensile/compressive). Analysis of plane frames: finding support reactions and internal forces. Cables under concentrated and distributed loads: catenary and parabolic cable analysis. Applications in bridges, roof structures, and transmission lines.',
  },
  {
    id: 'fe-em-u5',
    name: 'Kinematics of Particles',
    subjectId: 'fe-em',
    subjectName: 'Engineering Mechanics',
    difficulty: 'Medium',
    description:
      'Rectilinear motion: displacement, velocity, acceleration; uniformly accelerated motion, motion under gravity. Variable acceleration: acceleration as a function of time, displacement, or velocity; use of v-t and a-t curves and their areas. Curvilinear motion: position vector, velocity, and acceleration in 2D. Normal and tangential components of acceleration. Projectile motion: range, time of flight, maximum height, and trajectory equation.',
  },
  {
    id: 'fe-em-u6',
    name: 'Kinetics of Particles',
    subjectId: 'fe-em',
    subjectName: 'Engineering Mechanics',
    difficulty: 'Hard',
    description:
      'Newton\'s second law of motion applied to particles. D\'Alembert\'s principle and inertia force approach. Work done by a force, work-energy theorem, kinetic energy. Conservative forces and potential energy. Conservation of mechanical energy. Power and efficiency. Impulse and momentum: linear impulse-momentum theorem, conservation of linear momentum. Impact: direct central impact, coefficient of restitution, and types of impact (elastic, plastic, partially elastic).',
  },
];

@Injectable({ providedIn: 'root' })
export class UnitService {
  private units: Unit[] = [...MOCK_UNITS];

  getAll(): Observable<Unit[]> {
    return of([...this.units]).pipe(delay(100));
  }

  create(form: UnitForm): Observable<Unit> {
    const unit: Unit = { id: crypto.randomUUID(), subjectName: '', ...form };
    this.units = [...this.units, unit];
    return of(unit).pipe(delay(100));
  }

  update(unit: Unit): Observable<Unit> {
    this.units = this.units.map((u) =>
      u.id === unit.id ? unit : u,
    );
    return of(unit).pipe(delay(100));
  }

  delete(id: string): Observable<void> {
    this.units = this.units.filter((u) => u.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
