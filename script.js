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
            // a tapped cube-hint stays hidden — never force it back to visible
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
        const base = introWillPlay ? 2300 : 300; // start as the intro fades out
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
    const nav = document.querySelector(".hero-contact");
    const rail = document.querySelector(".contact-rail");
    if (!nav || !rail) return;
    const railText = rail.querySelector(".rail-text");
    // data-rail is set by lang.js (localized) before this script runs
    const links = Array.from(nav.querySelectorAll("a[data-rail]"));

    function show(a) { railText.textContent = a.dataset.rail; rail.classList.add("show"); }
    function hide() { rail.classList.remove("show"); }

    links.forEach((a) => {
        a.addEventListener("mouseenter", () => show(a));
        a.addEventListener("focus", () => show(a));
    });
    nav.addEventListener("mouseleave", hide);
    nav.addEventListener("focusout", hide);

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

    let buildTimer = null, closeTimer = null, clearTimer = null;

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
            closeTimer = setTimeout(collapseTree, HOLD_MS);
        }, Math.max(150, dur));
    }

    steps.forEach((s) => {
        s.addEventListener("click", () => selectPhase(s.dataset.phase));
        s.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPhase(s.dataset.phase); }
        });
    });

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
    const hint = document.querySelector(".cube-hint");
    const cubeCanvas = document.getElementById("cube-canvas");
    if (!canvasBox || !cta) return;
    const GAP = 22; // px between the text stack and the top of the cube

    function bottomOf(el) { return el ? el.offsetTop + el.offsetHeight : 0; }

    function pin() {
        if (window.matchMedia("(max-width: 900px)").matches) {
            // offsetTop/offsetHeight ignore the reveal-blur transform AND the
            // hint's opacity fade, so the band holds still whether the hint is
            // shown or hidden — nothing shifts
            const stackBottom = Math.max(bottomOf(cta), bottomOf(hint));
            // --band-up raises the top so the band grows UPWARD over the hint.
            // The CSS height adds --band-up + --band-down (calc), so --band-down
            // extends the bottom over the name independently. Cube stays frozen.
            const up = parseFloat(getComputedStyle(document.documentElement)
                .getPropertyValue("--band-up")) || 0;
            canvasBox.style.top = (stackBottom + GAP - up) + "px";
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

    // ---- hint: gently fades out once the cube is tapped and stays hidden for
    // the whole session (matches the hero's heroTapped flag). Opacity only
    // (box stays), so the cube band never moves. ----
    if (hint && cubeCanvas) {
        let tappedThisSession = false;
        try { tappedThisSession = sessionStorage.getItem("heroTapped") === "1"; } catch (e) { /* private mode */ }
        if (tappedThisSession) hint.classList.add("is-tapped");
        cubeCanvas.addEventListener("click", function () {
            if (!tappedThisSession) {
                tappedThisSession = true;
                hint.classList.add("is-tapped");
                // inline opacity so no reveal guard/class fight can re-show it
                hint.style.opacity = "0";
            }
        });
    }
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




// ===== HERO FIGURE (lattice cube <-> stipple portrait, true per-point morph) =====
// All tuning lives in SCENE_CONFIG below — values come from the morph lab session.
// Point data comes from face-points.js (window.FACE_POINTS + window.FACE_BRIGHTNESS,
// generated by facegen v3). If that file fails to load, the figure gracefully
// degrades to a plain cube: the morph (and its "tap me" hint) is disabled.
(function () {
    const canvas = document.getElementById("cube-canvas");
    if (!canvas || typeof THREE === "undefined") return;
    const hero = document.getElementById("hero-canvas-container");

    // ===== THEME PALETTES: the figure recolors itself when the theme flips =====
    // light: the original look — navy portrait on white, teal cube.
    // dark:  the face becomes a LIGHT hologram on navy (light dots instead of
    //        navy-on-navy inversion), the cube glows bright cyan, orange pops.
    const PALETTES = {
        light: {
            ink: [0.039, 0.145, 0.251],    // portrait dot color (site --ink #0a2540)
            cube: [0.08, 0.72, 0.77],      // CUBE dot & line color (site teal)
            orange: [1.0, 0.34, 0.13],     // twinkle accent (site --accent #ff5722)
            fadeTo: [0.859, 0.906, 0.984]  // shadows/blink sink toward this (band background)
        },
        dark: {
            ink: [0.93, 0.97, 1.0],        // portrait dots: luminous off-white (reads as a hologram on navy)
            cube: [0.13, 0.83, 0.93],      // CUBE dots & lines: bright cyan (matches the intro)
            orange: [1.0, 0.34, 0.13],     // twinkle accent (site --accent #ff5722)
            fadeTo: [0.055, 0.11, 0.2]     // shadows/blink sink toward this (deep navy, just off the bg)
        }
    };
    const isDarkTheme = () => document.documentElement.classList.contains("dark");
    const THEME_COLORS = isDarkTheme() ? PALETTES.dark : PALETTES.light;
    // the reveal panel reuses the light-theme palette while the portrait develops
    const LIGHT_INK = PALETTES.light.ink, LIGHT_BG = PALETTES.light.fadeTo;

    // ===== SCENE_CONFIG — the single tuning surface =====
    const SCENE_CONFIG = {
        cube: {
            desktop: { scale: 0.9, grid: 3, lineOpacity: 0.5, rot: 0.0025, breathe: 0.09 },
            mobile: { scale: 1, grid: 3, lineOpacity: 0.25, rot: 0.0025, breathe: 0.04 }
        },
        face: {
            desktop: { scale: 1.6, camZ: 4.4, dotSize: 0.04, shade: 1, flatten: 0.9 },
            mobile: { scale: 1.5, camZ: 2.5, dotSize: 0.03, shade: 0.9, flatten: 0.9 }
        },
        morph: { durationMs: 4000, stagger: 0.75, reveal: 0.4, holdMs: 6000 },
        // dark theme only: the portrait develops on a soft light panel with the
        // original light-theme colors and STAYS there until the cube starts
        // rebuilding — only then the panel recedes and the glow face shows.
        facePanel: { on: true, fadeIn: 1.5, fadeOut: 1.1 },
        cubeDot: { size: 0.05, opacity: 0.5 },   // dot size/opacity in the CUBE state
        // in-flight dots during the morph: thinShare of the swarm slims down to
        // thinScale of normal size mid-flight, landing back at full size
        flightDots: { thinShare: 0.7, thinScale: 0.45 },
        colors: THEME_COLORS,
        cubeDiagonals: true,               // face diagonals on the cage (false = plain grid)
        twinkle: { rate: 2, decay: 0.0020, blinkAmp: 1.3, blinkSpeed: 0.025 },
        breatheSpeed: 0.4,     // cube breathing tempo
        wobble: 0.5,          // camera axis precession: 0 = plain orbit, higher = livelier
        intro: { scale: 10.0, delayMs: 3000, contractMs: 2000 },
        bootFadeMs: 500,       // figure fades in on load instead of popping in fully formed
        scrollShrink: 0.2,    // desktop only: figure shrinks as the hero scrolls away (0 = off)
        panFrac: 0.20,         // shift figure toward screen-right on desktop (0 = centred)
        // nudges the figure UP/DOWN inside the existing frame — frame/canvas size
        // is untouched, only what the camera frames within it shifts. Positive = up,
        // negative = down, in (roughly) on-screen pixels. Start small (10-30) and tune.
        facePanY: { mobile: 45, desktop: 0 },
        // ----- heartbeat teaser: periodic lub-dub pulse in cube state (tuned in lab_heartbeat.html) -----
        heartbeat: {
            intervalMs: 5000,   // time between double-pulses
            mainAmp: 0.03,      // main beat: +5% scale
            echoAmp: 0.02,      // echo beat: +3% scale
            beatMs: 600,        // duration of one beat (attack + decay)
            pauseMs: 300,       // micro-pause between the two beats
            roundness: 0,       // 0..1: cube bulges toward a sphere at pulse peak (0 = off)
            firstDelayMs: 2500  // delay before the very first beat (after intro settles)
        },
        hintText: {
            text: "tap me",     // word 1 appears on lub, the rest joins on dub
            color: "ink",       // teal | ink | orange
            depth: 0,           // fake-3D extrusion layers in px (0 = flat)
            maxShows: 0,        // 0 = 3D cube hint disabled; the "tap the cube" hint now lives as a static HTML line under the contacts
            peakOpacity: 0.5,   // opacity at the peak of the pulse
            restOpacity: 0,     // ghost opacity in resting state (0 = fully hidden)
            restBlur: 2,        // blur px in resting state (0 at the peak)
            fadeMs: 750,        // how slowly the text melts back into blur
            size: 2           // hint plane width in scene units
        }
    };
    const C = SCENE_CONFIG;

    // ----- active profile: chosen by viewport, live-switches on rotate/resize -----
    const mq = window.matchMedia("(max-width: 900px)");
    let vp = mq.matches ? "mobile" : "desktop";

    // ----- point data: face-points.js is required for the morph; without it the
    // figure stays a cube (SRC is a dummy cloud that is never flown to) -----
    const FACE_OK = !!(window.FACE_POINTS && window.FACE_POINTS.length);
    const SRC = FACE_OK ? window.FACE_POINTS : new Float32Array(1500 * 3);
    const N = SRC.length / 3;
    let BRIGHT;
    if (window.FACE_BRIGHTNESS && window.FACE_BRIGHTNESS.length === N) {
        BRIGHT = window.FACE_BRIGHTNESS;
    } else {
        BRIGHT = new Float32Array(N); BRIGHT.fill(0.8); // flat weights for the legacy cloud
    }
    const HALF = 1.1; // cube half-size in scene units (face points are exported to match)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, hero.clientWidth / hero.clientHeight, 0.1, 1000);
    camera.position.z = 3.0;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(hero.clientWidth, hero.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // ----- mobile band stretch: two independent levers. --band-up grows the band
    // UPWARD (over the hint), --band-down grows it DOWNWARD (over the name). Both
    // only add transparent margin: the cube's size AND on-screen position stay
    // frozen (scale locked to the BASE band height), so neither lever inflates or
    // moves the figure — the frame just extends on whichever side you tune. -----
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
            // up == down == 0  ->  hRef == h, offset 0  ->  identical to baseline.
            const hRef = heroScaleH();
            camera.aspect = w / hRef;                       // keep dots square vs frozen scale
            camera.setViewOffset(w, hRef, 0, -bandPx("--band-up") + C.facePanY.mobile, w, h);
        } else {
            camera.aspect = w / h;
            camera.setViewOffset(w, h, -w * C.panFrac, C.facePanY.desktop, w, h);
        }
    }
    applyHeroPan();

    // ----- figure: one dots cloud (N points) + rebuildable lattice wireframe -----
    const figure = new THREE.Group();
    scene.add(figure);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    // PointsMaterial only supports ONE global size, but in-flight dots need
    // per-point sizes (30% stay bold, 70% slim down mid-flight). This shader
    // replicates three r128 PointsMaterial size math exactly (size * pixelRatio,
    // scale = canvasHeight / 2, perspective attenuation) plus an aSize multiplier.
    geo.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(N).fill(1), 1));
    const sizeTarget = new Float32Array(N); // per-dot mid-flight size multiplier
    for (let i = 0; i < N; i++) {
        sizeTarget[i] = Math.random() < C.flightDots.thinShare ? C.flightDots.thinScale : 1;
    }
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: makeCircleTexture() },
            uSize: { value: C.cubeDot.size * renderer.getPixelRatio() },
            uScale: { value: heroScaleH() * 0.5 },
            uOpacity: { value: 0 }
        },
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
    figure.add(new THREE.Points(geo, mat));

    const cubeHomes = new Float32Array(N * 3);
    const homes = new Float32Array(N * 3); // spherify-adjusted copy of cubeHomes (what the loop reads)
    let lineSeg = null;
    let lineBase = null;   // wireframe rest positions (cube shape) for spherify
    let lastK = -1;        // last spherify factor applied (-1 forces a resync)
    let nodeCount = 1;

    // Surface lattice: dots stack on grid nodes (clean cube at rest), wireframe
    // lines run along every face — the true morph flies each point to the face.
    function buildCube(G) {
        const nodes = [];
        for (let i = 0; i <= G; i++) for (let j = 0; j <= G; j++) for (let k = 0; k <= G; k++) {
            if (i === 0 || i === G || j === 0 || j === G || k === 0 || k === G) {
                nodes.push([-HALF + 2 * HALF * i / G, -HALF + 2 * HALF * j / G, -HALF + 2 * HALF * k / G]);
            }
        }
        nodeCount = nodes.length;
        const order = nodes.map((_, i) => i);
        for (let i = order.length - 1; i > 0; i--) {
            const j = (Math.random() * (i + 1)) | 0;
            const tmpSwap = order[i]; order[i] = order[j]; order[j] = tmpSwap;
        }
        for (let p = 0; p < N; p++) {
            const nd = nodes[order[p % order.length]];
            cubeHomes[p * 3] = nd[0]; cubeHomes[p * 3 + 1] = nd[1]; cubeHomes[p * 3 + 2] = nd[2];
        }
        // segments are SUBDIVIDED so the heartbeat can bow lines toward a sphere
        const raw = [];
        const step = 2 * HALF / G;
        for (let a = 0; a <= G; a++) {
            const u = -HALF + a * step;
            for (const s of [-HALF, HALF]) {
                raw.push([u, -HALF, s, u, HALF, s]);   // z-faces: vertical
                raw.push([-HALF, u, s, HALF, u, s]);   // z-faces: horizontal
                raw.push([u, s, -HALF, u, s, HALF]);   // y-faces: along Z
                raw.push([-HALF, s, u, HALF, s, u]);   // y-faces: along X (was missing)
                raw.push([s, u, -HALF, s, u, HALF]);   // x-faces: along Z
                raw.push([s, -HALF, u, s, HALF, u]);   // x-faces: vertical (was missing)
            }
        }
        // corner-to-corner diagonals on every face — same motif as the intro cubes
        if (C.cubeDiagonals) {
            for (const s of [-HALF, HALF]) {
                raw.push([s, -HALF, -HALF, s, HALF, HALF]); raw.push([s, -HALF, HALF, s, HALF, -HALF]);
                raw.push([-HALF, s, -HALF, HALF, s, HALF]); raw.push([-HALF, s, HALF, HALF, s, -HALF]);
                raw.push([-HALF, -HALF, s, HALF, HALF, s]); raw.push([-HALF, HALF, s, HALF, -HALF, s]);
            }
        }
        const SUB = 8;
        const segs = [];
        for (const r of raw) {
            for (let q = 0; q < SUB; q++) {
                const t0 = q / SUB, t1 = (q + 1) / SUB;
                segs.push(
                    r[0] + (r[3] - r[0]) * t0, r[1] + (r[4] - r[1]) * t0, r[2] + (r[5] - r[2]) * t0,
                    r[0] + (r[3] - r[0]) * t1, r[1] + (r[4] - r[1]) * t1, r[2] + (r[5] - r[2]) * t1
                );
            }
        }
        if (lineSeg) { figure.remove(lineSeg); lineSeg.geometry.dispose(); lineSeg.material.dispose(); }
        const lgeo = new THREE.BufferGeometry();
        lgeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segs), 3));
        lineBase = new Float32Array(segs);
        const cc = C.colors.cube;
        const lmat = new THREE.LineBasicMaterial({
            color: new THREE.Color(cc[0], cc[1], cc[2]), transparent: true, opacity: 0
        });
        lineSeg = new THREE.LineSegments(lgeo, lmat);
        figure.add(lineSeg);
        homes.set(cubeHomes); // resync the spherify copy after every rebuild
        lastK = -1;
    }
    buildCube(C.cube[vp].grid);

    // ----- spherify: lerp every vertex from its cube home toward a sphere (heartbeat) -----
    const SPHERE_R = HALF * 1.15; // radius the vertices bulge toward
    function applySpherify(k) {
        if (Math.abs(k - lastK) < 0.0005) return;
        lastK = k;
        for (let i = 0; i < N; i++) {
            const j = i * 3;
            const x = cubeHomes[j], y = cubeHomes[j + 1], z = cubeHomes[j + 2];
            const d = Math.sqrt(x * x + y * y + z * z) || 1;
            const mm = 1 + (SPHERE_R / d - 1) * k;
            homes[j] = x * mm; homes[j + 1] = y * mm; homes[j + 2] = z * mm;
        }
        const lp = lineSeg.geometry.attributes.position.array;
        for (let j = 0; j < lp.length; j += 3) {
            const x = lineBase[j], y = lineBase[j + 1], z = lineBase[j + 2];
            const d = Math.sqrt(x * x + y * y + z * z) || 1;
            const mm = 1 + (SPHERE_R / d - 1) * k;
            lp[j] = x * mm; lp[j + 1] = y * mm; lp[j + 2] = z * mm;
        }
        lineSeg.geometry.attributes.position.needsUpdate = true;
    }

    const onMq = () => { vp = mq.matches ? "mobile" : "desktop"; buildCube(C.cube[vp].grid); applyHeroPan(); mat.uniforms.uScale.value = heroScaleH() * 0.5; };
    if (mq.addEventListener) mq.addEventListener("change", onMq); else mq.addListener(onMq);

    // ----- per-point animation state -----
    const delay = new Float32Array(N);   // position-wave offsets
    const flash = new Float32Array(N);   // orange twinkle intensity
    const phase = new Float32Array(N);   // per-dot blink phase
    for (let i = 0; i < N; i++) { delay[i] = Math.random(); phase[i] = Math.random() * Math.PI * 2; }

    // ----- morph state: 0 = cube, 1 = face; click toggles -----
    let morph = 0, morphTarget = 0, holdTimer = null;
    // reveal panel: 0 = navy (dark palette), 1 = light palette + panel visible
    const panelEl = document.getElementById("face-panel");
    let panelMix = 0, panelTarget = 0, panelRecedeAt = -1;
    canvas.style.cursor = FACE_OK ? "pointer" : "default";
    canvas.addEventListener("click", () => {
        if (!FACE_OK) return; // no portrait data — stay a cube
        morphTarget = morphTarget === 0 ? 1 : 0;
        clearTimeout(holdTimer);
        if (morphTarget === 1) holdTimer = setTimeout(() => { morphTarget = 0; }, C.morph.holdMs);
        // the user has found the secret — retire the hint for the rest of the session
        tapped = true;
        windowHasText = false;
        sessionStorage.setItem("heroTapped", "1");
    });

    // ===== HEARTBEAT TEASER + HINT TEXT (tuned in lab_heartbeat.html) =====
    // Hint plane lives INSIDE the cube and rotates with it; the text is drawn on a
    // canvas in the hero-credo face (SF Mono 500, uppercase, wide letter-spacing)
    // and melts in/out of blur via ctx.filter baked into the texture.
    const HINT_COLOR = { teal: "#14b8c4", ink: "#0a2540", orange: "#ff5722" };
    const HINT_DEPTH_COLOR = { teal: "#0c6f76", ink: "#04101c", orange: "#a33314" };
    const HINT_W = 1024, HINT_H = 320, HINT_FONT_PX = 96;
    // keep in sync with --font-mono in style.css (canvas cannot read CSS vars)
    const HINT_FONT = "500 " + HINT_FONT_PX + "px 'JetBrains Mono', 'SF Mono', 'Roboto Mono', ui-monospace, monospace";
    const hintCanvas = document.createElement("canvas");
    hintCanvas.width = HINT_W; hintCanvas.height = HINT_H;
    const hintCtx = hintCanvas.getContext("2d");
    const hintTex = new THREE.CanvasTexture(hintCanvas);
    hintTex.minFilter = THREE.LinearFilter;
    const hintMat = new THREE.MeshBasicMaterial({
        map: hintTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide
    });
    const hintPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, HINT_H / HINT_W), hintMat);
    hintPlane.scale.setScalar(C.hintText.size);
    figure.add(hintPlane); // rotates with the cube — weird angles are expected

    let hintLastDraw = "";
    function drawHint(str, blurPx, dots) {
        const ht = C.hintText;
        const key = str + "|" + blurPx.toFixed(1) + "|" + dots + "|" + ht.color + "|" + ht.depth;
        if (key === hintLastDraw) return;
        hintLastDraw = key;
        hintCtx.clearRect(0, 0, HINT_W, HINT_H);
        if (!str) { hintTex.needsUpdate = true; return; }
        hintCtx.filter = blurPx > 0.3 ? "blur(" + blurPx.toFixed(1) + "px)" : "none";
        hintCtx.font = HINT_FONT;
        if ("letterSpacing" in hintCtx) hintCtx.letterSpacing = (0.22 * HINT_FONT_PX).toFixed(0) + "px";
        hintCtx.textAlign = "center"; hintCtx.textBaseline = "middle";
        const cx = HINT_W / 2, cy = HINT_H / 2;
        // fake 3D: darker extrusion layers stepped behind the top face (depth 0 = flat)
        for (let d = C.hintText.depth; d >= 1; d--) {
            hintCtx.fillStyle = HINT_DEPTH_COLOR[ht.color] || HINT_DEPTH_COLOR.ink;
            hintCtx.fillText(str, cx + d, cy + d);
        }
        hintCtx.fillStyle = HINT_COLOR[ht.color] || HINT_COLOR.ink;
        hintCtx.fillText(str, cx, cy);
        // trailing dots appended at the right edge so the word itself never shifts
        if (dots > 0) {
            const w = hintCtx.measureText(str).width;
            hintCtx.textAlign = "left";
            hintCtx.fillText(".".repeat(dots), cx + w / 2 + HINT_FONT_PX * 0.15, cy);
        }
        hintCtx.filter = "none";
        hintTex.needsUpdate = true;
    }

    // beatShape: sharp ease-out attack (35% of the beat), smooth decay back
    function beatShape(p) {
        if (p <= 0 || p >= 1) return 0;
        const a = 0.35;
        return p < a ? easeOut(p / a) : 1 - easeInOut((p - a) / (1 - a));
    }

    let beatStart = -1;    // -1 = resting
    let beatSign = -1;     // flips each beat: +1 = grow-beat (lub-dub bigger), -1 = shrink-beat (lub-dub smaller) — reads as breathing in/out
    let nextBeatAt = performance.now() + C.heartbeat.firstDelayMs;
    let hintVis = 0;       // 0 = hidden/blurred, 1 = sharp peak
    let hintShows = 0;     // how many times the hint has been shown this page load
    // no face data -> treat as "already tapped" so the "tap me" hint never shows
    let tapped = !FACE_OK || sessionStorage.getItem("heroTapped") === "1";
    let windowHasText = false;
    let hbLast = performance.now();

    function heartbeat(now) {
        const hb = C.heartbeat;
        if (beatStart < 0 && now >= nextBeatAt) {
            // beats only fire in the resting cube state — never during morph or intro
            if (morph === 0 && morphTarget === 0 && !contracting) {
                beatStart = now;
                beatSign *= -1; // alternate grow-beat / shrink-beat so the cube "breathes"
                windowHasText = !tapped && hintShows < C.hintText.maxShows;
                if (windowHasText) {
                    hintShows++;
                    // align the plane with the cube face that currently looks at the
                    // camera (yaw snapped to 90°) — the text stays true to the cube
                    // lattice geometry instead of floating at an arbitrary angle
                    const snapped = Math.round(Math.atan2(camera.position.x, camera.position.z) / (Math.PI / 2)) * (Math.PI / 2);
                    hintPlane.rotation.set(0, snapped, 0);
                }
            } else {
                nextBeatAt = now + hb.intervalMs; // busy — try again next interval
            }
        }
        let pulse = 0, inWindow = false, echoPhase = false;
        if (beatStart >= 0) {
            const el = now - beatStart;
            const echoDur = hb.beatMs * 0.85;
            const total = hb.beatMs + hb.pauseMs + echoDur;
            if (el >= total) {
                beatStart = -1;
                nextBeatAt = now + hb.intervalMs;
            } else {
                inWindow = true;
                echoPhase = el >= hb.beatMs + hb.pauseMs * 0.5; // second word joins on the dub
                pulse += beatShape(el / hb.beatMs) * hb.mainAmp * beatSign;                          // lub
                pulse += beatShape((el - hb.beatMs - hb.pauseMs) / echoDur) * hb.echoAmp * beatSign; // dub
            }
        }
        return { pulse: pulse, inWindow: inWindow, echoPhase: echoPhase };
    }

    // ----- intro hand-off + boot fade -----
    const introWillPlay = (function () { try { return sessionStorage.getItem("introSeen") !== "1"; } catch (e) { return true; } })();
    // The zoom-in used to run only after the intro. On repeat views the cube just
    // popped in fully formed, which read as "broken/cheap" — so it now always plays,
    // just without the intro's wait and from a gentler start scale.
    let contracting = true;
    const contractDelay = introWillPlay ? C.intro.delayMs : 0;
    const contractFrom = introWillPlay ? C.intro.scale : 2.8;
    const contractDur = introWillPlay ? C.intro.contractMs : 1100;
    const heroStart = performance.now();

    const easeOut = (p) => 1 - Math.pow(1 - p, 3);
    const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    let t = 0, angle = 0;
    const pos = geo.attributes.position;
    const col = geo.attributes.color;
    const asz = geo.attributes.aSize;

    function animate() {
        requestAnimationFrame(animate);
        const cube = C.cube[vp], face = C.face[vp];

        // advance morph toward the target at a speed derived from durationMs
        const step = 16.7 / C.morph.durationMs;
        if (morph < morphTarget) morph = Math.min(morph + step, 1);
        else if (morph > morphTarget) morph = Math.max(morph - step, 0);
        const m = easeInOut(morph), inv = 1 - m;

        // reveal panel (dark theme only): rises with the developing portrait and
        // lingers ~1s into the rebuild before receding — the card outlives the
        // face just enough that the dark glow face is never left alone on navy
        if (panelEl && C.facePanel.on && isDarkTheme()) {
            if (morphTarget === 1) {
                panelRecedeAt = -1;
                panelTarget = clamp01((morph - 0.15) / 0.55);
            } else if (morph > 0.02 && panelRecedeAt < 0) {
                panelRecedeAt = performance.now() + 1000; // the card lingers 1s into the rebuild
                panelTarget = 1;
            } else if (panelRecedeAt >= 0 && performance.now() >= panelRecedeAt) {
                panelTarget = 0;
            }
            panelMix += (panelTarget - panelMix) * 0.03;
            panelEl.style.opacity = panelMix.toFixed(3);
        } else if (panelEl) {
            panelEl.style.opacity = "0";
        }

        t += 0.01;
        angle += cube.rot * (1 - morph); // orbit stops as the face forms

        // on intro loads the overlay + contraction own the entrance, so skip the fade
        const bootFade = introWillPlay ? 1 : Math.min(1, (performance.now() - heroStart) / C.bootFadeMs);
        const breathe = 1 + Math.sin(t * C.breatheSpeed) * cube.breathe * (1 - morph);

        // desktop: figure shrinks in sync with the hero scrolling away
        let shr = 1;
        if (vp === "desktop" && C.scrollShrink > 0) {
            const e = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
            shr = 1 - C.scrollShrink * easeInOut(e);
        }

        let base = cube.scale + (face.scale - cube.scale) * m;
        if (contracting) {
            const el = performance.now() - heroStart - contractDelay;
            if (el >= 0) {
                const p = Math.min(el / contractDur, 1);
                base = contractFrom + (cube.scale - contractFrom) * easeOut(p);
                if (p >= 1) contracting = false;
            } else {
                base = contractFrom;
            }
        }
        // heartbeat: lub-dub pulse rides on top of breathe; dies out as the face forms
        const hbNow = performance.now();
        const hbDt = Math.min(50, hbNow - hbLast); hbLast = hbNow;
        const hbState = heartbeat(hbNow);
        const pulse = hbState.pulse * inv;

        // breathe/shrink multiply the whole curve, so the handoff has no scale jump
        figure.scale.setScalar(base * breathe * shr * (1 + pulse));

        // cube -> sphere bulge driven by pulse strength (roundness 0 = off)
        applySpherify(C.heartbeat.roundness * Math.min(1, pulse / (C.heartbeat.mainAmp || 1)));

        // hint text: fast attack at the beat, slow melt back into blur;
        // staged wording — word 1 on the lub, full phrase on the dub, dots grow on the fade
        const hTarget = (hbState.inWindow && windowHasText) ? 1 : 0;
        const hSpeed = hTarget > hintVis ? hbDt / 120 : hbDt / C.hintText.fadeMs;
        hintVis += (hTarget - hintVis) * Math.min(1, hSpeed);
        if (hintVis < 0.001) hintVis = 0;
        const HT = C.hintText;
        hintMat.opacity = (HT.restOpacity + (HT.peakOpacity - HT.restOpacity) * hintVis) * inv * bootFade;
        if (hintMat.opacity > 0.001 || hintVis > 0) {
            const hWords = (HT.text || "").trim().toUpperCase().split(/\s+/);
            let hStr = "", hDots = 0;
            if (hbState.inWindow && windowHasText) {
                hStr = hbState.echoPhase ? hWords.join(" ") : hWords[0];
            } else if (hintVis > 0) {
                hStr = hWords.join(" ");
                hDots = hintVis > 0.75 ? 1 : hintVis > 0.45 ? 2 : 3;
            }
            drawHint(hStr, HT.restBlur * (1 - hintVis), hDots);
        }

        // wireframe dissolves as the face forms; dots settle to full presence
        lineSeg.material.opacity = cube.lineOpacity * (1 - m) * bootFade;
        mat.uniforms.uSize.value = (C.cubeDot.size + (face.dotSize - C.cubeDot.size) * m) * renderer.getPixelRatio();
        mat.uniforms.uOpacity.value = (C.cubeDot.opacity + (1 - C.cubeDot.opacity) * morph) * bootFade;

        // twinkle ignition (rate = flares per frame): in cube state dots are stacked
        // on lattice nodes, so a single flaring dot stays buried under its stack —
        // flare the whole node; in face state single dots flare as before
        // rate = flares per SECOND (probability per frame), not per frame
        if (Math.random() < C.twinkle.rate / 60) {
            if (morph < 0.5) {
                const n = (Math.random() * nodeCount) | 0;
                for (let p = n; p < N; p += nodeCount) flash[p] = 1;
            } else {
                flash[(Math.random() * N) | 0] = 1;
            }
        }

        const stag = C.morph.stagger, rev = C.morph.reveal, shade = face.shade;
        const zK = 1 - face.flatten * m; // relief collapses: flat crisp portrait at rest
        let INK = C.colors.ink, CUB = C.colors.cube, ORANGE = C.colors.orange, BG = C.colors.fadeTo;
        // while the light panel is up, blend the dot colors toward the light-theme
        // palette so the portrait develops exactly as it does on the white theme
        if (panelMix > 0.001) {
            const t = panelMix, o = 1 - t;
            INK = [LIGHT_INK[0] * t + INK[0] * o, LIGHT_INK[1] * t + INK[1] * o, LIGHT_INK[2] * t + INK[2] * o];
            BG = [LIGHT_BG[0] * t + BG[0] * o, LIGHT_BG[1] * t + BG[1] * o, LIGHT_BG[2] * t + BG[2] * o];
        }

        for (let i = 0; i < N; i++) {
            const j = i * 3;
            // position: per-point staggered flight cube -> face
            const lp = easeInOut(clamp01((morph - delay[i] * stag) / (1 - stag || 1)));
            pos.array[j] = homes[j] + (SRC[j] - homes[j]) * lp;
            pos.array[j + 1] = homes[j + 1] + (SRC[j + 1] - homes[j + 1]) * lp;
            pos.array[j + 2] = homes[j + 2] + (SRC[j + 2] * zK - homes[j + 2]) * lp;

            // in-flight slimming: transit peaks mid-flight (0 at both endpoints),
            // so dots take off and land at full size but thin out while flying
            const transit = 4 * lp * (1 - lp);
            asz.array[i] = 1 + (sizeTarget[i] - 1) * transit;

            // color: brightness-ordered reveal — strong features commit first,
            // light shadows fill in last ("developing photo")
            const b = BRIGHT[i];
            const lr = clamp01((morph - (1 - b) * rev) / (1 - rev || 1));
            const k = 1 - shade * (1 - b);
            // cube state: each dot drifts SLOWLY through the full palette cycle
            // ink -> teal -> orange -> teal -> ink (blinkAmp = how far along the
            // palette the drift reaches: 0.5 stops at teal, 1.0 reaches orange;
            // blinkSpeed = tempo). The drift dies out as the portrait forms.
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
            r += ((BG[0] + (INK[0] - BG[0]) * k) - r) * lr;
            g += ((BG[1] + (INK[1] - BG[1]) * k) - g) * lr;
            bl += ((BG[2] + (INK[2] - BG[2]) * k) - bl) * lr;

            // orange flare on top
            if (flash[i] > 0) { flash[i] -= C.twinkle.decay; if (flash[i] < 0) flash[i] = 0; }
            const f = flash[i];
            col.array[j] = r + (ORANGE[0] - r) * f;
            col.array[j + 1] = g + (ORANGE[1] - g) * f;
            col.array[j + 2] = bl + (ORANGE[2] - bl) * f;
        }
        pos.needsUpdate = true;
        col.needsUpdate = true;
        asz.needsUpdate = true;

        // camera: orbit + slow axis precession for the cube, straight-on for the face
        const camR = Math.max(3.0, HALF * cube.scale * 2.4);
        const ox = Math.sin(angle) * camR + Math.sin(t * 0.23) * C.wobble;
        const oy = Math.sin(angle * 0.5) * 0.5 + Math.sin(t * 0.31) * C.wobble;
        const oz = Math.cos(angle) * camR;
        camera.position.x = ox * inv;
        camera.position.y = oy * inv;
        camera.position.z = oz * inv + face.camZ * m;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    // theme flip: swap the palette (dots recolor on the next frame) and rebuild
    // the wireframe so its line color follows the theme too
    window.addEventListener("themechange", () => {
        C.colors = document.documentElement.classList.contains("dark") ? PALETTES.dark : PALETTES.light;
        buildCube(C.cube[vp].grid);
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
        const p = Math.min(now / 1800, 1);
        const s = S0 + (S1 - S0) * easeInOut(p); group.scale.set(s, s, s);
        const be = easeOut(Math.min(now / 800, 1));
        for (let i = 0; i < NUM_DOTS; i++) { const ix = i * 3; dotPos[ix] = dotTarget[ix] * be; dotPos[ix + 1] = dotTarget[ix + 1] * be; dotPos[ix + 2] = dotTarget[ix + 2] * be; }
        dotGeo.attributes.position.needsUpdate = true;
        dotMat.size = 0.06 * DOT_SCALE * (0.18 + 0.82 * be);   // thin at the burst, full once spread
        const cubeReveal = easeOut(Math.min(Math.max(now - 450, 0) / 650, 1)); for (const m of cubeMats) m.opacity = m.userData.base * cubeReveal;
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
        const DUR = 3500;                                   // finishes just before exitIntro (4000ms)
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
            pctEls.forEach((e) => { if (e) e.textContent = pct + "%"; });
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
    const auto = setTimeout(exitIntro, 4000);
    ["wheel", "touchstart", "keydown", "mousedown"].forEach((ev) => window.addEventListener(ev, () => { clearTimeout(auto); exitIntro(); }, { once: true, passive: true }));
})();