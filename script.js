// ===== TYPEWRITER EFFECT (hero subtitle) =====

const phrases = [
    "Business Analyst",
    "7 years in IT",
    "Requirements, from discovery to UAT",
    "BPMN / UML modeling",
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
        arrow.style.opacity = window.scrollY > 40 ? "0" : "0.7";
    });
})();


// ===== HERO 3D MORPHING CUBE =====
(function () {
    const canvas = document.getElementById("cube-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    const hero = document.getElementById("hero");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, hero.clientWidth / hero.clientHeight, 0.1, 1000);
    camera.position.z = 3.0;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(hero.clientWidth, hero.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 5, 5, 5);
    const basePositions = geometry.attributes.position.array.slice();
    const count = geometry.attributes.position.count;

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0x14b8c4, wireframe: true, transparent: true, opacity: 0.18
    }));
    scene.add(mesh);

    const BLUE = [0.04, 0.15, 0.25];
    const ORANGE = [1.0, 0.34, 0.13];
    const colors = new Float32Array(count * 3);
    const flash = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        colors[i * 3] = BLUE[0]; colors[i * 3 + 1] = BLUE[1]; colors[i * 3 + 2] = BLUE[2];
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const dots = new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 0.045, vertexColors: true, transparent: true, opacity: 0.5
    }));
    scene.add(dots);

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

        if (Math.random() < 0.25) {
            const n = 1 + Math.floor(Math.random() * 4);
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

        mesh.rotation.x += 0.002; mesh.rotation.y += 0.004;
        dots.rotation.x += 0.002; dots.rotation.y += 0.004;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = hero.clientWidth / hero.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(hero.clientWidth, hero.clientHeight);
    });
})();