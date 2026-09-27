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
            role: "Business Analyst",
            typed: ["BPMN & UML modeling", "API & Data entity schemas", "Requirements engineering", "Pre-sale consulting", "Discovery to handoff"],
            rail: { email: "email me", linkedin: "message me" },
            now: {
                heading: "Currently working with",
                items: ["RAG search across project documentation", "Local LLMs for NDA-safe analysis", "AI validation of specs — gaps, conflicts, testability"]
            },
            domains: {
                heading: "Domains",
                items: ["SaaS", "GovTech", "Healthcare", "Real Estate", "Media", "Advertising", "Energy & Utilities", "Blockchain & Crypto", "Logistics"]
            },
            expertise: {
                heading: "Expertise",
                // key order mirrors the visual order in index.html (BA-logic flow)
                groups: {
                    requirements: { title: "Requirements & Docs", items: ["BRD", "PRD", "SRS", "User Stories"] },
                    notations: { title: "Modeling & Architecture", items: ["BPMN", "UML", "System Architecture"] },
                    diagramming: { title: "Design & Visual Tools", items: ["Miro", "Lucidchart", "Figma"] },
                    api: { title: "APIs & Automation", items: ["REST API", "Swagger", "n8n", "AI Agents"] },
                    query: { title: "Query & Technical", items: ["SQL", "JQL"] },
                    delivery: { title: "Delivery & PM", items: ["Jira", "Confluence", "Notion", "ClickUp"] }
                }
            },
            footer: { rights: "All rights reserved.", privacy: "Privacy Policy", status: "Business Analyst", statusMeta: "UA / EU / US" },
            notFound: {
                title: "Page not found — Anton Lisachenko",
                back: "Back to home",
                kicker: "Page not found",
                heading: "Nothing here — yet.",
                text: "The page you're looking for doesn't exist or has moved.",
                hint: "tap the figure to rebuild it · drag to spin",
                home: "Home"
            },
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
                    arch: { type: "Architecture", title: "System Architecture", short: "Multi-tenant records platform: three front doors over one NestJS core, with PostgreSQL, Redis, object storage and OAuth 2.0 / OIDC.", desc: "Layered architecture of a multi-tenant records platform: three front doors (public portal, per-tenant cabinet, restricted admin panel) over a single NestJS core with routing, state-registry sync and OAuth 2.0 / OIDC access control; PostgreSQL with GIN/GiST full-text indexes, Redis for cache and queues, S3-compatible object storage for scanned documents; Docker / Kubernetes with CI/CD." },
                    approval: { type: "UML · Sequence", title: "Nomenclature Approval Flow", short: "How a catalogue item moves from Project to Approved — statuses, edit locks, storage and notifications in one sequence.", desc: "Sequence for approving a nomenclature (catalogue) item: create in Project status, save to Postgres, submit with edits locked and a copy held in object storage, notify the clerk via a Redis queue; then either approve (status Approved) or return with comments (back to Project, edits unlocked)." },
                    bpmn: { type: "BPMN · draw.io", title: "Institutions Registry — Admin Flow", short: "Moderator side of a registry: validated record entry, hierarchy upkeep, file limits and a full audit trail.", desc: "BPMN of an institutions registry, admin side: a moderator creates records under validation (required fields, formats, duplicates), maintains the hierarchical structure and uploads files within technical limits; every save, block and delete lands in the audit log, and published records appear on the portal by access level." },
                    bpmn4: { type: "BPMN · draw.io", title: "Document Extracts — Order & Delivery", short: "Request-to-delivery flow for signed document extracts: officer review, mandatory rejection reasons, status tracking and repeat orders.", desc: "BPMN of an extract-ordering flow: a document owner requests a personalised digital copy of a protocol extract for one approved document; an authorised officer uploads a signed PDF or rejects the request with a required reason; the requester tracks the state — Pending / Granted / Declined — and may re-request the same extract any number of times; every action is recorded in the audit log." },
                    bpmn2: { type: "BPMN · Miro", title: "Annual Reporting Flow", short: "Two ways in — API (JSON) or paper — one way out: deadline-driven statuses, versioned corrections and registrar approval.", desc: "BPMN of an annual-reporting flow with two entry points: an external system files a JSON report via API — parsed, then stamped Submitted or Overdue by the filing date — while a registrar may also enter a paper report by hand; corrections replace the version until the cut-off date, then the registrar verifies and approves the report and the balance is closed." },
                    bpmn3: { type: "BPMN · Miro", title: "Registry Records — Lifecycle & Publication", short: "Record lifecycle from duplicate check to publication: manual or synced entry, e-signature, Draft → Active, previous version archived.", desc: "BPMN of a registry record lifecycle: a specialist checks whether the record already exists in the register; if not, it is created by hand or synced from the authorised source, then the data and files are updated and published — the verifier's e-signature is applied, the record moves from Draft to Active, the previous record is archived with a technical link to it, and the public fields open." },
                    dwh: { type: "Data Architecture", title: "Medallion Data Pipeline", short: "Bronze → Silver → Gold warehouse: raw ingestion, cleaning and validation, curated marts feeding Superset and Power BI dashboards.", desc: "Data flows in a warehouse built on the medallion architecture: a Bronze layer ingests raw files untouched — idempotent and re-processable — a Silver layer cleans, validates, filters and normalizes them into one structure, and a Gold layer publishes curated marts that feed dashboards in Apache Superset (analysts) and Power BI (leadership); orchestration and scheduled jobs keep the layers consistent." },
                    deploy: { type: "Deployment", title: "Deployment Architecture", short: "One Kubernetes cluster, two ways in — VPN for staff, CDN edge for the public — plus identity-provider and registry integrations.", desc: "Deployment topology of the platform: one Kubernetes cluster runs the admin module, core service and both public apps; internal staff connect over a VPN tunnel, external users arrive through a CDN edge with TLS, caching and anti-DDoS; trusted outside systems are the identity provider (OAuth 2.0 / OIDC with 2FA) and a state registry; data lives in Postgres, Redis and S3-compatible object storage." },
                    agent: { type: "AI Agents", title: "Problem Radar", short: "Automated problem discovery: collects complaint-shaped posts, a local LLM tags the themes — the machine counts, a human decides what to build.", desc: "A zero-cost n8n flow that scans Hacker News for complaint-shaped posts, dedupes them by URL and files each into a Complaints board — a local Ollama model tags noise and theme. The one rule holds: the machine collects, counts and suggests; you decide what is worth building." }
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
                            req: { title: "Requirements & Docs", desc: "BRD, SRS, FRD and user stories — written so a team can actually build from them, with acceptance criteria that end arguments.", pills: "Stories | BRD / SRS / FRD" },
                            model: { title: "Process Modeling", desc: "BPMN and UML diagrams that make the current pain and the target flow visible to business and developers at the same time.", pills: "BPMN / UML / Sequence" },
                            arch: { title: "Architecture & Data", desc: "System architecture, ERD / DWH schemas and API specs — the blueprint before a single line of code is spent.", pills: "API | ERD / Architecture" },
                            presale: { title: "Pre-Sale & Discovery", desc: "Feasibility, scope and estimates at the very front of a deal, so stakeholders commit with their eyes open.", pills: "Workshops | Discovery / Estimates" }
                        }
                    },
                    delivery: {
                        heading: "AI-Native Delivery",
                        items: {
                            websites: { title: "Full Websites & Integrations", desc: "Multi-page sites with booking, payments, CMS and SEO — built to run a business.", pills: "HTML / CSS / JS | API / Integrations / CMS" },
                            bcard: { title: "Business Card Sites", desc: "A one-page web business card — dark, modern, bilingual — designed, coded and deployed. Live in days, not months.", pills: "HTML / CSS / JS | Bilingual / Deploy" },
                            landing: { title: "Landing Pages", desc: "A focused landing that sells one thing: your product, your profile, your offer. Clean copy, clean code, no framework.", pills: "HTML / CSS / JS | SEO / Copy" },
                            automation: { title: "AI Automation", desc: "n8n workflows and local LLMs that scan, digest and remind for you — zero cloud cost, running on your own hardware.", pills: "AI / API | n8n / LLM / RAG" }
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
                        tesik: { title: "Tesik Craft — Handmade Toys", desc: "A craft workshop storefront — cotton-wool Christmas ornaments and textile teddies, catalog with cart and a production showcase." },
                        shape: { title: "Shape Barbershop", desc: "A barbershop site with a dark, gritty look — services, price list, team and a booking that starts a WhatsApp chat." }
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
            nav: { portfolio: "Портфоліо" },
            role: "Бізнес-аналітик",
            typed: ["BPMN та UML моделювання", "Схеми API та даних", "Інженерія вимог", "Консалтинг з препродажу", "Від дослідження до передачі"],
            rail: { email: "напишіть мені", linkedin: "напишіть в LinkedIn" },
            now: {
                heading: "Зараз працюю з",
                items: ["RAG-пошук по проєктній документації", "Локальні LLM для аналізу даних під NDA", "ШІ-валідація специфікацій — прогалини, суперечності, тестованість"]
            },
            domains: {
                heading: "Домени",
                items: ["SaaS", "Державні цифрові сервіси", "Охорона здоров'я", "Нерухомість", "Медіа", "Реклама", "Енергетика та ЖКГ", "Блокчейн та крипто", "Логістика"]
            },
            expertise: {
                heading: "Експертиза",
                // key order mirrors the visual order in index.html (BA-logic flow)
                groups: {
                    requirements: { title: "Requirements & Docs", items: ["BRD", "PRD", "SRS", "User Stories"] },
                    notations: { title: "Modeling & Architecture", items: ["BPMN", "UML", "System Architecture"] },
                    diagramming: { title: "Design & Visual Tools", items: ["Miro", "Lucidchart", "Figma"] },
                    api: { title: "APIs & Automation", items: ["REST API", "Swagger", "n8n", "AI Agents"] },
                    query: { title: "Query & Technical", items: ["SQL", "JQL"] },
                    delivery: { title: "Delivery & PM", items: ["Jira", "Confluence", "Notion", "ClickUp"] }
                }
            },
            footer: { rights: "Всі права захищені.", privacy: "Політика приватності", status: "Бізнес-аналітик", statusMeta: "Україна / ЄС / США" },
            notFound: {
                title: "Сторінку не знайдено — Антон Лісаченко",
                back: "На головну",
                kicker: "Сторінку не знайдено",
                heading: "Тут поки нічого немає.",
                text: "Сторінки, яку ти шукаєш, не існує або її перенесли.",
                hint: "тапни фігуру, щоб перебудувати · потягни, щоб покрутити",
                home: "Головна"
            },
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
                    arch: { type: "Архітектура", title: "Архітектура системи", short: "Мультитенантна платформа: три входи над єдиним ядром NestJS, PostgreSQL, Redis, об'єктне сховище і OAuth 2.0 / OIDC.", desc: "Шарова архітектура мультитенантної платформи керування документами: три входи (публічний портал, кабінет установи, обмежена адмінпанель) над єдиним ядром NestJS із маршрутизацією, синхронізацією з державним реєстром і контролем доступу OAuth 2.0 / OIDC; PostgreSQL із повнотекстовими індексами GIN/GiST, Redis для кешу і черг, S3-сумісне сховище для скан-копій; Docker / Kubernetes з CI/CD." },
                    approval: { type: "UML · Sequence", title: "Флоу погодження номенклатури", short: "Як позиція номенклатури проходить шлях від «Проєкту» до «Погодженої» — статуси, блокування редагування, сховище і сповіщення в одній діаграмі.", desc: "Sequence-діаграма погодження номенклатури: створення у статусі «Проєкт», збереження в PostgreSQL, подання на погодження з блокуванням редагування та копією в об'єктному сховищі, сповіщення діловода через чергу Redis; далі — «Погодити» (статус «Погоджена») або повернення з коментарями (статус «Проєкт», розблокування редагування). Підпис на етапі подання не вимагається." },
                    bpmn: { type: "BPMN · draw.io", title: "Реєстр установ — адміністративна частина", short: "Адмінська частина реєстру: введення записів з перевіркою, ведення ієрархії, ліміти на файли і повний журнал аудиту.", desc: "BPMN реєстру установ, адміністративна частина: модератор створює записи з перевіркою (обов'язкові поля, формати, дублікати), веде ієрархічну структуру і завантажує файли в межах технічних обмежень; кожне збереження, блокування та видалення фіксується в журналі аудиту, а опубліковані записи відображаються на порталі згідно з рівнем доступу." },
                    bpmn4: { type: "BPMN · draw.io", title: "Витяги з документів — флоу замовлення та надання", short: "Флоу від запиту до видачі підписаного витягу: розгляд уповноваженим працівником, обов'язкова причина відмови, відстеження статусу і повторні замовлення.", desc: "BPMN флоу замовлення витягу: власник документа замовляє персоналізовану цифрову копію витягу з протоколу за одним затвердженим документом; уповноважений працівник завантажує підписаний PDF або відхиляє запит з обов'язковою причиною; замовник відстежує стан — «Очікує формування» / «Надано» / «Відхилено» — і може повторно замовити той самий витяг будь-яку кількість разів; кожна дія фіксується в журналі аудиту." },
                    bpmn2: { type: "BPMN · Miro", title: "Флоу подання щорічної звітності", short: "Два входи — API (JSON) або папір — і один вихід: статуси за дедлайном, версії уточнень і затвердження реєстратором.", desc: "BPMN флоу щорічної звітності із двома точками входу: зовнішня система подає звіт через API у форматі JSON — система парсить його і за датою подання надає статус «Подано» або «Прострочено», а реєстратор може вносити паперовий звіт вручну; уточнення замінюють версію звіту до граничної дати, після чого реєстратор верифікує та затверджує звіт і баланс зведено." },
                    bpmn3: { type: "BPMN · Miro", title: "Реєстрові записи — життєвий цикл і публікація", short: "Життєвий цикл запису від перевірки на дубль до публікації: ручне введення або синхронізація, ЕЦП, «Чернетка» → «Активний», попередня версія — в архів.", desc: "BPMN життєвого циклу реєстрового запису: фахівець перевіряє, чи запис уже є в реєстрі; якщо ні — створює його вручну або синхронізує з уповноваженого джерела, оновлює дані та файли й публікує — накладається ЕЦП верифікатора, запис переходить зі статусу «Чернетка» в «Активний», попередній запис стає «Архівним» із технічним зв'язком з новим, а публічні поля відкриваються." },
                    dwh: { type: "Архітектура даних", title: "Медальйонний пайплайн даних", short: "Сховище Bronze → Silver → Gold: сирі дані, очищення й валідація, готові вітрини для дашбордів у Superset і Power BI.", desc: "Потоки даних у сховищі (DWH) за медальйонною архітектурою: рівень Bronze приймає сирі файли без змін — ідемпотентно і з можливістю повторної обробки — рівень Silver очищає, валідує, фільтрує та нормалізує їх до єдиної структури, а рівень Gold формує готові вітрини, що живлять дашборди в Apache Superset (аналітики) і Power BI (керівництво); оркестрація і планові завдання тримають шари узгодженими." },
                    deploy: { type: "Розгортання", title: "Архітектура розгортання", short: "Один Kubernetes-кластер, два шляхи входу — VPN для працівників, CDN для публіки — плюс інтеграції зі службою авторизації та реєстром.", desc: "Топологія розгортання предметної платформи: один Kubernetes-кластер розміщує модуль адміністрування, Core Service та обидва публічні застосунки; внутрішні користувачі заходять через VPN-тунель, зовнішні — через CDN-край (TLS, кешування, захист від DDoS); довірені зовнішні системи — служба авторизації (OAuth 2.0 / OIDC із 2FA) та державний реєстр; дані — у PostgreSQL, Redis та S3-сумісному сховищі." },
                    agent: { type: "ШІ-агенти", title: "Problem Radar", short: "Автоматизований пошук проблем: збирає скарги користувачів, локальна LLM тегує теми — машина рахує, людина вирішує, що будувати.", desc: "Безкоштовний n8n-пайплайн, який сканує Hacker News на повідомлення у формі скарг, дедуплікує їх за URL і дописує кожне до дошки Complaints — локальна модель Ollama позначає шум і тему. Одне правило: машина збирає, рахує і підказує; ти вирішуєш, що варте того, щоб будувати." }
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
                            req: { title: "Вимоги та документація", desc: "BRD, SRS, FRD і юзер-сторі — написані так, щоб команда могла реально будувати за ними, з критеріями приймання, які знімають суперечки.", pills: "Stories | BRD / SRS / FRD" },
                            model: { title: "Моделювання процесів", desc: "BPMN та UML діаграми, що роблять поточний біль і цільовий флоу видимими одночасно для бізнесу і розробників.", pills: "BPMN / UML / Sequence" },
                            arch: { title: "Архітектура та дані", desc: "Архітектура системи, ERD / DWH-схеми і API-специфікації — «креслення» до того, як витрачено перший рядок коду.", pills: "API | ERD / Архітектура" },
                            presale: { title: "Препродаж і дослідження", desc: "Здійсненність, обсяг і оцінки на самому старті угоди, щоб стейкхолдери брали на себе зобов'язання з відкритими очима.", pills: "Воркшопи | Discovery / Оцінки" }
                        }
                    },
                    delivery: {
                        heading: "AI-орієнтована розробка",
                        items: {
                            websites: { title: "Повноцінні сайти та інтеграції", desc: "Багатосторінкові сайти із записом, оплатами, CMS та SEO — зроблені для бізнесу.", pills: "HTML / CSS / JS | API / Інтеграції / CMS" },
                            bcard: { title: "Сайти-візитки", desc: "Односторінкова веб-візитка — темна, сучасна, двомовна — спроєктована, написана і задеплоєна. Живе за дні, а не місяці.", pills: "HTML / CSS / JS | Двомовний / Деплой" },
                            landing: { title: "Лендінги", desc: "Лендінг, що продає одну річ: твій продукт, твій профайл, твою пропозицію. Чистий текст, чистий код, без фреймворків.", pills: "HTML / CSS / JS | SEO / Копірайт" },
                            automation: { title: "AI-автоматизація", desc: "n8n-воркфлоу та локальні LLM, які сканують, узагальнюють і нагадують за тебе — нульова вартість у хмарі, все працює на твоєму залізі.", pills: "AI / API | n8n / LLM / RAG" }
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
                        tesik: { title: "Tesik Craft — іграшки ручної роботи", desc: "Вітрина ремісничої майстерні — ватні ялинкові іграшки та текстильні тедді, каталог з кошиком і розділ «як це робиться»." },
                        shape: { title: "Shape Barbershop", desc: "Сайт барбершопу з темним характерним стилем — послуги, прайс, команда і запис, що відкриває чат у WhatsApp." }
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

    // exposed for script.js (typewriter) — it loads after this file, so the
    // phrases are ready by the time it runs
    window.TYPED_PHRASES = dict.typed;

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