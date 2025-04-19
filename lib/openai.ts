import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generatePdfSummaryfromOpenai = async (pdfText: string) => {
  console.log(pdfText);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `I’m uploading the raw text extracted from a PDF document. Please read and summarize it using the exact format provided in your instructions. 

Here is the text:
""" 
${pdfText}
"""`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error("Error generating summary: " + error.message);
  }
};
