"use client";

import React, { useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/utils/uploadthings";
import {
  ExtractText,
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "Filesize must be less than 20MB.",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be a PDF.",
    }),
});

const UploadPage = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Upload & Summarize");

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: handleUploadComplete,
    onUploadError: handleUploadError,
    onUploadBegin: handleUploadBegin,
  });

  function handleUploadComplete() {
    toast("Upload complete", {
      description: "Your file has been uploaded successfully.",
    });
  }

  function handleUploadError() {
    toast.error("Upload failed", {
      description: "Something went wrong. Please try again.",
    });
  }

  function handleUploadBegin() {
    toast("Uploading...", {
      description: "Your PDF is currently being uploaded.",
    });
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setButtonText("Uploading...");

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validation = schema.safeParse({ file });
    if (!validation.success) {
      toast.error("Invalid file", {
        description:
          validation.error.flatten().fieldErrors.file?.[0] ??
          "Please upload a valid PDF under 20MB.",
      });
      setLoading(false);
      setButtonText("Upload & Summarize");
      return;
    }

    const uploadResponse = await startUpload([file]);
    if (!uploadResponse) {
      toast.error("Upload error", {
        description: "Something went wrong. Try a different file.",
      });
      setLoading(false);
      setButtonText("Upload & Summarize");
      return;
    }

    toast("Processing started", {
      description: "Extracting text from your PDF...",
    });
    setButtonText("Extracting text...");

    const extractionResult = await ExtractText(uploadResponse);
    if (!extractionResult.success) {
      toast.error("Text extraction failed", {
        description: extractionResult.message,
      });
      setLoading(false);
      setButtonText("Upload & Summarize");
      return;
    }

    setButtonText("Generating summary...");
    let title = "Untitled";

    const summaryResult = await generatePdfSummary(extractionResult.data ?? "");
    if (!summaryResult.success) {
      toast.error("Summary generation failed", {
        description: summaryResult.message,
      });
      setLoading(false);
      setButtonText("Upload & Summarize");
      const titleMatch = summaryResult.data?.match(
        /📌\s*\*\*Title:\*\*\s*\n?(.+)/
      );
      title = titleMatch ? titleMatch[1].trim() : "Untitled";
      return;
    }

    toast.success("Summary generated", {
      description: "Storing summary into the database...",
    });
    setButtonText("Saving summary...");

    const storageResult = await storePdfSummaryAction({
      status: "completed",
      originalFileUrl: uploadResponse[0].serverData.file.ufsUrl,
      summaryText: summaryResult.data ?? "",
      fileName: uploadResponse[0].serverData.file.name,
      title,
    });

    if (storageResult.success) {
      toast.success("Summary saved", {
        description: "Your PDF summary has been successfully stored.",
      });
      router.push(`/summary/${storageResult.data.id}`);
    } else {
      toast.error("Database save error", {
        description: storageResult.message,
      });
    }

    setLoading(false);
    setButtonText("Upload & Summarize");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-background">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-gray-100 dark:bg-card">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-foreground">
          Upload your PDF
        </h2>
        <p className="text-sm text-gray-600 dark:text-muted-foreground text-center mb-6">
          SmartSummary will read and summarize your file using AI.
        </p>

        <form className="space-y-4" onSubmit={handleFormSubmit} ref={formRef}>
          <input
            name="file"
            type="file"
            accept="application/pdf"
            disabled={loading}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-rose-600 file:text-white hover:file:bg-rose-700
              dark:file:bg-primary dark:file:text-background disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium disabled:opacity-70"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
