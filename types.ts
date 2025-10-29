
export interface Stats {
  speed: number;
  strength: number;
  intellect: number;
}

export interface CharacterData {
  name: string;
  class: string;
  faction: string;
  weapons: string[];
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  personality: string;
  backstory: string;
  stats: Stats;
  voice_line_prompt: string;
}

export interface FormState {
  archetype: string;
  traits: string;
  attire: string;
  artStyle: string;
  personality_trait: string;
}

export interface CharacterImages {
  [key: string]: string; // key is angle id (e.g., 'front', 'side')
}

export interface Angle {
  id: string;
  label: string;
  prompt: string;
}
