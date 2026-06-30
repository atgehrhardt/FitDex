import type { ElementType, Move } from '../types'
import { BASIC_ATTACK_ID } from '../types'

export const BASIC_ATTACK: Move = {
  id: BASIC_ATTACK_ID,
  name: 'Strike',
  element: 'fire', // overridden by attacker element at runtime
  power: 1,
  description: 'A basic physical attack using the monster\'s element.',
  cost: 0,
}

export const MOVES: Move[] = [
  // Fire
  { id: 'ember-bite', name: 'Ember Bite', element: 'fire', power: 1.15, description: 'A quick fiery nip.', cost: 30 },
  { id: 'heat-wave', name: 'Heat Wave', element: 'fire', power: 1.35, description: 'Waves of scorching heat.', cost: 60 },
  { id: 'flame-burst', name: 'Flame Burst', element: 'fire', power: 1.55, description: 'An explosive burst of flames.', cost: 100 },
  { id: 'inferno', name: 'Inferno', element: 'fire', power: 1.85, description: 'Devastating inferno attack.', cost: 200 },

  // Water
  { id: 'splash', name: 'Splash', element: 'water', power: 1.1, description: 'A pressurized water splash.', cost: 25 },
  { id: 'aqua-jet', name: 'Aqua Jet', element: 'water', power: 1.3, description: 'A high-speed water tackle.', cost: 55 },
  { id: 'tidal-slam', name: 'Tidal Slam', element: 'water', power: 1.5, description: 'Crushing tidal force.', cost: 90 },
  { id: 'tsunami', name: 'Tsunami', element: 'water', power: 1.8, description: 'Overwhelming wave of water.', cost: 180 },

  // Grass
  { id: 'vine-whip', name: 'Vine Whip', element: 'grass', power: 1.12, description: 'Lashing vines strike the foe.', cost: 28 },
  { id: 'leaf-blade', name: 'Leaf Blade', element: 'grass', power: 1.32, description: 'Razor-sharp leaf slash.', cost: 58 },
  { id: 'root-slam', name: 'Root Slam', element: 'grass', power: 1.52, description: 'Roots erupt from the ground.', cost: 95 },
  { id: 'nature-fury', name: 'Nature Fury', element: 'grass', power: 1.75, description: 'The forest unleashes its wrath.', cost: 175 },

  // Electric
  { id: 'spark', name: 'Spark', element: 'electric', power: 1.13, description: 'A crackling electric jolt.', cost: 30 },
  { id: 'thunder-fang', name: 'Thunder Fang', element: 'electric', power: 1.38, description: 'Electrified bite attack.', cost: 65 },
  { id: 'volt-crash', name: 'Volt Crash', element: 'electric', power: 1.58, description: 'High-voltage body slam.', cost: 105 },
  { id: 'storm-bolt', name: 'Storm Bolt', element: 'electric', power: 1.9, description: 'A bolt from the storm itself.', cost: 210 },

  // Earth
  { id: 'pebble-toss', name: 'Pebble Toss', element: 'earth', power: 1.1, description: 'Hurls hardened pebbles.', cost: 25 },
  { id: 'rock-smash', name: 'Rock Smash', element: 'earth', power: 1.33, description: 'Smashes with stone fists.', cost: 55 },
  { id: 'quake-stomp', name: 'Quake Stomp', element: 'earth', power: 1.55, description: 'Ground-shaking stomp.', cost: 95 },
  { id: 'tectonic-rage', name: 'Tectonic Rage', element: 'earth', power: 1.82, description: 'Tectonic plates shift violently.', cost: 190 },

  // Shadow
  { id: 'shadow-claw', name: 'Shadow Claw', element: 'shadow', power: 1.14, description: 'Claws of pure darkness.', cost: 32 },
  { id: 'dark-pulse', name: 'Dark Pulse', element: 'shadow', power: 1.36, description: 'A pulse of shadow energy.', cost: 62 },
  { id: 'void-slash', name: 'Void Slash', element: 'shadow', power: 1.56, description: 'Cuts through with void energy.', cost: 100 },
  { id: 'eclipse', name: 'Eclipse', element: 'shadow', power: 1.88, description: 'Total eclipse of power.', cost: 205 },

  // Light
  { id: 'gleam-ray', name: 'Gleam Ray', element: 'light', power: 1.12, description: 'A ray of radiant light.', cost: 28 },
  { id: 'solar-beam', name: 'Solar Beam', element: 'light', power: 1.4, description: 'Concentrated solar energy.', cost: 70 },
  { id: 'radiant-burst', name: 'Radiant Burst', element: 'light', power: 1.6, description: 'Burst of blinding radiance.', cost: 110 },
  { id: 'supernova', name: 'Supernova', element: 'light', power: 1.92, description: 'Explosive stellar power.', cost: 220 },
]

