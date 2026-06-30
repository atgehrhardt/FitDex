# FitDex

**Train hard. Roll monsters. Battle champions.**

FitDex is a workout app that doubles as a Pokémon-style monster collector. Log your workouts to earn gacha rolls, catch monsters, merge duplicates to level them up, and battle wild opponents.

## Features

- **Workout Logging** — Track cardio, strength, flexibility, HIIT, and sports sessions with duration and intensity (1–5)
- **Monster Rolls** — Earn rolls based on workout length and intensity; higher intensity improves rare monster odds
- **Collection** — 27 unique monsters across 7 elements and 5 rarity tiers
- **Merge & Level Up** — Combine 3 duplicates (same species + level) into a stronger higher-level monster (up to Lv.10)
- **Turn-Based Battles** — Fight wild monsters with type advantages, attack, special, and defend actions
- **Persistent Progress** — All data saved locally in your browser

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

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
- Zustand (state + localStorage persistence)

## Build

```bash
npm run build
npm run preview
```
