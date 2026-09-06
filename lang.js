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
                sections: { process: "Process & Notation", data: "Architecture & Data", ai: "AI in Practice" },
                intro: {
                    p1: "A slice of real delivery work from the last seven years.",
                    p2: "Every artifact lives under an NDA, so previews stay blurred on purpose — you see the shape of the thinking, not the client's data. The structure, notation and craft are mine; the details stay in the vault."
                },
                items: {
                    arch: { type: "Architecture", title: "System Architecture", desc: "Layered architecture of a multi-tenant records platform: three front doors (public portal, per-tenant cabinet, restricted admin panel) over a single NestJS core with routing, state-registry sync and OAuth 2.0 / OIDC access control; PostgreSQL with GIN/GiST full-text indexes, Redis for cache and queues, S3-compatible object storage for scanned documents; Docker / Kubernetes with CI/CD." },
                    approval: { type: "UML · Sequence", title: "Nomenclature Approval Flow", desc: "Sequence for approving a nomenclature (catalogue) item: create in Project status, save to Postgres, submit with edits locked and a copy held in object storage, notify the clerk via a Redis queue; then either approve (status Approved) or return with comments (back to Project, edits unlocked). The founder's signature is not required at the submission stage." },
                    bpmn: { type: "BPMN · draw.io", title: "Institutions Registry — Admin Flow", desc: "BPMN of an institutions registry, admin side: a moderator creates records under validation (required fields, formats, duplicates), maintains the hierarchical structure and uploads files within technical limits; every save, block and delete lands in the audit log, and published records appear on the portal by access level." },
                    bpmn4: { type: "BPMN · draw.io", title: "Document Extracts — Order & Delivery", desc: "BPMN of an extract-ordering flow: a document owner requests a personalised digital copy of a protocol extract for one approved document; an authorised officer uploads a signed PDF or rejects the request with a required reason; the requester tracks the state — Pending / Granted / Declined — and may re-request the same extract any number of times; every action is recorded in the audit log." },
                    bpmn2: { type: "BPMN · Miro", title: "Annual Reporting Flow", desc: "BPMN of an annual-reporting flow with two entry points: an external system files a JSON report via API — parsed, then stamped Submitted or Overdue by the filing date — while a registrar may also enter a paper report by hand; corrections replace the version until the cut-off date, then the registrar verifies and approves the report and the balance is closed." },
                    bpmn3: { type: "BPMN · Miro", title: "Registry Records — Lifecycle & Publication", desc: "BPMN of a registry record lifecycle: a specialist checks whether the record already exists in the register; if not, it is created by hand or synced from the authorised source, then the data and files are updated and published — the verifier's e-signature is applied, the record moves from Draft to Active, the previous record is archived with a technical link to it, and the public fields open." },
                    dwh: { type: "Data Architecture", title: "Medallion Data Pipeline", desc: "Data flows in a warehouse built on the medallion architecture: a Bronze layer ingests raw files untouched — idempotent and re-processable — a Silver layer cleans, validates, filters and normalizes them into one structure, and a Gold layer publishes curated marts that feed dashboards in Apache Superset (analysts) and Power BI (leadership); orchestration and scheduled jobs keep the layers consistent." },
                    deploy: { type: "Deployment", title: "Deployment Architecture", desc: "Deployment topology of the platform: one Kubernetes cluster runs the admin module, core service and both public apps; internal staff connect over a VPN tunnel, external users arrive through a CDN edge with TLS, caching and anti-DDoS; trusted outside systems are the identity provider (OAuth 2.0 / OIDC with 2FA) and a state registry; data lives in Postgres, Redis and S3-compatible object storage." },
                    agent: { type: "AI Agents", title: "Problem Radar", desc: "A zero-cost n8n flow that scans Hacker News for complaint-shaped posts, dedupes them by URL and files each into a Complaints board — a local Ollama model tags noise and theme. The one rule holds: the machine collects, counts and suggests; you decide what is worth building." },
                    digest: { type: "AI Agents", title: "News Digest Bot", desc: "An n8n workflow that delivers a daily 09:00 Telegram digest across 15 news sources, processed end-to-end by a local Ollama model. Instead of one oversized prompt it makes three small calls — pick topics, translate, summarise — so it fits on an 8 GB Mac, no paid APIs." }
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
                sections: { process: "Процеси та нотації", data: "Архітектура та дані", ai: "ШІ на практиці" },
                intro: {
                    p1: "Зріз реальної роботи за останні сім років.",
                    p2: "Кожен артефакт під NDA, тому прев'ю свідомо заблюрені — видно форму мислення, а не дані клієнта. Структура, нотація і майстерність — мої; деталі лишаються в сховищі."
                },
                items: {
                    arch: { type: "Архітектура", title: "Архітектура системи", desc: "Шарова архітектура мультитенантної платформи керування документами: три входи (публічний портал, кабінет установи, обмежена адмінпанель) над єдиним ядром NestJS із маршрутизацією, синхронізацією з державним реєстром і контролем доступу OAuth 2.0 / OIDC; PostgreSQL із повнотекстовими індексами GIN/GiST, Redis для кешу і черг, S3-сумісне сховище для скан-копій; Docker / Kubernetes з CI/CD." },
                    approval: { type: "UML · Sequence", title: "Флоу погодження номенклатури", desc: "Sequence-діаграма погодження номенклатури: створення у статусі «Проєкт», збереження в PostgreSQL, подання на погодження з блокуванням редагування та копією в об'єктному сховищі, сповіщення діловода через чергу Redis; далі — «Погодити» (статус «Погоджена») або повернення з коментарями (статус «Проєкт», розблокування редагування). Підпис на етапі подання не вимагається." },
                    bpmn: { type: "BPMN · draw.io", title: "Реєстр установ — адміністративна частина", desc: "BPMN реєстру установ, адміністративна частина: модератор створює записи з перевіркою (обов'язкові поля, формати, дублікати), веде ієрархічну структуру і завантажує файли в межах технічних обмежень; кожне збереження, блокування та видалення фіксується в журналі аудиту, а опубліковані записи відображаються на порталі згідно з рівнем доступу." },
                    bpmn4: { type: "BPMN · draw.io", title: "Витяги з документів — флоу замовлення та надання", desc: "BPMN флоу замовлення витягу: власник документа замовляє персоналізовану цифрову копію витягу з протоколу за одним затвердженим документом; уповноважений працівник завантажує підписаний PDF або відхиляє запит з обов'язковою причиною; замовник відстежує стан — «Очікує формування» / «Надано» / «Відхилено» — і може повторно замовити той самий витяг будь-яку кількість разів; кожна дія фіксується в журналі аудиту." },
                    bpmn2: { type: "BPMN · Miro", title: "Флоу подання щорічної звітності", desc: "BPMN флоу щорічної звітності із двома точками входу: зовнішня система подає звіт через API у форматі JSON — система парсить його і за датою подання надає статус «Подано» або «Прострочено», а реєстратор може вносити паперовий звіт вручну; уточнення замінюють версію звіту до граничної дати, після чого реєстратор верифікує та затверджує звіт і баланс зведено." },
                    bpmn3: { type: "BPMN · Miro", title: "Реєстрові записи — життєвий цикл і публікація", desc: "BPMN життєвого циклу реєстрового запису: фахівець перевіряє, чи запис уже є в реєстрі; якщо ні — створює його вручну або синхронізує з уповноваженого джерела, оновлює дані та файли й публікує — накладається ЕЦП верифікатора, запис переходить зі статусу «Чернетка» в «Активний», попередній запис стає «Архівним» із технічним зв'язком з новим, а публічні поля відкриваються." },
                    dwh: { type: "Архітектура даних", title: "Медальйонний пайплайн даних", desc: "Потоки даних у сховищі (DWH) за медальйонною архітектурою: рівень Bronze приймає сирі файли без змін — ідемпотентно і з можливістю повторної обробки — рівень Silver очищає, валідує, фільтрує та нормалізує їх до єдиної структури, а рівень Gold формує готові вітрини, що живлять дашборди в Apache Superset (аналітики) і Power BI (керівництво); оркестрація і планові завдання тримають шари узгодженими." },
                    deploy: { type: "Розгортання", title: "Архітектура розгортання", desc: "Топологія розгортання предметної платформи: один Kubernetes-кластер розміщує модуль адміністрування, Core Service та обидва публічні застосунки; внутрішні користувачі заходять через VPN-тунель, зовнішні — через CDN-край (TLS, кешування, захист від DDoS); довірені зовнішні системи — служба авторизації (OAuth 2.0 / OIDC із 2FA) та державний реєстр; дані — у PostgreSQL, Redis та S3-сумісному сховищі." },
                    agent: { type: "ШІ-агенти", title: "Problem Radar", desc: "Безкоштовний n8n-пайплайн, який сканує Hacker News на повідомлення у формі скарг, дедуплікує їх за URL і дописує кожне до дошки Complaints — локальна модель Ollama позначає шум і тему. Одне правило: машина збирає, рахує і підказує; ти вирішуєш, що варте того, щоб будувати." },
                    digest: { type: "ШІ-агенти", title: "News Digest Bot", desc: "n8n-воркфлоу, який щодня о 09:00 надсилає у Telegram дайджест новин із 15 джерел, повністю оброблений локальною моделлю Ollama. Замість одного великого запиту — три малих: вибір тем, переклад і саммарі — тому все працює на Mac з 8 GB, без платних API." }
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