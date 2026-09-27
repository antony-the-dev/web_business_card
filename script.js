// ===== TYPEWRITER EFFECT (writes to every .typed-out target) =====
// Phrases come from lang.js (window.TYPED_PHRASES, localized); the inline
// array is only a fallback in case lang.js fails to load.
const phrases = (window.TYPED_PHRASES && window.TYPED_PHRASES.length)
    ? window.TYPED_PHRASES
    : ["BPMN & UML modeling", "API & Data entity schemas", "Requirements engineering", "Pre-sale consulting", "Discovery to handoff"];
const targets = document.querySelectorAll("#typed, .id-typed");
let phraseIndex = 0; let charIndex = 0; let deleting = false;

function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
        const text = current.slice(0, charIndex + 1);
        targets.forEach((t) => t.textContent = text);
        charIndex++;
        if (charIndex === current.length) { deleting = true; setTimeout(tick, 1500); return; }
    } else {
        const text = current.slice(0, charIndex - 1);
        targets.forEach((t) => t.textContent = text);
        charIndex--;
        if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 50 : 100);
}
tick();


// ===== shared helper for the UI scripts below (the Three.js sections keep
// their own local copies — their math stays self-contained) =====
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);


// ===== ENTRANCE: hero blocks appear one by one; lower blocks reveal on scroll =====
(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reveals an element and guarantees it actually ends up visible: some browser/
    // capture contexts (backgrounded tabs, print/screenshot pipelines, odd timeline
    // throttling) can leave a CSS transition parked at its 0%/from-state forever
    // instead of running it. If that happens content silently never appears — so
    // after giving the transition a chance, force the end-state inline if the
    // computed opacity hasn't actually moved.
    function reveal(el) {
        el.classList.add("shown");
        setTimeout(() => {
            // never force a deliberately-hidden element back to visible
            if (el.classList.contains("is-tapped")) return;
            if (parseFloat(getComputedStyle(el).opacity) < 0.5) {
                el.style.transition = "none";
                el.style.opacity = "1";
                el.style.filter = "none";
                el.style.transform = "none";
            }
        }, 900);
    }

    // hero blocks: staggered blur-in, timed to start as the intro hands off
    const enterEls = Array.from(document.querySelectorAll("[data-enter]"))
        .sort((a, b) => (+a.dataset.enter) - (+b.dataset.enter));

    if (reduceMotion) {
        enterEls.forEach((el) => el.classList.add("shown"));
    } else {
        const introWillPlay = (function () { try { return sessionStorage.getItem("introSeen") !== "1"; } catch (e) { return true; } })();
        const base = introWillPlay ? 1610 : 300; // start as the intro fades out
        enterEls.forEach((el, i) => setTimeout(() => reveal(el), base + i * 240));
    }

    // lower blocks: blur-in when scrolled into view
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { reveal(entry.target); io.unobserve(entry.target); }
            /* fires a touch earlier than the block being 20% in view, so content
               starts appearing while the hero is still finishing its own fade —
               closes the "dead" white gap between the two screens */
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    document.querySelectorAll("[data-scroll]").forEach((el) => {
        if (reduceMotion) el.classList.add("shown"); else io.observe(el);
    });
})();


// ===== HIDE SCROLL ARROW AFTER SCROLLING =====
(function () {
    const arrow = document.querySelector(".scroll-arrow");
    if (!arrow) return;
    window.addEventListener("scroll", () => { arrow.style.opacity = window.scrollY > 10 ? "0" : "0.7"; });
})();


