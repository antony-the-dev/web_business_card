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
            privacy: {
                title: "Privacy Policy — Anton Lisachenko",
                back: "Back to home",
                heading: "Privacy Policy",
                updated: "Last updated: September 2026",
                overview: { h: "Overview", p: "This is a static personal site. It does not collect, store, sell or share personal data: there are no accounts, no forms, no cookies and no tracking scripts." },
                storage: { h: "Stored in your browser", p: "Your theme (dark or light) and language (EN or UA) are remembered in your browser's local storage, so the site opens with your settings. They never leave your device, and you can clear them at any time in your browser settings." },
                hosting: { h: "Hosting & technical logs", p: "The site is hosted on GitHub Pages. GitHub may keep standard server access logs (such as IP address, browser type and referring page) as part of running its infrastructure, under", link: "GitHub's Privacy Statement" },
                resources: { h: "Third-party resources", p: "The 3D figure is drawn with the Three.js library, loaded from the cdnjs network run by Cloudflare. When your browser downloads it, Cloudflare receives the usual technical request data (such as IP address and browser type), under", link: "Cloudflare's Privacy Policy", p2: "Fonts are served from this site itself — no requests go to Google." },
                cookies: { h: "Cookies", p: "The site sets no cookies. DNS for the domain is managed by Cloudflare in DNS-only mode — site traffic is not proxied, cached or tracked by Cloudflare." },
                links: { h: "Third-party links", p: "The Email and LinkedIn links take you to third-party services with their own privacy policies. Following them is up to you." },
                analytics: { h: "Analytics", p: "No analytics or usage-tracking tools are in use. If that ever changes, this page will say what is collected and why before it starts." },
                changes: { h: "Changes to this policy", p: "This policy may be updated as the site changes; the date at the top shows the current version." },
                contact: { h: "Contact", p: "Questions about this policy? Write to" }
            },
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
                note: "preview blurred · details on a call",
                sections: { process: "Process & Notation", data: "Architecture & Data", ai: "AI in Practice" },
                intro: {
                    p1: "Diagrams, documents and tools from real projects.",
                    p2: "Client work is under NDA, so the previews are blurred."
                },
                items: {
                    arch: { type: "Architecture", title: "System Architecture", short: "Multi-tenant records platform: three front doors over one NestJS core, with PostgreSQL, Redis, object storage and OAuth 2.0 / OIDC.", desc: "Layered architecture of a multi-tenant records platform: three front doors (public portal, per-tenant cabinet, restricted admin panel) over a single NestJS core with routing, state-registry sync and OAuth 2.0 / OIDC access control; PostgreSQL with GIN/GiST full-text indexes, Redis for cache and queues, S3-compatible object storage for scanned documents; Docker / Kubernetes with CI/CD." },
                    approval: { type: "UML · Sequence", title: "Nomenclature Approval Flow", short: "How a catalogue item moves from Project to Approved — statuses, edit locks, storage and notifications in one sequence.", desc: "Sequence for approving a nomenclature (catalogue) item: create in Project status, save to Postgres, submit with edits locked and a copy held in object storage, notify the clerk via a Redis queue; then either approve (status Approved) or return with comments (back to Project, edits unlocked)." },
                    cert: { type: "BPMN 2.0", title: "Certificate Issuance from Registry Records", short: "Reuse a certificate already issued or build a new one from source records — ending in a document with a QR code for verification.", desc: "BPMN 2.0 of issuing a certificate from registry records: the clerk first checks whether one has already been issued; if not, a draft is created and its type chosen, the object's source records are found and entered, linked records and supporting documents are added to the chain, and the content is reviewed — looping back until it is correct. The draft is saved at every step; once the clerk sets it to Generated, the system adds a QR code for verification and the certificate is printed or sent electronically." },
                    access: { type: "BPMN 2.0", title: "Access Request & Approval", short: "Time-boxed access to a registry card: requested by the user, routed by the role map, revoked automatically when the term ends.", desc: "BPMN 2.0 of role-based access on request: when a user's role gives no rights to a registry card, the system shows a request form; the user asks for specific rights (view, edit, attach files, print) for a set number of days, and the request is routed to the approving role from the role map. A rejection comes back with a reason; an approval grants access for the term, and a timer revokes it automatically once the term is over." },
                    bpmn2: { type: "BPMN 2.0", title: "Annual Reporting Flow", short: "Two ways in — API (JSON) or paper — one way out: deadline-driven statuses, versioned corrections and registrar approval.", desc: "BPMN 2.0 of an annual-reporting flow with two entry points: an external system files a JSON report via API — parsed, then stamped Submitted or Overdue by the filing date — while a registrar may also enter a paper report by hand; corrections replace the version until the cut-off date, then the registrar verifies and approves the report and the balance is closed." },
                    dwh: { type: "Data Architecture", title: "Medallion Data Pipeline", short: "Bronze → Silver → Gold warehouse: raw ingestion, cleaning and validation, curated marts feeding Superset and Power BI dashboards.", desc: "Data flows in a warehouse built on the medallion architecture: a Bronze layer ingests raw files untouched — idempotent and re-processable — a Silver layer cleans, validates, filters and normalizes them into one structure, and a Gold layer publishes curated marts that feed dashboards in Apache Superset (analysts) and Power BI (leadership); orchestration and scheduled jobs keep the layers consistent." },
                    rag: { type: "BPMN 2.0 · RAG", title: "User Story Validator", short: "A local RAG assistant that checks a draft story against my BA rulebook — type, INVEST / 3C, acceptance criteria, splitting, DoR — and returns the gaps plus a suggested rewrite.", desc: "An AnythingLLM workspace on a local model. Seven reference documents — story types, INVEST & 3C quality rules, acceptance-criteria patterns, splitting techniques, golden examples, DoR / DoD and reference stories — are embedded once into a local vector store. A draft story is matched against the most relevant rules and examples, and the model returns a verdict per check, untestable or missing acceptance criteria, split suggestions and a rewrite. Nothing leaves the laptop, so it works on NDA material; approved stories feed back in as new golden examples, and the analyst makes the final call." }
                },
                cta: {
                    heading: "Want the details?",
                    text: "I can walk you through any of these on a call — under NDA if needed."
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
                        pub: { title: "This very site", desc: "A business card site with a dark theme, a 3D glass figure, bilingual switching and the contact rail you just used." },
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
            privacy: {
                title: "Політика приватності — Антон Лісаченко",
                back: "На головну",
                heading: "Політика приватності",
                updated: "Оновлено: вересень 2026",
                overview: { h: "Загалом", p: "Це статичний персональний сайт. Він не збирає, не зберігає, не продає і не передає персональні дані: тут немає акаунтів, форм, кукі та скриптів відстеження." },
                storage: { h: "Що зберігається у твоєму браузері", p: "Тема (темна чи світла) і мова (EN чи UA) запам'ятовуються в локальному сховищі браузера, щоб сайт відкривався з твоїми налаштуваннями. Ці дані не залишають твій пристрій, і їх можна будь-коли очистити в налаштуваннях браузера." },
                hosting: { h: "Хостинг і технічні журнали", p: "Сайт розміщено на GitHub Pages. GitHub може зберігати стандартні журнали доступу до сервера (як-от IP-адресу, тип браузера та сторінку, з якої перейшли) в межах роботи своєї інфраструктури відповідно до", link: "Політики конфіденційності GitHub" },
                resources: { h: "Сторонні ресурси", p: "3D-фігура малюється бібліотекою Three.js, яка завантажується з мережі cdnjs від Cloudflare. Коли браузер її завантажує, Cloudflare отримує звичайні технічні дані запиту (як-от IP-адресу та тип браузера) відповідно до", link: "Політики конфіденційності Cloudflare", p2: "Шрифти завантажуються з цього ж сайту — жодних запитів до Google." },
                cookies: { h: "Кукі", p: "Сайт не встановлює кукі. DNS домену обслуговує Cloudflare у режимі «лише DNS» — трафік сайту не проходить через Cloudflare, не кешується і не відстежується." },
                links: { h: "Посилання на сторонні сервіси", p: "Посилання на Email і LinkedIn ведуть на сторонні сервіси з власними політиками приватності. Переходити чи ні — вирішуєш ти." },
                analytics: { h: "Аналітика", p: "Жодних інструментів аналітики чи відстеження не використовується. Якщо це колись зміниться, ця сторінка заздалегідь розповість, що збирається і навіщо." },
                changes: { h: "Зміни політики", p: "Політика може оновлюватися разом із сайтом; дата вгорі показує актуальну версію." },
                contact: { h: "Контакти", p: "Питання щодо цієї політики? Пиши на" }
            },
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
                note: "прев'ю розмите · деталі — на дзвінку",
                sections: { process: "Процеси та нотації", data: "Архітектура та дані", ai: "ШІ на практиці" },
                intro: {
                    p1: "Діаграми, документи та інструменти з реальних проєктів.",
                    p2: "Клієнтські роботи під NDA, тому прев'ю розмиті."
                },
                items: {
                    arch: { type: "Архітектура", title: "Архітектура системи", short: "Мультитенантна платформа: три входи над єдиним ядром NestJS, PostgreSQL, Redis, об'єктне сховище і OAuth 2.0 / OIDC.", desc: "Шарова архітектура мультитенантної платформи керування документами: три входи (публічний портал, кабінет установи, обмежена адмінпанель) над єдиним ядром NestJS із маршрутизацією, синхронізацією з державним реєстром і контролем доступу OAuth 2.0 / OIDC; PostgreSQL із повнотекстовими індексами GIN/GiST, Redis для кешу і черг, S3-сумісне сховище для скан-копій; Docker / Kubernetes з CI/CD." },
                    approval: { type: "UML · Sequence", title: "Флоу погодження номенклатури", short: "Як позиція номенклатури проходить шлях від «Проєкту» до «Погодженої» — статуси, блокування редагування, сховище і сповіщення в одній діаграмі.", desc: "Sequence-діаграма погодження номенклатури: створення у статусі «Проєкт», збереження в PostgreSQL, подання на погодження з блокуванням редагування та копією в об'єктному сховищі, сповіщення діловода через чергу Redis; далі — «Погодити» (статус «Погоджена») або повернення з коментарями (статус «Проєкт», розблокування редагування). Підпис на етапі подання не вимагається." },
                    cert: { type: "BPMN 2.0", title: "Формування довідки з реєстрових записів", short: "Знайти вже видану довідку або зібрати нову з первинних записів — до документа з QR-кодом для перевірки.", desc: "BPMN 2.0 формування довідки за реєстровими записами: працівник спершу шукає вже видану довідку; якщо її немає — створює чернетку й обирає тип, знаходить і вносить первинні записи про об'єкт, додає пов'язані записи та підтвердні документи в один ланцюг і перевіряє зміст — з поверненням на попередні кроки, доки все не буде коректно. Чернетка зберігається на кожному кроці; після ручного присвоєння статусу «Сформовано» система генерує QR-код для верифікації, а довідку друкують або надсилають в електронному вигляді." },
                    access: { type: "BPMN 2.0", title: "Запит і погодження доступу", short: "Тимчасовий доступ до картки реєстру: запит від користувача, маршрут за картою ролей, автоматичне скасування після строку.", desc: "BPMN 2.0 надання доступу за запитом: якщо роль користувача не дає прав на картку реєстру, система показує форму запиту; користувач зазначає потрібні права (перегляд, редагування, додавання файлів, друк) і строк у днях, а запит іде на погодження ролі, визначеній картою ролей. Відмова повертається з причиною; погодження відкриває доступ на строк, а таймер автоматично скасовує його, щойно строк мине." },
                    bpmn2: { type: "BPMN 2.0", title: "Флоу подання щорічної звітності", short: "Два входи — API (JSON) або папір — і один вихід: статуси за дедлайном, версії уточнень і затвердження реєстратором.", desc: "BPMN 2.0 флоу щорічної звітності із двома точками входу: зовнішня система подає звіт через API у форматі JSON — система парсить його і за датою подання надає статус «Подано» або «Прострочено», а реєстратор може вносити паперовий звіт вручну; уточнення замінюють версію звіту до граничної дати, після чого реєстратор верифікує та затверджує звіт і баланс зведено." },
                    dwh: { type: "Архітектура даних", title: "Медальйонний пайплайн даних", short: "Сховище Bronze → Silver → Gold: сирі дані, очищення й валідація, готові вітрини для дашбордів у Superset і Power BI.", desc: "Потоки даних у сховищі (DWH) за медальйонною архітектурою: рівень Bronze приймає сирі файли без змін — ідемпотентно і з можливістю повторної обробки — рівень Silver очищає, валідує, фільтрує та нормалізує їх до єдиної структури, а рівень Gold формує готові вітрини, що живлять дашборди в Apache Superset (аналітики) і Power BI (керівництво); оркестрація і планові завдання тримають шари узгодженими." },
                    rag: { type: "BPMN 2.0 · RAG", title: "Валідатор user stories", short: "Локальний RAG-асистент, який перевіряє чернетку сторі за моїми правилами BA — тип, INVEST / 3C, критерії приймання, розбиття, DoR — і повертає прогалини та варіант переписаної сторі.", desc: "Робочий простір AnythingLLM на локальній моделі. Сім довідкових документів — види сторі, правила якості INVEST і 3C, шаблони критеріїв приймання, техніки розбиття, золоті приклади, DoR / DoD та еталонні сторі — один раз індексуються в локальне векторне сховище. Чернетка сторі зіставляється з найрелевантнішими правилами й прикладами, а модель повертає вердикт по кожній перевірці, нетестовані або відсутні критерії приймання, пропозиції з розбиття та переписаний варіант. Нічого не виходить за межі ноутбука, тож це працює з матеріалами під NDA; схвалені сторі повертаються в базу як нові золоті приклади, а останнє слово — за аналітиком." }
                },
                cta: {
                    heading: "Потрібні деталі?",
                    text: "Можу розповісти про будь-яку з цих робіт на дзвінку — за потреби під NDA."
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
                        pub: { title: "Цей самий сайт", desc: "Сайт-візитка з темною темою, 3D-фігурою зі скла, перемиканням мови та рейлом контактів, яким ти щойно користувався (-лася)." },
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