/** Which species can learn which moves (must purchase before equipping). */
export const SPECIES_LEARNSETS: Record<string, string[]> = {
  emberpup: ['ember-bite', 'heat-wave'],
  droplet: ['splash', 'aqua-jet'],
  leaflet: ['vine-whip', 'leaf-blade'],
  sparkbit: ['spark', 'thunder-fang'],
  pebble: ['pebble-toss', 'rock-smash'],
  gloomlet: ['shadow-claw', 'dark-pulse'],
  gleam: ['gleam-ray', 'solar-beam'],

  flamewolf: ['ember-bite', 'heat-wave', 'flame-burst'],
  tidalynx: ['splash', 'aqua-jet', 'tidal-slam'],
  thornback: ['vine-whip', 'leaf-blade', 'root-slam'],
  voltfox: ['spark', 'thunder-fang', 'volt-crash'],
  boulder: ['pebble-toss', 'rock-smash', 'quake-stomp'],
  shadebat: ['shadow-claw', 'dark-pulse', 'void-slash'],

  infernox: ['ember-bite', 'heat-wave', 'flame-burst', 'inferno'],
  aquadrake: ['splash', 'aqua-jet', 'tidal-slam', 'tsunami'],
  verdantaur: ['vine-whip', 'leaf-blade', 'root-slam', 'nature-fury'],
  thunderhorn: ['spark', 'thunder-fang', 'volt-crash', 'storm-bolt'],
  terraforge: ['pebble-toss', 'rock-smash', 'quake-stomp', 'tectonic-rage'],

  phoenixion: ['heat-wave', 'flame-burst', 'inferno', 'solar-beam'],
  leviathane: ['aqua-jet', 'tidal-slam', 'tsunami', 'nature-fury'],
  stormreaver: ['thunder-fang', 'volt-crash', 'storm-bolt', 'radiant-burst'],
  eclipsion: ['dark-pulse', 'void-slash', 'eclipse', 'shadow-claw'],

  solarius: ['solar-beam', 'radiant-burst', 'supernova', 'gleam-ray'],
  voidreign: ['void-slash', 'eclipse', 'dark-pulse', 'shadow-claw'],
  primordial: ['quake-stomp', 'tectonic-rage', 'root-slam', 'nature-fury'],
}

export function getMoveById(id: string): Move | undefined {
  if (id === BASIC_ATTACK_ID) return BASIC_ATTACK
  return MOVES.find((m) => m.id === id)
}

export function getMovesForSpecies(speciesId: string): Move[] {
  const learnset = SPECIES_LEARNSETS[speciesId] ?? []
  return learnset.map((id) => getMoveById(id)).filter((m): m is Move => m !== undefined)
}

export function canSpeciesLearn(speciesId: string, moveId: string): boolean {
  return (SPECIES_LEARNSETS[speciesId] ?? []).includes(moveId)
}

export function getMovesByElement(element: ElementType): Move[] {
  return MOVES.filter((m) => m.element === element)
}
