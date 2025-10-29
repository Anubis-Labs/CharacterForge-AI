
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { CharacterData, FormState } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const characterSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "A cool and fitting name for the character." },
        class: { type: Type.STRING, description: "The character's class or role (e.g., Assassin, Mage, Warrior)." },
        faction: { type: Type.STRING, description: "The faction or group the character belongs to." },
        weapons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 2-3 weapons the character uses."
        },
        rarity: {
            type: Type.STRING,
            enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
            description: "The character's rarity level."
        },
        personality: { type: Type.STRING, description: "A brief description of the character's personality (e.g., Cold, precise, loyal)." },
        backstory: { type: Type.STRING, description: "A short, compelling origin story or backstory for the character (2-3 sentences)." },
        stats: {
            type: Type.OBJECT,
            properties: {
                speed: { type: Type.INTEGER, description: "A value from 1 to 100 representing speed/agility." },
                strength: { type: Type.INTEGER, description: "A value from 1 to 100 representing physical strength." },
                intellect: { type: Type.INTEGER, description: "A value from 1 to 100 representing intelligence/wisdom." }
            },
            required: ["speed", "strength", "intellect"]
        },
        voice_line_prompt: { type: Type.STRING, description: "A short, impactful voice line or catchphrase for the character to say (e.g., 'The shadows are my allies.')." }
    },
    required: ["name", "class", "faction", "weapons", "rarity", "personality", "backstory", "stats", "voice_line_prompt"]
};


export const generateCharacterDetails = async (prompt: string): Promise<CharacterData> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Based on the following prompt, generate a complete character profile in JSON format. Prompt: "${prompt}"`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: characterSchema
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CharacterData;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("Could not generate character details. The AI returned an invalid format.");
    }
};

export const generateCharacterImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: '3:4', // Portrait aspect ratio
            outputMimeType: 'image/jpeg'
        }
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("Image generation failed.");
};


export const generateVoiceLine = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with a dramatic and serious tone: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // A deep, serious voice
                },
            },
        },
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.[0];
    if (audioPart && audioPart.inlineData?.data) {
        return audioPart.inlineData.data;
    }

    throw new Error("Voice line generation failed.");
};

const randomPromptSchema = {
    type: Type.OBJECT,
    properties: {
        archetype: { type: Type.STRING, description: "A creative and unique character archetype or class (e.g., 'Celestial Cartographer', 'Scrap-Knight')." },
        personality_trait: { type: Type.STRING, description: "A single, defining personality trait (e.g., 'Cynical but hopeful', 'Endlessly curious')." },
        traits: { type: Type.STRING, description: "Key visual traits, describing physical appearance (e.g., 'Eyes that shimmer with constellations, wears a cloak of woven starlight')." },
        attire: { type: Type.STRING, description: "A description of the character's clothing and gear (e.g., 'Worn leather explorer's gear, brass astrolabe and enchanted compass at their belt')." },
    },
    required: ["archetype", "personality_trait", "traits", "attire"],
};

export const generateRandomCharacterPrompt = async (): Promise<Partial<FormState>> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a creative and unique character concept. Provide an archetype, a core personality trait, key visual traits, and attire as a JSON object. Be imaginative and avoid clichés.',
        config: {
            responseMimeType: 'application/json',
            responseSchema: randomPromptSchema,
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Partial<FormState>;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini for random prompt:", response.text);
        throw new Error("Could not generate a random prompt. The AI returned an invalid format.");
    }
};

export const generateInspiration = async (
    fieldType: 'personality_trait' | 'traits' | 'attire',
    context: FormState
): Promise<string> => {
    const prompt = `Based on this character concept, give me one creative idea for their "${fieldType}".
    Concept:
    - Archetype: ${context.archetype}
    - Personality: ${context.personality_trait}
    - Traits: ${context.traits}
    - Attire: ${context.attire}

    Your suggestion should be short and punchy (5-15 words). Just return the suggestion text, nothing else.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
};
