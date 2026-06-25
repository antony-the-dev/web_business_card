// ===== TYPEWRITER EFFECT =====
const phrases = ["7 years in IT", "Requirements, from discovery to UAT", "BPMN / UML modeling", "Pre-sale to UAT, end to end"];
const target = document.getElementById("typed");
let phraseIndex = 0; let charIndex = 0; let deleting = false;

function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
        target.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) { deleting = true; setTimeout(tick, 1500); return; }
    } else {
        target.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 50 : 90);
}
tick();


// ===== ENTRANCE: hero blocks appear one by one; lower blocks reveal on scroll =====
(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // hero blocks: staggered blur-in, timed to start as the intro hands off
    const enterEls = Array.from(document.querySelectorAll("[data-enter]"))
        .sort((a, b) => (+a.dataset.enter) - (+b.dataset.enter));

    if (reduceMotion) {
        enterEls.forEach((el) => el.classList.add("shown"));
    } else {
        const introWillPlay = sessionStorage.getItem("introSeen") !== "1";
        const base = introWillPlay ? 2300 : 300; // start as the intro fades out
        enterEls.forEach((el, i) => setTimeout(() => el.classList.add("shown"), base + i * 240));
    }

    // lower blocks: blur-in when scrolled into view
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add("shown"); io.unobserve(entry.target); }
        });
    }, { threshold: 0.2 });
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


// ===== shared: soft round sprite so points render as circles =====
function makeCircleTexture() {
    const s = 64; const c = document.createElement("canvas"); c.width = c.height = s;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0.0, "rgba(255,255,255,1)"); g.addColorStop(0.6, "rgba(255,255,255,0.85)"); g.addColorStop(1.0, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); ctx.fill();
    return new THREE.CanvasTexture(c);
}


// ===== HERO FIGURE =====
(function () {
    const canvas = document.getElementById("cube-canvas");
    if (!canvas || typeof THREE === "undefined") return;
    const hero = document.getElementById("hero-canvas-container");
    const RESTING_SCALE = 0.8; const INTRO_SCALE = 5.0; const CONTRACT_DELAY = 2200; const CONTRACT_MS = 1500;
    const introWillPlay = sessionStorage.getItem("introSeen") !== "1";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, hero.clientWidth / hero.clientHeight, 0.1, 1000);
    camera.position.z = 3.0;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(hero.clientWidth, hero.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 5, 5, 5);
    const basePositions = geometry.attributes.position.array.slice();
    const count = geometry.attributes.position.count;
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x14b8c4, wireframe: true, transparent: true, opacity: 0.13 }));

    const TEAL = [0.08, 0.72, 0.77]; const ORANGE = [1.0, 0.34, 0.13];
    const colors = new Float32Array(count * 3); const flash = new Float32Array(count); const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) { colors[i * 3] = TEAL[0]; colors[i * 3 + 1] = TEAL[1]; colors[i * 3 + 2] = TEAL[2]; phase[i] = Math.random() * Math.PI * 2; }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const dots = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.06, map: makeCircleTexture(), vertexColors: true, transparent: true, opacity: 0.65, depthWrite: false }));
    const figure = new THREE.Group(); figure.add(mesh, dots); scene.add(figure);

    figure.scale.setScalar(introWillPlay ? INTRO_SCALE : RESTING_SCALE);
    let contracting = introWillPlay; const heroStart = performance.now(); const easeOut = (p) => 1 - Math.pow(1 - p, 3);
    let t = 0; const pos = geometry.attributes.position; const col = geometry.attributes.color;
    let cameraAngle = 0; const cameraRadius = 3.0;

    function animate() {
        requestAnimationFrame(animate); t += 0.01; cameraAngle += 0.002;
        for (let i = 0; i < count; i++) {
            const ix = i * 3; const x = basePositions[ix], y = basePositions[ix + 1], z = basePositions[ix + 2];
            const wave = Math.sin(x * 2 + t) * 0.15 + Math.cos(y * 2 + t * 1.3) * 0.15 + Math.sin(z * 2 + t * 0.7) * 0.15;
            const s = 1 + wave; pos.array[ix] = x * s; pos.array[ix + 1] = y * s; pos.array[ix + 2] = z * s;
        }
        pos.needsUpdate = true;
        if (Math.random() < 0.15) { const n = 1 + Math.floor(Math.random() * 3); for (let k = 0; k < n; k++) flash[Math.floor(Math.random() * count)] = 1; }
        for (let i = 0; i < count; i++) {
            if (flash[i] > 0) flash[i] -= 0.02; if (flash[i] < 0) flash[i] = 0;
            const f = flash[i]; phase[i] += 0.02 + (Math.random() * 0.01); const blink = Math.sin(phase[i]) * 0.4 + 0.6;
            col.array[i * 3] = (TEAL[0] + (ORANGE[0] - TEAL[0]) * f) * blink;
            col.array[i * 3 + 1] = (TEAL[1] + (ORANGE[1] - TEAL[1]) * f) * blink;
            col.array[i * 3 + 2] = (TEAL[2] + (ORANGE[2] - TEAL[2]) * f) * blink;
        }
        col.needsUpdate = true;
        if (contracting) {
            const el = performance.now() - heroStart - CONTRACT_DELAY;
            if (el >= 0) { const p = Math.min(el / CONTRACT_MS, 1); figure.scale.setScalar(INTRO_SCALE + (RESTING_SCALE - INTRO_SCALE) * easeOut(p)); if (p >= 1) contracting = false; }
        }
        camera.position.x = Math.sin(cameraAngle) * cameraRadius; camera.position.z = Math.cos(cameraAngle) * cameraRadius;
        camera.position.y = Math.sin(cameraAngle * 0.5) * 0.5; camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener("resize", () => { camera.aspect = hero.clientWidth / hero.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(hero.clientWidth, hero.clientHeight); });
})();


