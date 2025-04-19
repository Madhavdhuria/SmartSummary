"use client";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthings";
import { generatePdfSummary } from "@/actions/upload-actions";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "Filesize must be less than 20MB.",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be a PDF",
    }),
});

const Page = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast("Upload complete", {
        description: "Your file has been uploaded successfully.",
      });
      setLoading(false);
      if (formRef.current) formRef.current.reset();
    },
    onUploadError: () => {
      toast.error("Upload failed", {
        description: "Something went wrong. Please try again.",
      });
      setLoading(false);
    },
    onUploadBegin: () => {
      toast("Uploading...", {
        description: "Your PDF is currently being uploaded.",
      });
    },
  });

  const FormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData(e.currentTarget);
    const file = formdata.get("file") as File;

    const ValidatedFields = schema.safeParse({ file });

    if (!ValidatedFields.success) {
      toast.error("Invalid file", {
        description:
          ValidatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Please upload a valid PDF file under 20MB.",
      });
      setLoading(false);
      return;
    }

    

    const res = await startUpload([file]);
    if (!res) {
      toast.error("Upload error", {
        description: "Something went wrong. Try a different file.",
      });
      setLoading(false);
      return;
    }
    

    toast("Processing started", {
      description: "Hang on, our AI is summarizing your file.",
    });

    const summary = await generatePdfSummary(res);

    console.log(summary);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-100 dark:bg-card p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-foreground">
          Upload your PDF
        </h2>
        <p className="text-sm text-gray-600 dark:text-muted-foreground text-center mb-6">
          SmartSummary will read and summarize your file using AI.
        </p>

        <form className="space-y-4" onSubmit={FormSubmit} ref={formRef}>
          <div>
            <input
              name="file"
              type="file"
              accept="application/pdf"
              disabled={loading}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-rose-600 file:text-white
              hover:file:bg-rose-700
              dark:file:bg-primary dark:file:text-background
              disabled:opacity-70"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-70"
          >
            {loading ? "Uploading..." : "Upload & Summarize"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
