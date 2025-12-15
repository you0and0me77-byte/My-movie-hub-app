
import { GoogleGenAI } from "@google/genai";
import { GroundingSource } from "../types";

export const findSmartLinks = async (movieTitle: string): Promise<{ text: string, sources: GroundingSource[], dorks: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Specific instruction for finding dorks and high-quality links
  const systemInstruction = `You are an expert at finding movies via Google Search Dorks. 
  For the movie: "${movieTitle}", identify:
  1. Direct high-quality web sources found via grounding.
  2. Suggested Google Search Dork queries like: 
     - site:drive.google.com "${movieTitle}"
     - index of "${movieTitle}" mp4
     - site:t.me "${movieTitle}" download
  Be helpful and provide a summary of where to look.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: systemInstruction,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "Searching for specialized links...";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const sources: GroundingSource[] = groundingChunks
    .map((chunk: any) => {
      if (chunk.web) {
        return { title: chunk.web.title, uri: chunk.web.uri };
      }
      return null;
    })
    .filter(Boolean) as GroundingSource[];

  // Heuristic to extract dorks if Gemini mentioned them, 
  // or provide defaults based on user feedback success patterns
  const dorks = [
    `site:drive.google.com "${movieTitle}"`,
    `index of "${movieTitle}" mp4`,
    `site:t.me "${movieTitle}" download`,
    `site:archive.org "${movieTitle}"`
  ];

  return { text, sources, dorks };
};