// ===== INTRO SEQUENCE (explosion from a point -> cube emerges -> expands) =====
(function () {
    const intro = document.getElementById("intro");
    if (!intro || typeof THREE === "undefined") return;
    const seen = sessionStorage.getItem("introSeen") === "1";
    if (seen) { intro.remove(); return; }
    document.body.classList.add("intro-lock");
    const canvas = document.getElementById("intro-canvas");
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); camera.position.z = 3.0;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(window.devicePixelRatio);
    const TEAL = 0x14b8c4; const group = new THREE.Group(); const cubeMats = [];
    function lineMat(opacity) { const m = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0 }); m.userData = { base: opacity }; cubeMats.push(m); return m; }
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
    const OH = 0.8, IH = 0.4; group.add(wireCube(OH * 2, 0.9)); group.add(faceDiagonals(OH, 0.4)); group.add(wireCube(IH * 2, 0.9));
    const signs = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]; const cpts = [];
    for (const s of signs) { cpts.push(s[0] * OH, s[1] * OH, s[2] * OH); cpts.push(s[0] * IH, s[1] * IH, s[2] * IH); }
    const cgeo = new THREE.BufferGeometry(); cgeo.setAttribute("position", new THREE.Float32BufferAttribute(cpts, 3)); group.add(new THREE.LineSegments(cgeo, lineMat(0.45)));
    const NUM_DOTS = 450; const DOT_RADIUS = 2; const DOT_BURST_MS = 800; const DOT_TEAL = [0.08, 0.72, 0.77]; const DOT_ORANGE = [1.0, 0.34, 0.13];
    const dotTarget = new Float32Array(NUM_DOTS * 3); const dotPos = new Float32Array(NUM_DOTS * 3); const dotColors = new Float32Array(NUM_DOTS * 3); const dotFlash = new Float32Array(NUM_DOTS); const dotPhase = new Float32Array(NUM_DOTS);
    for (let i = 0; i < NUM_DOTS; i++) {
        const d = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(); const r = Math.cbrt(Math.random()) * DOT_RADIUS;
        dotTarget[i * 3] = d.x * r; dotTarget[i * 3 + 1] = d.y * r; dotTarget[i * 3 + 2] = d.z * r; dotColors[i * 3] = DOT_TEAL[0]; dotColors[i * 3 + 1] = DOT_TEAL[1]; dotColors[i * 3 + 2] = DOT_TEAL[2]; dotPhase[i] = Math.random() * Math.PI * 2;
    }
    const dotGeo = new THREE.BufferGeometry(); dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3)); dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
    group.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ size: 0.06, map: makeCircleTexture(), vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false })));
    scene.add(group);
    let raf = null; const startTime = performance.now(); const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); const easeOut = (p) => 1 - Math.pow(1 - p, 3);
    function render() {
        raf = requestAnimationFrame(render); const now = performance.now() - startTime; group.rotation.x += 0.0015; group.rotation.y += 0.003;
        const p = Math.min(now / 1800, 1); const s = 1 + (4.0) * easeInOut(p); group.scale.set(s, s, s);
        const be = easeOut(Math.min(now / 800, 1));
        for (let i = 0; i < NUM_DOTS; i++) { const ix = i * 3; dotPos[ix] = dotTarget[ix] * be; dotPos[ix + 1] = dotTarget[ix + 1] * be; dotPos[ix + 2] = dotTarget[ix + 2] * be; }
        dotGeo.attributes.position.needsUpdate = true;
        const cubeReveal = easeOut(Math.min(Math.max(now - 450, 0) / 650, 1)); for (const m of cubeMats) m.opacity = m.userData.base * cubeReveal;
        if (Math.random() < 0.2) { const nf = 1 + Math.floor(Math.random() * 4); for (let k = 0; k < nf; k++) dotFlash[Math.floor(Math.random() * NUM_DOTS)] = 1; }
        for (let i = 0; i < NUM_DOTS; i++) {
            if (dotFlash[i] > 0) dotFlash[i] -= 0.02; if (dotFlash[i] < 0) dotFlash[i] = 0; const f = dotFlash[i];
            dotPhase[i] += 0.03 + (Math.random() * 0.02); const blink = Math.sin(dotPhase[i]) * 0.5 + 0.5;
            dotColors[i * 3] = (DOT_TEAL[0] + (DOT_ORANGE[0] - DOT_TEAL[0]) * f) * blink; dotColors[i * 3 + 1] = (DOT_TEAL[1] + (DOT_ORANGE[1] - DOT_TEAL[1]) * f) * blink; dotColors[i * 3 + 2] = (DOT_TEAL[2] + (DOT_ORANGE[2] - DOT_TEAL[2]) * f) * blink;
        }
        dotGeo.attributes.color.needsUpdate = true; renderer.render(scene, camera);
    }
    render();
    const words = Array.from(document.querySelectorAll(".intro-word")); const timers = [];
    words.forEach((w, idx) => { timers.push(setTimeout(() => { if (idx > 0) { words[idx - 1].classList.remove("sharp"); words[idx - 1].classList.add("blurred"); } w.classList.add("sharp"); }, 300 + idx * 600)); });
    let exited = false;
    function exitIntro() { if (exited) return; exited = true; sessionStorage.setItem("introSeen", "1"); timers.forEach(clearTimeout); intro.classList.add("is-exiting"); document.body.classList.remove("intro-lock"); setTimeout(() => { cancelAnimationFrame(raf); renderer.dispose(); intro.remove(); }, 650); }
    const auto = setTimeout(exitIntro, 2400);
    ["wheel", "touchstart", "keydown", "mousedown"].forEach((ev) => window.addEventListener(ev, () => { clearTimeout(auto); exitIntro(); }, { once: true, passive: true }));
})();