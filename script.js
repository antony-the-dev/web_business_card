// ===== TYPEWRITER EFFECT (the changing line at the bottom of the hero) =====

const phrases = [
    "7 years in IT",
    "Requirements, from discovery to UAT",
    "BPMN / UML modeling",
    "Pre-sale to UAT, end to end",
];

const target = document.getElementById("typed");

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
        target.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1500);
            return;
        }
    } else {
        target.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    const speed = deleting ? 50 : 90;
    setTimeout(tick, speed);
}

tick();


// ===== SCROLL FADE-IN =====

const revealEls = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));


// ===== HIDE SCROLL ARROW AFTER SCROLLING =====
(function () {
    const arrow = document.querySelector(".scroll-arrow");
    if (!arrow) return;
    window.addEventListener("scroll", () => {
        arrow.style.opacity = window.scrollY > 10 ? "0" : "0.7";
    });
})();


// ===== shared: soft round sprite so points render as circles, not squares =====
function makeCircleTexture() {
    const s = 64;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0.0, "rgba(255,255,255,1)");
    g.addColorStop(0.6, "rgba(255,255,255,0.85)");
    g.addColorStop(1.0, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
}


// ===== HERO FIGURE (enters full-screen, contracts to a small centered shape) =====
(function () {
    const canvas = document.getElementById("cube-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    const hero = document.getElementById("hero");

    // ---- entrance knobs (tell me a number, I'll change it) ----
    const RESTING_SCALE = 0.8;    // final size of the figure
    const INTRO_SCALE = 5.0;    // size it appears at before contracting
    const CONTRACT_DELAY = 2200;   // when the contraction starts (synced to intro exit)
    const CONTRACT_MS = 1500;   // how long the contraction takes
    // ----------------------------------------------------------

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // intro plays only on a fresh first load; if so, the figure does its entrance
    const introWillPlay = !reduceMotion && sessionStorage.getItem("introSeen") !== "1";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, hero.clientWidth / hero.clientHeight, 0.1, 1000);
    camera.position.z = 3.0;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(hero.clientWidth, hero.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 5, 5, 5);
    const basePositions = geometry.attributes.position.array.slice();
    const count = geometry.attributes.position.count;

    // faint lattice that joins the circles together
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0x14b8c4, wireframe: true, transparent: true, opacity: 0.13
    }));

    const BLUE = [0.04, 0.15, 0.25];
    const ORANGE = [1.0, 0.34, 0.13];
    const colors = new Float32Array(count * 3);
    const flash = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        colors[i * 3] = BLUE[0]; colors[i * 3 + 1] = BLUE[1]; colors[i * 3 + 2] = BLUE[2];
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // round, semi-transparent circles instead of square points
    const dots = new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 0.06,
        map: makeCircleTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
    }));

    // group both so we can scale the whole figure for the entrance
    const figure = new THREE.Group();
    figure.add(mesh, dots);
    scene.add(figure);

    figure.scale.setScalar(introWillPlay ? INTRO_SCALE : RESTING_SCALE);
    let contracting = introWillPlay;
    const heroStart = performance.now();
    const easeOut = (p) => 1 - Math.pow(1 - p, 3);

    let t = 0;
    const pos = geometry.attributes.position;
    const col = geometry.attributes.color;

    function animate() {
        requestAnimationFrame(animate);
        t += 0.01;

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const x = basePositions[ix], y = basePositions[ix + 1], z = basePositions[ix + 2];
            const wave = Math.sin(x * 2 + t) * 0.15 + Math.cos(y * 2 + t * 1.3) * 0.15 + Math.sin(z * 2 + t * 0.7) * 0.15;
            const s = 1 + wave;
            pos.array[ix] = x * s; pos.array[ix + 1] = y * s; pos.array[ix + 2] = z * s;
        }
        pos.needsUpdate = true;

        // rarer, quieter orange flashes
        if (Math.random() < 0.15) {
            const n = 1 + Math.floor(Math.random() * 3);
            for (let k = 0; k < n; k++) flash[Math.floor(Math.random() * count)] = 1;
        }
        for (let i = 0; i < count; i++) {
            if (flash[i] > 0) flash[i] -= 0.02;
            if (flash[i] < 0) flash[i] = 0;
            const f = flash[i];
            col.array[i * 3] = BLUE[0] + (ORANGE[0] - BLUE[0]) * f;
            col.array[i * 3 + 1] = BLUE[1] + (ORANGE[1] - BLUE[1]) * f;
            col.array[i * 3 + 2] = BLUE[2] + (ORANGE[2] - BLUE[2]) * f;
        }
        col.needsUpdate = true;

        // entrance: contract from INTRO_SCALE down to RESTING_SCALE
        if (contracting) {
            const el = performance.now() - heroStart - CONTRACT_DELAY;
            if (el >= 0) {
                const p = Math.min(el / CONTRACT_MS, 1);
                figure.scale.setScalar(INTRO_SCALE + (RESTING_SCALE - INTRO_SCALE) * easeOut(p));
                if (p >= 1) contracting = false;
            }
        }

        figure.rotation.x += 0.002;
        figure.rotation.y += 0.004;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = hero.clientWidth / hero.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(hero.clientWidth, hero.clientHeight);
    });
})();


