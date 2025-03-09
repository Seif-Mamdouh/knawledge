"use client";
import { LinkInput } from "@/components/Links/LinkInput";
import { SummaryDisplay } from "@/components/Summary/SummaryDisplay";

interface SummarizePageProps {
  params: {
    pageId: string;
  };
}

export default function SummarizePage({ params }: SummarizePageProps) {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <SummaryDisplay pageId={params.pageId} />
      </div>
    </main>
  );
}