// ===== HERO SHRINK/FADE ON SCROLL — also moves the full-bleed canvas =====
(function () {
    const grid = document.querySelector(".hero-grid");
    const cv = document.getElementById("hero-canvas-container");
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const HERO_MIN_SCALE = 0.5;
    const HERO_DRIFT = 200;

    let ticking = false;
    const easeOut = (p) => 1 - Math.pow(1 - p, 2);

    function update() {
        ticking = false;
        const vh = window.innerHeight || 1;
        // fade/shrink resolves over ~72% of a viewport of scroll instead of the
        // full 100% — closes the beat of plain white that used to sit between
        // "hero fully faded" and "lower section fully in view"
        const e = easeOut(clamp01(window.scrollY / (vh * 1.72)));

        // MOBILE: plain scroll — no dim/scale/blur (the fade flashed grey
        // on fast phone scroll and cost performance for no visual gain).
        // Clear any inline transform/opacity the desktop branch may have parked
        // on the grid/canvas — otherwise crossing the 900px line (e.g. a
        // landscape→portrait rotation) can leave the hero stuck faded to white
        // with no scroll event able to restore it.
        if (window.matchMedia("(max-width: 900px)").matches) {
            if (grid.style.opacity !== "" || grid.style.transform !== "") {
                grid.style.transform = "";
                grid.style.opacity = "";
                if (cv) { cv.style.transform = ""; cv.style.opacity = ""; }
            }
            return;
        }

        // DESKTOP: full shrink + blur + drift
        const scale = 1 - (1 - HERO_MIN_SCALE) * e;
        const tf = "translateY(" + (HERO_DRIFT * e) + "px) scale(" + scale + ")";
        const op = (1 - e).toFixed(3);

        grid.style.transform = tf;
        grid.style.opacity = op;

        if (cv) {
            cv.style.transform = tf;   // particle field recedes together with the text
            cv.style.opacity = op;
        }
    }

    window.addEventListener("scroll", () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
})();


// ===== PERSISTENT IDENTITY BAR: scroll-driven oacity (no time-based fade) =====
(function () {
    const bar = document.getElementById("id-bar");
    const lower = document.getElementById("lower");
    if (!bar || !lower) return;

    bar.style.transition = "none";

    const APPEAR_AT = 0.7;
    const APPEAR_OVER = 0.2;
    const FADE_DIST = 25;
    const BAR_H = 110;

    let ticking = false;

    function update() {
        ticking = false;
        const vh = window.innerHeight || 1;
        const sy = window.scrollY;
        const appear = clamp01((sy - vh * APPEAR_AT) / (vh * APPEAR_OVER));
        const lowerTop = lower.getBoundingClientRect().top;
        const disappear = clamp01((lowerTop - BAR_H) / FADE_DIST);
        bar.style.opacity = (appear * disappear).toFixed(3);
    }

    window.addEventListener("scroll", () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
    // iOS safety net: Safari can swallow the scroll event that would hide the bar
    // (URL-bar collapse/expand, scroll restoration after the intro lock), which
    // leaves the bar stuck visible at the top of the page — the "blue lines".
    // A light interval re-reads the real state so the bar can never stay stuck.
    setInterval(update, 250);
})();


// ===== CONTACT RAIL: per-link vertical caption on the right edge =====
(function () {
    const navs = Array.from(document.querySelectorAll(".hero-contact"));
    const rail = document.querySelector(".contact-rail");
    if (!navs.length || !rail) return;
    const railText = rail.querySelector(".rail-text");
    // data-rail is set by lang.js (localized) before this script runs
    const links = [];
    navs.forEach((nav) => {
        links.push(...Array.from(nav.querySelectorAll("a[data-rail]")));
        nav.addEventListener("mouseleave", hide);
        nav.addEventListener("focusout", hide);
    });

    function show(a) { railText.textContent = a.dataset.rail; rail.classList.add("show"); }
    function hide() { rail.classList.remove("show"); }

    links.forEach((a) => {
        a.addEventListener("mouseenter", () => show(a));
        a.addEventListener("focus", () => show(a));
    });

    // the DOWNLOAD CV button drives the same right-edge rail caption ("grab my CV")
    const cv = document.querySelector(".cv-btn[data-rail]");
    if (cv) {
        cv.addEventListener("mouseenter", () => show(cv));
        cv.addEventListener("focus", () => show(cv));
        cv.addEventListener("mouseleave", hide);
        cv.addEventListener("blur", hide);
    }
})();


// ===== INTERACTIVE "HOW I WORK" PIPELINE =====
(function () {
    // phase content comes from lang.js (localized); no data duplicated here
    const PHASES = window.PHASES_I18N || {};

    const strip = document.querySelector(".process-strip");
    const detail = document.querySelector(".proc-detail");
    if (!strip || !detail) return;

    const steps = Array.from(strip.querySelectorAll(".proc-step"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const RUNNER_MAX = 650;
    const HOLD_MS = 3000;
    const EXIT_MS = 900;

    // auto-play: the pipeline runs itself when the section becomes visible —
    // first step opens ~1s after reveal, then it flows to the next phase every
    // 4s. A manual click/keypress hands control to the user; after ~8s of
    // inactivity the auto cycle restarts from the first phase.
    const AUTOPLAY_REVEAL_DELAY = 1000;
    const AUTOPLAY_STEP_MS = 4000;
    const AUTOPLAY_IDLE_MS = 8000;

    let buildTimer = null, closeTimer = null, clearTimer = null;
    let autoplayTimer = null, autoplayStepIndex = 0, autoplayActive = false;
    let idleTimer = null, revealTimer = null;
    const phaseOrder = steps.map((s) => s.dataset.phase);

    function stopAutoplay() {
        autoplayActive = false;
        clearTimeout(autoplayTimer);
        clearTimeout(idleTimer);
    }

    function startAutoplay(fromStart) {
        stopAutoplay();
        if (reduceMotion) return;
        autoplayActive = true;
        if (fromStart) autoplayStepIndex = 0;
        const tick = () => {
            if (!autoplayActive) return;
            selectPhase(phaseOrder[autoplayStepIndex]);
            autoplayStepIndex = (autoplayStepIndex + 1) % phaseOrder.length;
            autoplayTimer = setTimeout(tick, AUTOPLAY_STEP_MS);
        };
        tick();
    }

    function manualSelect(key) {
        stopAutoplay();
        clearTimeout(revealTimer);
        selectPhase(key);
        // after the user leaves it alone for a while, resume the auto cycle
        idleTimer = setTimeout(() => startAutoplay(true), AUTOPLAY_IDLE_MS);
    }

    function resetSteps() {
        steps.forEach((s) => {
            s.classList.remove("active", "filled");
            s.setAttribute("aria-pressed", "false");
        });
    }

    function positionTree(activeStep, tree) {
        const stripRect = strip.getBoundingClientRect();
        const nodeRect = activeStep.querySelector(".proc-node").getBoundingClientRect();
        const nodeCenter = nodeRect.left + nodeRect.width / 2 - stripRect.left;
        const treeW = tree.offsetWidth;
        let x = nodeCenter - 6;
        const rightEdge = stripRect.left + x + treeW;
        const vw = window.innerWidth;
        if (rightEdge > vw - 16) x -= (rightEdge - (vw - 16));
        if (x < 0) x = 0;
        tree.style.marginLeft = x + "px";
    }

    function collapseTree() {
        clearTimeout(closeTimer);
        const tree = detail.querySelector(".proc-tree");
        resetSteps();
        strip.style.setProperty("--run-dur", "0.5s");
        strip.style.setProperty("--fill", 0);
        if (!tree) return;
        tree.classList.remove("show");
        clearTimeout(clearTimer);
        clearTimer = setTimeout(() => {
            if (detail.querySelector(".proc-tree") === tree) detail.innerHTML = "";
        }, EXIT_MS);
    }

    function selectPhase(key) {
        const items = PHASES[key];
        if (!items) return;

        clearTimeout(buildTimer);
        clearTimeout(closeTimer);
        clearTimeout(clearTimer);

        const idx = steps.findIndex((s) => s.dataset.phase === key);
        const activeStep = steps[idx];

        resetSteps();
        steps.forEach((s, i) => { if (i <= idx) s.classList.add("filled"); });
        if (activeStep) {
            activeStep.classList.add("active");
            activeStep.setAttribute("aria-pressed", "true");
        }

        const fill = steps.length > 1 ? idx / (steps.length - 1) : 0;
        const dur = RUNNER_MAX * fill;
        strip.style.setProperty("--run-dur", reduceMotion ? "0s" : (dur / 1000).toFixed(3) + "s");
        strip.style.setProperty("--fill", fill);

        const title = activeStep ? activeStep.querySelector(".proc-label").textContent : key;
        let html = '<div class="proc-tree"><div class="proc-tree-title">' + title + '</div><ul class="proc-branches">';
        items.forEach((txt, i) => {
            html += '<li style="--i:' + i + '"><span class="branch-text">' + txt + '</span></li>';
        });
        html += '</ul></div>';
        detail.innerHTML = html;

        const tree = detail.querySelector(".proc-tree");
        positionTree(activeStep, tree);

        if (reduceMotion) { tree.classList.add("show"); return; }

        buildTimer = setTimeout(() => {
            tree.classList.add("show");
            // only auto-collapse after a manual pick (the user hands back
            // control); during auto-play the next phase replaces the tree on
            // its own schedule, so no 3s hold-and-collapse gap
            if (!autoplayActive) closeTimer = setTimeout(collapseTree, HOLD_MS);
        }, Math.max(150, dur));
    }

    steps.forEach((s) => {
        s.addEventListener("click", () => manualSelect(s.dataset.phase));
        s.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); manualSelect(s.dataset.phase); }
        });
    });

    // kick off the auto-play once the "How I work" section scrolls into view;
    // pause it again if the section scrolls away so it never plays off-screen
    const block = strip.closest(".block") || strip.parentElement;
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!autoplayActive && !idleTimer) {
                        clearTimeout(revealTimer);
                        revealTimer = setTimeout(() => startAutoplay(true), AUTOPLAY_REVEAL_DELAY);
                    }
                } else {
                    clearTimeout(revealTimer);
                    stopAutoplay();
                }
            });
        }, { threshold: 0.2 });
        io.observe(block);
    }

    window.addEventListener("resize", () => {
        const tree = detail.querySelector(".proc-tree");
        if (!tree) return;
        const active = steps.find((s) => s.classList.contains("active"));
        if (active) positionTree(active, tree);
    });
})();


