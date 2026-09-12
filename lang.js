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
            nav: { portfolio: "Portfolio", services: "Services" },
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
                items: ["SaaS", "Mobile", "GovTech", "Healthcare", "Real Estate", "Media", "Advertising", "Energy & Utilities", "IoT", "Blockchain & Crypto", "Logistics"]
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
            },
            services: {
                title: "Services — Anton Lisachenko",
                back: "Back to home",
                kicker: "What I deliver",
                heading: "Services",
                intro: {
                    p1: "Two crafts, one hand: classic business analysis on paper, AI-native execution underneath. You get an analyst who turns ambiguity into structure and a builder who ships.",
                    p2: "Everything below is offered end-to-end — from a pre-sale estimate and discovery to a delivered, deployed product."
                },
                tracks: {
                    analysis: {
                        heading: "Business Analysis",
                        items: {
                            req: { title: "Requirements & Docs", desc: "BRD, SRS, FRD and user stories — written so a team can actually build from them, with acceptance criteria that end arguments.", pills: "BRD / SRS / FRD / Stories" },
                            model: { title: "Process Modeling", desc: "BPMN and UML diagrams that make the current pain and the target flow visible to business and developers at the same time.", pills: "BPMN / UML / Sequence" },
                            arch: { title: "Architecture & Data", desc: "System architecture, ERD / DWH schemas and API specs — the blueprint before a single line of code is spent.", pills: "Architecture / ERD / API" },
                            presale: { title: "Pre-Sale & Discovery", desc: "Feasibility, scope and estimates at the very front of a deal, so stakeholders commit with their eyes open.", pills: "Discovery / Estimates / Workshops" }
                        }
                    },
                    delivery: {
                        heading: "AI-Native Delivery",
                        items: {
                            bcard: { title: "Business Card Sites", desc: "A one-page web business card — dark, modern, bilingual — designed, coded and deployed. Live in days, not months.", pills: "HTML / CSS / JS" },
                            landing: { title: "Landing Pages", desc: "A focused landing that sells one thing: your product, your profile, your offer. Clean copy, clean code, no framework.", pills: "Landing / SEO / Deploy" },
                            automation: { title: "AI Automation", desc: "n8n workflows and local LLMs that scan, digest and remind for you — zero cloud cost, running on your own hardware.", pills: "n8n / Ollama / RAG" },
                            fullstack: { title: "Analysis → Live Product", desc: "The full loop: requirements, model, design, build, launch. One person to talk to from discovery to handoff.", pills: "BA + Web + AI" }
                        }
                    }
                },
                sites: {
                    heading: "My Work",
                    note: "The public half of the portfolio — no NDA here. Pick one and open it.",
                    open: "open site",
                    items: {
                        pub: { title: "This very site", desc: "A business card site with a dark theme, a 3D intro, bilingual switching and the contact rail you just used." },
                        kate: { title: "Kateryna Onokalo — Fine Art", desc: "An artist's portfolio and online store — gallery with four painting series, shopping cart and custom order flow." },
                        tesik: { title: "Tesik Craft — Handmade Toys", desc: "A craft workshop storefront — cotton-wool Christmas ornaments and textile teddies, catalog with cart and a production showcase." }
                    }
                },
                cta: {
                    heading: "Want something built?",
                    text: "Tell me what you're trying to ship and what's stuck. I'll reply with a short, plain-language plan — no discovery-fee talk until you know it's useful."
                }
            }
        },
        uk: {
            meta: { title: "Антон Лісаченко — Бізнес-аналітик" },
            credo: { l1: "Класичний бізнес-аналіз.", l2: "ШІ-орієнтоване виконання." },
            cv: "Завантажити CV",
            nav: { portfolio: "Портфоліо", services: "Послуги" },
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
                items: ["SaaS", "Мобільні додатки", "Державні цифрові сервіси", "Охорона здоров'я", "Нерухомість", "Медіа", "Реклама", "Енергетика та ЖКГ", "IoT", "Блокчейн та крипто", "Логістика"]
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
            },
            services: {
                title: "Послуги — Антон Лісаченко",
                back: "На головну",
                kicker: "Що я роблю",
                heading: "Послуги",
                intro: {
                    p1: "Два ремесла, одна рука: класичний бізнес-аналіз на папері, AI-орієнтоване виконання під ним. Ти отримуєш аналітика, який перетворює невизначеність на структуру, і будівельника, який це випускає.",
                    p2: "Усе нижче надається наскрізно — від оцінки на препродажі й дослідження до зданого і задеплоєного продукту."
                },
                tracks: {
                    analysis: {
                        heading: "Бізнес-аналіз",
                        items: {
                            req: { title: "Вимоги та документація", desc: "BRD, SRS, FRD і юзер-сторі — написані так, щоб команда могла реально будувати за ними, з критеріями приймання, які знімають суперечки.", pills: "BRD / SRS / FRD / Stories" },
                            model: { title: "Моделювання процесів", desc: "BPMN та UML діаграми, що роблять поточний біль і цільовий флоу видимими одночасно для бізнесу і розробників.", pills: "BPMN / UML / Sequence" },
                            arch: { title: "Архітектура та дані", desc: "Архітектура системи, ERD / DWH-схеми і API-специфікації — «креслення» до того, як витрачено перший рядок коду.", pills: "Архітектура / ERD / API" },
                            presale: { title: "Препродаж і дослідження", desc: "Здійсненність, обсяг і оцінки на самому старті угоди, щоб стейкхолдери брали на себе зобов'язання з відкритими очима.", pills: "Discovery / Оцінки / Воркшопи" }
                        }
                    },
                    delivery: {
                        heading: "AI-орієнтована розробка",
                        items: {
                            bcard: { title: "Сайти-візитки", desc: "Односторінкова веб-візитка — темна, сучасна, двомовна — спроєктована, написана і задеплоєна. Живе за дні, а не місяці.", pills: "HTML / CSS / JS" },
                            landing: { title: "Лендінги", desc: "Лендінг, що продає одну річ: твій продукт, твій профайл, твою пропозицію. Чистий текст, чистий код, без фреймворків.", pills: "Landing / SEO / Deploy" },
                            automation: { title: "AI-автоматизація", desc: "n8n-воркфлоу та локальні LLM, які сканують, узагальнюють і нагадують за тебе — нульова вартість у хмарі, все працює на твоєму залізі.", pills: "n8n / Ollama / RAG" },
                            fullstack: { title: "Від аналізу до живого продукту", desc: "Повне коло: вимоги, модель, дизайн, розробка, запуск. Один співрозмовник від дослідження до передачі.", pills: "БА + Web + AI" }
                        }
                    }
                },
                sites: {
                    heading: "Мої роботи",
                    note: "Публічна половина портфоліо — тут без NDA. Обери і відкрий.",
                    open: "відкрити сайт",
                    items: {
                        pub: { title: "Цей самий сайт", desc: "Сайт-візитка з темною темою, 3D-інтро, перемиканням мови та рейлом контактів, яким ти щойно користувався (-лася)." },
                        kate: { title: "Катерина Онокало — живопис", desc: "Портфоліо та онлайн-магазин художниці — галерея з чотирма серіями, кошик і замовлення на індивідуальне полотно." },
                        tesik: { title: "Tesik Craft — іграшки ручної роботи", desc: "Вітрина ремісничої майстерні — ватні ялинкові іграшки та текстильні тедді, каталог з кошиком і розділ «як це робиться»." }
                    }
                },
                cta: {
                    heading: "Хочеш щось збудувати?",
                    text: "Розкажи, що хочеш випустити і де щось застрягло. Я відповім коротким, зрозумілим планом — жодного занурювання в платне discovery, поки не будеш знати, що це корисно."
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