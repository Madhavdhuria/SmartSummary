import { getSummary } from "@/lib/summaries";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const summary = await getSummary(id);

  if (!summary) notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl lg:text-4xl  lg:tracking-tight font-bold text-red-400">
            {summary.title}
          </h1>
          <div>
            <p className="text-sm text-gray-500 text-center">
              Created on{" "}
              {new Date(summary.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-950 text-center mb-6">
              {summary.file_name}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar flex space-x-4 snap-x snap-mandatory border-2 rounded-lg p-3 shadow-md bg-white ">
          {summary.summary_text}
        </div>

        <div className="text-center mt-4 p-2 flex justify-around items-center">
          <button className="bg-rose-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-rose-600 transition duration-200">
            <Link href="/dashboard">Back to Dashboard</Link>
          </button>
          <button className="bg-rose-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-rose-600 transition duration-200">
            <a href={summary.original_file_url} target="_blank">
              <ExternalLink className="inline mr-1" />
              View Original PDF
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
