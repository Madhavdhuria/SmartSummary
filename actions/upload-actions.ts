"use server";

import { extractandsummarizePdf } from "@/lib/langchain";

export async function generatePdfSummary(
  UploadResponse: {
    name: string;
    size: number;
    key: string;
    url: string;
    serverData?: {
      userId: string;
      file: { url: string; name: string };
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

  if (!first?.serverData?.file?.url) {
    return {
      success: false,
      message: "Missing file data",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = first;

  try {
    const summary = await extractandsummarizePdf(pdfUrl);

    return {
      success: true,
      message: "Summary generated successfully",
      data: summary,
    };
  } catch (error) {
    console.error("Summary generation error:", error);
    return {
      success: false,
      message: "Error generating summary",
      data: null,
    };
  }
}
