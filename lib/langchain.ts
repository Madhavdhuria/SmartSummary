import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractandsummarizePdf(pdfUrl: string) {
  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF. Status: ${response.status}`);
    }

    const pdfBlob = await response.blob();
    const arrayBuffer = await pdfBlob.arrayBuffer();

    const loader = new PDFLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();

    const fullText = docs.map((doc) => doc.pageContent).join("\n");
    return fullText;
  } catch (error) {
    console.error("Error loading or summarizing PDF:", error);
    throw new Error("Failed to extract and summarize PDF content.");
  }
}
