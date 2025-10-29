
import React, { useState } from 'react';
import type { FormState } from '../types';
import { ForgeIcon, RandomIcon, SparklesIcon } from './icons';
import { ARCHETYPES, ART_STYLES } from '../constants';
import { generateRandomCharacterPrompt, generateInspiration } from '../services/geminiService';

interface CharacterFormProps {
  onGenerate: (formState: FormState) => void;
  isLoading: boolean;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({ onGenerate, isLoading }) => {
  const [formState, setFormState] = useState<FormState>({
    archetype: 'Shadow Assassin',
    personality_trait: 'Cold, precise, and loyal',
    traits: 'Silver hair, glowing purple eyes, athletic build',
    attire: 'Dark hooded cloak, leather armor with intricate silver engravings, dual daggers on their back',
    artStyle: 'Fantasy anime (like Genshin Impact)',
  });

  const [isRandomizing, setIsRandomizing] = useState(false);
  const [inspirationLoading, setInspirationLoading] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formState);
  };
  
  const handleRandomize = async () => {
    setIsRandomizing(true);
    try {
      const randomPrompt = await generateRandomCharacterPrompt();
      const randomArtStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
      setFormState(prevState => ({
          ...prevState,
          ...randomPrompt,
          artStyle: randomArtStyle
      }));
    } catch (error) {
      console.error("Failed to generate random character", error);
      // You could show an error toast here
    } finally {
      setIsRandomizing(false);
    }
  };

  const handleGetInspiration = async (field: 'personality_trait' | 'traits' | 'attire') => {
    setInspirationLoading(field);
    try {
      const suggestion = await generateInspiration(field, formState);
      setFormState(prevState => ({ ...prevState, [field]: suggestion }));
    } catch (error) {
      console.error(`Failed to get inspiration for ${field}`, error);
    } finally {
      setInspirationLoading(null);
    }
  }

  return (
    <div className="bg-secondary p-6 rounded-lg border border-border shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-accent">1. Character Prompt</h2>
        <button
          type="button"
          onClick={handleRandomize}
          disabled={isLoading || isRandomizing}
          className="flex items-center gap-2 text-sm bg-primary border border-border px-3 py-2 rounded-md hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Generate a random character prompt"
        >
          {isRandomizing ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <RandomIcon className="w-4 h-4" />
          )}
          Randomize
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="archetype" className="block text-sm font-medium text-light mb-1">Archetype</label>
          <select
            id="archetype"
            name="archetype"
            value={formState.archetype}
            onChange={handleChange}
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent transition-colors"
          >
            {ARCHETYPES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="personality_trait" className="block text-sm font-medium text-light mb-1">Personality Trait</label>
          <input
            type="text"
            id="personality_trait"
            name="personality_trait"
            value={formState.personality_trait}
            onChange={handleChange}
            placeholder="e.g., Honorable but ruthless"
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent transition-colors pr-10"
          />
           <button type="button" onClick={() => handleGetInspiration('personality_trait')} disabled={!!inspirationLoading} className="absolute right-2 top-8 text-medium hover:text-accent transition-colors disabled:opacity-50 p-1" aria-label="Get AI inspiration for personality">
             {inspirationLoading === 'personality_trait' ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5"/>}
           </button>
        </div>

        <div className="relative">
          <label htmlFor="traits" className="block text-sm font-medium text-light mb-1">Key Traits</label>
          <textarea
            id="traits"
            name="traits"
            rows={3}
            value={formState.traits}
            onChange={handleChange}
            placeholder="e.g., Mechanical arm, long white hair"
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent transition-colors pr-10"
          />
          <button type="button" onClick={() => handleGetInspiration('traits')} disabled={!!inspirationLoading} className="absolute right-2 top-8 text-medium hover:text-accent transition-colors disabled:opacity-50 p-1" aria-label="Get AI inspiration for traits">
             {inspirationLoading === 'traits' ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5"/>}
          </button>
        </div>

        <div className="relative">
          <label htmlFor="attire" className="block text-sm font-medium text-light mb-1">Attire</label>
          <textarea
            id="attire"
            name="attire"
            rows={3}
            value={formState.attire}
            onChange={handleChange}
            placeholder="e.g., Glowing neon trench coat, tactical gear"
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent transition-colors pr-10"
          />
           <button type="button" onClick={() => handleGetInspiration('attire')} disabled={!!inspirationLoading} className="absolute right-2 top-8 text-medium hover:text-accent transition-colors disabled:opacity-50 p-1" aria-label="Get AI inspiration for attire">
             {inspirationLoading === 'attire' ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5"/>}
           </button>
        </div>

        <div>
          <label htmlFor="artStyle" className="block text-sm font-medium text-light mb-1">Art Style</label>
           <select
            id="artStyle"
            name="artStyle"
            value={formState.artStyle}
            onChange={handleChange}
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent transition-colors"
          >
            {ART_STYLES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-accent text-primary font-bold py-3 px-4 rounded-md hover:bg-blue-400 transition-all duration-300 disabled:bg-medium disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
        >
          <ForgeIcon className="w-6 h-6 mr-2" />
          {isLoading ? 'Forging...' : 'Forge Character'}
        </button>
      </form>
    </div>
  );
};
