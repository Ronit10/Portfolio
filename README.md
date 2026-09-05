# Ronit Gupta — Portfolio

A 3D personal portfolio for **Ronit Gupta**, Salesforce Software Engineer and AI / Agentic systems builder.

Positioning: platform depth (Apex, Flows, LWC, integrations) is the foundation; the **MCP servers that let AI agents drive Salesforce business processes** are the differentiator. Every fact on the site comes from the resume — see [Content rules](#content-rules).

---

## Run it locally

```bash
cd portfolio
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` only |

Requires Node 18+ (built and verified on Node 24).

---

## Stack

| Layer | Choice |
| --- | --- |
| Build | Vite 5 |
| UI | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS 3 with a custom token layer |
| 3D | Three.js + React Three Fiber + a little Drei |
| Motion | Framer Motion |
| Icons | Lucide |

No UI kit, no animation-preset library, no state manager — the whole design system is `tailwind.config.js` plus `src/styles/index.css`.

---

## Project structure

```
portfolio/
├── index.html                 # SEO meta, Open Graph, JSON-LD Person, noscript fallback
├── public/
│   ├── favicon.svg            # gradient "R" monogram
│   └── og-image.png           # 1200×630 social card
├── src/
│   ├── data/profile.ts        # ← SINGLE SOURCE OF TRUTH (all resume content)
│   ├── hooks/index.ts         # media queries, active section, scroll lock, scene quality
│   ├── styles/index.css       # tokens, component classes, reduced-motion rules
│   ├── three/                 # HeroScene, Core, Orbits, Particles, shaders
│   ├── components/            # Navbar, Loader, Button, TiltCard, Reveal, Footer, …
│   ├── sections/              # Hero, About, Skills, Experience, Projects,
│   │                          #   Approach, Credentials, Contact
│   ├── App.tsx
│   └── main.tsx
└── vite.config.ts             # manual chunking: three.js stays off the critical path
```

### Editing content

**Change `src/data/profile.ts` — nothing else.** Every section reads from it: name, headline, socials, skills, experience, projects, certifications, achievements, education, and the "Approach" claims. Sections render from arrays, so adding a project or a certification is a one-object edit.

Two conveniences built into that file:

- Any social entry with an empty `href` is filtered out of the UI automatically (`linkedSocials`).
- Each "Approach" card carries an `evidence` string — the resume line that backs the claim — and it renders as the card's footnote. If you add a claim, add its evidence.

---

## What's implemented

**3D hero.** A faceted core wrapped in two counter-rotating wireframe cages (azure = platform, violet = agentic), three tilted orbits of lit technology nodes, a light packet travelling the inner ring, a 1,300-point starfield and an infinite grid floor. The camera — not the subject — follows the pointer, damped, so the composition never drifts.

**Performance.** The scene is chosen per device by `useSceneQuality()` (device memory, core count, viewport, reduced-motion):

| Tier | Behaviour |
| --- | --- |
| `high` | 3 orbits, 1,300 particles, grid floor, antialias, DPR ≤ 1.75 |
| `low` | 2 orbits, 420 particles, no grid, no antialias, DPR ≤ 1.25 |
| `off` | No WebGL context created at all — CSS hero visual instead |

Plus: the whole three.js stack is `React.lazy`-loaded *after* the hero text paints; the render loop stops (`frameloop="never"`) once the hero scrolls out of view; `AdaptiveDpr` drops resolution under load; glow is faked with a fresnel shader and one shared 64px canvas sprite rather than a post-processing bloom pass; delta is clamped so a backgrounded tab never jumps the scene on return.

**Accessibility.** Skip link is the first tab stop. Visible 2px focus ring on every control. Project dialog traps Tab, closes on Escape, and returns focus to the card that opened it. Reduced motion disables the 3D scene, scroll reveals, parallax, marquee, cursor light and the loader — not just CSS transitions. Text contrast measured against the page background: 17.4:1 / 8.6:1 / 5.5:1, all clear of WCAG AA.

**SEO.** Semantic sectioning, single `h1`, no heading-level jumps, descriptive title and meta description, Open Graph + Twitter card with a real 1200×630 PNG, JSON-LD `Person`, and a `<noscript>` block carrying the core profile text.

**Responsive.** Verified with no horizontal overflow at 1440, 1280, 834 and 390 px.

---

## Content rules

`src/data/profile.ts` is the single source of truth, and it is resume-only. No job, company, client, certification, award, technology, metric, project outcome or date has been invented.

Two things are stated plainly on the site rather than glossed over:

- **The contact form has no backend.** It validates input and opens the visitor's own mail client with the message pre-filled (`mailto:`). The UI says so directly under the button. To make it actually send, swap the `submit` handler in `src/sections/Contact.tsx` for a Formspree / Resend / Web3Forms call.
- **Neither project has a public repo or demo**, so the case-study dialog says "Built inside a private Salesforce org — no public repository or demo link available." Add entries to a project's `links` array and buttons appear.

Because the resume ships no screenshots, each project card carries a hand-drawn SVG schematic of what the project actually does (prompt → MCP tools → Salesforce; and the five related custom objects) instead of stock imagery. They cost nothing to download and they carry real information.

---

## Deploying

The build is fully static and `base: './'`, so it works from a domain root or a sub-path.

```bash
npm run build      # → dist/
```

Drop `dist/` on Netlify, Vercel, Cloudflare Pages or GitHub Pages.

**Before going live**, update the absolute URLs in `index.html` — `<link rel="canonical">`, `og:url` — which currently point at the placeholder `https://ronitgupta.dev/`. They must be absolute for Open Graph to resolve the social card.
