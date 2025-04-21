import React from "react";
import Link from "next/link";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { getSummaries } from "@/lib/summaries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const userId = user?.id;
  const summaries = await getSummaries(userId);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">Your Summaries</h1>
          <p className="mt-2 text-gray-600">
            Transform your PDFs into concise, actionable insights
          </p>
        </div>
        <Link
          href="/upload"
          className="rounded-md bg-rose-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-rose-600"
        >
          New Summary
        </Link>
      </div>

      {summaries.length === 0 ? (
        <div className="mt-16 text-center text-gray-500">
          <p className="text-lg font-medium">No summaries found.</p>
          <p className="mt-2">Start by uploading a PDF to generate your first summary.</p>
        </div>
      ) : (
        <div className="container mx-auto mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary) => (
            <SummaryCard
              key={summary.id}
              id={summary.id}
              title={summary.title}
              createdAt={new Date(summary.created_at).toLocaleString()}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;