// ===== BOTTOM SECTION THEME BEHAVIOUR =====
// Dark theme: the navy section "develops" into the classic white design once it
// enters the focus band — one-way, stays white after.
// Light theme: the original inversion — the section turns navy while it is in
// the focus band and releases back to white as it passes.
(function () {
    const lower = document.getElementById("lower");
    if (!lower) return;
    const isDarkTheme = () => document.documentElement.classList.contains("dark");
    let inView = false, revealed = false;
    const apply = () => {
        if (isDarkTheme()) lower.classList.toggle("light", revealed);
        else lower.classList.toggle("dark", inView);
    };
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            inView = entry.isIntersecting;
            if (inView) revealed = true; // dark theme: one-way develop
        });
        apply();
    }, { rootMargin: "-12% 0px -12% 0px", threshold: 0 });
    io.observe(lower);
    window.addEventListener("themechange", apply);
})();


// ===== THEME TOGGLE (moon/sun button next to the language switch) =====
(function () {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const root = document.documentElement;
    // keep the mobile browser chrome in sync with the current theme
    function syncThemeColor() {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", root.classList.contains("dark") ? "#0a2540" : "#ffffff");
    }
    syncThemeColor();
    btn.addEventListener("click", () => {
        const dark = !root.classList.contains("dark");
        root.classList.toggle("dark", dark);
        try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) { /* private mode */ }
        window.dispatchEvent(new CustomEvent("themechange", { detail: { dark } }));
        syncThemeColor();
        // iOS Safari can leave stale navy tiles around the URL bar / home
        // indicator while the background transitions; force repeated
        // compositor repaints so the whole viewport (including the chrome
        // zones) refreshes.
        function repaint() {
            document.body.style.webkitTransform = "translateZ(0)";
            requestAnimationFrame(() => { document.body.style.webkitTransform = ""; });
        }
        repaint();
        [150, 450].forEach((ms) => setTimeout(repaint, ms));
    });
})();


