# Business Card Site — project notes for AI sessions

Plain HTML/CSS/JS, no framework. Files: `index.html`, `style.css`, `script.js`, `lang.js`, `face-points.js` (generated face data, do not edit by hand).

## Test
- Local server: `python3 -m http.server 8080` from the project root → http://localhost:8080
- The intro plays once per session; to replay it open a fresh/private tab.
- After editing script.js run: `node --check script.js`

## Current design (as of the dark-theme overhaul — do not regress)
- **Dark navy is the default theme** (`#0a2540`); light theme is opt-in via the moon/sun toggle next to EN/UA. Pre-paint script in `<head>` of index.html sets `html.dark` unless `localStorage.theme === "light"`. Choice persists in localStorage.
- Theme switching: toggle → dispatch `CustomEvent("themechange", { detail: { dark } })`. Listeners: hero figure (palette swap + `buildCube(grid)` rebuild) and the lower-section reveal.
- **The bottom section is theme-opposed**: dark theme → navy bottom "develops" to the classic white design (`#lower.light`, scoped light vars in style.css ~line 1156) when it enters the focus band; ONE-WAY, stays white (the `develop` IO module in script.js ~line 321 never resets). Light theme → the original scroll inversion: `#lower.dark` (navy) while in the focus band, releases as it passes. The user explicitly wants the bottom blue in the light theme ("as it was in white colors").
- **Hero: Portfolio · Services live UNDER the credo** (left column, desktop grid-area `pages`, row 4), in their own `.hero-pages` nav (which ALSO carries the `hero-contact` class so all link/beam styling applies) + a thin `.pages-sep` divider (`2rem` × `1px`, `var(--line)`, same grey as the expertise vertical divider). **Email · LinkedIn · GitHub stay top-right** (`grid-area contact`, row 3) in the main `.hero-contact` nav. The old **"tap the cube" hint (`.cube-hint`) was REMOVED** Sep 12 2026 (user: "вже зайве") — the static line, its grid slot (`cubehint`), tap-fade block in script.js, `.is-tapped` CSS and `cubeHint` lang keys are all gone. Mobile `--band-up` retuned to 0px (it existed to grow the band over the hint). The contact rail drives from BOTH navs (script.js queries `querySelectorAll(".hero-contact")`). `heroTapped`/`is-tapped` remain only for the 3D "tap me" plane (already `maxShows: 0`).
- **Pill buttons (expertise/domain tags) — one unified style, REVERSE on hover**: default = plain pill (`1px var(--line)` border, `var(--ink)` text, transparent bg, 0.85rem); hover/active swaps the fill to the opposite of the background — navy bottoms: white fill + navy `#0a2540` text; white bottoms (`html:not(.dark) #lower` and `html.dark #lower.light`): navy fill + white text — PLUS a thin orange ring (`box-shadow: 0 0 0 2px var(--accent)`) around the pill in both themes. Exactly the `.cv-btn` inversion idea but in the plain pill look. The swap starts after a 0.2s delay and animates over 0.2s (the user loves the delayed highlight; release is immediate). NO neon glow, NO orange text, NO gradient borders — all tried and rejected ("i have no words"). The `.cv-btn` (Download CV) stays UNIQUE.
- **Theme toggle on iOS**: after flipping the theme, a forced `translateZ(0)` repaint on body is required — otherwise Safari leaves stale navy tiles around the URL bar / home indicator that persist until refresh.
- **The face on dark**: the portrait develops on a soft light panel (`#face-panel`, radial gradient in style.css) with the original light-theme dot colors, then the panel recedes ~1s after the cube starts rebuilding (never leave the dark glow face alone on navy — the user explicitly hates that). Timing knobs: `SCENE_CONFIG.facePanel` and `morph.holdMs` (currently 6000). Desktop: the panel is a circle hugging the face at ~70% (the cube is right-shifted by the camera `panFrac 0.2`) — box `min(53vw, 69vh)`, ~15% wider than the original (user asked for wider edges). Mobile: now ALSO a circle (not a band-wide oval — the user called the oval "бедно"), centered at 42% of the band height (was 50% — it sat on the neck and the white edge "framed" the head; the user reported it Aug 5, fix pending his confirmation), size `min(94vw, 78vh)` — STRICTLY square box (both axes the SAME expression; `%` alone resolves against different container axes and stretches the circle into a portrait oval — the user called that "0 нолик, а не буква о"). A first attempt at `min(78vw, 64%)` was called "кружочек как пенис щенка". IMPORTANT: the desktop gradient must stay `ellipse 50% 50%` — `100%` fills the whole box and shows a square.
- **Proc-step labels stay plain orange on hover/active.**
- **Palettes**: `PALETTES.light` / `PALETTES.dark` in script.js (~line 442). The face "hologram" (light dots) is only ever seen mid-rebuild — panel logic in the hero `animate()`.
- **Intro**: navy screen, cyan cube explosion. Contraction `C.intro { scale: 10, delayMs: 2100, contractMs: 1400 }`, exit at 2800ms (~30% faster since Sep 12 2026; loader DUR 2450, hero stagger base 1610, cube expansion 1260ms). The intro fades WITH the cube still zooming out (handoff to the hero cube) — user loves this, keep it.
- **The "blue lines" bug is SOLVED**: it was the `#id-bar` (fixed top identity bar with navy text) getting stuck visible after the intro due to iOS scroll restoration. Two guards: `window.scrollTo(0,0)` when the intro lock releases, and a 250ms watchdog interval in the id-bar module (script.js ~line 173). Never remove the watchdog.
- Original white version lives in git history (commit 39d4c95). All post-dark-theme work is uncommitted. NEVER use `git reset --hard` (the user was warned; uncommitted work would be destroyed).
- `bugs/` folder: screenshots + claude_chat.md (history of failed attempts, useful context for the iOS lines bug).
- **Deploy prep done (uncommitted)**: `og-image.png` (1200×630, navy + hexagon watermark) + og/twitter meta; `theme-color` meta synced dynamically on theme toggle (light `#ffffff` / dark `#0a2540`); footer timezone removed (user doesn't want to maintain it); UA "Елісітація" → "Збір вимог"; cube-hint default text removed (lang.js fills it); privacy.html favicon paths fixed (files live in ROOT, not `favicons/`) — the page is intentionally always light (no dark pre-paint script). iOS theme-switch lines persist after 2-3 toggles (repaint retries at 150/450ms), reload clears — user says fine, don't chase it.

## Portfolio page — `portfolio.html` (LIVE — deployed to prod Sep 6 2026)

Separate page (not a section on index.html). Rationale: `#lower` has fragile theme-opposed inversion logic (`develop` IO module, one-way transition, scoped `.light` vars) — injecting a heavy gallery there risks breaking the tuned scroll choreography. A separate URL (`alisachenko.com/portfolio.html`) is also shareable to recruiters independently and is an SEO plus.

### Design decisions (locked)
- **Always dark** — no theme toggle, no pre-paint light script. Navy `#0a2540` background only. Blurred artifacts look far better on navy than on white.
- **"Redacted Vault" concept**: real artifact images are pre-blurred BY THE USER at export, shown near-sharp (blur(1px)) in the strip, and carry a mono-uppercase NDA stamp overlay (e.g. `NDA // SANITIZED`, `CONFIDENTIAL — STRUCTURE ONLY`) that only appears in the lightbox (see Status for the locked Sep 5 rule). Hexagon watermark optional. This is a feature, not a workaround — everything is under NDA, and the redaction signals "real work, not internet tutorials". Fits the existing design language perfectly.

### Design tokens (reuse from style.css)
| Token | Value |
|---|---|
| Background | `#0a2540` |
| Text | `#eaf2fc` (primary), `#9fb3c9` (muted) |
| Accent | `#ff5722` (orange) |
| Teal | `#22d3ee` (lines, connectors) |
| Lines/borders | `rgba(255,255,255,.14)` |
| Fonts | Inter 400–700; JetBrains Mono for stamps and captions |

Reuse patterns: `.hex` hexagon before headings, `.deco-line` above sections, mono uppercase with `letter-spacing: 0.12–0.18em` for small captions, pill-tags for artifact types (same `.domain-tags` / `.exp-tags` style).

### Layout
- **Desktop**: vertical card strip (each card = near-sharp preview image + title + type pill + 1-line description; NDA stamp only in the lightbox). Click opens full-view lightbox or expanded card.
- **Mobile**: same vertical stack, naturally responsive.
- **No split-pane** (list-left / preview-right) — overkill for 5–8 artifacts and breaks on mobile.
- **No filter UI** — with 5–8 items, filters look empty. Type pills on each card serve as visual categorization.
- Page flow: back-link (`.legal-back` pattern from privacy.html) → heading with intro paragraph (why everything is NDA, why that's a feature) → card strip → CTA block ("Want the full picture? Let's talk" + email/LinkedIn).

### Artifact content checklist
Each artifact needs: title (EN + UA), type (BPMN / UML / System Architecture / ERD / User Story Map / BRD-SRS / Wireframe / AI-agent flow), tool used, 1-sentence description (EN + UA), image (PNG/JPG, width ≥ 1600px so blur doesn't eat quality).

Currently: 10 artifacts delivered. Coverage: 4 BPMN, 1 UML/Sequence, 2 architecture (system + deployment), 1 data architecture/DWH, 2 AI-agent flows. Remaining types from the list to cover if desired:
1. BPMN process diagram
2. UML / sequence diagram
3. System architecture diagram
4. ERD / data model
5. User story map
6. BRD/SRS document (template spread)
7. Figma wireframes
8. AI-agent flow (ties to "AI-native execution" credo)

### i18n
Portfolio page MUST be bilingual like the rest of the site. Add keys to `I18N.en` and `I18N.uk` in `lang.js`. Include a lang-switch (EN/UA) on the page itself — same pattern as index.html.

### Navigation
- **From portfolio**: `.legal-back` link back to index.html (same pattern as privacy.html).
- **To portfolio from index**: lives FIRST in `.hero-contact .contact-links` (user reordered). LOCKED design (user decision): looks EXACTLY like Email/LinkedIn/GitHub — same mono uppercase, same accent-text hover colour. The ONE difference — his neon scanning beam UNDER the word: `::before` = faint orange base line, `::after` = bright gradient beam gliding left→right forever (`@keyframes neon-scan`, 3s ease-in-out, blur+drop-shadow), brightens on hover/:active. History: pill → rejected ("ні до місця") → my marching morse dashes → user reworked into the beam himself ("класніше"). Markup: `<a class="contact-portfolio"><span class="pf-word" data-i18n="nav.portfolio">…</span></a>` — ALL decorations live on the `.pf-word` span (inline-block, word-wide), NOT the anchor; `data-i18n` MUST stay on the span because lang.js writes `textContent` and would wipe a naive wrapper. The anchor's shared `::after` draw-in is killed with `display: none`. Touch: no static grey underline (beam is the affordance); reduced-motion parks the beam centred.
- **Mobile hero gotchas (all three bit us Aug 2026)**: (1) ≤900px Portfolio AND Services share one centred row via `order:1` (no `flex-basis:100%` anymore — both sit on the same line below Email/LinkedIn/GitHub); GOTCHA (historical): `flex-basis` beats `width` on the main axis, so `width:fit-content` alone never forced a wrap; keeping decorations on `.pf-word`/`.sv-word` is what keeps the beam word-wide. (2) In the ≤900px hero grid the `contact` row MUST be `auto`, not a fixed spacer track — with Portfolio+Services on a second line the content is ~2 rows tall and a fixed height overflows onto the CV button. (3) `--band-top` is a NO-JS FALLBACK ONLY (~16.3rem, assumes two contact lines); `pin()` in script.js measures the CTA's real bottom edge and overrides inline — don't "fix" layout by editing --band-top when JS runs.
- Update `sitemap.xml` to include portfolio.html.

### OG meta
Separate `og:image` and `og:description` for portfolio.html. Recruiters share links in messengers — the preview card matters. Title: "Portfolio — Anton Lisachenko". Consider a dedicated og-image with blurred artifacts and NDA stamp motif.

### Technical constraints — DO NOT TOUCH
- `index.html` intro, hero cube, `#lower` develop IO, theme toggle, id-bar watchdog — leave all untouched.
- `script.js` — portfolio page should NOT load script.js (it's tightly coupled to index.html's DOM). Portfolio gets its own lightweight JS file or inline `<script>`.
- `style.css` — reuse via `<link rel="stylesheet" href="style.css">` for base tokens (colors, fonts, `.hex`, `.deco-line`, `.reveal-blur`). Page-scoped styles go in a `<style>` block inside portfolio.html (same pattern as privacy.html).
- No frameworks, no build tools — vanilla HTML/CSS/JS only.

### Phases
| Phase | Who | What |
|---|---|---|
| 0 – Content | user | Collect 5–8 artifact images, write titles + descriptions EN/UA |
| 1 – Design | user (Figma) | Page mockup using tokens above (SKIPPED — AI built directly from existing style language) |
| 2 – Skeleton | AI | `portfolio.html`: head (always-dark, OG meta), back-link, static HTML with placeholder data array, lang-switch |
| 3 – Interactivity | AI | ~60 lines vanilla JS: card click → expanded view, NDA stamp animations |
| 4 – Polish | AI | Reveal-blur entrance animations, mobile responsive, link from index hero-contact, sitemap.xml update |

### Status (workflow: user exports real artifacts one-by-one; AI adds a card + lang.js keys each time. All 7 placeholder cards were REMOVED Sep 5 2026; now 10 real artifacts in 3 sections. **DEPLOYED to prod Sep 6 2026** — the deployed state is the source of truth, keep future cards consistent with it.)
- `portfolio.html` — full page: back-link + lang-switch top row, kicker `NDA //`, intro ("vault" framing), card strip (media left / text right on desktop ≥821px, stacked below), CTA block, footer. Lightbox = expanded view (image, type/tool pills, title, desc, note). Esc / backdrop / × close; body scroll lock; focus restore; reopen-race guarded by hideTimer.
- `artifacts/` — all 10 real exports here as PNG/JPG under kebab-case English names (`bpmn-annual-reporting.png`, `dwh-medallion.png`, …); leftover placeholder SVGs were deleted Sep 5. Source files user uploads keep Ukrainian names until renamed per convention (e.g. `Зведення балансу.png` → `bpmn-annual-reporting.png`).
- **Blur / NDA-stamp rule (user's Sep 5 design, base for all future cards)**: user pre-blurs each image export HIMSELF. BUT as of Aug 2026 the CSS blur was REMOVED entirely — `.pf-media img` and `.lb-media img` are both `filter: none` (double-blurring his pre-blurred exports read as "muddy"); the `transform: scale(1.09)` stays to hide the blur edge. Do NOT add any CSS blur back. The `.pf-stamp` overlay is `display:none` on strip cards (`.pf-strip .pf-stamp`) and ONLY appears in the lightbox, slamming in via `pf-stamp-in` (spring cubic-bezier, 0.18s delay after `.open`). The card's `.pf-stamp` element must stay in the HTML — JS copies its textContent into the lightbox stamp.
- Entrance is **keyframes-based** (`pf-develop`), NOT transitions — so the card's own fast hover transitions are untouched forever. Stagger via inline `style.animationDelay` (0/.09/.18s cycle). All entrance states gated under `html.js` (class added by a tiny head script) — no-JS visitors see the full page statically.
- **Sections (added Sep 6 2026)**: the strip is split into 3 groups by `.pf-section-head` (grid-column 1/-1): `01 // Process & Notation`, `02 // Architecture & Data`, `03 // AI in Practice` — styled like the page kicker (mono uppercase, `//` in accent orange, flex line filler using `var(--line)`). Keys live in `portfolio.sections.{process,data,ai}` EN+UA. Section heads are `.pf-reveal` too but get NO stagger delay (only `.pf-card` gets inline animationDelay). When adding a card, place it in the right section AND mirror the order in lang.js `items` for tidiness.
- i18n: all strings under `I18N.en.portfolio` / `I18N.uk.portfolio` in lang.js (+ `nav.portfolio` for the index link). Per-page `<title>` support added to lang.js: pages declare `<body data-title-key="portfolio.title">`; without it falls back to home `meta.title` as before.
- Index link: `.contact-portfolio` (first item) in `.hero-contact .contact-links` with inner `.pf-word` span — identical to sibling links + the neon scan beam under the word (see "To portfolio from index" above for the locked spec + mobile gotchas); rail captions wired (`see my work` / `мої кейси`). `.contact-links` wraps ≤900px (Portfolio + Services on their own centred row) and tightens gap ≤600px.
- sitemap.xml: portfolio.html added (priority 0.8), index lastmod bumped.
- TODOs: re-export at 1600×1000 (user's plan) — priority order: `dwh-medallion.png` (964×200, by far the worst), `general-schematic-diagram.png` (1158×784), `deployment-architecture.png` (1013×538), `bpmn-archive-extract.png` (1242×472); dedicated og-image with NDA-stamp motif (og:image currently reuses the main one); user review of layout/wording EN+UA (two AI reviews done Aug/Sep, copy finalized); optional docs artifacts (BRD/SRS spread, story map) if the types list needs filling.
- **Card inventory (10, Deployed)** — key: img → type · title · pills:
  1. `approval` — `sequence-diagram.png` → UML · Sequence · "Nomenclature Approval Flow" · GovTech
  2. `bpmn` — `bpmn-archives-admin.png` → BPMN · draw.io · "Institutions Registry — Admin Flow" · Healthcare
  3. `bpmn4` — `bpmn-archive-extract.png` → BPMN · draw.io · "Document Extracts — Order & Delivery" · GovTech
  4. `bpmn2` — `bpmn-annual-reporting.png` → BPMN · Miro · "Annual Reporting Flow" · Energy & Utilities
  5. `bpmn3` — `bpmn-deposit-publication.png` → BPMN · Miro · "Registry Records — Lifecycle & Publication" · Energy & Utilities
  6. `arch` — `general-schematic-diagram.png` → Architecture · "System Architecture" · SaaS
  7. `deploy` — `deployment-architecture.png` → Deployment · "Deployment Architecture" · SaaS
  8. `dwh` — `dwh-medallion.png` → Data Architecture · "Medallion Data Pipeline" · Blockchain & Crypto
  9. `agent` — `n8n-problem-radar.png` → AI Agents · "Problem Radar" · Automation
  10. `digest` — `n8n-news-digest.png` → AI Agents · "News Digest Bot" · Automation
  Sections: 01 Process & Notation = 1–5; 02 Architecture & Data = 6–8; 03 AI in Practice = 9–10.
- **GENERAL NDA rule — pilly are COVERS, NOT truth**: the domain pill on any card may be deliberately WRONG vs the real project (Healthcare on an archival-institutions flow, Energy & Utilities / Blockchain & Crypto as decoys for the same gov machinery). The user decides each cover; NEVER "correct" a pill back to the true domain, and NEVER put real project/realm hints into titles or descs. Real burning risk is domain-leakage via wording: the user caught AI twice ("archive/archivist", "deposits/mining" flavour) — titles/descs must read neutral (registry, documents, records, extracts) so no single card fingerprints the client.
- **I can't see images** (no image input in this model): descriptions are written from the user's text specs and the sidecar .drawio XMLs (still saved under `/var/folders/.../T/opencode/` if needed). A second AI reviewed the exported PNGs visually (Aug 2026) and found `Django IVPublishService + DataBridge` and a `lagacy` typo readable on `dwh-medallion.png` — cosmetic, not client-identifying; user may re-blur later.
- **Copy conventions (final)**: EN statuses WITHOUT guillemets (Approved, Submitted, Draft→Active), UA keeps «…». UA has no comma before an em-dash pairing. bpmn2/bpmn4 show tool in the type pill (`BPMN · Miro`, `BPMN · draw.io`). dwh is the one card that deliberately reveals real tech (Apache Superset + Power BI) — user asked for it, keep the rest of its stack hidden.

## User preferences
- Baby steps; never rush a big refactor unprompted.
- No white-background box behind the face, no photo inversion, no "slide up" intro exit (called cheap).
- Face reveal = "developing photo" feel. The dark face is a work-in-progress; ask the user before changing it.
