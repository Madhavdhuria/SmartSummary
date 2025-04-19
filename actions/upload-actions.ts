"use server";

import { generateGeminiSummary } from "@/lib/gemini";
import { extractandsummarizePdf } from "@/lib/langchain";
import { generatePdfSummaryfromOpenai } from "@/lib/openai";

export async function generatePdfSummary(UploadResponse: {
  name: string;
  size: number;
  key: string;
  url: string;
  serverData?: {
    userId: string;
    file: { ufsUrl: string; name: string };
  };
}[]) {
  if (!UploadResponse || UploadResponse.length === 0) {
    return {
      success: false,
      message: "No file uploaded",
      data: null,
    };
  }

  const first = UploadResponse[0];

  if (!first?.serverData?.file?.ufsUrl) {
    return {
      success: false,
      message: "Missing file data",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { ufsUrl: pdfUrl, name: fileName },
    },
  } = first;

  try {
    const pdfText = await extractandsummarizePdf(pdfUrl);
    if (!pdfText) {
      return {
        success: false,
        message: "No text extracted from PDF",
        data: null,
      };
    }

    let summary = null;

    try {
      summary = await generatePdfSummaryfromOpenai(pdfText);
      if (summary) {
        return {
          success: true,
          message: "Summary generated using OpenAI",
          data: summary,
        };
      }
    } catch (error: any) {
      console.warn("OpenAI summary failed, trying Gemini...", error.message);
    }

    // Fallback to Gemini if OpenAI fails or returns null
    try {
      summary = await generateGeminiSummary(pdfText);
      if (!summary) {
        return {
          success: false,
          message: "Gemini summary was empty",
          data: null,
        };
      }

      return {
        success: true,
        message: "Summary generated using Gemini",
        data: summary,
      };
    } catch (geminiError) {
      console.error("Gemini summary generation error:", geminiError);
      return {
        success: false,
        message: "Failed to generate summary using available AI models",
        data: null,
      };
    }
  } catch (error) {
    console.error("General summary generation error:", error);
    return {
      success: false,
      message: "Error generating summary",
      data: null,
    };
  }
}
