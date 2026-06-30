import type { ElementType, MonsterSpecies, Rarity } from '../types'

export const MONSTER_SPECIES: MonsterSpecies[] = [
  // Common
  { id: 'emberpup', name: 'Emberpup', element: 'fire', rarity: 'common', description: 'A fiery pup that warms up with every sprint.', baseStats: { hp: 45, atk: 52, def: 38, spd: 48 } },
  { id: 'droplet', name: 'Droplet', element: 'water', rarity: 'common', description: 'Born from sweat drops after a long swim.', baseStats: { hp: 50, atk: 42, def: 45, spd: 40 } },
  { id: 'leaflet', name: 'Leaflet', element: 'grass', rarity: 'common', description: 'Sprouts stronger after yoga sessions.', baseStats: { hp: 48, atk: 44, def: 46, spd: 42 } },
  { id: 'sparkbit', name: 'Sparkbit', element: 'electric', rarity: 'common', description: 'Crackles with energy from HIIT circuits.', baseStats: { hp: 42, atk: 50, def: 35, spd: 55 } },
  { id: 'pebble', name: 'Pebble', element: 'earth', rarity: 'common', description: 'Hardened by heavy lifting sessions.', baseStats: { hp: 55, atk: 40, def: 55, spd: 30 } },
  { id: 'gloomlet', name: 'Gloomlet', element: 'shadow', rarity: 'common', description: 'Feeds on early-morning workout dread.', baseStats: { hp: 44, atk: 48, def: 40, spd: 46 } },
  { id: 'gleam', name: 'Gleam', element: 'light', rarity: 'common', description: 'Shines brightest after a personal best.', baseStats: { hp: 46, atk: 46, def: 42, spd: 44 } },

  // Uncommon
  { id: 'flamewolf', name: 'Flamewolf', element: 'fire', rarity: 'uncommon', description: 'Runs hot after marathon training.', baseStats: { hp: 58, atk: 65, def: 48, spd: 62 } },
  { id: 'tidalynx', name: 'Tidalynx', element: 'water', rarity: 'uncommon', description: 'Glides through laps like a predator.', baseStats: { hp: 62, atk: 55, def: 58, spd: 52 } },
  { id: 'thornback', name: 'Thornback', element: 'grass', rarity: 'uncommon', description: 'Its spines grow after stretching routines.', baseStats: { hp: 60, atk: 58, def: 62, spd: 45 } },
  { id: 'voltfox', name: 'Voltfox', element: 'electric', rarity: 'uncommon', description: 'Bursts with speed from box jumps.', baseStats: { hp: 52, atk: 68, def: 42, spd: 72 } },
  { id: 'boulder', name: 'Boulder', element: 'earth', rarity: 'uncommon', description: 'Immovable after deadlift day.', baseStats: { hp: 72, atk: 52, def: 75, spd: 28 } },
  { id: 'shadebat', name: 'Shadebat', element: 'shadow', rarity: 'uncommon', description: 'Strikes from the shadows of night runs.', baseStats: { hp: 54, atk: 64, def: 48, spd: 68 } },

  // Rare
  { id: 'infernox', name: 'Infernox', element: 'fire', rarity: 'rare', description: 'A blazing beast forged in interval sprints.', baseStats: { hp: 72, atk: 82, def: 58, spd: 70 } },
  { id: 'aquadrake', name: 'Aquadrake', element: 'water', rarity: 'rare', description: 'Master of the pool and open water.', baseStats: { hp: 78, atk: 72, def: 70, spd: 65 } },
  { id: 'verdantaur', name: 'Verdantaur', element: 'grass', rarity: 'rare', description: 'Ancient forest spirit of endurance hikes.', baseStats: { hp: 75, atk: 70, def: 75, spd: 58 } },
  { id: 'thunderhorn', name: 'Thunderhorn', element: 'electric', rarity: 'rare', description: 'Charges up with every burpee set.', baseStats: { hp: 68, atk: 85, def: 55, spd: 88 } },
  { id: 'terraforge', name: 'Terraforge', element: 'earth', rarity: 'rare', description: 'Mountain climber turned living golem.', baseStats: { hp: 90, atk: 68, def: 88, spd: 40 } },

  // Epic
  { id: 'phoenixion', name: 'Phoenixion', element: 'fire', rarity: 'epic', description: 'Rises from the ashes of brutal leg day.', baseStats: { hp: 88, atk: 95, def: 72, spd: 85 } },
  { id: 'leviathane', name: 'Leviathane', element: 'water', rarity: 'epic', description: 'Titan of the deep, born from triathlons.', baseStats: { hp: 98, atk: 88, def: 85, spd: 78 } },
  { id: 'stormreaver', name: 'Stormreaver', element: 'electric', rarity: 'epic', description: 'Channels the fury of CrossFit WODs.', baseStats: { hp: 82, atk: 102, def: 68, spd: 95 } },
  { id: 'eclipsion', name: 'Eclipsion', element: 'shadow', rarity: 'epic', description: 'Devours weakness during 5 AM workouts.', baseStats: { hp: 85, atk: 98, def: 75, spd: 90 } },

  // Legendary
  { id: 'solarius', name: 'Solarius', element: 'light', rarity: 'legendary', description: 'Legendary guardian of peak performance.', baseStats: { hp: 105, atk: 105, def: 95, spd: 95 } },
  { id: 'voidreign', name: 'Voidreign', element: 'shadow', rarity: 'legendary', description: 'The ultimate reward, tamed only by champions.', baseStats: { hp: 110, atk: 110, def: 100, spd: 85 } },
  { id: 'primordial', name: 'Primordial', element: 'earth', rarity: 'legendary', description: 'Ancient titan awakened by years of training.', baseStats: { hp: 120, atk: 95, def: 115, spd: 70 } },
]

export const TYPE_CHART: Record<ElementType, { strong: ElementType[]; weak: ElementType[] }> = {
  fire: { strong: ['grass', 'shadow'], weak: ['water', 'earth'] },
  water: { strong: ['fire', 'earth'], weak: ['grass', 'electric'] },
  grass: { strong: ['water', 'earth'], weak: ['fire', 'shadow'] },
  electric: { strong: ['water', 'light'], weak: ['earth', 'grass'] },
  earth: { strong: ['electric', 'fire'], weak: ['grass', 'water'] },
  shadow: { strong: ['light', 'grass'], weak: ['fire', 'light'] },
  light: { strong: ['shadow', 'electric'], weak: ['shadow', 'water'] },
}

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 55,
  uncommon: 28,
  rare: 12,
  epic: 4,
  legendary: 1,
}

export function getSpeciesById(id: string): MonsterSpecies | undefined {
  return MONSTER_SPECIES.find((s) => s.id === id)
}

export function getSpeciesByRarity(rarity: Rarity): MonsterSpecies[] {
  return MONSTER_SPECIES.filter((s) => s.rarity === rarity)
}