// ===== MOBILE: pin the cube band directly under the CV button (adaptive) =====
// The cube canvas is absolutely positioned. Instead of a hard-coded top (which
// slid the cube over the text whenever a row was added above it), measure the
// CTA's real bottom edge and drop the band right under it. offsetTop/offsetHeight
// ignore the reveal-blur transform, so the value is correct even mid-animation.
(function () {
    const canvasBox = document.getElementById("hero-canvas-container");
    const cta = document.querySelector(".hero-cta");
    if (!canvasBox || !cta) return;
    const GAP = 22; // px between the text stack and the top of the cube

    function bottomOf(el) { return el ? el.offsetTop + el.offsetHeight : 0; }

    function pin() {
        if (window.matchMedia("(max-width: 900px)").matches) {
            const stackBottom = bottomOf(cta);
            const up = parseFloat(getComputedStyle(document.documentElement)
                .getPropertyValue("--band-up")) || 0;
            const natural = stackBottom + GAP - up;
            // keep the cube roughly vertically centered on screen: the band must
            // not start higher than 30% of the viewport, so text can move up
            // without dragging the cube along with it
            const minTop = window.innerHeight * 0.27;
            canvasBox.style.top = Math.max(natural, minTop) + "px";
        } else {
            canvasBox.style.top = ""; // desktop: fall back to the full-bleed CSS
        }
    }

    pin();
    window.addEventListener("resize", pin);
    // re-measure once the webfont has swapped (text height can change a hair)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pin);
    setTimeout(pin, 800);
    setTimeout(pin, 2600);
})();


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
// solid glazes bottom-up: cube -> pyramid -> octahedron -> hex prism ->
// icosahedron -> cube ... It never switches on its own (user's call).
// All tuning lives in SCENE_CONFIG.
(function () {
    const canvas = document.getElementById("cube-canvas");
    if (!canvas || typeof THREE === "undefined") return;
    const hero = document.getElementById("hero-canvas-container");

    // ===== THEME PALETTES: the figure recolors itself when the theme flips =====
    // ink/cube/orange = the three stops every dot slowly drifts through;
    // cube is also the wireframe + glass tint, scan the colour of the scan light
    const PALETTES = {
        light: {
            ink: [0.039, 0.145, 0.251],    // site --ink #0a2540
            cube: [0.08, 0.72, 0.77],      // site teal
            orange: [1.0, 0.34, 0.13],     // spark / twinkle accent (site --accent #ff5722)
            scan: [0.02, 0.42, 0.5]        // deep teal: reads on white
        },
        dark: {
            ink: [0.93, 0.97, 1.0],        // luminous off-white on navy
            cube: [0.13, 0.83, 0.93],      // bright cyan (matches the intro)
            orange: [1.0, 0.34, 0.13],
            scan: [0.85, 1.0, 1.0]         // near-white cyan glow
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
        shapes: ["cube", "pyramid", "octahedron", "hexPrism", "icosahedron"],
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
        // breathing = an exploded view: faces drift out along their normals in a
        // slow wave rolling across the solid, then settle back (no scaling)
        explode: { amp: { desktop: 0.1, mobile: 0.07 }, periodMs: 4800, wave: 2.2 },
        // an analysis scan: a plane of light sweeps bottom-up through the solid now and then
        scan: { everyMs: 7000, sweepMs: 2400, width: 0.22, firstDelayMs: 3500 },
        // desktop: the solid leans a little toward the cursor (radians at the screen edge)
        parallax: { x: 0.16, y: 0.28, ease: 0.04 },
        dot: { size: 0.05, opacity: 0.6 },
        colors: isDarkTheme() ? PALETTES.dark : PALETTES.light,
        cubeDiagonals: true,               // face diagonals on the cube (false = plain grid)
        twinkle: { rate: 2, decay: 0.0020, blinkAmp: 1.3, blinkSpeed: 0.025 },
        wobble: 0.5,           // camera axis precession: 0 = plain orbit, higher = livelier
        intro: { scale: 10.0, delayMs: 2100, contractMs: 1400 },
        bootFadeMs: 500,       // figure fades in on load instead of popping in fully formed
        scrollShrink: 0.2,     // desktop only: figure shrinks as the hero scrolls away (0 = off)
        panFrac: 0.20,         // shift figure toward screen-right on desktop (0 = centred)
        // nudges the figure UP/DOWN inside the existing frame (frame/canvas size
        // untouched). Positive = up, in (roughly) on-screen pixels.
        figurePanY: { mobile: 45, desktop: 0 }
    };
    const C = SCENE_CONFIG;
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
        return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
    }
    // reference height that fixes the figure's on-screen scale (dots + geometry)
    function heroScaleH() {
        if (vp !== "mobile") return hero.clientHeight;
        return Math.max(1, hero.clientHeight - bandPx("--band-up") - bandPx("--band-down"));
    }

    function applyHeroPan() {
        const w = hero.clientWidth, h = hero.clientHeight;
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
                    // same motif as the intro cubes
                    const c = lerp3(A, B, D, 0.5, 0.5), n = facing(A, B, D, c);
                    const P = (i, j) => lerp3(A, B, D, i / G, j / G);
                    for (let k = 0; k < G; k++) out.struts.push([P(k, k), P(k + 1, k + 1), n, c], [P(k, G - k), P(k + 1, G - k - 1), n, c]);
                }
            }
            return out;
        },
        // tetrahedron standing on its base (apex up), centred on its bounding box
        pyramid() {
            const out = { struts: [], tiles: [] }, R = HALF * 1.5, F = 3; // corners reach the cube corners' radius
            const top = [0, R * 2 / 3, 0];
            const base = [0, 1, 2].map((k) => {
                const a = Math.PI / 2 + k * 2 * Math.PI / 3;
                return [Math.cos(a) * R * Math.sqrt(8) / 3, -R * 2 / 3, Math.sin(a) * R * Math.sqrt(8) / 3];
            });
            triFace(out, top, base[0], base[1], F);
            triFace(out, top, base[1], base[2], F);
            triFace(out, top, base[2], base[0], F);
            triFace(out, base[0], base[2], base[1], F);
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
        uColor: { value: new THREE.Color() }, uScanColor: { value: new THREE.Color() }
    };
    const glassVS = [
        "attribute vec3 aBary;",
        "attribute vec3 aNormalF;",
        "attribute vec3 aCenter;",
        "attribute float aDelay;",
        "uniform float uTime, uAmp, uOmega, uKappa, uScanY, uScanW, uGlaze;",
        "uniform vec3 uDir;",
        "varying vec3 vBary;",
        "varying float vFres, vScan, vGlaze;",
        "void main() {",
        "    float w = 0.5 + 0.5 * sin(uOmega * uTime - uKappa * dot(aCenter, uDir));",
        "    vec3 p = position + aNormalF * uAmp * w;",
        "    vec4 mv = modelViewMatrix * vec4(p, 1.0);",
        "    vec3 nv = normalize(normalMatrix * aNormalF);",
        "    vFres = pow(1.0 - abs(dot(nv, normalize(-mv.xyz))), 2.0);",
        "    float s = (p.y - uScanY) / uScanW;",
        "    vScan = exp(-s * s);",
        "    vGlaze = smoothstep(aDelay, aDelay + 0.25, uGlaze);",
        "    vBary = aBary;",
        "    gl_Position = projectionMatrix * mv;",
        "}"
    ].join("\n");
    const glassFS = [
        "uniform vec3 uColor, uScanColor;",
        "uniform float uOpacity;",
        "varying vec3 vBary;",
        "varying float vFres, vScan, vGlaze;",
        "void main() {",
        "    float e = min(min(vBary.x, vBary.y), vBary.z);   // 0 on the pane's rim",
        "    float rim = 1.0 - smoothstep(0.0, 0.2, e);        // inner glow hugging the rim",
        "    float a = (0.05 + 0.3 * rim) * (0.3 + 0.7 * vFres) + 0.45 * vScan * (0.25 + rim);",
        "    vec3 col = mix(uColor, uScanColor, clamp(vScan, 0.0, 1.0));",
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
        const m = new THREE.ShaderMaterial({
            uniforms: Object.assign({ uOpacity: { value: 0 }, uGlaze: { value: 0 } }, shared),
            vertexShader: glassVS, fragmentShader: glassFS,
            transparent: true, depthWrite: false, side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.visible = false;
        return mesh;
    }

    // Every solid becomes Float32Arrays of S struts (ends / face normal / face
    // centre), S = the biggest solid's strut count. Smaller solids park their
    // spares as zero-length struts on a real node: the line is invisible, the two
    // dots just thicken that node — in a rebuild they grow out / fold back in.
    let S = 0, solids = [];
    function buildSolids(G) {
        solids.forEach((sd) => { figure.remove(sd.glass); sd.glass.geometry.dispose(); sd.glass.material.dispose(); });
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
            return { ends: ends, nrm: nrm, ctr: ctr, glass: glassMesh(out.tiles) };
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
            uScale: { value: heroScaleH() * 0.5 },
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
    }

    let cur = 0, next = 0, building = false, pending = false, bt = 0;
    let glazeT = -1;       // ms into the current solid's glazing (-1 = not started)
    function boot() {
        const prevS = S;
        buildSolids(C.cube[vp].grid);
        if (S !== prevS || !geo) allocate();
        solids.forEach((sd) => figure.add(sd.glass));
        cur %= solids.length; building = pending = false;
        const sd = solids[cur];
        pose = { ends: sd.ends.slice(), nrm: sd.nrm.slice(), ctr: sd.ctr.slice() };
        pos.array.set(pose.ends); pos.needsUpdate = true;
        settle();
        applyColors();
        if (glazeT >= 0) glazeT = 1e9; // a viewport switch keeps the glass on
    }
    boot();

    function startBuild() {
        next = (cur + 1) % solids.length;
        target = matchStruts(pose, solids[next]);
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
    canvas.style.cursor = "pointer";
    canvas.addEventListener("click", () => {
        // tap = re-assemble into the next solid (the breathing settles first)
        if (!building && !pending && !contracting) pending = true;
    });

    const onMq = () => { vp = mq.matches ? "mobile" : "desktop"; boot(); applyHeroPan(); mat.uniforms.uScale.value = heroScaleH() * 0.5; };
    if (mq.addEventListener) mq.addEventListener("change", onMq); else mq.addListener(onMq);

    // desktop: aim the lean at the cursor (smoothed in the loop)
    let aimX = 0, aimY = 0, tiltX = 0, tiltY = 0;
    window.addEventListener("pointermove", (e) => {
        if (vp !== "desktop" || e.pointerType === "touch") return;
        aimY = (e.clientX / window.innerWidth - 0.5) * 2 * C.parallax.y;
        aimX = (e.clientY / window.innerHeight - 0.5) * 2 * C.parallax.x;
    }, { passive: true });

    // ----- intro hand-off + boot fade -----
    const introWillPlay = (function () { try { return sessionStorage.getItem("introSeen") !== "1"; } catch (e) { return true; } })();
    // The zoom-in used to run only after the intro. On repeat views the cube just
    // popped in fully formed, which read as "broken/cheap" — so it now always plays,
    // just without the intro's wait. Repeat views start only slightly enlarged:
    // the old 2.8x start overflowed the screen on every reload and read as a glitch.
    let contracting = true;
    const contractDelay = introWillPlay ? C.intro.delayMs : 0;
    const contractFrom = introWillPlay ? C.intro.scale : 1.25;
    const contractDur = introWillPlay ? C.intro.contractMs : 1200;
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
        const cube = C.cube[vp];
        const now = performance.now();
        // clamped frame time: a backgrounded tab resumes where it left off
        const dt = Math.min(50, now - last); last = now;
        clock += dt / 1000;

        // on intro loads the overlay + contraction own the entrance, so skip the fade
        const bootFade = introWillPlay ? 1 : Math.min(1, (now - heroStart) / C.bootFadeMs);

        let base = cube.scale;
        if (contracting) {
            const el = now - heroStart - contractDelay;
            if (el >= 0) {
                const p = Math.min(el / contractDur, 1);
                base = contractFrom + (cube.scale - contractFrom) * easeOut(p);
                if (p >= 1) { contracting = false; glazeT = 0; } // landed: glaze the solid
            } else {
                base = contractFrom;
            }
        }

        // ----- breathing settles before a rebuild and drifts back after it -----
        const bTarget = (pending || building) ? 0 : 1;
        breath += (bTarget - breath) * (bTarget ? 0.02 : 0.14);
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
            if (bt >= C.build.durationMs) {
                building = false; cur = next;
                pose = target;
                settle();
                glazeT = 0;  // the new frame is up: glaze it bottom-up
            }
        }
        if (!building) {
            // rest: every strut rides out with its face on the breathing wave
            const amp = C.explode.amp[vp] * breath, om = 2 * Math.PI / (C.explode.periodMs / 1000), kp = C.explode.wave;
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

        // ----- glass: the current solid's panes; off while it is being rebuilt -----
        if (glazeT >= 0 && !building) glazeT += dt;
        const gOp = C.glass.opacity[vp] * bootFade * (building ? 0 : pending ? breath : 1);
        solids.forEach((sd, s) => {
            const on = s === cur && gOp > 0.001 && glazeT >= 0;
            sd.glass.visible = on;
            if (on) {
                sd.glass.material.uniforms.uOpacity.value = gOp;
                sd.glass.material.uniforms.uGlaze.value = Math.min(1.3, glazeT / C.glass.glazeMs * 1.3);
            }
        });

        // ----- scan: a plane of light sweeps bottom-up now and then (at rest only) -----
        let scanY = 99;
        if (!building && !pending && !contracting) {
            scanClock += dt;
            if (scanClock >= C.scan.everyMs) scanClock = 0;
            if (scanClock >= 0 && scanClock < C.scan.sweepMs) scanY = -2.1 + 4.2 * easeInOut(scanClock / C.scan.sweepMs);
        }
        shared.uScanY.value = scanY;

        t += 0.01;
        angle += cube.rot;

        // desktop: figure shrinks in sync with the hero scrolling away
        let shr = 1;
        if (vp === "desktop" && C.scrollShrink > 0) {
            const e = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
            shr = 1 - C.scrollShrink * easeInOut(e);
        }
        figure.scale.setScalar(base * shr);
        // lean toward the cursor (desktop), eased so it floats rather than snaps
        tiltX += ((vp === "desktop" ? aimX : 0) - tiltX) * C.parallax.ease;
        tiltY += ((vp === "desktop" ? aimY : 0) - tiltY) * C.parallax.ease;
        figure.rotation.set(tiltX, tiltY, 0);

        lineMat.opacity = cube.lineOpacity * bootFade;
        mat.uniforms.uSize.value = C.dot.size * renderer.getPixelRatio();
        mat.uniforms.uOpacity.value = C.dot.opacity * bootFade;

        // twinkle ignition (rate = flares per SECOND): flare a whole node at rest
        if (!building && groups.length && Math.random() < C.twinkle.rate / 60) {
            groups[(Math.random() * groups.length) | 0].forEach((e) => { flash[e] = 1; });
        }

        const INK = C.colors.ink, CUB = C.colors.cube, ORANGE = C.colors.orange, SC = C.colors.scan;
        const V = S * 2, sw = C.scan.width;
        for (let i = 0; i < V; i++) {
            const j = i * 3;
            // scan light on this vertex (0 far from the plane, 1 on it)
            const sy = (P[j + 1] - scanY) / sw, lit = Math.exp(-sy * sy);
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
        const camR = Math.max(3.0, HALF * cube.scale * 2.4);
        camera.position.x = Math.sin(angle) * camR + Math.sin(t * 0.23) * C.wobble;
        camera.position.y = Math.sin(angle * 0.5) * 0.5 + Math.sin(t * 0.31) * C.wobble;
        camera.position.z = Math.cos(angle) * camR;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    // theme flip: swap the palette (dots, struts and glass recolor on the next frame)
    window.addEventListener("themechange", () => {
        C.colors = isDarkTheme() ? PALETTES.dark : PALETTES.light;
        applyColors();
    });

    window.addEventListener("resize", () => {
        renderer.setSize(hero.clientWidth, hero.clientHeight);
        applyHeroPan();                                       // sets camera.aspect + view offset
        mat.uniforms.uScale.value = heroScaleH() * 0.5;       // keep dot attenuation frozen to base band
    });
})();


// ===== INTRO SEQUENCE (explosion from a point -> cube emerges -> expands) =====
(function () {
    const intro = document.getElementById("intro");
    if (!intro) return;
    let seen = false;
    try { seen = sessionStorage.getItem("introSeen") === "1"; } catch (e) { /* private mode */ }
    // If Three.js failed to load (CDN blocked/slow), drop the intro instead of
    // returning early — otherwise the fixed blue overlay would trap the page.
    if (seen || typeof THREE === "undefined") { intro.remove(); document.body.classList.remove("intro-lock"); window.scrollTo(0, 0); return; }
    document.body.classList.add("intro-lock");
    const canvas = document.getElementById("intro-canvas");
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); camera.position.z = 3.0;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(window.devicePixelRatio);
    const TEAL = 0x22d3ee; const group = new THREE.Group(); const cubeMats = [];   // bright cyan: reads properly on the dark navy intro
    // Edge-fade support: each line vertex gets its own colour, blended toward the
    // backdrop as it approaches the screen border. That dissolves the cube's long
    // near-face edges instead of letting them run into the screen edges.
    const BGC = new THREE.Color(0x0a2540), TEALC = new THREE.Color(TEAL), fadeSets = [];
    function lineMat(opacity) { const m = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true, transparent: true, opacity: 0 }); m.userData = { base: opacity }; cubeMats.push(m); return m; }
    function attachFade(obj) {
        const n = obj.geometry.attributes.position.count;
        const col = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { col[i * 3] = TEALC.r; col[i * 3 + 1] = TEALC.g; col[i * 3 + 2] = TEALC.b; }
        obj.geometry.setAttribute("color", new THREE.BufferAttribute(col, 3));
        fadeSets.push(obj); return obj;
    }
    function wireCube(size, opacity) { const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)); return new THREE.LineSegments(edges, lineMat(opacity)); }
    function faceDiagonals(h, opacity) {
        const axes = [0, 1, 2]; const pts = [];
        for (const ax of axes) {
            for (const sgn of [-1, 1]) {
                const free = axes.filter((a) => a !== ax);
                const corner = (s0, s1) => { const v = [0, 0, 0]; v[ax] = sgn * h; v[free[0]] = s0 * h; v[free[1]] = s1 * h; return v; };
                const A = corner(-1, -1), B = corner(1, 1), C = corner(1, -1), D = corner(-1, 1); pts.push(...A, ...B, ...C, ...D);
            }
        }
        const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); return new THREE.LineSegments(g, lineMat(opacity));
    }
    const OH = 0.8, IH = 0.4; group.add(attachFade(wireCube(OH * 2, 0.9))); group.add(attachFade(faceDiagonals(OH, 0.4))); group.add(attachFade(wireCube(IH * 2, 0.9)));
    const signs = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]; const cpts = [];
    for (const s of signs) { cpts.push(s[0] * OH, s[1] * OH, s[2] * OH); cpts.push(s[0] * IH, s[1] * IH, s[2] * IH); }
    const cgeo = new THREE.BufferGeometry(); cgeo.setAttribute("position", new THREE.Float32BufferAttribute(cpts, 3)); group.add(attachFade(new THREE.LineSegments(cgeo, lineMat(0.45))));
    const NUM_DOTS = 450; const DOT_RADIUS = 2; const DOT_BURST_MS = 800; const DOT_TEAL = [0.13, 0.83, 0.93]; const DOT_ORANGE = [1.0, 0.34, 0.13];
    const dotTarget = new Float32Array(NUM_DOTS * 3); const dotPos = new Float32Array(NUM_DOTS * 3); const dotColors = new Float32Array(NUM_DOTS * 3); const dotFlash = new Float32Array(NUM_DOTS); const dotPhase = new Float32Array(NUM_DOTS);
    for (let i = 0; i < NUM_DOTS; i++) {
        const d = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(); const r = Math.cbrt(Math.random()) * DOT_RADIUS;
        dotTarget[i * 3] = d.x * r; dotTarget[i * 3 + 1] = d.y * r; dotTarget[i * 3 + 2] = d.z * r; dotColors[i * 3] = DOT_TEAL[0]; dotColors[i * 3 + 1] = DOT_TEAL[1]; dotColors[i * 3 + 2] = DOT_TEAL[2]; dotPhase[i] = Math.random() * Math.PI * 2;
    }
    const dotGeo = new THREE.BufferGeometry(); dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3)); dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
    // dot size is animated in render(): at t=0 every dot sits on the same point,
    // so a full-size dot reads as one fat blob — they grow in with the burst
    const DOT_SCALE = window.innerWidth < 600 ? 0.75 : 1;
    const dotMat = new THREE.PointsMaterial({ size: 0.06 * DOT_SCALE, map: makeCircleTexture(), vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false });
    group.add(new THREE.Points(dotGeo, dotMat));
    scene.add(group);
    const IS_PHONE = window.innerWidth < 600;
    // Phone values mirror the desktop composition proportionally: on desktop the
    // cube ends at ~1.09x the visible width, and starts at ~22% of it. A phone's
    // visible width is ~2.1 units (vs ~7.4), so the same look needs 0.3 -> 1.45,
    // not 1 -> 5 (which made it 4x wider than the screen = stray edge lines).
    const S0 = 1.0;                       // start scale (original)
    const S1 = 5.0;                       // end scale (original)
    // Screen-space fade band, in NDC (1.0 = screen border). Desktop keeps its
    // original look, so the fade is parked out of range there.
    const EDGE0 = IS_PHONE ? 0.55 : 99, EDGE1 = IS_PHONE ? 0.95 : 100;
    const _v = new THREE.Vector3();
    camera.updateMatrixWorld(); camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    let raf = null; const startTime = performance.now(); const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); const easeOut = (p) => 1 - Math.pow(1 - p, 3);
    function render() {
        raf = requestAnimationFrame(render); const now = performance.now() - startTime; group.rotation.x += 0.0015; group.rotation.y += 0.003;
        // Expansion range. Desktop keeps the original 1 -> 5 blow-up. On phones that
        // made the cube ~4x wider than the viewport, so only stray edge lines were
        // visible running off-screen ("края") — there we grow small -> still on-screen.
        const p = Math.min(now / 1260, 1);
        const s = S0 + (S1 - S0) * easeInOut(p); group.scale.set(s, s, s);
        const be = easeOut(Math.min(now / 560, 1));
        for (let i = 0; i < NUM_DOTS; i++) { const ix = i * 3; dotPos[ix] = dotTarget[ix] * be; dotPos[ix + 1] = dotTarget[ix + 1] * be; dotPos[ix + 2] = dotTarget[ix + 2] * be; }
        dotGeo.attributes.position.needsUpdate = true;
        dotMat.size = 0.06 * DOT_SCALE * (0.18 + 0.82 * be);   // thin at the burst, full once spread
        const cubeReveal = easeOut(Math.min(Math.max(now - 315, 0) / 455, 1)); for (const m of cubeMats) m.opacity = m.userData.base * cubeReveal;
        if (Math.random() < 0.38) { const nf = 2 + Math.floor(Math.random() * 5); for (let k = 0; k < nf; k++) dotFlash[Math.floor(Math.random() * NUM_DOTS)] = 1; }
        for (let i = 0; i < NUM_DOTS; i++) {
            if (dotFlash[i] > 0) dotFlash[i] -= 0.02; if (dotFlash[i] < 0) dotFlash[i] = 0; const f = dotFlash[i];
            dotPhase[i] += 0.03 + (Math.random() * 0.02); const blink = Math.sin(dotPhase[i]) * 0.5 + 0.5;
            dotColors[i * 3] = (DOT_TEAL[0] + (DOT_ORANGE[0] - DOT_TEAL[0]) * f) * blink; dotColors[i * 3 + 1] = (DOT_TEAL[1] + (DOT_ORANGE[1] - DOT_TEAL[1]) * f) * blink; dotColors[i * 3 + 2] = (DOT_TEAL[2] + (DOT_ORANGE[2] - DOT_TEAL[2]) * f) * blink;
        }
        dotGeo.attributes.color.needsUpdate = true;
        // dissolve line vertices that approach (or pass) the screen border
        if (EDGE0 < 9) {
            group.updateMatrixWorld();
            for (const o of fadeSets) {
                const pos = o.geometry.attributes.position, col = o.geometry.attributes.color;
                for (let i = 0; i < pos.count; i++) {
                    _v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(o.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
                    let t;
                    if (_v.z > -0.25) { t = 1; }                       // at/behind the camera
                    else {
                        _v.applyMatrix4(camera.projectionMatrix);      // -> NDC (1 = screen border)
                        const e = Math.abs(_v.x) > Math.abs(_v.y) ? Math.abs(_v.x) : Math.abs(_v.y);
                        t = (e - EDGE0) / (EDGE1 - EDGE0); t = t < 0 ? 0 : t > 1 ? 1 : t;
                    }
                    col.setXYZ(i, TEALC.r + (BGC.r - TEALC.r) * t, TEALC.g + (BGC.g - TEALC.g) * t, TEALC.b + (BGC.b - TEALC.b) * t);
                }
                col.needsUpdate = true;
            }
        }
        renderer.render(scene, camera);
    }
    render();
    const timers = [];
    // ===== INTRO LOADER animation (drives the #intro-loader markup in index.html) =====
    (function () {
        const fill = document.getElementById("al-fill");
        if (!fill) return;
        const pctEls = [document.getElementById("al-pct-l"), document.getElementById("al-pct-r")];
        const sides = document.querySelectorAll(".al-side");
        const topEl = document.getElementById("al-top");
        const DUR = 2450;                                   // finishes just before exitIntro (2800ms)
        const live = () => document.body.classList.contains("intro-lock");
        const typeCol = (node, text) => {
            if (!node) return; let i = 0; const per = (DUR * 0.85) / text.length;
            (function s() { if (live() && i <= text.length) { node.textContent = text.slice(0, i++); timers.push(setTimeout(s, per)); } })();
        };
        typeCol(document.getElementById("al-tw-tr"), "Elicitation\nAlignment");
        typeCol(document.getElementById("al-tw-bl"), "Risks Analysis\nBusiness Value");
        const t0 = performance.now();
        (function tick(now) {
            if (!live()) return;                            // intro exited -> stop
            const p = Math.min(1, (now - t0) / DUR);
            const pct = Math.max(1, Math.round(p * 100));
            pctEls.forEach((e) => { if (e) e.dataset.pct = pct + "%"; });   // drawn via CSS ::before — keeps "1%" out of the page text (SEO / scrapers)
            fill.setAttribute("y", String(100 - pct));      // white fill rises bottom -> top
            const s = Math.min(1, p / 0.8);
            sides.forEach((n) => { n.style.filter = "blur(" + (12 * (1 - s)) + "px)"; n.style.opacity = s; });
            const st = Math.min(1, p / 0.6);
            if (topEl) { topEl.style.filter = "blur(" + (8 * (1 - st)) + "px)"; topEl.style.opacity = st * 0.9; }
            if (p < 1) requestAnimationFrame(tick);
        })(t0);
    })();
    let exited = false;
    function exitIntro() { if (exited) return; exited = true; try { sessionStorage.setItem("introSeen", "1"); } catch (e) { } timers.forEach(clearTimeout); document.body.classList.remove("intro-lock"); window.scrollTo(0, 0); // exit: kill the loader text fast (no lingering text strips on iOS), then fade the navy screen WITH the cube still contracting — the handoff to the hero cube
        const loaderEl = document.getElementById("intro-loader"); if (loaderEl) { loaderEl.style.transition = "opacity 0.18s ease"; loaderEl.style.opacity = "0"; }
        intro.classList.add("is-exiting"); setTimeout(() => { cancelAnimationFrame(raf); renderer.dispose(); intro.remove(); }, 700); }
    const auto = setTimeout(exitIntro, 2800);
    ["wheel", "touchstart", "keydown", "mousedown"].forEach((ev) => window.addEventListener(ev, () => { clearTimeout(auto); exitIntro(); }, { once: true, passive: true }));
})();