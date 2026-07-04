// ===== i18n =====
// All translatable strings live here, separate from script.js / index.html.
// Reload-based switch (simplest + most reliable with a running Three.js scene
// and a typewriter mid-phrase — no need to hot-patch live animation state).
// Adding a language later = add a new top-level key here + wire a 3-way toggle.
(function () {
    var I18N = {
        en: {
            meta: { title: "Anton Lisachenko — Business Analyst" },
            credo: { l1: "Classic business analysis.", l2: "AI-native execution." },
            role: "Business Analyst",
            typed: ["BPMN & UML modeling", "API & Data entity schemas", "Requirements engineering", "Pre-sale consulting", "Discovery to handoff"],
            rail: { email: "email me", linkedin: "message me", github: "follow me" },
            about: {
                heading: "About",
                p1: "Business Analyst with 7 years in IT and a background in project management.",
                p2: "I take requirements from pre-sale and discovery all the way through to UAT and a clean handoff."
            },
            now: {
                heading: "Currently working with",
                items: ["AI agent orchestration & vibe-coding", "Local LLM deployment (Hermes)", "Google Antigravity & VS Code", "Git & GitHub"]
            },
            domains: {
                heading: "Domains",
                items: ["SaaS", "Mobile", "GovTech", "Healthcare", "Real Estate", "Media", "Advertising", "Energy & Utilities", "IoT", "Blockchain & Crypto"]
            },
            expertise: {
                heading: "Expertise",
                groups: {
                    notations: { title: "Modeling Notations", items: ["BPMN", "UML", "ERD", "DFD"] },
                    requirements: { title: "Requirements & Docs", items: ["BRD", "PRD", "SRS", "User Stories"] },
                    query: { title: "Query & Technical", items: ["SQL", "JQL", "HTML / CSS"] },
                    api: { title: "APIs & Testing", items: ["REST API", "Swagger", "Postman"] },
                    diagramming: { title: "Diagramming Tools", items: ["Miro", "Lucidchart"] },
                    design: { title: "Design & Prototyping", items: ["Figma", "Photoshop"] },
                    delivery: { title: "Delivery & PM", items: ["Jira", "Confluence", "Notion", "ClickUp"] },
                    automation: { title: "Automation", items: ["n8n"] }
                }
            },
            how: {
                heading: "How I work",
                hint: "Tap a phase to expand its activities.",
                steps: { discovery: "Discovery", elicitation: "Elicitation", modeling: "Modeling", uat: "UAT", handoff: "Handoff" },
                phases: {
                    discovery: ["Define objectives", "Map stakeholders", "Identify constraints", "Assess feasibility"],
                    elicitation: ["Run workshops", "Interviews & surveys", "Capture requirements", "Resolve conflicts"],
                    modeling: ["BPMN / UML diagrams", "Data entity schemas", "User stories", "BRD / SRS"],
                    uat: ["Test scenarios", "Acceptance criteria", "Defect triage", "Sign-off"],
                    handoff: ["Documentation", "Knowledge transfer", "Backlog grooming", "Support transition"]
                }
            },
            footer: { rights: "All rights reserved.", privacy: "Privacy Policy" }
        },
        uk: {
            meta: { title: "Антон Лісаченко — Бізнес-аналітик" },
            credo: { l1: "Класичний бізнес-аналіз.", l2: "ШІ-орієнтоване виконання." },
            role: "Бізнес-аналітик",
            typed: ["BPMN та UML моделювання", "Схеми API та даних", "Інженерія вимог", "Консалтинг з препродажу", "Від дослідження до передачі"],
            rail: { email: "напишіть мені", linkedin: "напишіть в LinkedIn", github: "мій GitHub" },
            about: {
                heading: "Про мене",
                p1: "Бізнес-аналітик з 7-річним досвідом в IT та кваліфікацією в проєктному менеджменті.",
                p2: "Веду вимоги від препродажу та етапу дослідження до користувацького приймального тестування і передачі проєкту."
            },
            now: {
                heading: "Зараз працюю з",
                items: ["Оркестрація ШІ-агентів та вайбкодинг", "Локальний LLM (Hermes)", "Google Antigravity та VS Code", "Git та GitHub"]
            },
            domains: {
                heading: "Домени",
                items: ["SaaS", "Мобільні додатки", "Державні цифрові сервіси", "Охорона здоров'я", "Нерухомість", "Медіа", "Реклама", "Енергетика та ЖКГ", "IoT", "Блокчейн та крипто"]
            },
            expertise: {
                heading: "Експертиза",
                groups: {
                    notations: { title: "Нотації моделювання", items: ["BPMN", "UML", "ERD", "DFD"] },
                    requirements: { title: "Вимоги та документація", items: ["BRD", "PRD", "SRS", "User Stories"] },
                    query: { title: "Запити та технічне", items: ["SQL", "JQL", "HTML / CSS"] },
                    api: { title: "API та тестування", items: ["REST API", "Swagger", "Postman"] },
                    diagramming: { title: "Інструменти візуалізації", items: ["Miro", "Lucidchart"] },
                    design: { title: "Дизайн та прототипування", items: ["Figma", "Photoshop"] },
                    delivery: { title: "Постачання та PM", items: ["Jira", "Confluence", "Notion", "ClickUp"] },
                    automation: { title: "Автоматизація", items: ["n8n"] }
                }
            },
            how: {
                heading: "Як я працюю",
                hint: "Натисни на етап, щоб розгорнути активності.",
                steps: { discovery: "Дослідження", elicitation: "Елісітація", modeling: "Моделювання", uat: "UAT", handoff: "Передача" },
                phases: {
                    discovery: ["Визначення цілей", "Мапування зацікавлених сторін", "Виявлення обмежень", "Оцінка здійсненності"],
                    elicitation: ["Фасилітація воркшопів", "Інтерв'ю та опитування", "Виявлення та збір вимог", "Розв'язання конфліктів"],
                    modeling: ["BPMN / UML моделювання", "Схеми сутностей даних", "Користувацькі історії", "BRD / SRS"],
                    uat: ["Тест-сценарії", "Критерії приймання", "Тріаж дефектів", "Формальне погодження результатів"],
                    handoff: ["Документування", "Передача знань", "Упорядкування беклогу", "Передача на підтримку"]
                }
            },
            footer: { rights: "Всі права захищені.", privacy: "Політика приватності" }
        }
    };

    function get(path, obj) {
        return path.split(".").reduce(function (acc, key) {
            return (acc == null) ? acc : acc[key];
        }, obj);
    }

    var lang = (localStorage.getItem("site-lang") === "uk") ? "uk" : "en";
    var dict = I18N[lang];

    // exposed for script.js (typewriter) and the inline "How I work" pipeline —
    // both load after this file, so these are ready by the time they run
    window.TYPED_PHRASES = dict.typed;
    window.PHASES_I18N = dict.how.phases;

    // DOM is already fully parsed at this point (this script sits right before
    // the content-consuming scripts, all placed at the end of <body>)
    document.documentElement.lang = lang;
    if (dict.meta && dict.meta.title) document.title = dict.meta.title;

    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
        var val = get(el.getAttribute("data-i18n"), dict);
        if (typeof val === "string") el.textContent = val;
    });

    // contact-rail captions: copy the right language into the live data-rail
    // attribute the contact-rail script actually reads
    Array.prototype.forEach.call(document.querySelectorAll(".hero-contact a[data-rail-en]"), function (a) {
        a.setAttribute("data-rail", lang === "uk" ? a.getAttribute("data-rail-uk") : a.getAttribute("data-rail-en"));
    });

    // language switch — two plain buttons (EN / UA), active one highlighted.
    // Clicking the already-active one is a no-op; clicking the other one
    // stores the choice and reloads (see lang.js header comment for why
    // reload-based, not hot-swap).
    Array.prototype.forEach.call(document.querySelectorAll(".lang-opt"), function (b) {
        var isActive = b.dataset.lang === lang;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-pressed", isActive ? "true" : "false");
        b.addEventListener("click", function () {
            if (b.dataset.lang === lang) return;
            localStorage.setItem("site-lang", b.dataset.lang);
            location.reload();
        });
    });
})();