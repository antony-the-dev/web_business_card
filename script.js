// ===== TYPEWRITER EFFECT (writes to every .typed-out target) =====
// Phrases come from lang.js (window.TYPED_PHRASES, localized); the inline
// array is only a fallback in case lang.js fails to load.
const phrases = (window.TYPED_PHRASES && window.TYPED_PHRASES.length)
    ? window.TYPED_PHRASES
    : ["BPMN & UML modeling", "API & Data entity schemas", "Requirements engineering", "Pre-sale consulting", "Discovery to handoff"];
const targets = document.querySelectorAll("#typed, .id-typed");
// open on the whole first phrase (a half-typed "BPMN & UML modelin" on the first
// paint read as a glitch in screenshots and link previews); the cycle starts by
// deleting it after the usual pause
let phraseIndex = 0; let charIndex = phrases[0].length; let deleting = true;
targets.forEach((t) => t.textContent = phrases[0]);

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
setTimeout(tick, 2200);


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

    // hero blocks: staggered blur-in, starting right after the first paint
    const enterEls = Array.from(document.querySelectorAll("[data-enter]"))
        .sort((a, b) => (+a.dataset.enter) - (+b.dataset.enter));

    if (reduceMotion) {
        enterEls.forEach((el) => el.classList.add("shown"));
    } else {
        const base = 300;
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


// ===== BOTTOM SECTION: DEVELOP TO WHITE =====
// The navy section "develops" into the classic white design once it enters the
// focus band — one-way, it stays white after. (The site is dark only since
// Oct 19 2026; the light theme's scroll inversion went with it.)
(function () {
    const lower = document.getElementById("lower");
    if (!lower) return;
    const io = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            lower.classList.add("light");
            io.disconnect();
        }
    }, { rootMargin: "-12% 0px -12% 0px", threshold: 0 });
    io.observe(lower);
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
