
import React, { useState } from 'react';
import type { CharacterData, CharacterImages } from '../types';
import { ANGLES } from '../constants';
import { DownloadIcon, SpeedIcon, StrengthIcon, IntellectIcon, PlayIcon } from './icons';
import { LoadingIndicator } from './LoadingIndicator';

interface CharacterSheetProps {
  data: CharacterData | null;
  images: CharacterImages;
  audio: string | null;
  isLoading: boolean;
  loadingStage: string;
  error: string | null;
  onDownload: () => void;
}

const RarityBadge: React.FC<{ rarity: string }> = ({ rarity }) => {
    const rarityColors: { [key: string]: string } = {
        Common: 'bg-gray-500 text-white',
        Uncommon: 'bg-green-500 text-white',
        Rare: 'bg-blue-500 text-white',
        Epic: 'bg-purple-600 text-white',
        Legendary: 'bg-yellow-500 text-black',
    };
    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${rarityColors[rarity] || 'bg-gray-500'}`}>
            {rarity}
        </span>
    );
};

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ data, images, audio, isLoading, loadingStage, error, onDownload }) => {
  const [selectedAngle, setSelectedAngle] = useState(ANGLES[0].id);

  if (isLoading) {
    return <LoadingIndicator stage={loadingStage} />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-secondary border border-red-500/50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-red-400">Generation Failed</h3>
        <p className="text-medium mt-2">An error occurred while forging your character.</p>
        <p className="bg-primary p-4 mt-4 rounded-md text-sm text-light font-mono text-left">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-secondary border-2 border-dashed border-border rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-medium">Your character awaits...</h3>
        <p className="text-medium mt-2">Fill out the prompt and click "Forge Character" to begin.</p>
      </div>
    );
  }

  const mainImage = images[selectedAngle] || 'https://picsum.photos/600/800?grayscale';

  return (
    <div className="bg-secondary p-4 sm:p-6 rounded-lg border border-border shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Gallery */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="w-full aspect-[3/4] bg-primary rounded-md overflow-hidden border border-border mb-4">
              <img src={mainImage} alt={`${data.name} - ${selectedAngle}`} className="w-full h-full object-cover"/>
          </div>
          <div className="grid grid-cols-4 gap-2 w-full">
            {ANGLES.map(angle => (
              <button 
                key={angle.id}
                onClick={() => setSelectedAngle(angle.id)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedAngle === angle.id ? 'border-accent scale-105' : 'border-border hover:border-medium'}`}
              >
                {images[angle.id] ? (
                   <img src={images[angle.id]} alt={angle.label} className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-medium text-xs">
                        {angle.label}
                    </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Character Details */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold font-[Orbitron,sans-serif]">{data.name}</h2>
              <p className="text-accent text-lg">{data.class} of the {data.faction}</p>
            </div>
            <RarityBadge rarity={data.rarity} />
          </div>

          <div className="mt-4 border-t border-border pt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-medium">Personality</h4>
              <p className="text-light italic">"{data.personality}"</p>
            </div>
            <div>
              <h4 className="font-semibold text-medium">Backstory</h4>
              <p className="text-light">{data.backstory}</p>
            </div>
             <div>
              <h4 className="font-semibold text-medium">Weapons</h4>
              <p className="text-light">{data.weapons.join(', ')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-primary p-3 rounded-md border border-border">
              <SpeedIcon className="w-8 h-8 mx-auto text-accent"/>
              <p className="text-xs text-medium mt-1">SPEED</p>
              <p className="text-2xl font-bold">{data.stats.speed}</p>
            </div>
             <div className="bg-primary p-3 rounded-md border border-border">
              <StrengthIcon className="w-8 h-8 mx-auto text-accent"/>
              <p className="text-xs text-medium mt-1">STRENGTH</p>
              <p className="text-2xl font-bold">{data.stats.strength}</p>
            </div>
             <div className="bg-primary p-3 rounded-md border border-border">
              <IntellectIcon className="w-8 h-8 mx-auto text-accent"/>
              <p className="text-xs text-medium mt-1">INTELLECT</p>
              <p className="text-2xl font-bold">{data.stats.intellect}</p>
            </div>
          </div>

           <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {audio && (
              <div className="flex-1 bg-primary border border-border rounded-md p-3 flex items-center gap-4">
                  <button onClick={() => new Audio(audio).play()} className="bg-accent p-2 rounded-full text-primary hover:bg-blue-400 transition-colors">
                    <PlayIcon className="w-5 h-5"/>
                  </button>
                  <p className="text-sm italic text-light">"{data.voice_line_prompt}"</p>
              </div>
            )}
            <button
                onClick={onDownload}
                className="flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-500 transition-all duration-300 transform hover:scale-105"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Bundle
            </button>
           </div>
        </div>
      </div>
    </div>
  );
};
