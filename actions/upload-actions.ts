"use server";

import { getDbConnection } from "@/lib/db";
import { generateGeminiSummary } from "@/lib/gemini";
import { extractandsummarizePdf } from "@/lib/langchain";
import { generatePdfSummaryfromOpenai } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type StorePdfSummaryArgs = {
  userId?: string;
  originalFileUrl: string;
  summaryText: string;
  title: string;
  fileName: string;
  status?: string;
};

const createSuccessResponse = (message: string, data: any = null) => ({
  success: true,
  message,
  data,
});

const createErrorResponse = (message: string, data: any = null) => ({
  success: false,
  message,
  data,
});

export async function ExtractText(
  UploadResponse: {
    name: string;
    size: number;
    key: string;
    url: string;
    serverData?: { userId: string; file: { ufsUrl: string; name: string } };
  }[]
) {
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

  if (!pdfUrl) {
    return createErrorResponse("Missing file data");
  }

  const pdfText = await extractandsummarizePdf(pdfUrl);
  if (!pdfText) {
    return createErrorResponse("No text extracted from PDF");
  }

  return createSuccessResponse("Text extracted successfully", pdfText);
}

export async function generatePdfSummary(pdfText: string) {
  try {
    let summary = null;

    try {
      summary = await generatePdfSummaryfromOpenai(pdfText);
      if (summary) {
        return createSuccessResponse("Summary generated using OpenAI", summary);
      }
    } catch (error: any) {
      console.warn("OpenAI summary failed, trying Gemini...", error.message);
    }

    try {
      summary = await generateGeminiSummary(pdfText);
      if (!summary) {
        return createErrorResponse("Gemini summary was empty");
      }

      return createSuccessResponse("Summary generated using Gemini", summary);
    } catch (geminiError) {
      console.error("Gemini summary generation error:", geminiError);
      return createErrorResponse(
        "Failed to generate summary using available AI models"
      );
    }
  } catch (error) {
    console.error("General summary generation error:", error);
    return createErrorResponse("Error generating summary");
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

    return createSuccessResponse("PDF summary stored successfully", result[0]);
  } catch (error) {
    console.error("Error storing summary:", error);
    return createErrorResponse("Error storing summary");
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
      return createErrorResponse("User not authenticated");
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
      return createErrorResponse(savedPdfSummary.message);
    }

    revalidatePath("summary/" + savedPdfSummary.data?.id);
    return createSuccessResponse(
      "PDF summary stored successfully",
      savedPdfSummary.data
    );
  } catch (err) {
    console.error("Error during storePdfSummaryAction:", err);
    return createErrorResponse("Error storing summary");
  }
}
