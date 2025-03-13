"use client";
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
        {/* Chat interface showing the summary being generated */}
        <SummaryChat pageId={params.pageId} />
      </div>
    </main>
  );
}
