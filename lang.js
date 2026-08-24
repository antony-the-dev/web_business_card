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
            cv: "Download CV",
            nav: { portfolio: "Portfolio" },
            cubeHint: "tap the object",
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
                items: ["AI agent orchestration & vibe-coding", "Local LLM deployment (Ollama, Apple Silicon)", "Model benchmarking & quantization", "Private RAG & remote access (Open WebUI, Tailscale)", "Google Antigravity & VS Code", "Git & GitHub"]
            },
            domains: {
                heading: "Domains",
                items: ["SaaS", "Mobile", "GovTech", "Healthcare", "Real Estate", "Media", "Advertising", "Energy & Utilities", "IoT", "Blockchain & Crypto"]
            },
            expertise: {
                heading: "Expertise",
                // key order mirrors the visual order in index.html (BA-logic flow)
                groups: {
                    requirements: { title: "Requirements & Docs", items: ["BRD", "PRD", "SRS", "User Stories"] },
                    notations: { title: "Modeling & Architecture", items: ["BPMN", "UML", "System Architecture"] },
                    diagramming: { title: "Design & Visual Tools", items: ["Miro", "Lucidchart", "Figma"] },
                    api: { title: "APIs & Automation", items: ["REST API", "Swagger", "n8n", "AI Agents"] },
                    query: { title: "Query & Technical", items: ["SQL", "JQL", "HTML / CSS"] },
                    delivery: { title: "Delivery & PM", items: ["Jira", "Confluence", "Notion", "ClickUp"] }
                }
            },
            how: {
                heading: "How I work",
                hint: "Tap a phase to expand its activities.",
                steps: { discovery: "Discovery", elicitation: "Elicitation", modeling: "Modeling", uat: "UAT", handoff: "Handoff" },
                phases: {
                    discovery: ["Define objectives", "Map stakeholders", "Identify constraints", "Assess feasibility"],
                    elicitation: ["Run workshops", "Interviews & surveys", "Capture requirements", "Resolve conflicts"],
                    modeling: ["BPMN / UML / Architecture", "Figma prototyping", "Data entity schemas", "BRD / SRS / FRD"],
                    uat: ["Test scenarios", "Acceptance criteria", "AI-powered verification", "Sign-off"],
                    handoff: ["Documentation", "Knowledge transfer", "Backlog grooming", "Support transition"]
                }
            },
            footer: { rights: "All rights reserved.", privacy: "Privacy Policy", status: "Available for new projects", statusMeta: "UA / EU / US" },
            portfolio: {
                title: "Portfolio — Anton Lisachenko",
                back: "Back to home",
                kicker: "Selected work · Redacted",
                heading: "Portfolio",
                more: "tap to inspect",
                note: "preview intentionally blurred · details available on call",
                intro: {
                    p1: "A slice of real delivery work from the last seven years.",
                    p2: "Every artifact lives under an NDA, so previews stay blurred on purpose — you see the shape of the thinking, not the client's data. The structure, notation and craft are mine; the details stay in the vault."
                },
                items: {
                    bpmn: { type: "BPMN", title: "Client Onboarding Flow", desc: "Swimlane process across client, back office and compliance lanes, with KYC gateways and an SLA timer on the manual review step." },
                    uml: { type: "UML · Sequence", title: "Checkout Sequence", desc: "Payment orchestration across gateway, fraud check and ledger services — including the refund alternative flow." },
                    arch: { type: "Architecture", title: "Marketplace Architecture", desc: "Layered system view: clients, API gateway, core services, queue and three data stores behind one contract boundary." },
                    erd: { type: "ERD", title: "Booking Data Model", desc: "Entities, keys and relations for the booking domain — a junction table resolves the many-to-many between listings and reservations." },
                    map: { type: "Story Map", title: "SaaS Story Map", desc: "User activities as the backbone, stories sliced into release bands; the highlighted band is the MVP scope agreement." },
                    doc: { type: "BRD / SRS", title: "BRD Template Spread", desc: "Sanitized two-page spread of my requirements document structure: scope table, functional sections and the sign-off block." },
                    wireframe: { type: "Wireframes", title: "Mobile App Wireframes", desc: "Low-fidelity screens for navigation, list/detail flows and empty states — built for early usability testing." },
                    agent: { type: "AI Agents", title: "AI Agent Flow", desc: "Tool-calling agent with guardrails, a memory loop and fallback paths — the AI-native way I run elicitation follow-ups." }
                },
                cta: {
                    heading: "Want the full picture?",
                    text: "Under NDA I can walk through any of these live — process decisions, trade-offs and templates included. Let's talk."
                }
            }
        },
        uk: {
            meta: { title: "Антон Лісаченко — Бізнес-аналітик" },
            credo: { l1: "Класичний бізнес-аналіз.", l2: "ШІ-орієнтоване виконання." },
            cv: "Завантажити CV",
            nav: { portfolio: "Портфоліо" },
            cubeHint: "торкнись об'єкта",
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
                items: ["Оркестрація ШІ-агентів та вайбкодинг", "Локальний LLM (Ollama, Apple Silicon)", "Бенчмаркінг та квантизація моделей", "Приватний RAG та віддалений доступ (Open WebUI, Tailscale)", "Google Antigravity та VS Code", "Git та GitHub"]
            },
            domains: {
                heading: "Домени",
                items: ["SaaS", "Мобільні додатки", "Державні цифрові сервіси", "Охорона здоров'я", "Нерухомість", "Медіа", "Реклама", "Енергетика та ЖКГ", "IoT", "Блокчейн та крипто"]
            },
            expertise: {
                heading: "Експертиза",
                // key order mirrors the visual order in index.html (BA-logic flow)
                groups: {
                    requirements: { title: "Requirements & Docs", items: ["BRD", "PRD", "SRS", "User Stories"] },
                    notations: { title: "Modeling & Architecture", items: ["BPMN", "UML", "System Architecture"] },
                    diagramming: { title: "Design & Visual Tools", items: ["Miro", "Lucidchart", "Figma"] },
                    api: { title: "APIs & Automation", items: ["REST API", "Swagger", "n8n", "AI Agents"] },
                    query: { title: "Query & Technical", items: ["SQL", "JQL", "HTML / CSS"] },
                    delivery: { title: "Delivery & PM", items: ["Jira", "Confluence", "Notion", "ClickUp"] }
                }
            },
            how: {
                heading: "Як я працюю",
                hint: "Натисни на етап, щоб розгорнути активності.",
                steps: { discovery: "Дослідження", elicitation: "Збір вимог", modeling: "Моделювання", uat: "UAT", handoff: "Передача" },
                phases: {
                    discovery: ["Визначення цілей", "Мапування зацікавлених сторін", "Виявлення обмежень", "Оцінка здійсненності"],
                    elicitation: ["Фасилітація воркшопів", "Інтерв'ю та опитування", "Виявлення та збір вимог", "Розв'язання конфліктів"],
                    modeling: ["BPMN / UML / Архітектура", "Прототипування у Figma", "Схеми сутностей даних", "BRD / SRS / FRD"],
                    uat: ["Тест-сценарії", "Критерії приймання", "AI-верифікація вимог", "Формальне погодження результатів"],
                    handoff: ["Документування", "Передача знань", "Упорядкування беклогу", "Передача на підтримку"]
                }
            },
            footer: { rights: "Всі права захищені.", privacy: "Політика приватності", status: "Доступний для нових проєктів", statusMeta: "Україна / ЄС / США" },
            portfolio: {
                title: "Портфоліо — Антон Лісаченко",
                back: "На головну",
                kicker: "Обрані роботи · Під NDA",
                heading: "Портфоліо",
                more: "натисни, щоб розглянути",
                note: "прев'ю свідомо заблюрене · деталі — на дзвінку",
                intro: {
                    p1: "Зріз реальної роботи за останні сім років.",
                    p2: "Кожен артефакт під NDA, тому прев'ю свідомо заблюрені — видно форму мислення, а не дані клієнта. Структура, нотація і майстерність — мої; деталі лишаються в сховищі."
                },
                items: {
                    bpmn: { type: "BPMN", title: "Процес онбордингу клієнта", desc: "Процес із доріжками клієнта, бекофісу та комплаєнсу, шлюзами KYC і SLA-таймером на ручній перевірці." },
                    uml: { type: "UML · Sequence", title: "Sequence-діаграма оплати", desc: "Оркестрація платежу між платіжним шлюзом, антифродом і сервісом бухгалтерії — з альтернативним флоу повернення коштів." },
                    arch: { type: "Архітектура", title: "Архітектура маркетплейсу", desc: "Шарова система: клієнти, API-шлюз, ключові сервіси, черга та три сховища даних за одним контрактом." },
                    erd: { type: "ERD", title: "Модель даних бронювань", desc: "Сутності, ключі та зв'язки домену бронювань — junction-таблиця розв'язує many-to-many між листингами й резервуваннями." },
                    map: { type: "Карта історій", title: "Story Map для SaaS", desc: "Активності користувачів як backbone, історії, нарізані на релізні смуги; виділена смуга — узгоджений MVP-скоуп." },
                    doc: { type: "BRD / SRS", title: "Розгорт BRD-шаблону", desc: "Знеболений двосторінковий розгорт структури документа вимог: таблиця скоупу, функціональні секції та блок погодження." },
                    wireframe: { type: "Вайфрейми", title: "Вайфрейми мобільного додатку", desc: "Лоу-фай екрани навігації, флоу список/деталь і порожніх станів — зроблені для раннього юзабіліті-тестування." },
                    agent: { type: "ШІ-агенти", title: "Флоу ШІ-агента", desc: "Агент із викликом інструментів, guardrails, циклом пам'яті та fallback-шляхами — так я ШІ-нативно веду уточнення вимог." }
                },
                cta: {
                    heading: "Хочеш повну картину?",
                    text: "Під NDA можу пройтися по будь-якій роботі наживо — з рішеннями по процесу, трейд-оффами та шаблонами. Гайда."
                }
            }
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
    // per-page title: a page can declare <body data-title-key="portfolio.title">
    // to use its own key instead of the home-page meta.title
    var titleKey = document.body.getAttribute("data-title-key");
    var pageTitle = titleKey ? get(titleKey, dict) : (dict.meta && dict.meta.title);
    if (typeof pageTitle === "string") document.title = pageTitle;

    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
        var val = get(el.getAttribute("data-i18n"), dict);
        if (typeof val === "string") el.textContent = val;
    });

    // contact-rail captions: copy the right language into the live data-rail
    // attribute the contact-rail script actually reads
    Array.prototype.forEach.call(document.querySelectorAll("[data-rail-en]"), function (a) {
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