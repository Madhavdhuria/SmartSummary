import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateGeminiSummary = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-002",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    });

    const promptText = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform the following text into an engaging, easy-to-read summary with contextually relevant emojis and proper Markdown formatting:\n\n${pdfText}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
    });

    const responseText = result.response.text?.();
    if (!responseText || responseText.trim() === "") {
      throw new Error("Empty response from Gemini API");
    }
    return responseText;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
