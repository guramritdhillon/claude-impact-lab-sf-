# One Ahead

**Connecting people mid-transition with the near-peers just ahead of them — so hard-won knowledge moves sideways through a community.**

Built for the Claude Impact Lab Hackathon · Community & Engagement track.

---

## What it is

People whose work is shifting under AI often can't reach the help that matters most. The knowledge isn't missing — it's held by people slightly ahead of them, with no warm, low-stakes way to reach those people. One Ahead matches a person mid-transition with a **near-peer** who made the same jump a few months ago, in small circles that meet over Zoom or in person. Guides earn **AI credits** for helping, which they can spend on their own learning or pool to sponsor access for the community they host.

## Running it

You need Node.js 18+.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

### Live Claude matching

The intake sends the person's own words to Claude, which picks the best guide, explains the fit, and suggests where to start.

- **Inside the Claude.ai artifact:** this runs on Claude automatically, no key needed.
- **Running your own copy (this repo):** browsers can't call Claude without a key. Open the ⚙️ settings sheet in the app and paste an Anthropic API key to enable live matching (held in memory only, for the demo). For production you'd route calls through a small server-side proxy so the key never ships to the browser.
- **If no key is present or a call fails,** the app falls back to a local keyword-and-topic match, so **the demo never breaks** — you just won't see the "Matched live by Claude" badge.

## Demo script (~90 seconds)

1. **Match** tab: as a learner, type a real situation (e.g. "my job's going digital and I write emails all day"), pick what you want help with, and tap *Find my person*. Claude matches you to a guide and explains why.
2. Join their circle → "You're in."
3. Flip the top toggle to **I'm one ahead** and watch that guide's AI-credit balance and "people helped" tick up. Try **Host a new circle** to publish one.
4. **Ideas** tab: browse real ways people use AI, filterable by category.
5. **Join** tab: apply as a mentor — pick your background, say why you want to help. The confirmation explains how guiding stays selective without being exclusive.
6. **About** tab: the idea, who it's for, and how credits work (earn, spend, or pool for your community).

## What's real vs. faked

Real: the four-tab app, Claude-powered matching, the credits mechanic, the host-a-circle flow, the mentor application, the anonymized-feedback insight, persona switching. Faked for the prototype: accounts, real scheduling, and the rating-gated payout (modeled, not enforced).

## Stack

React + Vite. Single self-contained component (`src/OneAhead.jsx`). In-memory state, no backend.
