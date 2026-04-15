# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Is

This is the **Advuman landing page** — `app.html` is a single-file web application serving as the primary marketing and conversion surface for [advuman.com](https://advuman.com).

**Advuman** is a trade risk intelligence platform. It monitors 24+ OSINT sources per corridor daily, classifies signals across three pressure layers (Regulatory / Logistics / Cost), and produces corridor health states plus weekly intelligence briefs for UK SMEs trading with the Global South (India, Egypt, Vietnam).

**Primary audience:** UK SMEs actively importing/exporting on the UK–India or UK–Egypt corridor.  
**Primary CTA:** Book a 15-minute call (Calendly popup).  
**Secondary CTA:** Email waitlist signup.

This codebase was refactored from a Bitcoin signal app (whentobuybtc.xyz). The canvas animation engine, lerpSignal system, and data-fetching architecture were preserved and repurposed. See the architecture notes below.

---

## File Overview

- **`app.html`** — The entire application: inline CSS (`<style>`), HTML structure, and inline `<script>`. All logic lives here. ~1,800+ lines.
- **`script.js`** — Umami analytics (sourced from `umami-orange.up.railway.app`). Do not edit.
- **`css2`** — Cached Google Fonts CSS (Inter).
- **`s/`** — Cached Google Fonts `.ttf` files.

---

## Architecture of `app.html`

### Section Map (DOM order)

| # | Section | Key CSS class / ID |
| --- | --- | --- |
| 0 | Nav | `.nav` |
| 1 | Hero + Corridor Health Globe | `#hero`, `#canvas`, `.signal-display` |
| 2 | Corridor Status Strip | `.corridor-strip` |
| 3 | Cost of Surprise | `.cost-section` |
| 4 | How It Works | `.how-it-works` |
| 5 | Hormuz Proof Timeline | `.hormuz-timeline` |
| 6 | What You Get | `.product-features` |
| 7 | Corridor Health States | `.health-states` |
| 8 | The Maths (ROI) | `.roi-section` |
| 9 | Pricing | `.pricing` |
| 10 | CETA Block | `.ceta-block` |
| 11 | Getting Started | `.onboarding` |
| 12 | Final CTA | `.final-cta` |
| 13 | Footer | `footer` |

---

### Data Fetching

All calls go to relative `/api/...` endpoints (requires the live host or a local proxy). The page falls back to hardcoded stub data when these endpoints fail — the corridor health globe defaults to `ACTIVE` state.

| Endpoint | Description | Response Shape |
| --- | --- | --- |
| `/api/corridor-status` | Current health state for all corridors | `{ corridors: [{ id, state, score, updated }] }` |
| `/api/signals` | Recent signal log | `{ signals: [{ date, type, severity, description, impact }] }` |
| `/api/alerts` | Early warning alerts | `{ alerts: [{ id, date, corridor, title, severity }] }` |
| `/api/corridor-history` | Weekly composite scores for sparkline | `{ history: [{ corridor, week, score, state }] }` |
| `/api/visitor-count` | Visitor counter | `{ count: number }` |
| `/api/subscribe` | POST — email waitlist signup | Body: `{ email, corridor, tier }` → 201 or error |

**Corridor IDs:** `uk-india` | `uk-egypt` | `uk-vietnam` (Vietnam: paused)

**Stub fallback** (hardcoded when API unavailable):

```javascript
const STUB_CORRIDOR_STATUS = {
  corridors: [
    { id: 'uk-india', state: 'ACTIVE', score: 55.25, updated: '2026-04-07' },
    { id: 'uk-egypt', state: 'WATCH',  score: 11.0,  updated: '2026-04-07' }
  ]
};
```

Update this stub manually when the API is not deployed.

---

### Corridor Health Signal System

The signal system drives the corridor health globe animation. Four states:

| State | Meaning | Hex | Sphere Behavior |
| --- | --- | --- | --- |
| `ACTIVE` | Material risk — act now | `#ff3b3b` | Fast particles, aggressive ring arcs, red pulse |
| `WATCH` | Signal detected — monitor | `#ffd700` | Medium pulse, amber glow |
| `STABLE` | Normal conditions | `#00c896` | Slow rotation, cool teal glow |
| `RECOVERY` | Returning to normal | `#4488ff` | Blue-green settling |

The globe displays the **highest-severity active corridor state** (e.g., if UK–India is ACTIVE and UK–Egypt is WATCH, the globe shows ACTIVE).

**Key function: `updateSignal()`** — Fetches `/api/corridor-status`, calls `setCorridorState(state)`, falls back to stub on error.

**Key function: `lerpSignal(dt)`** — Smoothly interpolates current color/particle targets toward the target state values each animation frame. Do not rewrite this — it's the original animation engine repurposed.

**Color targets** (defined in `COLOR_TARGETS` object near the top of the script):

```javascript
const COLOR_TARGETS = {
  ACTIVE:   { r: 255, g: 59,  b: 59,  glow: 1.0, particleSpeed: 1.8, ringIntensity: 1.0 },
  WATCH:    { r: 255, g: 215, b: 0,   glow: 0.7, particleSpeed: 1.2, ringIntensity: 0.6 },
  STABLE:   { r: 0,   g: 200, b: 150, glow: 0.4, particleSpeed: 0.6, ringIntensity: 0.3 },
  RECOVERY: { r: 68,  g: 136, b: 255, glow: 0.5, particleSpeed: 0.8, ringIntensity: 0.4 }
};
```

---

### Canvas Animation

The `<canvas id="canvas">` element renders the corridor health globe. Architecture:

- **3D sphere** with depth-shaded surface points
- **Ring arcs** that respond to signal intensity
- **Star field** background
- **Energy particles** with velocity driven by `particleSpeed`
- **Depth blur** post-processing pass
- **`lerpSignal(dt)`** interpolates toward `COLOR_TARGETS[currentState]` each frame

Do NOT add new canvas render passes unless you understand the existing layering order. The render loop is in `animate()`, called via `requestAnimationFrame`.

---

### Conversion Components

**Calendly popup:**

```javascript
// Loaded lazily 3s after page load
function loadCalendly() {
  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  document.head.appendChild(script);
}
// CTAs call:
Calendly.initPopupWidget({ url: CALENDLY_URL });
```

`CALENDLY_URL` is defined as a constant near the top of the script. Update it when Arush's Calendly link changes.

**Email waitlist form:**

- Located in `#waitlist-form`
- POSTs to `/api/subscribe` with `{ email, corridor, tier: 'waitlist' }`
- On success: shows `.waitlist-success` message
- On failure / API unavailable: falls back to mailto link or Tally embed URL defined in `TALLY_FALLBACK_URL`

---

### Hormuz Timeline Animation

The timeline in Section 5 uses IntersectionObserver to trigger entry animations as the user scrolls. Each `.timeline-event` element gets the class `visible` when it enters the viewport. CSS `@keyframes fadeSlideIn` handles the reveal.

Do not use JavaScript animation libraries here — keep it CSS-driven.

---

### Analytics

`script.js` loads Umami analytics from `umami-orange.up.railway.app`. This is passively included and does not affect functionality. If the Railway instance goes down, analytics stop but the page continues to function.

---

## Running Locally

Open `app.html` directly in a browser. The page renders and animates fully in stub mode (no backend required). The corridor health globe will show ACTIVE state (UK–India hardcoded).

To test live data rendering:

1. A reverse proxy forwarding `/api/` to the live Advuman backend, or
2. Mock responses from a local HTTP server (e.g., `python3 -m http.server 8080` + stub endpoint)

No build step required. Edit `app.html` and reload.

---

## How to Update Corridor Health States Manually

When the live API is not deployed, update the stub in the script block:

```javascript
// Search for: STUB_CORRIDOR_STATUS
// Update the state values:
const STUB_CORRIDOR_STATUS = {
  corridors: [
    { id: 'uk-india', state: 'ACTIVE', score: 55.25, updated: '2026-04-07' },
    { id: 'uk-egypt', state: 'WATCH',  score: 11.0,  updated: '2026-04-07' }
  ]
};
```

Also update the live status strip text in the HTML:

```html
<!-- Search for: corridor-status-strip -->
<span class="corridor-badge active">UK–India: ACTIVE</span>
<span class="corridor-badge watch">UK–Egypt: WATCH</span>
<span class="status-updated">Updated 07 Apr 2026</span>
```

---

## Content Update Guide

**To update pricing:** Search for `<!-- PRICING SECTION -->` in the HTML. Update the `£` figures in the `.pricing-card` elements.

**To update the Hormuz proof timeline:** Search for `<!-- HORMUZ TIMELINE -->`. Each event is a `.timeline-event` div with `data-date` attribute and a `.event-description` inner element.

**To add a new corridor:**

1. Add to `STUB_CORRIDOR_STATUS` with initial state
2. Add a new `.corridor-pill` in the corridor strip HTML
3. The globe automatically picks up the highest-severity state

**To change the Calendly URL:** Update `const CALENDLY_URL` near the top of the script block.

**To change the waitlist fallback URL (Tally/Typeform):** Update `const TALLY_FALLBACK_URL` near the top of the script block.

---

## What NOT to Do

- **Don't add a build system.** This is intentionally a single-file, no-dependency page. Edit and reload.
- **Don't split the CSS or JS into separate files** unless you're willing to update the deployment pipeline.
- **Don't add React, Vue, or any component framework.** The canvas animation is vanilla JS and must stay that way.
- **Don't rewrite `lerpSignal()`** unless you fully understand the interpolation math. It drives the entire globe animation.
- **Don't hardcode specific dates** in the hero stats (the "3 days" etc. are product claims, not tied to a specific date). Exception: the Hormuz timeline uses specific dates — those are fixed historical facts.
- **Don't remove the stub fallback.** The page must function without a backend.
