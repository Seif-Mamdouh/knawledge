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
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <LinkInput 
        pageId={params.pageId} 
        onAddLink={() => {}} 
      />
      <SummaryDisplay pageId={params.pageId} />
    </main>
  );
}