// ===== INTRO SEQUENCE (cube-in-cube greeter that expands to fill the page) =====
(function () {
    const intro = document.getElementById("intro");
    if (!intro || typeof THREE === "undefined") return;

    // ---- timing knobs (tell me a number, I'll change it) ----
    const FIRST_MS = 300;    // delay before the first word lands
    const STEP_MS = 600;    // gap between each word
    const EXPAND_MS = 1800;   // how long the cube grows to fill the screen
    const FULL_SCALE = 5.0;    // how big the cube gets at full expansion
    const WORDS_MS = 2400;   // total run time before auto-exit
    const EXIT_MS = 650;    // length of the fade-out before the hero is revealed
    // ----------------------------------------------------------

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("introSeen") === "1";

    // Skip entirely: no animation, no second canvas — straight to the hero.
    if (reduceMotion || seen) {
        intro.remove();
        return;
    }

    document.body.classList.add("intro-lock");

    // --- the cube (outer cube + face diagonals + inner cube + corner links) ---
    const canvas = document.getElementById("intro-canvas");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3.0;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const TEAL = 0x14b8c4;
    const group = new THREE.Group();

    function lineMat(opacity) {
        return new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: opacity });
    }

    function wireCube(size, opacity) {
        const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
        return new THREE.LineSegments(edges, lineMat(opacity));
    }

    // crossing diagonals on each of the 6 faces of a cube of half-size h
    function faceDiagonals(h, opacity) {
        const axes = [0, 1, 2];
        const pts = [];
        for (const ax of axes) {
            for (const sgn of [-1, 1]) {
                const free = axes.filter((a) => a !== ax);
                const corner = (s0, s1) => {
                    const v = [0, 0, 0];
                    v[ax] = sgn * h;
                    v[free[0]] = s0 * h;
                    v[free[1]] = s1 * h;
                    return v;
                };
                const A = corner(-1, -1), B = corner(1, 1), C = corner(1, -1), D = corner(-1, 1);
                pts.push(...A, ...B, ...C, ...D); // two diagonals -> an X
            }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        return new THREE.LineSegments(g, lineMat(opacity));
    }

    const OH = 0.8, IH = 0.4; // outer / inner half-sizes
    group.add(wireCube(OH * 2, 0.9));        // outer cube edges
    group.add(faceDiagonals(OH, 0.4));       // diagonals across outer faces
    group.add(wireCube(IH * 2, 0.9));        // inner cube edges

    // connect each outer corner to its matching inner corner
    const signs = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    const cpts = [];
    for (const s of signs) {
        cpts.push(s[0] * OH, s[1] * OH, s[2] * OH);
        cpts.push(s[0] * IH, s[1] * IH, s[2] * IH);
    }
    const cgeo = new THREE.BufferGeometry();
    cgeo.setAttribute("position", new THREE.Float32BufferAttribute(cpts, 3));
    group.add(new THREE.LineSegments(cgeo, lineMat(0.45)));

    scene.add(group);

    // --- expand from load; reaches full screen around the third word ---
    let raf = null;
    const startTime = performance.now();
    const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

    function render() {
        raf = requestAnimationFrame(render);
        group.rotation.x += 0.0015;
        group.rotation.y += 0.003;

        const p = Math.min((performance.now() - startTime) / EXPAND_MS, 1);
        const s = 1 + (FULL_SCALE - 1) * easeInOut(p);
        group.scale.set(s, s, s);

        renderer.render(scene, camera);
    }
    render();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- words: accumulate in a column, newest sharp, older ones blur ---
    const words = Array.from(document.querySelectorAll(".intro-word"));
    const timers = [];
    words.forEach((w, idx) => {
        timers.push(setTimeout(() => {
            if (idx > 0) {
                words[idx - 1].classList.remove("sharp");
                words[idx - 1].classList.add("blurred");
            }
            w.classList.add("sharp");
        }, FIRST_MS + idx * STEP_MS));
    });

    // --- exit / skip ---
    let exited = false;
    function exitIntro() {
        if (exited) return;
        exited = true;
        sessionStorage.setItem("introSeen", "1");
        timers.forEach(clearTimeout);
        intro.classList.add("is-exiting");
        document.body.classList.remove("intro-lock");
        setTimeout(() => {
            cancelAnimationFrame(raf);
            renderer.dispose();
            intro.remove();
        }, EXIT_MS);
    }

    const auto = setTimeout(exitIntro, WORDS_MS);

    ["wheel", "touchstart", "keydown", "mousedown"].forEach((ev) =>
        window.addEventListener(ev, () => { clearTimeout(auto); exitIntro(); }, { once: true, passive: true })
    );
})();