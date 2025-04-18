"use server";

import { extractandsummarizePdf } from "@/lib/langchain";
import { generatePdfSummaryfromOpenai } from "@/lib/openai";

export async function generatePdfSummary(
  UploadResponse: {
    name: string;
    size: number;
    key: string;
    url: string;
    serverData?: {
      userId: string;
      file: { ufsUrl: string; name: string };
    };
  }[]
) {
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

    try {
      const summary = await generatePdfSummaryfromOpenai(pdfText);
      if (!summary) {
        return {
          success: false,
          message: "No summary generated",
          data: null,
        };
      }
      console.log("Summary generated successfully:", summary);

      return {
        success: true,
        message: "Summary generated successfully",
        data: summary,
      };
    } catch (error) {
      console.error("Error generating summary:", error);
      return {
        success: false,
        message: "Error generating summary",
        data: null,
      };
    }
  } catch (error) {
    console.error("Summary generation error:", error);
    return {
      success: false,
      message: "Error generating summary",
      data: null,
    };
  }
}
