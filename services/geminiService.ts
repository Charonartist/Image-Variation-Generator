
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function dataUrlToBlob(dataUrl: string): { base64: string; mimeType: string } {
  const parts = dataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const base64 = parts[1];
  return { base64, mimeType };
}

export const generateImageVariation = async (base64ImageDataUrl: string, prompt: string): Promise<string> => {
  const { base64, mimeType } = dataUrlToBlob(base64ImageDataUrl);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newBase64 = part.inlineData.data;
          const newMimeType = part.inlineData.mimeType;
          return `data:${newMimeType};base64,${newBase64}`;
        }
      }
    }
    throw new Error('No image part found in the API response.');
  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    throw new Error(`Failed to generate image variation. ${error instanceof Error ? error.message : String(error)}`);
  }
};
