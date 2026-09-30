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
                kicker: "Selected work",
                heading: "Portfolio",
                more: "tap to inspect",
                sections: { process: "Process & Notation", data: "Architecture & Data", ai: "AI in Practice" },
                intro: {
                    p1: "Business analysis artifacts in classic notations — BPMN 2.0, UML 2 and DFD.",
                    p2: "Each one is prepared for this portfolio: typical processes and systems from my practice, drawn with generic names and no client data."
                },
                items: {
                    arch: { type: "UML · Component", title: "System Architecture", short: "Multi-tenant records platform: three front doors over one NestJS core, with PostgreSQL, Redis, object storage and OAuth 2.0 / OIDC.", desc: "UML component diagram of a multi-tenant records platform: three front ends (public portal, per-tenant cabinet, VPN-only admin panel) require REST interfaces that the NestJS core provides on its ports and delegates to the API components; auth (OAuth 2.0 / OIDC), state-registry sync and notification components reach the external systems through ports as well, on top of persistence, cache and file-storage components backed by PostgreSQL (GIN/GiST full-text), Redis and S3-compatible storage; Docker / Kubernetes with CI/CD." },
                    approval: { type: "UML · Sequence", title: "Nomenclature Approval Flow", short: "How a catalogue item moves from Draft to Approved — statuses, edit locks, file storage and notifications in one sequence.", desc: "UML sequence diagram of approving a nomenclature (catalogue) item across five lifelines: the author creates it (saved to PostgreSQL) and submits it — the file goes to MinIO object storage, the status becomes In review and editing is locked — and the approver is notified asynchronously through a Redis queue; the approver opens the card and, in an alt fragment, either approves it or returns it with comments, which sends it back to Draft; either way the author is notified. No signature is required at submission." },
                    cert: { type: "BPMN 2.0", title: "Certificate Issuance from Registry Records", short: "Reuse a certificate already issued or build a new one from registry records — with a refusal path and a QR code for verification.", desc: "BPMN 2.0 of issuing a certificate from registry records: the clerk first searches for one already issued and, if found, checks its card and issues it again; otherwise a draft is created and the object is looked up in the index — if it is not there, a refusal goes to the applicant. The record text is copied into the certificate, related records and documents are added when there are any, and the content is checked in a loop until it is correct; every join is an explicit merge gateway. The draft is saved at every step; once the clerk sets it to Formed, the system generates a QR code for verification and the certificate is issued to the applicant." },
                    access: { type: "BPMN 2.0", title: "Access Request & Approval", short: "Time-boxed access to a registry card: requested by the user, routed by the role map, revoked automatically when the term ends.", desc: "BPMN 2.0 of role-based access on request: when a user's role gives no rights to a registry card, the system shows a request form; the user asks for specific rights (view, edit, attach files, print) for a set number of days, and the request is routed to the approving role from the role map. A rejection comes back with a reason; an approval grants access for the term, and a timer revokes it automatically once the term is over." },
                    state: { type: "UML · State Machine", title: "Access Request — Lifecycle", short: "The access request from the BPMN, seen as states: submitted, under review, active until the term runs out — and every way it can end.", desc: "UML 2 state machine of one access request — the lifecycle view of the Access Request BPMN: submit(rights, term) creates it in Submitted (entry: route to the approver); the approver opens it and either rejects it with a reason (entry: notify the requester) or approves it, which makes it Active — entry grants the rights and notifies the requester, exit withdraws them, so every way out cleans up. The time event after(term) moves it to Expired, an admin can revoke it earlier, and the requester may withdraw it while it is still Submitted; every end state leads to a final state." },
                    bpmn2: { type: "BPMN 2.0", title: "Annual Reporting Flow", short: "Two ways in — API (JSON) or paper — one way out: validation, deadline-driven statuses, versioned corrections and registrar approval.", desc: "BPMN 2.0 collaboration of an annual-reporting flow with two entry points: an external system files a JSON report via API — its structure is validated first, and an invalid file goes back to the sender with the errors — while a registrar may also enter a paper report by hand. The report is stamped Submitted or Overdue by the filing date; an event-based gateway then takes corrections, each replacing the version, until the correction deadline, after which the registrar approves the report and the balance is compiled." },
                    dwh: { type: "DFD · Gane–Sarson", title: "Medallion Data Pipeline", short: "Bronze → Silver → Gold warehouse: raw ingestion, cleaning and validation, curated marts feeding Superset and Power BI dashboards.", desc: "Level-1 data flow diagram (Gane–Sarson) of a warehouse built on the medallion architecture, with the level-0 context diagram alongside: source files and an upstream feed land untouched in Bronze, so every layer can be rebuilt; they are staged, cleansed and mapped to reference data, and Silver is built in wide and long, partitioned form; Gold marts are refreshed from it and served as dashboards in Apache Superset (analysts) and Power BI (leadership); scheduled orchestration keeps the layers consistent." },
                    erd: { type: "ERD · Crow's Foot", title: "Records Platform — Data Model", short: "The logical model behind the registry flows: organisations, users and roles, cards with records and documents, certificates and access requests.", desc: "Logical ERD in crow's foot (IE) notation of the records platform behind the certificate and access flows: organisations own users and registry cards; users hold roles through user_role (at least one each); a card carries records and documents; a certificate quotes one or more records through certificate_record, and a record can be quoted by many certificates; a user's access request targets one card and yields at most one grant, whose unique request_id enforces the zero-or-one. Every foreign key has its relationship line, with the cardinality read at both ends." },
                    rag: { type: "BPMN 2.0 · RAG", title: "Spec & Story Validator", short: "A local LLM checks a spec or a user story against eight standards and a set of golden stories, then returns an audit, recommendations and suggested edits — the analyst makes the call.", desc: "An AnythingLLM workspace on local models. A spec or a user story goes in, and its type picks the model: a compact, fast one for a story, a long-context one for a spec. The relevant standards and the nearest golden stories are retrieved from a local vector store, and the text is checked against each of eight standards in parallel — story types, INVEST, 3C, acceptance criteria, splitting, Definition of Ready, Definition of Done and requirement quality (ISO/IEC/IEEE 29148). Out come three things: an audit per standard, recommendations and suggested edits, every finding citing its standard. The analyst accepts the edits or reworks and resubmits; the best approved stories become new golden stories. Nothing leaves the laptop, so it works on NDA material." }
                },
                cta: {
                    heading: "Want the details?",
                    text: "I can walk you through the reasoning behind any of these on a call."
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
                kicker: "Обрані роботи",
                heading: "Портфоліо",
                more: "натисни, щоб розглянути",
                sections: { process: "Процеси та нотації", data: "Архітектура та дані", ai: "ШІ на практиці" },
                intro: {
                    p1: "Артефакти бізнес-аналізу в класичних нотаціях — BPMN 2.0, UML 2 і DFD.",
                    p2: "Кожен підготовлено спеціально для портфоліо: типові процеси й системи з моєї практики, з узагальненими назвами і без даних клієнтів."
                },
                items: {
                    arch: { type: "UML · Component", title: "Архітектура системи", short: "Мультитенантна платформа: три входи над єдиним ядром NestJS, PostgreSQL, Redis, об'єктне сховище і OAuth 2.0 / OIDC.", desc: "UML-діаграма компонентів мультитенантної платформи: три фронтенди (публічний портал, кабінет установи, адмінпанель лише через VPN) використовують REST-інтерфейси, які ядро NestJS надає через порти й делегує компонентам API; компоненти авторизації (OAuth 2.0 / OIDC), синхронізації з державним реєстром і сповіщень так само звертаються до зовнішніх систем через порти й працюють поверх компонентів доступу до даних, кешу та файлів із PostgreSQL (повнотекстові індекси GIN/GiST), Redis і S3-сумісним сховищем; Docker / Kubernetes з CI/CD." },
                    approval: { type: "UML · Sequence", title: "Флоу погодження номенклатури", short: "Як позиція номенклатури проходить шлях від «Чернетки» до «Погоджено» — статуси, блокування редагування, файлове сховище і сповіщення в одній діаграмі.", desc: "UML-діаграма послідовності погодження номенклатури з п'ятьма лініями життя: автор створює позицію (вона зберігається в PostgreSQL) і подає її — файл іде в об'єктне сховище MinIO, статус стає «На погодженні», редагування блокується, — а погоджувач отримує асинхронне сповіщення через чергу Redis; погоджувач відкриває картку і у фрагменті alt або погоджує її, або повертає з коментарями — тоді позиція повертається в «Чернетку»; в обох випадках автор отримує сповіщення. Підпис на етапі подання не вимагається." },
                    cert: { type: "BPMN 2.0", title: "Формування довідки з реєстрових записів", short: "Знайти вже видану довідку або зібрати нову з реєстрових записів — з гілкою відмови і QR-кодом для перевірки.", desc: "BPMN 2.0 формування довідки за реєстровими записами: працівник спершу шукає вже видану довідку і, якщо вона є, перевіряє її картку та видає повторно; інакше створює чернетку й шукає об'єкт у покажчику — якщо його немає, заявник отримує відмову. Текст запису переноситься в довідку, пов'язані записи й документи додаються, якщо вони є, а зміст перевіряється в циклі, доки не стане коректним; кожне злиття — явний шлюз. Чернетка зберігається на кожному кроці; після присвоєння статусу «Сформовано» система генерує QR-код для перевірки, і довідку видають заявнику." },
                    access: { type: "BPMN 2.0", title: "Запит і погодження доступу", short: "Тимчасовий доступ до картки реєстру: запит від користувача, маршрут за картою ролей, автоматичне скасування після строку.", desc: "BPMN 2.0 надання доступу за запитом: якщо роль користувача не дає прав на картку реєстру, система показує форму запиту; користувач зазначає потрібні права (перегляд, редагування, додавання файлів, друк) і строк у днях, а запит іде на погодження ролі, визначеній картою ролей. Відмова повертається з причиною; погодження відкриває доступ на строк, а таймер автоматично скасовує його, щойно строк мине." },
                    state: { type: "UML · State Machine", title: "Запит на доступ — життєвий цикл", short: "Той самий запит на доступ, що й у BPMN, але як стани: подано, на розгляді, активний до кінця строку — і всі способи, якими він завершується.", desc: "UML 2 діаграма станів одного запиту на доступ — життєвий цикл до BPMN «Запит і погодження доступу»: подати(права, строк) створює запит у стані «Подано» (entry: направити погоджувачу); погоджувач відкриває його і або відхиляє з причиною (entry: сповістити заявника), або погоджує — тоді запит стає «Активним»: entry надає права й сповіщає заявника, exit забирає права, тож будь-який вихід прибирає за собою. Часова подія after(строк) переводить його у «Строк минув», адміністратор може скасувати доступ раніше, а поки запит «Подано», заявник може його відкликати; кожен кінцевий стан веде до фінального." },
                    bpmn2: { type: "BPMN 2.0", title: "Флоу подання щорічної звітності", short: "Два входи — API (JSON) або папір — і один вихід: валідація, статуси за дедлайном, версії уточнень і затвердження реєстратором.", desc: "BPMN 2.0 (колаборація) флоу щорічної звітності із двома точками входу: зовнішня система подає звіт через API у форматі JSON — спершу перевіряється його структура, і некоректний файл повертається відправнику з помилками, — а реєстратор може внести паперовий звіт вручну. За датою подання звіт отримує статус «Подано» або «Прострочено»; далі шлюз на основі подій приймає уточнення, кожне з яких замінює версію, до кінцевої дати, після чого реєстратор затверджує звіт і баланс зводиться." },
                    dwh: { type: "DFD · Gane–Sarson", title: "Медальйонний пайплайн даних", short: "Сховище Bronze → Silver → Gold: сирі дані, очищення й валідація, готові вітрини для дашбордів у Superset і Power BI.", desc: "DFD першого рівня (нотація Gane–Sarson) сховища за медальйонною архітектурою разом із контекстною діаграмою рівня 0: файли-джерела й зовнішній потік потрапляють у Bronze без змін, тож будь-який шар можна перебудувати; далі — очищення, зіставлення з довідниками і побудова Silver у широкому й довгому партиційованому форматах; з нього оновлюються вітрини Gold для дашбордів в Apache Superset (аналітики) і Power BI (керівництво); планова оркестрація тримає шари узгодженими." },
                    erd: { type: "ERD · Crow's Foot", title: "Платформа реєстру — модель даних", short: "Логічна модель під флоу реєстру: організації, користувачі й ролі, картки із записами та документами, довідки й запити на доступ.", desc: "Логічна ERD у нотації crow's foot (IE) платформи, на якій працюють флоу довідок і доступу: організації володіють користувачами й картками реєстру; користувачі мають ролі через user_role (щонайменше одну); картка містить записи й документи; довідка цитує один або кілька записів через certificate_record, а запис може потрапити в багато довідок; запит користувача на доступ стосується однієї картки й дає не більше одного надання доступу — унікальний request_id забезпечує «нуль або один». Кожен зовнішній ключ має свою лінію зв'язку, кардинальність видно з обох кінців." },
                    rag: { type: "BPMN 2.0 · RAG", title: "Валідатор специфікацій і user stories", short: "Локальна LLM перевіряє специфікацію або user story на відповідність восьми стандартам і золотим сторі та повертає аудит, рекомендації й правки — рішення за аналітиком.", desc: "Робочий простір AnythingLLM на локальних моделях. На вхід — специфікація або user story, і від типу залежить модель: компактна й швидка для сторі, з довгим контекстом — для специфікації. З локального векторного сховища підтягуються релевантні стандарти й найближчі золоті сторі, а текст паралельно перевіряється на відповідність кожному з восьми стандартів — типи сторі, INVEST, 3C, критерії приймання, розбиття, Definition of Ready, Definition of Done і якість вимог (ISO/IEC/IEEE 29148). На виході три речі: аудит по кожному стандарту, рекомендації та запропоновані правки, і кожне зауваження посилається на свій стандарт. Аналітик приймає правки або доопрацьовує й подає знову; найкращі схвалені сторі стають новими золотими. Нічого не виходить за межі ноутбука, тож це працює з матеріалами під NDA." }
                },
                cta: {
                    heading: "Потрібні деталі?",
                    text: "Можу розповісти про логіку будь-якої з цих схем на дзвінку."
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

    // localized pictures: <img src="…-en.png" data-src-uk="…-uk.png"> — the English
    // file is the static default (crawlers, no-JS); Ukrainian visitors get their own
    if (lang === "uk") {
        Array.prototype.forEach.call(document.querySelectorAll("img[data-src-uk]"), function (img) {
            img.src = img.getAttribute("data-src-uk");
        });
    }

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