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
    // makeCircleTexture() lives in figure.js, which index.html loads right before this file
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