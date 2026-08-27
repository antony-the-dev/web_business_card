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
- **"Tap the cube" hint** (`.cube-hint`): fades on tap and stays hidden for the session (matches `heroTapped` in sessionStorage). No 8s return — the user called the return "blinking". The tap handler also sets an INLINE opacity so the entrance module's reveal guard (which force-sets `opacity:1` 900ms after reveal when a transition parks) can never re-show it — the guard skips `.is-tapped` elements. Both guards are required.
- **Pill buttons (expertise/domain tags) — one unified style, REVERSE on hover**: default = plain pill (`1px var(--line)` border, `var(--ink)` text, transparent bg, 0.85rem); hover/active swaps the fill to the opposite of the background — navy bottoms: white fill + navy `#0a2540` text; white bottoms (`html:not(.dark) #lower` and `html.dark #lower.light`): navy fill + white text — PLUS a thin orange ring (`box-shadow: 0 0 0 2px var(--accent)`) around the pill in both themes. Exactly the `.cv-btn` inversion idea but in the plain pill look. The swap starts after a 0.2s delay and animates over 0.2s (the user loves the delayed highlight; release is immediate). NO neon glow, NO orange text, NO gradient borders — all tried and rejected ("i have no words"). The `.cv-btn` (Download CV) stays UNIQUE.
- **Theme toggle on iOS**: after flipping the theme, a forced `translateZ(0)` repaint on body is required — otherwise Safari leaves stale navy tiles around the URL bar / home indicator that persist until refresh.
- **The face on dark**: the portrait develops on a soft light panel (`#face-panel`, radial gradient in style.css) with the original light-theme dot colors, then the panel recedes ~1s after the cube starts rebuilding (never leave the dark glow face alone on navy — the user explicitly hates that). Timing knobs: `SCENE_CONFIG.facePanel` and `morph.holdMs` (currently 6000). Desktop: the panel is a circle hugging the face at ~70% (the cube is right-shifted by the camera `panFrac 0.2`) — box `min(53vw, 69vh)`, ~15% wider than the original (user asked for wider edges). Mobile: now ALSO a circle (not a band-wide oval — the user called the oval "бедно"), centered at 42% of the band height (was 50% — it sat on the neck and the white edge "framed" the head; the user reported it Aug 5, fix pending his confirmation), size `min(94vw, 78vh)` — STRICTLY square box (both axes the SAME expression; `%` alone resolves against different container axes and stretches the circle into a portrait oval — the user called that "0 нолик, а не буква о"). A first attempt at `min(78vw, 64%)` was called "кружочек как пенис щенка". IMPORTANT: the desktop gradient must stay `ellipse 50% 50%` — `100%` fills the whole box and shows a square.
- **Proc-step labels stay plain orange on hover/active.**
- **Palettes**: `PALETTES.light` / `PALETTES.dark` in script.js (~line 442). The face "hologram" (light dots) is only ever seen mid-rebuild — panel logic in the hero `animate()`.
- **Intro**: navy screen, cyan cube explosion. Contraction `C.intro { scale: 10, delayMs: 3000, contractMs: 2000 }`, exit at 4000ms. The intro fades WITH the cube still zooming out (handoff to the hero cube) — user loves this, keep it.
- **The "blue lines" bug is SOLVED**: it was the `#id-bar` (fixed top identity bar with navy text) getting stuck visible after the intro due to iOS scroll restoration. Two guards: `window.scrollTo(0,0)` when the intro lock releases, and a 250ms watchdog interval in the id-bar module (script.js ~line 173). Never remove the watchdog.
- Original white version lives in git history (commit 39d4c95). All post-dark-theme work is uncommitted. NEVER use `git reset --hard` (the user was warned; uncommitted work would be destroyed).
- `bugs/` folder: screenshots + claude_chat.md (history of failed attempts, useful context for the iOS lines bug).
- **Deploy prep done (uncommitted)**: `og-image.png` (1200×630, navy + hexagon watermark) + og/twitter meta; `theme-color` meta synced dynamically on theme toggle (light `#ffffff` / dark `#0a2540`); footer timezone removed (user doesn't want to maintain it); UA "Елісітація" → "Збір вимог"; cube-hint default text removed (lang.js fills it); privacy.html favicon paths fixed (files live in ROOT, not `favicons/`) — the page is intentionally always light (no dark pre-paint script). iOS theme-switch lines persist after 2-3 toggles (repaint retries at 150/450ms), reload clears — user says fine, don't chase it.

## Portfolio page — `portfolio.html` (in progress)

Separate page (not a section on index.html). Rationale: `#lower` has fragile theme-opposed inversion logic (`develop` IO module, one-way transition, scoped `.light` vars) — injecting a heavy gallery there risks breaking the tuned scroll choreography. A separate URL (`alisachenko.com/portfolio.html`) is also shareable to recruiters independently and is an SEO plus.

### Design decisions (locked)
- **Always dark** — no theme toggle, no pre-paint light script. Navy `#0a2540` background only. Blurred artifacts look far better on navy than on white.
- **"Redacted Vault" concept**: every artifact image has `filter: blur(8px)` + a mono-uppercase NDA stamp overlay (e.g. `NDA // SANITIZED`, `CONFIDENTIAL — STRUCTURE ONLY`). Hexagon watermark optional. This is a feature, not a workaround — everything is under NDA, and the blur signals "real work, not internet tutorials". Fits the existing design language perfectly.

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
- **Desktop**: vertical card strip (each card = blurred preview image + NDA stamp overlay + title + type pill + 1-line description). Click opens full-view lightbox or expanded card.
- **Mobile**: same vertical stack, naturally responsive.
- **No split-pane** (list-left / preview-right) — overkill for 5–8 artifacts and breaks on mobile.
- **No filter UI** — with 5–8 items, filters look empty. Type pills on each card serve as visual categorization.
- Page flow: back-link (`.legal-back` pattern from privacy.html) → heading with intro paragraph (why everything is NDA, why that's a feature) → card strip → CTA block ("Want the full picture? Let's talk" + email/LinkedIn).

### Artifact content checklist
Each artifact needs: title (EN + UA), type (BPMN / UML / System Architecture / ERD / User Story Map / BRD-SRS / Wireframe / AI-agent flow), tool used, 1-sentence description (EN + UA), image (PNG/JPG, width ≥ 1600px so blur doesn't eat quality).

Target: 5–8 artifacts. Types to cover:
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
- **Mobile hero gotchas (all three bit us Aug 2026)**: (1) ≤900px the anchor gets `order:1; flex-basis:100%; text-align:center` so Portfolio wraps onto its OWN centred row below Email/LinkedIn/GitHub — GOTCHA: `flex-basis` beats `width` on the main axis, so the earlier `width:fit-content` hack did nothing (word stuck left + beam across the whole screen); keeping decorations on `.pf-word` is what keeps the beam word-wide. (2) In the ≤900px hero grid the `contact` row MUST be `auto`, not a fixed spacer track — with Portfolio on a second line the content is ~2 rows tall and a fixed height overflows onto the CV button. (3) `--band-top` is a NO-JS FALLBACK ONLY (~16.3rem, assumes two contact lines); `pin()` in script.js measures the CTA's real bottom edge and overrides inline — don't "fix" layout by editing --band-top when JS runs.
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

### Status (built Aug 23 2026 — Phases 2+3+4 done, pending user review + real content)
- `portfolio.html` — full page: back-link + lang-switch top row, kicker `NDA //`, intro ("vault" framing), 8 static cards (media left / text right on desktop ≥821px, stacked below), CTA block, footer. Lightbox = expanded view (same blurred image, type/tool pills, title, desc, note). Esc / backdrop / × close; body scroll lock; focus restore; reopen-race guarded by hideTimer.
- `artifacts/*.svg` — 8 hand-crafted PLACEHOLDER diagrams in the site palette (navy panel #0d2b4c, teal/orange strokes, fake-text bars instead of readable words). Swap with real PNG/JPG exports by replacing `src` paths — nothing else changes. Blur: `filter: blur(9px)` + `transform: scale(1.09)` inside `overflow:hidden` (scale hides the transparent blur fringe).
- Entrance is **keyframes-based** (`pf-develop`), NOT transitions — so the card's own fast hover transitions are untouched forever. Stagger via inline `style.animationDelay` (0/.09/.18s cycle). NDA stamp slams in (`pf-stamp-in`, spring cubic-bezier) at .55s after its card reveals. All entrance states gated under `html.js` (class added by a tiny head script) — no-JS visitors see the full page statically.
- i18n: all strings under `I18N.en.portfolio` / `I18N.uk.portfolio` in lang.js (+ `nav.portfolio` for the index link). Per-page `<title>` support added to lang.js: pages declare `<body data-title-key="portfolio.title">`; without it falls back to home `meta.title` as before.
- Index link: `.contact-portfolio` (first item) in `.hero-contact .contact-links` with inner `.pf-word` span — identical to sibling links + the neon scan beam under the word (see "To portfolio from index" above for the locked spec + mobile gotchas); rail captions wired (`see my work` / `мої кейси`). `.contact-links` wraps ≤900px (Portfolio own centred row) and tightens gap ≤600px.
- sitemap.xml: portfolio.html added (priority 0.8), index lastmod bumped.
- TODOs: replace placeholder SVGs with real artifact exports (≥1600px wide); dedicated og-image with NDA-stamp motif (og:image currently reuses the main one); user review of layout/wording EN+UA.
- First REAL artifact swapped in (Aug 24): card #7 `artifacts/wireframes-mobile.svg` → `artifacts/sequence-diagram.png` (user's own edit). i18n key renamed `wireframe` → `approval` (EN+UK texts are NDA-sanitized: no role names / registry names / product names from the source doc — only interaction shape + generic tech breadth). Second pill = `GovTech` (tool unknown; ask user which tool exported the PNG and swap the pill text). PNG is 1113×857 — below the 1600px guideline but acceptable under blur(9px)+cover (lightbox caps at ~980px wide); re-export wider if convenient.

## User preferences
- Baby steps; never rush a big refactor unprompted.
- No white-background box behind the face, no photo inversion, no "slide up" intro exit (called cheap).
- Face reveal = "developing photo" feel. The dark face is a work-in-progress; ask the user before changing it.
