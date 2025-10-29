
import React, { useState, useCallback } from 'react';
import { CharacterForm } from './components/CharacterForm';
import { CharacterSheet } from './components/CharacterSheet';
import { generateCharacterDetails, generateCharacterImage, generateVoiceLine } from './services/geminiService';
import type { CharacterData, FormState, CharacterImages } from './types';
import { ANGLES } from './constants';

function App() {
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [characterImages, setCharacterImages] = useState<CharacterImages>({});
  const [voiceAudio, setVoiceAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (formState: FormState) => {
    setIsLoading(true);
    setError(null);
    setCharacterData(null);
    setCharacterImages({});
    setVoiceAudio(null);

    const basePrompt = `A full-body character concept of a ${formState.archetype}. 
    Personality: ${formState.personality_trait}.
    Key traits: ${formState.traits}. 
    Attire: ${formState.attire}. 
    Art style: ${formState.artStyle}, high detail, dramatic lighting.`;

    try {
      // Stage 1: Generate Lore & Stats
      setLoadingStage('Forging personality and lore...');
      const details = await generateCharacterDetails(basePrompt);
      setCharacterData(details);

      // Stage 2: Generate Images
      const imagePromises = ANGLES.map(async (angle) => {
        setLoadingStage(`Rendering ${angle.label.toLowerCase()} view...`);
        const imagePrompt = `${basePrompt}. ${angle.prompt}.`;
        const imageData = await generateCharacterImage(imagePrompt);
        return { angle: angle.id, imageData };
      });

      const settledImages = await Promise.allSettled(imagePromises);
      const newImages: CharacterImages = {};
      settledImages.forEach(result => {
        if (result.status === 'fulfilled') {
          newImages[result.value.angle] = `data:image/jpeg;base64,${result.value.imageData}`;
        }
      });
      setCharacterImages(newImages);


      // Stage 3: Generate Voice Line
      if (details.voice_line_prompt) {
        setLoadingStage('Synthesizing voice...');
        const audioData = await generateVoiceLine(details.voice_line_prompt);
        setVoiceAudio(`data:audio/mpeg;base64,${audioData}`);
      }

      setLoadingStage('Character forged!');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
      setLoadingStage('');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDownload = () => {
    if (!characterData) return;
    
    const exportData = {
      ...characterData,
      image_set: Object.keys(characterImages).map(key => `${characterData.name.replace(/\s+/g, '_')}_${key}.png`),
      voice_line_file: characterData.name.replace(/\s+/g, '_') + '_voice.mp3',
    };
    
    // Create and download metadata.json
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Note: Due to browser security, we can't auto-download all files into a folder.
    // The user would typically right-click -> save each image and the audio.
    // The downloaded JSON provides the correct filenames for them to use.
  };

  return (
    <div className="min-h-screen bg-primary font-sans">
      <header className="bg-secondary/50 backdrop-blur-sm border-b border-border p-4 text-center sticky top-0 z-10">
        <h1 className="text-3xl font-bold font-[Orbitron,sans-serif] text-accent tracking-widest">
          CharacterForge AI
        </h1>
        <p className="text-medium mt-1">Generate Complete Character Packages with AI</p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 md:p-8">
        <aside className="lg:col-span-1 xl:col-span-1 lg:sticky lg:top-24 h-fit">
          <CharacterForm onGenerate={handleGenerate} isLoading={isLoading} />
        </aside>
        <section className="lg:col-span-2 xl:col-span-3">
          <CharacterSheet
            data={characterData}
            images={characterImages}
            audio={voiceAudio}
            isLoading={isLoading}
            loadingStage={loadingStage}
            error={error}
            onDownload={handleDownload}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
