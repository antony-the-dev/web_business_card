// ===== figure.js — the glazed transformer solid (hero figure) =====
// Standalone: needs only Three.js (r128) and a box + canvas on the page. The home
// page runs it with the defaults below; other pages (portfolio, 404) set
// window.FIGURE_OPTS before loading this file:
//   box / canvas   element ids (default "hero-canvas-container" / "cube-canvas")
//   panFrac, panY  where the figure sits in its box (home: right-shifted hero)
//   scrollShrink   desktop shrink as the page scrolls (home only)
//   scale          { desktop, mobile } figure scale override
//   bandless       true = ignore the home page's mobile band stretch vars
//   frame          the canvas box is this many times the figure's own frame (default 1):
//                  a bigger transparent canvas gives flying pieces room — the camera
//                  zooms out by the same factor so the figure keeps its size
//   hit            id of the element that takes clicks/drags (default: the canvas) —
//                  lets an oversized canvas stay pointer-events: none

// ===== shared: soft round sprite so points render as circles =====
function makeCircleTexture() {
    const s = 64; const c = document.createElement("canvas"); c.width = c.height = s;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0.0, "rgba(255,255,255,1)"); g.addColorStop(0.6, "rgba(255,255,255,0.85)"); g.addColorStop(1.0, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); ctx.fill();
    return new THREE.CanvasTexture(c);
}




