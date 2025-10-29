
import type { Angle } from './types';

export const ANGLES: Angle[] = [
  { id: 'front', label: 'Front', prompt: 'Front view, facing forward, symmetrical pose.' },
  { id: 'three_quarter', label: '¾ View', prompt: 'Three-quarter view, slightly turned.' },
  { id: 'side', label: 'Side', prompt: 'Side profile view, facing left.' },
  { id: 'back', label: 'Back', prompt: 'Back view, showing the character from behind.' },
];

export const ART_STYLES: string[] = [
  'Fantasy anime (like Genshin Impact)',
  'Photo-realistic, cinematic lighting',
  'Dark fantasy, gothic (like Dark Souls)',
  'Cyberpunk neon-noir',
  'Classic 16-bit pixel art',
  'Modern cartoon (like The Dragon Prince)',
  'Impressionistic watercolor concept art',
  'Cel-shaded comic book style',
  'Steampunk intricate concept art',
];

export const ARCHETYPES: string[] = [
    'Shadow Assassin',
    'Cyberpunk Samurai',
    'Cosmic Sorcerer',
    'Steampunk Inventor',
    'Post-Apocalyptic Nomad',
    'Forest Guardian',
    'Celestial Knight',
    'Time-Traveling Detective',
    'Bio-Mechanical Android',
    'Deep Sea Paladin',
];
