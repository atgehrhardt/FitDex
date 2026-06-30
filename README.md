# FitDex

**Train hard. Roll monsters. Battle champions.**

FitDex is a workout app that doubles as a Pokémon-style monster collector. Log your workouts to earn gacha rolls, catch monsters, merge duplicates to level them up, and battle wild opponents.

## Features

- **Workout Logging** — Track cardio, strength, flexibility, HIIT, and sports sessions with duration and intensity (1–5)
- **Monster Rolls** — Earn rolls based on workout length and intensity; higher intensity improves rare monster odds
- **Collection** — 27 unique monsters across 7 elements and 5 rarity tiers
- **Merge & Level Up** — Combine 3 duplicates (same species + level) into a stronger higher-level monster (up to Lv.10)
- **Turn-Based Battles** — Fight wild monsters with type advantages, attack, special, and defend actions
- **Secure Accounts** — Free email/password auth via Supabase (PKCE, row-level security, cloud saves)
- **Persistent Progress** — Cloud sync when signed in; local-only fallback when Supabase is not configured

## Getting Started

```bash
npm install
cp .env.example .env.local   # optional — for cloud auth locally
npm run dev
```

Open http://localhost:5173 in your browser.

## Secure accounts (Supabase — free tier)

GitHub Pages is static-only, so auth runs through [Supabase Auth](https://supabase.com) (free tier). Passwords are hashed server-side; game saves use **Row Level Security** so each user can only read/write their own data.

### One-time Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. **SQL Editor** → paste and run [`supabase/schema.sql`](supabase/schema.sql)
3. **Authentication → Providers → Email** — keep enabled; turn **Confirm email** ON (recommended)
4. **Authentication → URL Configuration**:
   - **Site URL:** `https://YOUR_USERNAME.github.io/FitDex/`
   - **Redirect URLs:** `https://YOUR_USERNAME.github.io/FitDex/**` and `http://localhost:5173/**`
5. **Project Settings → API** — copy the **Project URL** and **anon public** key

### GitHub Actions secrets (production deploy)

In the repo: **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|--------|--------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase **anon** (public) key |

> **Security:** The anon key is safe in the client — it is designed to be public. **Never** commit the `service_role` key; it bypasses RLS.

### Local development

Create `.env.local` (gitignored) from `.env.example` with the same two variables.

## Live Demo (GitHub Pages)

After merging to `main`, the app deploys automatically via GitHub Actions to:

**https://atgehrhardt.github.io/FitDex/**

### One-time repo setup

1. Go to **Settings → Pages** in the GitHub repo
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Merge this PR to `main` (or push to `main`) — the workflow builds and deploys on every push
4. You can also trigger a deploy manually from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

Uses GitHub-hosted runners (free for public repos) — no self-hosted runner required.

## How It Works

| Workout Type | Rolls Formula |
|---|---|
| Cardio | 1 roll per 10 min |
| Strength | 1 roll per 15 min |
| Flexibility | 1 roll per 20 min |
| HIIT | 1 roll per 8 min |
| Sports | 1 roll per 12 min |

Intensity adds bonus rolls and shifts gacha odds toward rare/legendary monsters.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand (state + optional local cache)
- Supabase Auth + PostgreSQL (accounts & cloud saves, free tier)

## Build

```bash
npm run build
npm run preview
```