// ===== HERO FIGURE (a glazed strut-built solid that re-assembles itself on tap) =====
// The figure is a set of rigid struts (lattice edges) with a dot on each end,
// every lattice cell glazed with a faint pane of glass. At rest it "breathes" as
// an exploded view (faces drift out along their normals in a slow rolling wave),
// a light plane now and then scans it bottom-up, and on desktop it leans toward
// the cursor. A click / tap re-assembles it like a transformer: the glass comes
// off, strut by strut (bottom to top) each piece pops out, swings round and
// clicks into its slot on the next solid with an orange spark, then the new
// solid glazes bottom-up: cube -> hex prism -> icosahedron (with a neural net
// inside) -> octahedron -> cube ... It never switches on its own (user's call).
// All tuning lives in SCENE_CONFIG.
(function () {
    const OPTS = window.FIGURE_OPTS || {};
    const canvas = document.getElementById(OPTS.canvas || "cube-canvas");
    const hero = document.getElementById(OPTS.box || "hero-canvas-container");
    if (!canvas || !hero || typeof THREE === "undefined") return;
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const FRAME = OPTS.frame || 1;
    const hit = (OPTS.hit && document.getElementById(OPTS.hit)) || canvas;

    // ===== THEME PALETTES: the figure recolors itself when the theme flips =====
    // ink/cube/orange = the three stops every dot slowly drifts through;
    // cube is also the wireframe + glass tint, scan the colour of the scan light
    const PALETTES = {
        light: {
            ink: [0.039, 0.145, 0.251],    // site --ink #0a2540
            cube: [0.08, 0.72, 0.77],      // site teal
            orange: [1.0, 0.34, 0.13],     // spark / twinkle accent (site --accent #ff5722)
            scan: [0.02, 0.42, 0.5],       // deep teal: reads on white
            glint: [0.02, 0.42, 0.5]       // pane highlight (white would vanish on white)
        },
        dark: {
            ink: [0.93, 0.97, 1.0],        // luminous off-white on navy
            cube: [0.13, 0.83, 0.93],      // bright cyan
            orange: [1.0, 0.34, 0.13],
            scan: [0.85, 1.0, 1.0],        // near-white cyan glow
            glint: [1.0, 1.0, 1.0]         // pane highlight
        }
    };
    const isDarkTheme = () => document.documentElement.classList.contains("dark");

    // ===== SCENE_CONFIG — the single tuning surface =====
    const SCENE_CONFIG = {
        cube: {
            desktop: { scale: 0.9, grid: 3, lineOpacity: 0.5, rot: 0.0025 },
            mobile: { scale: 1, grid: 3, lineOpacity: 0.25, rot: 0.0025 }
        },
        // the solids a tap steps through, in order (the first one is home)
        shapes: ["cube", "hexPrism", "icosahedron", "octahedron"],   // no pyramid: after the cube it read as a downgrade
        // one rebuild: every strut pops out, swings round and clicks into the next solid
        build: {
            durationMs: 3000,  // whole rebuild: first strut lift-off to the last click
            strutMs: 750,      // one strut's own trip (pop out -> swing -> click in); short vs
                               // durationMs = fewer pieces in the air at once, reads piece by piece
            lift: 0.3,         // how far a strut pops out of the body before it travels
            jitter: 0.15       // shuffle in the bottom-up assembly order (0 = strict sweep)
        },
        // volume: every lattice cell is a pane of glass — a faint fill plus an inner
        // glow hugging its edges, stronger where the pane turns away from the camera
        glass: { opacity: { desktop: 0.85, mobile: 0.8 }, glazeMs: 1400 },
        // extras layered on a rebuild — each one can be switched off on its own
        rebuildFx: {
            // the glass panes ARE the construction pieces: every pane breaks off as a
            // shard, tumbles over and docks into the next solid with a flash of light
            shards: { on: true, ms: 1100, lift: 0.4, tumble: 1.3, glintMs: 550 },
            blueprint: { on: true, drawMs: 800, opacity: { desktop: 0.4, mobile: 0.35 } }, // the next solid's dashed outline is drawn first; the pieces dock into it
            settle: { on: true, ms: 800, amp: 0.04 },            // the finished solid settles with one small bounce...
            verifyScan: true,                                    // ...and one scan pass checks it over
            push: 0.07                                           // the camera leans in by this fraction mid-rebuild
        },
        // breathing = an exploded view: faces drift out along their normals in a
        // slow wave rolling across the solid, then settle back (no scaling)
        explode: { amp: { desktop: 0.1, mobile: 0.05 }, periodMs: 4800, wave: 2.2 },
        // an analysis scan: a plane of light sweeps bottom-up through the solid now and then
        scan: { everyMs: 7000, sweepMs: 2400, width: 0.22, firstDelayMs: 3500 },
        // a neural net inside some solids: neurons + synapses, all but invisible at
        // rest — the scan's light makes the links it crosses fire (keep it subtle)
        neural: { shapes: ["icosahedron"], neurons: 26, links: 3, base: 0.02, peak: 0.5, width: 0.3 },
        // desktop: the solid leans a little toward the cursor (radians at the screen edge)
        parallax: { x: 0.16, y: 0.28, ease: 0.04 },
        // glass light: a glint whenever a pane turns into the light as the solid
        // spins, the far side dimmed for depth, and (desktop) a soft torch that
        // follows the cursor over the glass, struts and dots
        light: { spec: 0.55, shine: 28, depthFloor: 0.4, hover: 0.5, hoverR: 0.045 },
        // grab & spin: the solid can be dragged round (mouse drag / sideways swipe)
        // and coasts on with inertia
        touch: { spin: 0.006, friction: 0.95, maxPitch: 0.5, dragPx: 6 },
        dot: { size: 0.05, opacity: 0.6 },
        colors: isDarkTheme() ? PALETTES.dark : PALETTES.light,
        cubeDiagonals: true,               // face diagonals on the cube (false = plain grid)
        twinkle: { rate: 2, decay: 0.0020, blinkAmp: 1.3, blinkSpeed: 0.025 },
        wobble: 0.5,           // camera axis precession: 0 = plain orbit, higher = livelier
        entrance: { from: 1.25, ms: 1200 }, // on load the solid settles in from slightly enlarged
        bootFadeMs: 500,       // figure fades in on load instead of popping in fully formed
        scrollShrink: "scrollShrink" in OPTS ? OPTS.scrollShrink : 0.2, // desktop only: figure shrinks as the hero scrolls away (0 = off)
        panFrac: "panFrac" in OPTS ? OPTS.panFrac : 0.20,              // shift figure toward screen-right on desktop (0 = centred)
        // nudges the figure UP/DOWN inside the existing frame (frame/canvas size
        // untouched). Positive = up, in (roughly) on-screen pixels.
        figurePanY: OPTS.panY || { mobile: 45, desktop: 0 }
    };
    const C = SCENE_CONFIG;
    if (OPTS.scale) { C.cube.desktop.scale = OPTS.scale.desktop; C.cube.mobile.scale = OPTS.scale.mobile; }
    const WAVE_DIR = new THREE.Vector3(0.3, 1, 0.2).normalize(); // the breathing wave rolls mostly upward

    // ----- active profile: chosen by viewport, live-switches on rotate/resize -----
    const mq = window.matchMedia("(max-width: 900px)");
    let vp = mq.matches ? "mobile" : "desktop";

    const HALF = 1.1;  // cube half-size in scene units — the other solids are sized to sit in the same box

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, hero.clientWidth / hero.clientHeight, 0.1, 1000);
    camera.position.z = 3.0;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(hero.clientWidth, hero.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // ----- mobile band stretch: two independent levers. --band-up grows the band
    // UPWARD, --band-down grows it DOWNWARD. Both only add transparent margin: the
    // figure's size AND on-screen position stay frozen (scale locked to the BASE
    // band height), so neither lever inflates or moves the figure. -----
    function bandPx(name) {
        if (OPTS.bandless) return 0;
        return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
    }
    // reference height that fixes the figure's on-screen scale (dots + geometry)
    function heroScaleH() {
        if (vp !== "mobile") return hero.clientHeight;
        return Math.max(1, hero.clientHeight - bandPx("--band-up") - bandPx("--band-down"));
    }

    function applyHeroPan() {
        const w = hero.clientWidth, h = hero.clientHeight;
        camera.zoom = 1 / FRAME;   // oversized canvas: same figure size, more room around it
        if (vp === "mobile") {
            // Freeze scale to the base band height; render into the full (taller)
            // canvas. Offset by exactly --band-up so the figure holds its absolute
            // screen position while the extra top/bottom space stays transparent.
            const hRef = heroScaleH();
            camera.aspect = w / hRef;                       // keep dots square vs frozen scale
            camera.setViewOffset(w, hRef, 0, -bandPx("--band-up") + C.figurePanY.mobile, w, h);
        } else {
            camera.aspect = w / h;
            camera.setViewOffset(w, h, -w * C.panFrac, C.figurePanY.desktop, w, h);
        }
    }
    applyHeroPan();

    // ===== SOLIDS =====
    // Every solid is built face by face into { struts, tiles }:
    //   strut = [p, q, n, c] — a lattice edge plus its face's outward normal/centre
    //   tile  = [[p1, p2, p3], [b1, b2, b3], n, c] — one glass triangle; b = edge
    //           coordinates (0 on a real edge, a quad's split diagonal is pinned to 1
    //           so it never glows)
    // Edges shared by two faces are TWO struts: they read brighter than the inner
    // lattice (the old cube cage look) and part like panels when the solid breathes.
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const lerp3 = (A, B, D, u, v) => [0, 1, 2].map((d) => A[d] + (B[d] - A[d]) * u + (D[d] - A[d]) * v);
    // outward unit normal of the plane (A, B, D) + the face centre
    function facing(A, B, D, c) {
        let n = norm(cross(sub(B, A), sub(D, A)));
        if (n[0] * c[0] + n[1] * c[1] + n[2] * c[2] < 0) n = [-n[0], -n[1], -n[2]];
        return n;
    }

    // triangle face A,B,C cut into an F-frequency triangular lattice
    function triFace(out, A, B, C3, F) {
        const c = [0, 1, 2].map((d) => (A[d] + B[d] + C3[d]) / 3), n = facing(A, B, C3, c);
        const P = (i, j) => lerp3(A, B, C3, i / F, j / F);
        const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        for (let i = 0; i < F; i++) for (let j = 0; i + j < F; j++) {
            out.struts.push([P(i, j), P(i + 1, j), n, c], [P(i, j), P(i, j + 1), n, c], [P(i + 1, j), P(i, j + 1), n, c]);
            out.tiles.push([[P(i, j), P(i + 1, j), P(i, j + 1)], I, n, c]);                              // upward cell
            if (i + j < F - 1) out.tiles.push([[P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], I, n, c]);  // downward cell
        }
    }
    // quad face spanned by A->B (nu cells) and A->D (nv cells)
    function quadFace(out, A, B, D, nu, nv) {
        const c = lerp3(A, B, D, 0.5, 0.5), n = facing(A, B, D, c);
        const P = (i, j) => lerp3(A, B, D, i / nu, j / nv);
        for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
            if (i < nu) out.struts.push([P(i, j), P(i + 1, j), n, c]);
            if (j < nv) out.struts.push([P(i, j), P(i, j + 1), n, c]);
            if (i < nu && j < nv) {
                // two triangles, diagonal P(i,j)-P(i+1,j+1) pinned so only the cell's rim glows
                out.tiles.push([[P(i, j), P(i + 1, j), P(i + 1, j + 1)], [[1, 1, 0], [0, 1, 0], [0, 1, 1]], n, c]);
                out.tiles.push([[P(i, j), P(i + 1, j + 1), P(i, j + 1)], [[1, 0, 1], [0, 0, 1], [0, 1, 1]], n, c]);
            }
        }
    }

    const SOLIDS = {
        // the original cage: a G x G grid on every face + corner-to-corner diagonals
        cube(G) {
            const out = { struts: [], tiles: [] }, H = HALF, faces = [];
            for (const s of [-H, H]) {
                faces.push([[s, -H, -H], [s, H, -H], [s, -H, H]]);   // x = ±H
                faces.push([[-H, s, -H], [H, s, -H], [-H, s, H]]);   // y = ±H
                faces.push([[-H, -H, s], [H, -H, s], [-H, H, s]]);   // z = ±H
            }
            for (const [A, B, D] of faces) {
                quadFace(out, A, B, D, G, G);
                if (C.cubeDiagonals) {
                    // corner-to-corner, the site's cube motif
                    const c = lerp3(A, B, D, 0.5, 0.5), n = facing(A, B, D, c);
                    const P = (i, j) => lerp3(A, B, D, i / G, j / G);
                    for (let k = 0; k < G; k++) out.struts.push([P(k, k), P(k + 1, k + 1), n, c], [P(k, G - k), P(k + 1, G - k - 1), n, c]);
                }
            }
            return out;
        },
        octahedron() {
            const out = { struts: [], tiles: [] }, R = HALF * 1.5, F = 3;
            const X = [[R, 0, 0], [-R, 0, 0]], Y = [[0, R, 0], [0, -R, 0]], Z = [[0, 0, R], [0, 0, -R]];
            for (const x of X) for (const y of Y) for (const z of Z) triFace(out, x, y, z, F);
            return out;
        },
        // the site's hexagon, extruded — tilted forward so the cap reads as a hexagon
        hexPrism() {
            const out = { struts: [], tiles: [] }, R = HALF * 1.2, H = HALF * 0.8;
            const ring = (y) => [0, 1, 2, 3, 4, 5].map((k) => {
                const a = Math.PI / 6 + k * Math.PI / 3;
                return [Math.cos(a) * R, y, Math.sin(a) * R];
            });
            const top = ring(H), bot = ring(-H);
            for (let k = 0; k < 6; k++) {
                const k1 = (k + 1) % 6;
                triFace(out, [0, H, 0], top[k], top[k1], 2);     // caps: 6-slice fan
                triFace(out, [0, -H, 0], bot[k], bot[k1], 2);
                quadFace(out, top[k], top[k1], bot[k], 1, 2);    // sides: edges + one mid ring
                // cross-bracing in every side cell — the cube's diagonal motif, so the
                // prism reads as the same family instead of an empty box
                const A = top[k], B = top[k1], D = bot[k], c = lerp3(A, B, D, 0.5, 0.5), n = facing(A, B, D, c);
                const P = (i, j) => lerp3(A, B, D, i, j / 2);
                for (let j = 0; j < 2; j++) out.struts.push([P(0, j), P(1, j + 1), n, c], [P(1, j), P(0, j + 1), n, c]);
            }
            return out;
        },
        // 20 triangles, each split once — reads as a geodesic ball
        icosahedron() {
            const out = { struts: [], tiles: [] }, R = HALF * 1.45, p = (1 + Math.sqrt(5)) / 2;
            const V = [];
            for (const a of [-1, 1]) for (const b of [-p, p]) V.push([0, a, b], [a, b, 0], [b, 0, a]);
            const n = Math.hypot(1, p);
            V.forEach((v) => { v[0] *= R / n; v[1] *= R / n; v[2] *= R / n; });
            const edge = 2 * R / n, near = (a, b) => Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) - edge) < 1e-6;
            for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) for (let c = b + 1; c < 12; c++) {
                if (near(V[a], V[b]) && near(V[b], V[c]) && near(V[a], V[c])) triFace(out, V[a], V[b], V[c], 2);
            }
            return out;
        }
    };
    const TILT = { hexPrism: [0.42, 0, 0.18] };   // x/y/z rotation baked into a solid

    // ----- glass: one mesh per solid; the breathing offset and the scan light are
    // computed in the shader from the same formula the CPU uses for the struts -----
    const shared = {
        uTime: { value: 0 }, uAmp: { value: 0 }, uOmega: { value: 0 }, uKappa: { value: C.explode.wave },
        uDir: { value: WAVE_DIR }, uScanY: { value: 99 }, uScanW: { value: C.scan.width },
        uColor: { value: new THREE.Color() }, uScanColor: { value: new THREE.Color() },
        uGlintColor: { value: new THREE.Color() }, uLight: { value: new THREE.Vector3(-0.5, 0.75, 0.45).normalize() },
        uSpec: { value: C.light.spec }, uShine: { value: C.light.shine }, uDepthFloor: { value: C.light.depthFloor },
        uNear: { value: 1 }, uFar: { value: 5 }, uMouse: { value: new THREE.Vector2(9, 9) }, uAspect: { value: 1 },
        uHover: { value: 0 }, uHoverR: { value: C.light.hoverR }
    };
    const glassVS = [
        "attribute vec3 aBary;",
        "attribute vec3 aNormalF;",
        "attribute vec3 aCenter;",
        "attribute float aDelay;",
        "attribute float aGlint;",
        "uniform float uTime, uAmp, uOmega, uKappa, uScanY, uScanW, uGlaze, uNear, uFar, uAspect, uHoverR;",
        "uniform vec3 uDir;",
        "uniform vec2 uMouse;",
        "varying vec3 vBary, vN, vV;",
        "varying float vFres, vScan, vGlaze, vGlint, vDepth, vHover;",
        "void main() {",
        "    float w = 0.5 + 0.5 * sin(uOmega * uTime - uKappa * dot(aCenter, uDir));",
        "    vec3 p = position + aNormalF * uAmp * w;",
        "    vGlint = aGlint;",
        "    vec4 mv = modelViewMatrix * vec4(p, 1.0);",
        "    vec3 nv = normalize(normalMatrix * aNormalF), vv = normalize(-mv.xyz);",
        "    vFres = pow(1.0 - abs(dot(nv, vv)), 2.0);",
        "    vN = nv; vV = vv;",
        "    vDepth = clamp((uFar + mv.z) / (uFar - uNear), 0.0, 1.0);   // 1 = nearest pane, 0 = far side",
        "    float s = (p.y - uScanY) / uScanW;",
        "    vScan = exp(-s * s);",
        "    vGlaze = smoothstep(aDelay, aDelay + 0.25, uGlaze);",
        "    vBary = aBary;",
        "    gl_Position = projectionMatrix * mv;",
        "    vec2 dm = (gl_Position.xy / gl_Position.w - uMouse) * vec2(uAspect, 1.0);",
        "    vHover = exp(-dot(dm, dm) / uHoverR);   // cursor torch",
        "}"
    ].join("\n");
    const glassFS = [
        "uniform vec3 uColor, uScanColor, uGlintColor, uLight;",
        "uniform float uOpacity, uSpec, uShine, uDepthFloor, uHover;",
        "varying vec3 vBary, vN, vV;",
        "varying float vFres, vScan, vGlaze, vGlint, vDepth, vHover;",
        "void main() {",
        "    float e = min(min(vBary.x, vBary.y), vBary.z);   // 0 on the pane's rim",
        "    float rim = 1.0 - smoothstep(0.0, 0.2, e);        // inner glow hugging the rim",
        "    float spec = uSpec * pow(abs(dot(vN, normalize(uLight + vV))), uShine);   // glint as a pane turns into the light",
        "    float hov = uHover * vHover;",
        "    float a = (0.05 + 0.3 * rim) * (0.3 + 0.7 * vFres) + 0.45 * vScan * (0.25 + rim) + 0.8 * vGlint * (0.25 + rim)",
        "            + spec * (0.35 + rim) + hov * (0.2 + rim);",
        "    vec3 col = mix(uColor, uScanColor, clamp(vScan + vGlint + 0.6 * hov, 0.0, 1.0));   // scan / docking flash / torch",
        "    col = mix(col, uGlintColor, clamp(spec, 0.0, 0.8));",
        "    a *= mix(uDepthFloor, 1.0, vDepth);   // far side dimmer: depth",
        "    gl_FragColor = vec4(col, a * uOpacity * vGlaze);",
        "}"
    ].join("\n");
    function glassMesh(tiles) {
        const T = tiles.length, V = T * 3;
        const P = new Float32Array(V * 3), Bc = new Float32Array(V * 3), Nf = new Float32Array(V * 3), Cf = new Float32Array(V * 3), Dl = new Float32Array(V);
        let lo = Infinity, hi = -Infinity;
        tiles.forEach((tl) => { const y = (tl[0][0][1] + tl[0][1][1] + tl[0][2][1]) / 3; lo = Math.min(lo, y); hi = Math.max(hi, y); });
        tiles.forEach((tl, t) => {
            const y = (tl[0][0][1] + tl[0][1][1] + tl[0][2][1]) / 3;
            for (let k = 0; k < 3; k++) {
                const v = t * 3 + k;
                P.set(tl[0][k], v * 3); Bc.set(tl[1][k], v * 3); Nf.set(tl[2], v * 3); Cf.set(tl[3], v * 3);
                Dl[v] = (y - lo) / ((hi - lo) || 1) * 0.9;   // glazes bottom-up
            }
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(P, 3));
        g.setAttribute("aBary", new THREE.BufferAttribute(Bc, 3));
        g.setAttribute("aNormalF", new THREE.BufferAttribute(Nf, 3));
        g.setAttribute("aCenter", new THREE.BufferAttribute(Cf, 3));
        g.setAttribute("aDelay", new THREE.BufferAttribute(Dl, 1));
        g.setAttribute("aGlint", new THREE.BufferAttribute(new Float32Array(V), 1));
        const m = new THREE.ShaderMaterial({
            uniforms: Object.assign({ uOpacity: { value: 0 }, uGlaze: { value: 0 } }, shared),
            vertexShader: glassVS, fragmentShader: glassFS,
            transparent: true, depthWrite: false, side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.visible = false;
        return mesh;
    }

    // the in-flight glass: one dynamic mesh holding every pane of a rebuild (the
    // union of both solids' panes); positions / normals / glints are written per frame
    let flight = null;
    function allocateFlight(T) {
        if (flight) { figure.remove(flight); flight.geometry.dispose(); flight.material.dispose(); }
        const V = T * 3, g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(V * 3), 3));
        g.setAttribute("aBary", new THREE.BufferAttribute(new Float32Array(V * 3), 3));
        g.setAttribute("aNormalF", new THREE.BufferAttribute(new Float32Array(V * 3), 3));
        g.setAttribute("aCenter", new THREE.BufferAttribute(new Float32Array(V * 3), 3));
        g.setAttribute("aDelay", new THREE.BufferAttribute(new Float32Array(V), 1));
        g.setAttribute("aGlint", new THREE.BufferAttribute(new Float32Array(V), 1));
        const m = new THREE.ShaderMaterial({
            uniforms: Object.assign({ uOpacity: { value: 0 }, uGlaze: { value: 1.3 } }, shared),
            vertexShader: glassVS, fragmentShader: glassFS,
            transparent: true, depthWrite: false, side: THREE.DoubleSide
        });
        flight = new THREE.Mesh(g, m);
        flight.visible = false;
        flight.frustumCulled = false;   // rewritten every frame — a cached bounding sphere would go stale
        figure.add(flight);
    }

    // The flight plan of every pane, old solid -> new: nearest-centre pairs first
    // (greedy, like the struts); spare old panes merge into their nearest new pane,
    // extra new panes split off their nearest old one. Each pair keeps the vertex
    // order that travels least, so a shard turns into its slot instead of flipping.
    const PERMS = [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]];
    let plan = null;
    function planShards(A, B) {
        const Ta = A.T, Tb = B.T, M = Math.max(Ta, Tb);
        const d2 = (a, i, b, j) => { const x = a.tcn[i * 3] - b.tcn[j * 3], y = a.tcn[i * 3 + 1] - b.tcn[j * 3 + 1], z = a.tcn[i * 3 + 2] - b.tcn[j * 3 + 2]; return x * x + y * y + z * z; };
        const n = Ta * Tb, cost = new Float32Array(n), idx = new Uint32Array(n);
        for (let i = 0; i < Ta; i++) for (let j = 0; j < Tb; j++) { cost[i * Tb + j] = d2(A, i, B, j); idx[i * Tb + j] = i * Tb + j; }
        idx.sort((a, b) => cost[a] - cost[b]);
        const usedA = new Uint8Array(Ta), usedB = new Uint8Array(Tb), pairs = [];
        for (let k = 0; k < n && pairs.length < Math.min(Ta, Tb); k++) {
            const i = (idx[k] / Tb) | 0, j = idx[k] % Tb;
            if (usedA[i] || usedB[j]) continue;
            usedA[i] = usedB[j] = 1; pairs.push([i, j, 0]);
        }
        const nearest = (a, i, b, T) => { let best = 0, bd = Infinity; for (let j = 0; j < T; j++) { const dd = d2(a, i, b, j); if (dd < bd) { bd = dd; best = j; } } return best; };
        for (let i = 0; i < Ta; i++) if (!usedA[i]) pairs.push([i, nearest(A, i, B, Tb), 1]);   // merges into a new pane
        for (let j = 0; j < Tb; j++) if (!usedB[j]) pairs.push([nearest(B, j, A, Ta), j, 2]);   // splits off an old pane
        plan = {
            M: M, src: new Float32Array(M * 9), dst: new Float32Array(M * 9),
            na: new Float32Array(M * 3), nb: new Float32Array(M * 3), axis: new Float32Array(M * 3),
            spin: new Float32Array(M), delay: new Float32Array(M), locked: new Uint8Array(M), glint: new Float32Array(M)
        };
        const bary = flight.geometry.attributes.aBary.array;
        let lo = Infinity, hi = -Infinity;
        pairs.forEach(([i, j, mode], s) => {
            const fx = C.rebuildFx.shards;
            let perm = PERMS[0];
            if (mode === 0) {
                let bestC = Infinity;
                for (const pm of PERMS) {
                    let c = 0;
                    for (let k = 0; k < 3; k++) for (let d = 0; d < 3; d++) { const e = A.tri[i * 9 + k * 3 + d] - B.tri[j * 9 + pm[k] * 3 + d]; c += e * e; }
                    if (c < bestC) { bestC = c; perm = pm; }
                }
            }
            for (let k = 0; k < 3; k++) for (let d = 0; d < 3; d++) {
                plan.src[s * 9 + k * 3 + d] = mode === 2 ? A.tcn[i * 3 + d] : A.tri[i * 9 + k * 3 + d];
                plan.dst[s * 9 + k * 3 + d] = mode === 1 ? B.tcn[j * 3 + d] : B.tri[j * 9 + perm[k] * 3 + d];
                bary[s * 9 + k * 3 + d] = mode === 1 ? A.tb[i * 9 + k * 3 + d] : B.tb[j * 9 + perm[k] * 3 + d];
            }
            plan.na.set(A.tn.subarray(i * 3, i * 3 + 3), s * 3);
            plan.nb.set(B.tn.subarray(j * 3, j * 3 + 3), s * 3);
            const ax = norm([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
            plan.axis.set(ax, s * 3);
            plan.spin[s] = (Math.random() < 0.5 ? -1 : 1) * fx.tumble * (0.5 + 0.5 * Math.random());
            const h = B.tcn[j * 3 + 1];
            plan.delay[s] = h; lo = Math.min(lo, h); hi = Math.max(hi, h);
        });
        // docking order: bottom-up by landing height, lightly shuffled
        const span = Math.max(0, C.build.durationMs - C.rebuildFx.shards.ms);
        for (let s = 0; s < M; s++) plan.delay[s] = ((plan.delay[s] - lo) / ((hi - lo) || 1) * (1 - C.build.jitter) + Math.random() * C.build.jitter) * span;
        flight.geometry.attributes.aBary.needsUpdate = true;
        flight.geometry.setDrawRange(0, M * 3);
    }

    // writes every shard's pose for the current rebuild time: 0-25% break off along
    // its normal, 25-75% tumble over on an arc round the body, 75-100% dock into
    // its slot with a small overshoot — a flash of light on docking
    const sv = new Float32Array(9), sc = [0, 0, 0], sn = [0, 0, 0];
    function shardsFrame(dt, time) {
        const fx = C.rebuildFx.shards, L = fx.lift, g = flight.geometry.attributes;
        const fp = g.position.array, fn = g.aNormalF.array, fgl = g.aGlint.array;
        for (let s = 0; s < plan.M; s++) {
            const u = clamp01((time - plan.delay[s]) / fx.ms), o9 = s * 9, o3 = s * 3;
            let blend, la, lb, arc = 0, ang = 0;
            if (u < 0.25) { const e = easeInOut(u / 0.25); blend = 0; la = L * e; lb = 0; }
            else if (u < 0.75) { const e = easeInOut((u - 0.25) / 0.5); blend = e; la = L * (1 - e); lb = L * e; arc = Math.sin(Math.PI * e) * L * 0.6; ang = Math.sin(Math.PI * e) * plan.spin[s]; }
            else { const e = easeOutBack((u - 0.75) / 0.25); blend = 1; la = 0; lb = L * (1 - e); }
            sc[0] = sc[1] = sc[2] = 0;
            for (let k = 0; k < 3; k++) for (let d = 0; d < 3; d++) {
                const v = plan.src[o9 + k * 3 + d] + (plan.dst[o9 + k * 3 + d] - plan.src[o9 + k * 3 + d]) * blend + plan.na[o3 + d] * la + plan.nb[o3 + d] * lb;
                sv[k * 3 + d] = v; sc[d] += v / 3;
            }
            // swing out round the body, not through it
            const cr = Math.hypot(sc[0], sc[1], sc[2]) || 1;
            for (let k = 0; k < 3; k++) for (let d = 0; d < 3; d++) sv[k * 3 + d] += sc[d] / cr * arc;
            for (let d = 0; d < 3; d++) sc[d] += sc[d] / cr * arc;
            // tumble about the shard's own centre (Rodrigues)
            if (ang !== 0) {
                const ax = plan.axis[o3], ay = plan.axis[o3 + 1], az = plan.axis[o3 + 2], cs = Math.cos(ang), sn1 = Math.sin(ang);
                for (let k = 0; k < 3; k++) {
                    const x = sv[k * 3] - sc[0], y = sv[k * 3 + 1] - sc[1], z = sv[k * 3 + 2] - sc[2];
                    const dot = ax * x + ay * y + az * z;
                    sv[k * 3] = sc[0] + x * cs + (ay * z - az * y) * sn1 + ax * dot * (1 - cs);
                    sv[k * 3 + 1] = sc[1] + y * cs + (az * x - ax * z) * sn1 + ay * dot * (1 - cs);
                    sv[k * 3 + 2] = sc[2] + z * cs + (ax * y - ay * x) * sn1 + az * dot * (1 - cs);
                }
            }
            fp.set(sv, o9);
            // current face normal (fresnel), facing out of the body
            const ux = sv[3] - sv[0], uy = sv[4] - sv[1], uz = sv[5] - sv[2], vx = sv[6] - sv[0], vy = sv[7] - sv[1], vz = sv[8] - sv[2];
            unit(sn, uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx, [plan.nb[o3], plan.nb[o3 + 1], plan.nb[o3 + 2]]);
            if (sn[0] * sc[0] + sn[1] * sc[1] + sn[2] * sc[2] < 0) { sn[0] = -sn[0]; sn[1] = -sn[1]; sn[2] = -sn[2]; }
            for (let k = 0; k < 3; k++) fn.set(sn, o9 + k * 3);
            // docking flash
            if (u >= 0.85 && !plan.locked[s]) { plan.locked[s] = 1; plan.glint[s] = 1; }
            if (plan.glint[s] > 0) plan.glint[s] = Math.max(0, plan.glint[s] - dt / fx.glintMs);
            fgl[s * 3] = fgl[s * 3 + 1] = fgl[s * 3 + 2] = plan.glint[s];
        }
        g.position.needsUpdate = g.aNormalF.needsUpdate = g.aGlint.needsUpdate = true;
    }

    // blueprint: the solid's outline as dashed lines (shared edges once), drawn in
    // face by face at the start of a rebuild so the struts have something to click into
    function blueprint(struts) {
        const seen = new Set(), pts = [];
        const key = (a) => a.map((v) => Math.round(v * 1000)).join(",");
        struts.forEach((st) => {
            const k1 = key(st[0]), k2 = key(st[1]), k = k1 < k2 ? k1 + "|" + k2 : k2 + "|" + k1;
            if (!seen.has(k)) { seen.add(k); pts.push(...st[0], ...st[1]); }
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
        const lines = new THREE.LineSegments(g, new THREE.LineDashedMaterial({ dashSize: 0.05, gapSize: 0.04, transparent: true, opacity: 0, depthWrite: false }));
        lines.computeLineDistances();
        lines.visible = false;
        return lines;
    }

    // Every solid becomes Float32Arrays of S struts (ends / face normal / face
    // centre), S = the biggest solid's strut count. Smaller solids park their
    // spares as zero-length struts on a real node: the line is invisible, the two
    // dots just thicken that node — in a rebuild they grow out / fold back in.
    let S = 0, solids = [];
    function buildSolids(G) {
        solids.forEach((sd) => [sd.glass, sd.ghost].forEach((o) => { figure.remove(o); o.geometry.dispose(); o.material.dispose(); }));
        const v = new THREE.Vector3();
        const raw = C.shapes.map((name) => {
            const out = SOLIDS[name](G), tilt = TILT[name];
            if (tilt) {
                const rot = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(tilt[0], tilt[1], tilt[2]));
                const turn = (pt) => { v.set(pt[0], pt[1], pt[2]).applyMatrix4(rot); pt[0] = v.x; pt[1] = v.y; pt[2] = v.z; };
                const seen = new Set();  // normals/centres are shared arrays — turn each one once
                const once = (pt) => { if (!seen.has(pt)) { seen.add(pt); turn(pt); } };
                out.struts.forEach((st) => st.forEach(once));
                out.tiles.forEach((tl) => { tl[0].forEach(once); once(tl[2]); once(tl[3]); });
            }
            return out;
        });
        S = Math.max(...raw.map((r) => r.struts.length));
        solids = raw.map((out) => {
            const ends = new Float32Array(S * 6), nrm = new Float32Array(S * 3), ctr = new Float32Array(S * 3);
            for (let i = 0; i < S; i++) {
                let a, b, n, c;
                if (i < out.struts.length) [a, b, n, c] = out.struts[i];
                else { a = b = c = out.struts[(Math.random() * out.struts.length) | 0][Math.random() < 0.5 ? 0 : 1]; n = norm(a); }
                ends.set(a, i * 6); ends.set(b, i * 6 + 3); nrm.set(n, i * 3); ctr.set(c, i * 3);
            }
            const T = out.tiles.length, tri = new Float32Array(T * 9), tb = new Float32Array(T * 9), tn = new Float32Array(T * 3), tcn = new Float32Array(T * 3);
            out.tiles.forEach((tl, t) => {
                for (let k = 0; k < 3; k++) { tri.set(tl[0][k], t * 9 + k * 3); tb.set(tl[1][k], t * 9 + k * 3); }
                tn.set(tl[2], t * 3);
                for (let dd = 0; dd < 3; dd++) tcn[t * 3 + dd] = (tl[0][0][dd] + tl[0][1][dd] + tl[0][2][dd]) / 3;
            });
            return { ends: ends, nrm: nrm, ctr: ctr, glass: glassMesh(out.tiles), ghost: blueprint(out.struts), T: T, tri: tri, tb: tb, tn: tn, tcn: tcn };
        });
    }

    // Pair every strut of the current pose with a slot on the next solid, nearest
    // midpoints first (greedy), so most pieces only shift locally — the body
    // visibly re-arranges instead of scrambling. Endpoints are flipped where
    // needed so no piece has to spin more than 90°.
    function matchStruts(from, to) {
        const fe = from.ends, te = to.ends;
        const mid = (a, i, d) => (a[i * 6 + d] + a[i * 6 + 3 + d]) / 2;
        const n = S * S, cost = new Float32Array(n), idx = new Uint32Array(n);
        for (let i = 0; i < S; i++) {
            const fx = mid(fe, i, 0), fy = mid(fe, i, 1), fz = mid(fe, i, 2);
            for (let j = 0; j < S; j++) {
                const dx = fx - mid(te, j, 0), dy = fy - mid(te, j, 1), dz = fz - mid(te, j, 2);
                cost[i * S + j] = dx * dx + dy * dy + dz * dz;
                idx[i * S + j] = i * S + j;
            }
        }
        idx.sort((a, b) => cost[a] - cost[b]);
        const usedI = new Uint8Array(S), usedJ = new Uint8Array(S);
        const out = { ends: new Float32Array(S * 6), nrm: new Float32Array(S * 3), ctr: new Float32Array(S * 3) };
        for (let k = 0, left = S; k < n && left; k++) {
            const i = (idx[k] / S) | 0, j = idx[k] % S;
            if (usedI[i] || usedJ[j]) continue;
            usedI[i] = usedJ[j] = 1; left--;
            const a = i * 6, b = j * 6;
            const dot = (fe[a + 3] - fe[a]) * (te[b + 3] - te[b]) + (fe[a + 4] - fe[a + 1]) * (te[b + 4] - te[b + 1]) + (fe[a + 5] - fe[a + 2]) * (te[b + 5] - te[b + 2]);
            if (dot < 0) out.ends.set([te[b + 3], te[b + 4], te[b + 5], te[b], te[b + 1], te[b + 2]], a);
            else out.ends.set(te.subarray(b, b + 6), a);
            out.nrm.set(to.nrm.subarray(j * 3, j * 3 + 3), i * 3);
            out.ctr.set(to.ctr.subarray(j * 3, j * 3 + 3), i * 3);
        }
        return out;
    }

    // ----- geometry: 2 dots per strut; the wireframe SHARES the dots' position
    // buffer (vertex 2i/2i+1 = strut i's ends), so one update moves both -----
    const figure = new THREE.Group();
    scene.add(figure);
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: makeCircleTexture() },
            uSize: { value: C.dot.size * renderer.getPixelRatio() },
            uScale: { value: heroScaleH() / FRAME * 0.5 },
            uOpacity: { value: 0 }
        },
        // three r128 PointsMaterial size math (size * pixelRatio, scale =
        // canvasHeight / 2, perspective attenuation) plus a per-dot aSize multiplier
        vertexShader: [
            "attribute float aSize;",
            "varying vec3 vColor;",
            "uniform float uSize;",
            "uniform float uScale;",
            "void main() {",
            "    vColor = color;",
            "    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
            "    gl_PointSize = uSize * aSize * (uScale / -mvPosition.z);",
            "    gl_Position = projectionMatrix * mvPosition;",
            "}"
        ].join("\n"),
        fragmentShader: [
            "uniform sampler2D map;",
            "uniform float uOpacity;",
            "varying vec3 vColor;",
            "void main() {",
            "    vec4 tex = texture2D(map, gl_PointCoord);",
            "    gl_FragColor = vec4(vColor, uOpacity) * tex;",
            "}"
        ].join("\n"),
        transparent: true, depthWrite: false, vertexColors: true
    });
    // line colour comes per vertex (the scan light brightens the struts it crosses)
    const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0, vertexColors: true });
    let geo = null, lineGeo = null, pos, col, lcol, asz;
    let pose, target, delayMs, locked, flash, pop, phase, groups = [];

    // (re)allocates every per-strut buffer; called on boot and whenever S changes
    function allocate() {
        if (geo) { geo.dispose(); lineGeo.dispose(); }
        while (figure.children.length) figure.remove(figure.children[0]);
        const V = S * 2;
        geo = new THREE.BufferGeometry();
        pos = new THREE.BufferAttribute(new Float32Array(V * 3), 3);
        col = new THREE.BufferAttribute(new Float32Array(V * 3), 3);
        lcol = new THREE.BufferAttribute(new Float32Array(V * 3), 3);
        asz = new THREE.BufferAttribute(new Float32Array(V).fill(1), 1);
        geo.setAttribute("position", pos); geo.setAttribute("color", col); geo.setAttribute("aSize", asz);
        lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", pos); lineGeo.setAttribute("color", lcol);
        figure.add(new THREE.LineSegments(lineGeo, lineMat));
        figure.add(new THREE.Points(geo, mat));
        flash = new Float32Array(V); pop = new Float32Array(V); phase = new Float32Array(V);
        for (let i = 0; i < V; i++) phase[i] = Math.random() * Math.PI * 2;
        delayMs = new Float32Array(S); locked = new Uint8Array(S);
    }

    // rest pose settled: remember which dots share a node, so a twinkle can
    // flare the whole node instead of one dot buried in its stack
    function settle() {
        const map = new Map(), e6 = pose.ends;
        for (let e = 0; e < S * 2; e++) {
            const k = Math.round(e6[e * 3] * 100) + "," + Math.round(e6[e * 3 + 1] * 100) + "," + Math.round(e6[e * 3 + 2] * 100);
            if (!map.has(k)) map.set(k, []);
            map.get(k).push(e);
        }
        groups = Array.from(map.values());
    }

    function applyColors() {
        const cc = C.colors.cube, sc = C.colors.scan;
        shared.uColor.value.setRGB(cc[0], cc[1], cc[2]);
        shared.uScanColor.value.setRGB(sc[0], sc[1], sc[2]);
        const gc = C.colors.glint;
        shared.uGlintColor.value.setRGB(gc[0], gc[1], gc[2]);
        solids.forEach((sd) => sd.ghost.material.color.setRGB(cc[0], cc[1], cc[2]));
    }

    // ----- the neural net: neurons on an inner shell and in the core, each wired to
    // its nearest neighbours. Lives inside the solids in C.neural.shapes; the scan
    // plane lights up the synapses it crosses (same local-y test as the glass) -----
    const neural = (function () {
        const NC = C.neural, R = HALF * 1.45, pts = [];
        for (let tries = 0; pts.length < NC.neurons && tries < 4000; tries++) {
            let v;
            if (pts.length < NC.neurons * 0.6) {   // shell neurons, just inside the glass
                v = norm([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]).map((x) => x * R * 0.78);
            } else {                                 // core neurons
                do { v = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]; } while (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] > 1);
                v = v.map((x) => x * R * 0.5);
            }
            if (pts.every((q) => Math.hypot(q[0] - v[0], q[1] - v[1], q[2] - v[2]) > R * 0.28)) pts.push(v);
        }
        const seen = new Set(), segs = [];
        pts.forEach((a, i) => {
            pts.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])])
                .filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, NC.links)
                .forEach(([j]) => {
                    const k = i < j ? i + "-" + j : j + "-" + i;
                    if (!seen.has(k)) { seen.add(k); segs.push(...a, ...pts[j]); }
                });
        });
        const uni = { uNeural: { value: 0 }, uBase: { value: NC.base }, uPeak: { value: NC.peak }, uNW: { value: NC.width }, uPx: { value: renderer.getPixelRatio() }, uScanY: shared.uScanY, uScanColor: shared.uScanColor };
        const vs = (point) => [
            "uniform float uScanY, uNW, uPx;",
            "varying float vGlow;",
            "void main() {",
            "    float s = (position.y - uScanY) / uNW;",
            "    vGlow = exp(-s * s);",
            point ? "    gl_PointSize = (2.0 + 4.0 * vGlow) * uPx;" : "",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
            "}"
        ].join("\n");
        const fs = (point) => [
            "uniform vec3 uScanColor;",
            "uniform float uNeural, uBase, uPeak;",
            "varying float vGlow;",
            "void main() {",
            point ? "    if (length(gl_PointCoord - 0.5) > 0.5) discard;" : "",
            "    gl_FragColor = vec4(uScanColor, uNeural * (uBase * " + (point ? "3.0" : "1.0") + " + uPeak * vGlow));",
            "}"
        ].join("\n");
        const lg = new THREE.BufferGeometry();
        lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segs), 3));
        const pg = new THREE.BufferGeometry();
        pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts.flat()), 3));
        const lines = new THREE.LineSegments(lg, new THREE.ShaderMaterial({ uniforms: uni, vertexShader: vs(false), fragmentShader: fs(false), transparent: true, depthWrite: false }));
        const dots = new THREE.Points(pg, new THREE.ShaderMaterial({ uniforms: uni, vertexShader: vs(true), fragmentShader: fs(true), transparent: true, depthWrite: false }));
        lines.visible = dots.visible = false;
        return { lines: lines, dots: dots, uni: uni, k: 0 };
    })();

    let cur = 0, next = 0, building = false, pending = false, bt = 0;
    let glazeT = -1;       // ms into the current solid's glazing (-1 = not started)
    let fxT = 0;           // ms since the tap: drives the blueprint drawing
    let landT = 0;         // ms left of the docking flashes after a rebuild (shards stay on screen)
    let settleT = -1;      // ms into the post-build settle bounce (-1 = idle)
    function boot() {
        const prevS = S;
        buildSolids(C.cube[vp].grid);
        if (S !== prevS || !geo) allocate();
        solids.forEach((sd) => { figure.add(sd.glass); figure.add(sd.ghost); });
        figure.add(neural.lines); figure.add(neural.dots);
        allocateFlight(Math.max(...solids.map((sd) => sd.T)));
        cur %= solids.length; next = cur; building = pending = false; landT = 0;
        const sd = solids[cur];
        pose = { ends: sd.ends.slice(), nrm: sd.nrm.slice(), ctr: sd.ctr.slice() };
        pos.array.set(pose.ends); pos.needsUpdate = true;
        settle();
        applyColors();
        if (glazeT >= 0) glazeT = 1e9; // a viewport switch keeps the glass on
    }
    boot();

    function startBuild() {
        target = matchStruts(pose, solids[next]);
        if (C.rebuildFx.shards.on) planShards(solids[cur], solids[next]);
        // assembly order: bottom-up by landing height (normalized), lightly shuffled
        let lo = Infinity, hi = -Infinity;
        const h = new Float32Array(S), te = target.ends;
        for (let i = 0; i < S; i++) { h[i] = (te[i * 6 + 1] + te[i * 6 + 4]) / 2; lo = Math.min(lo, h[i]); hi = Math.max(hi, h[i]); }
        const span = Math.max(0, C.build.durationMs - C.build.strutMs);
        for (let i = 0; i < S; i++) {
            const r = (h[i] - lo) / ((hi - lo) || 1) * (1 - C.build.jitter) + Math.random() * C.build.jitter;
            delayMs[i] = r * span;
        }
        locked.fill(0);
        building = true; bt = 0;
    }
    // grab & spin: a drag turns the solid (yaw; mouse also pitches), a fling keeps
    // it turning with inertia. Touch keeps vertical swipes for page scrolling
    // (touch-action: pan-y), so on phones only a sideways swipe spins it.
    let spinY = 0, spinX = 0, velY = 0, velX = 0, dragging = false, dragMoved = false, pX = 0, pY = 0, dX = 0, dY = 0;
    hit.style.cursor = "grab";
    hit.style.touchAction = "pan-y";
    hit.addEventListener("pointerdown", (e) => {
        dragging = true; dragMoved = false; dX = pX = e.clientX; dY = pY = e.clientY;
        try { hit.setPointerCapture(e.pointerId); } catch (err) { /* capture is a nicety */ }
        hit.style.cursor = "grabbing";
    });
    hit.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const mx = e.clientX - pX, my = e.clientY - pY; pX = e.clientX; pY = e.clientY;
        if (!dragMoved && Math.hypot(e.clientX - dX, e.clientY - dY) > C.touch.dragPx) dragMoved = true;
        if (!dragMoved) return;
        velY = mx * C.touch.spin; spinY += velY;
        velX = e.pointerType === "touch" ? 0 : my * C.touch.spin;
        spinX = Math.max(-C.touch.maxPitch, Math.min(C.touch.maxPitch, spinX + velX));
    });
    const endDrag = () => { dragging = false; hit.style.cursor = "grab"; };
    hit.addEventListener("pointerup", endDrag);
    hit.addEventListener("pointercancel", endDrag);
    hit.addEventListener("click", () => {
        if (dragMoved) { dragMoved = false; return; } // that was a spin, not a tap
        // tap = re-assemble into the next solid (the breathing settles, the glass
        // comes off and the blueprint is drawn first — see the pending phase)
        if (building || pending || contracting || landT > 0) return;
        next = (cur + 1) % solids.length;
        pending = true; fxT = 0;
    });

    const onMq = () => { vp = mq.matches ? "mobile" : "desktop"; boot(); applyHeroPan(); mat.uniforms.uScale.value = heroScaleH() / FRAME * 0.5; };
    if (mq.addEventListener) mq.addEventListener("change", onMq); else mq.addListener(onMq);

    // desktop: aim the lean at the cursor (smoothed in the loop)
    let aimX = 0, aimY = 0, tiltX = 0, tiltY = 0;
    // ...and park the cursor torch at the pointer, in the canvas' clip space
    let mouseOn = false;
    const mouseNdc = shared.uMouse.value;
    window.addEventListener("pointermove", (e) => {
        if (vp !== "desktop" || e.pointerType === "touch") return;
        aimY = (e.clientX / window.innerWidth - 0.5) * 2 * C.parallax.y;
        aimX = (e.clientY / window.innerHeight - 0.5) * 2 * C.parallax.x;
        const r = canvas.getBoundingClientRect();
        mouseNdc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height * 2 - 1));
        mouseOn = true;
    }, { passive: true });
    window.addEventListener("mouseout", (e) => { if (!e.relatedTarget) mouseOn = false; }); // pointer left the window

    // no work while the hero is off screen (the lower section, a background tab)
    let onScreen = true;
    if ("IntersectionObserver" in window) {
        new IntersectionObserver((en) => { onScreen = en[0].isIntersecting; }).observe(hero);
    }
    // reduced motion: no breathing, no scan sweeps, no cursor lean — a tap still rebuilds
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ----- entrance + boot fade: the solid fades in and settles from slightly
    // enlarged (the old navy intro screen was removed Sep 27 2026) -----
    let contracting = true;
    const heroStart = performance.now();

    const easeOut = (p) => 1 - Math.pow(1 - p, 3);
    const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    // small overshoot past the slot and back: the "click" of a strut locking in
    const easeOutBack = (p) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

    // where strut i sits at its own progress u (0..1) of the trip from pose -> target:
    // 0-25% pop out of the body along its radial direction, 25-75% swing over to
    // the lifted slot (arcing round the body, turning, stretching), 75-100% drop
    // into the slot with a small overshoot
    const ma = [0, 0, 0], mb = [0, 0, 0], ua = [0, 0, 0], ub = [0, 0, 0], ra = [0, 0, 0], rb = [0, 0, 0], m = [0, 0, 0], d = [0, 0, 0];
    function unit(outv, x, y, z, fb) {
        const l = Math.hypot(x, y, z);
        if (l < 1e-6) { outv[0] = fb[0]; outv[1] = fb[1]; outv[2] = fb[2]; return 0; }
        outv[0] = x / l; outv[1] = y / l; outv[2] = z / l; return l;
    }
    const UP = [0, 1, 0];
    function strutAt(i, u, out) {
        const a = i * 6, L = C.build.lift, fe = pose.ends, te = target.ends;
        for (let k = 0; k < 3; k++) { ma[k] = (fe[a + k] + fe[a + 3 + k]) / 2; mb[k] = (te[a + k] + te[a + 3 + k]) / 2; }
        const lb = unit(ub, te[a + 3] - te[a], te[a + 4] - te[a + 1], te[a + 5] - te[a + 2], UP);
        const la = unit(ua, fe[a + 3] - fe[a], fe[a + 4] - fe[a + 1], fe[a + 5] - fe[a + 2], ub);
        if (lb === 0) { ub[0] = ua[0]; ub[1] = ua[1]; ub[2] = ua[2]; } // a piece folding into a node keeps its heading
        unit(ra, ma[0], ma[1], ma[2], UP);
        unit(rb, mb[0], mb[1], mb[2], UP);
        let len;
        if (u < 0.25) {
            const e = easeInOut(u / 0.25);
            for (let k = 0; k < 3; k++) { m[k] = ma[k] + ra[k] * L * e; d[k] = ua[k]; }
            len = la;
        } else if (u < 0.75) {
            const e = easeInOut((u - 0.25) / 0.5), arc = Math.sin(Math.PI * e) * L * 0.6;
            for (let k = 0; k < 3; k++) {
                m[k] = ma[k] + ra[k] * L + (mb[k] + rb[k] * L - ma[k] - ra[k] * L) * e;
                d[k] = ua[k] + (ub[k] - ua[k]) * e;
            }
            const mr = Math.hypot(m[0], m[1], m[2]) || 1;
            for (let k = 0; k < 3; k++) m[k] += (m[k] / mr) * arc;   // swing out round the body, not through it
            unit(d, d[0], d[1], d[2], ub);
            len = la + (lb - la) * e;
        } else {
            const e = easeOutBack((u - 0.75) / 0.25);
            for (let k = 0; k < 3; k++) { m[k] = mb[k] + rb[k] * L * (1 - e); d[k] = ub[k]; }
            len = lb;
        }
        for (let k = 0; k < 3; k++) { out[a + k] = m[k] - d[k] * len / 2; out[a + 3 + k] = m[k] + d[k] * len / 2; }
    }

    let t = 0, angle = 0, last = performance.now();
    let clock = 0;         // seconds, drives the breathing wave (CPU + shader share it)
    let breath = 1;        // 0..1: exploded-view breathing strength (settles to 0 for a rebuild)
    let scanClock = -C.scan.firstDelayMs;

    function animate() {
        requestAnimationFrame(animate);
        const now = performance.now();
        if (!onScreen) { last = now; return; }
        const cube = C.cube[vp];
        // clamped frame time: a backgrounded tab resumes where it left off
        const dt = Math.min(50, now - last); last = now;
        clock += dt / 1000;

        const bootFade = Math.min(1, (now - heroStart) / C.bootFadeMs);

        let base = cube.scale;
        if (contracting) {
            const p = Math.min((now - heroStart) / C.entrance.ms, 1);
            base = C.entrance.from + (cube.scale - C.entrance.from) * easeOut(p);
            if (p >= 1) { contracting = false; glazeT = 0; } // landed: glaze the solid
        }

        // ----- breathing settles before a rebuild and drifts back after it -----
        const bTarget = (pending || building || landT > 0) ? 0 : 1;
        breath += (bTarget - breath) * (bTarget ? 0.02 : 0.14);
        const fx = C.rebuildFx;
        if (pending || building) fxT += dt;
        if (pending && breath < 0.02) { breath = 0; pending = false; startBuild(); }

        // ----- rebuild in progress -----
        const P = pos.array;
        if (building) {
            bt += dt;
            for (let i = 0; i < S; i++) {
                const u = clamp01((bt - delayMs[i]) / C.build.strutMs);
                strutAt(i, u, P);
                if (u >= 0.85 && !locked[i]) {
                    locked[i] = 1;   // clicked into place: spark on both ends
                    flash[i * 2] = flash[i * 2 + 1] = 1;
                    pop[i * 2] = pop[i * 2 + 1] = 1;
                }
            }
            if (fx.shards.on) shardsFrame(dt, bt);
            if (bt >= C.build.durationMs) {
                building = false; cur = next;
                pose = target;
                settle();
                // shards already sit in place — otherwise the new frame glazes bottom-up
                glazeT = fx.shards.on ? 1e9 : 0;
                landT = fx.shards.on ? fx.shards.glintMs : 0; // let the last docking flashes finish
                settleT = 0; // ...settle it with one small bounce
                if (fx.verifyScan) scanClock = fx.shards.on ? -300 : -C.glass.glazeMs * 0.75; // ...and scan it over
            }
        } else if (landT > 0) {
            landT -= dt;
            shardsFrame(dt, 1e9);
        }
        if (!building) {
            // rest: every strut rides out with its face on the breathing wave
            const amp = REDUCED ? 0 : C.explode.amp[vp] * breath, om = 2 * Math.PI / (C.explode.periodMs / 1000), kp = C.explode.wave;
            const pe = pose.ends, pn = pose.nrm, pc = pose.ctr;
            for (let i = 0; i < S; i++) {
                const j = i * 3, a = i * 6;
                const w = 0.5 + 0.5 * Math.sin(om * clock - kp * (pc[j] * WAVE_DIR.x + pc[j + 1] * WAVE_DIR.y + pc[j + 2] * WAVE_DIR.z));
                const o = amp * w;
                for (let k = 0; k < 3; k++) { P[a + k] = pe[a + k] + pn[j + k] * o; P[a + 3 + k] = pe[a + 3 + k] + pn[j + k] * o; }
            }
            shared.uAmp.value = amp; shared.uOmega.value = om;
        }
        pos.needsUpdate = true;
        shared.uTime.value = clock;

        // ----- glass: the current solid's panes at rest; during a rebuild the
        // flying shards (or, with shards off, a fade), plus the next solid's blueprint -----
        if (glazeT >= 0 && !building && !pending) glazeT += dt;
        const gBase = C.glass.opacity[vp] * bootFade;
        const flying = fx.shards.on && (building || landT > 0);
        flight.visible = flying;
        flight.material.uniforms.uOpacity.value = gBase;
        solids.forEach((sd, s) => {
            let op = 0;
            if (s === cur && glazeT >= 0 && !flying) op = building ? 0 : (pending && !fx.shards.on) ? gBase * breath : gBase;
            sd.glass.visible = op > 0.001;
            if (sd.glass.visible) {
                const u = sd.glass.material.uniforms;
                u.uOpacity.value = op;
                u.uGlaze.value = Math.min(1.3, glazeT / C.glass.glazeMs * 1.3);
            }
            let gop = 0;
            if (fx.blueprint.on && (pending || building) && s === next) {
                // fades in fast, draws in face by face, fades as the struts fill it
                const fadeOut = building ? 1 - clamp01((bt - C.build.durationMs * 0.6) / (C.build.durationMs * 0.4)) : 1;
                gop = fx.blueprint.opacity[vp] * bootFade * Math.min(1, fxT / 250) * fadeOut;
                const segs = sd.ghost.geometry.attributes.position.count / 2;
                sd.ghost.geometry.setDrawRange(0, 2 * Math.ceil(segs * Math.min(1, fxT / fx.blueprint.drawMs)));
            }
            sd.ghost.visible = gop > 0.001;
            sd.ghost.material.opacity = gop;
        });

        // ----- scan: a plane of light sweeps bottom-up now and then (at rest only) -----
        let scanY = 99;
        if (!building && !pending && !contracting && !REDUCED) {
            scanClock += dt;
            if (scanClock >= C.scan.everyMs) scanClock = 0;
            if (scanClock >= 0 && scanClock < C.scan.sweepMs) scanY = -2.1 + 4.2 * easeInOut(scanClock / C.scan.sweepMs);
        }
        shared.uScanY.value = scanY;

        // neural net: fades in while a neural solid is at rest, out for a rebuild
        const wantNet = C.neural.shapes.indexOf(C.shapes[cur]) >= 0 && !building && !pending && landT <= 0;
        neural.k += ((wantNet ? 1 : 0) - neural.k) * (wantNet ? 0.03 : 0.2);
        neural.lines.visible = neural.dots.visible = neural.k > 0.01;
        neural.uni.uNeural.value = neural.k * bootFade;

        t += 0.01;
        angle += cube.rot;

        // desktop: figure shrinks in sync with the hero scrolling away
        let shr = 1;
        if (vp === "desktop" && C.scrollShrink > 0) {
            const e = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
            shr = 1 - C.scrollShrink * easeInOut(e);
        }
        // post-build settle: one small bounce, dying out fast
        let settleK = 0;
        if (settleT >= 0) {
            settleT += dt;
            const sp = settleT / fx.settle.ms;
            if (sp >= 1) settleT = -1;
            else if (fx.settle.on) settleK = fx.settle.amp * Math.sin(sp * Math.PI * 3) * Math.exp(-4 * sp);
        }
        figure.scale.setScalar(base * shr * (1 + settleK));
        // lean toward the cursor (desktop), eased so it floats rather than snaps
        const lean = vp === "desktop" && !REDUCED;
        tiltX += ((lean ? aimX : 0) - tiltX) * C.parallax.ease;
        tiltY += ((lean ? aimY : 0) - tiltY) * C.parallax.ease;
        // grab & spin: coast on the fling, pitch drifts back to level
        if (!dragging) {
            spinY += velY; velY *= C.touch.friction; velX = 0;
            spinX *= 0.97;
        } else {
            velY *= 0.8;   // holding still bleeds the fling out
        }
        figure.rotation.set(tiltX + spinX, tiltY + spinY, 0);

        lineMat.opacity = cube.lineOpacity * bootFade;
        mat.uniforms.uSize.value = C.dot.size * renderer.getPixelRatio();
        mat.uniforms.uOpacity.value = C.dot.opacity * bootFade;

        // twinkle ignition (rate = flares per SECOND): flare a whole node at rest
        if (!building && groups.length && Math.random() < C.twinkle.rate / 60) {
            groups[(Math.random() * groups.length) | 0].forEach((e) => { flash[e] = 1; });
        }

        const INK = C.colors.ink, CUB = C.colors.cube, ORANGE = C.colors.orange, SC = C.colors.scan;
        const V = S * 2, sw = C.scan.width;
        // cursor torch strength (eases in/out as the pointer enters/leaves)
        shared.uHover.value += (((mouseOn && vp === "desktop") ? C.light.hover : 0) - shared.uHover.value) * 0.08;
        const torch = shared.uHover.value > 0.01, aspect = hero.clientWidth / hero.clientHeight, hr = C.light.hoverR;
        shared.uAspect.value = aspect;
        for (let i = 0; i < V; i++) {
            const j = i * 3;
            // scan light on this vertex (0 far from the plane, 1 on it)
            const sy = (P[j + 1] - scanY) / sw;
            let lit = Math.exp(-sy * sy);
            if (torch) {
                tv.set(P[j], P[j + 1], P[j + 2]).applyMatrix4(figure.matrixWorld).project(camera);
                const dx = (tv.x - mouseNdc.x) * aspect, dy = tv.y - mouseNdc.y;
                lit = Math.max(lit, shared.uHover.value * 1.4 * Math.exp(-(dx * dx + dy * dy) / hr));
            }
            // color: each dot drifts SLOWLY through the palette cycle
            // ink -> teal -> orange -> teal -> ink (blinkAmp = how far along the
            // palette the drift reaches: 0.5 stops at teal, 1.0 reaches orange)
            phase[i] += C.twinkle.blinkSpeed;
            const drift = C.twinkle.blinkAmp * (0.5 + 0.5 * Math.sin(phase[i]));
            let r, g, bl;
            if (drift < 0.5) {
                const d2 = drift * 2; // 0..1: ink -> teal
                r = INK[0] + (CUB[0] - INK[0]) * d2;
                g = INK[1] + (CUB[1] - INK[1]) * d2;
                bl = INK[2] + (CUB[2] - INK[2]) * d2;
            } else {
                const d2 = (drift - 0.5) * 2; // 0..1: teal -> orange
                r = CUB[0] + (ORANGE[0] - CUB[0]) * d2;
                g = CUB[1] + (ORANGE[1] - CUB[1]) * d2;
                bl = CUB[2] + (ORANGE[2] - CUB[2]) * d2;
            }
            r += (SC[0] - r) * lit; g += (SC[1] - g) * lit; bl += (SC[2] - bl) * lit;
            // orange flare on top (slow fade) + a quick size pop when a strut locks
            if (flash[i] > 0) { flash[i] -= C.twinkle.decay; if (flash[i] < 0) flash[i] = 0; }
            if (pop[i] > 0) { pop[i] -= 0.05; if (pop[i] < 0) pop[i] = 0; }
            const f = flash[i];
            col.array[j] = r + (ORANGE[0] - r) * f;
            col.array[j + 1] = g + (ORANGE[1] - g) * f;
            col.array[j + 2] = bl + (ORANGE[2] - bl) * f;
            asz.array[i] = 1 + 1.2 * pop[i] + 0.6 * lit;
            // struts: teal, brightened where the scan crosses them
            lcol.array[j] = CUB[0] + (SC[0] - CUB[0]) * lit;
            lcol.array[j + 1] = CUB[1] + (SC[1] - CUB[1]) * lit;
            lcol.array[j + 2] = CUB[2] + (SC[2] - CUB[2]) * lit;
        }
        col.needsUpdate = true;
        lcol.needsUpdate = true;
        asz.needsUpdate = true;

        // camera: orbit + slow axis precession
        const push = building ? Math.sin(Math.PI * clamp01(bt / C.build.durationMs)) * C.rebuildFx.push : 0;
        const camR = Math.max(3.0, HALF * cube.scale * 2.4) * (1 - push);
        camera.position.x = Math.sin(angle) * camR + Math.sin(t * 0.23) * C.wobble;
        camera.position.y = Math.sin(angle * 0.5) * 0.5 + Math.sin(t * 0.31) * C.wobble;
        camera.position.z = Math.cos(angle) * camR;
        camera.lookAt(scene.position);
        // the glass depth fade spans the solid's extent as seen from here
        const camD = camera.position.length(), rad = 1.95 * figure.scale.x;
        shared.uNear.value = camD - rad; shared.uFar.value = camD + rad;
        renderer.render(scene, camera);
    }
    const tv = new THREE.Vector3();
    animate();

    // theme flip: swap the palette (dots, struts and glass recolor on the next frame)
    window.addEventListener("themechange", () => {
        C.colors = isDarkTheme() ? PALETTES.dark : PALETTES.light;
        applyColors();
    });

    window.addEventListener("resize", () => {
        renderer.setSize(hero.clientWidth, hero.clientHeight);
        applyHeroPan();                                       // sets camera.aspect + view offset
        mat.uniforms.uScale.value = heroScaleH() / FRAME * 0.5;       // keep dot attenuation frozen to base band
    });
})();
