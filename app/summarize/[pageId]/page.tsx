"use client";
import { SummaryDisplay } from "@/components/Summary/SummaryDisplay";
import { SummaryChat } from "@/components/Chat/SummaryChat";

interface SummarizePageProps {
  params: {
    pageId: string;
  };
}

export default function SummarizePage({ params }: SummarizePageProps) {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900 flex flex-col items-center p-4">
      <div className="w-full max-w-7xl">
        {/* Chat interface for the summary */}
        <div className="mt-8 border-t pt-8">
          <SummaryChat pageId={params.pageId} />
        </div>
      </div>
    </main>
  );
}
