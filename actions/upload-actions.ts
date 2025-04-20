"use server";

import { getDbConnection } from "@/lib/db";
import { generateGeminiSummary } from "@/lib/gemini";
import { extractandsummarizePdf } from "@/lib/langchain";
import { generatePdfSummaryfromOpenai } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
type StorePdfSummaryArgs = {
  userId?: string;
  originalFileUrl: string;
  summaryText: string;
  title: string;
  fileName: string;
  status?: string;
};

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

async function storePdfSummary({
  userId,
  originalFileUrl,
  summaryText,
  title,
  fileName,
  status = "completed",
}: StorePdfSummaryArgs) {
  try {
    const sql = await getDbConnection();

    const result = await sql`
      INSERT INTO pdf_summary (
        user_id,
        original_file_url,
        summary_text,
        status,
        title,
        file_name
      )
      VALUES (
        ${userId},
        ${originalFileUrl},
        ${summaryText},
        ${status},
        ${title},
        ${fileName}
      )
      RETURNING *;
    `;

    return {
      success: true,
      message: "PDF summary stored successfully",
      data: result[0],
    };
  } catch (error) {
    console.error("Error storing summary:", error);
    return {
      success: false,
      message: "Error storing summary",
      data: null,
    };
  }
}

export async function storePdfSummaryAction({
  status,
  originalFileUrl,
  summaryText,
  title,
  fileName,
}: StorePdfSummaryArgs) {
  let savedPdfSummary = null;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    savedPdfSummary = await storePdfSummary({
      status,
      userId,
      originalFileUrl,
      summaryText,
      title,
      fileName,
    });

    if (!savedPdfSummary.success) {
      return {
        success: false,
        message: savedPdfSummary.message,
      };
    }

    return {
      success: true,
      message: "PDF summary stored successfully",
      data: savedPdfSummary.data,
    };
  } catch (err) {
    return {
      success: false,
      message: "Error storing summary",
      data: null,
    };
  }
}
