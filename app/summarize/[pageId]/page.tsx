"use client";
import NotesEditor from "@/components/NotesEditor";
import { SummaryChat } from "@/components/Chat/SummaryChat";
import { useEditor } from "novel";

interface SummarizePageProps {
  params: {
    pageId: string;
  };
}

export default function SummarizePage({ params }: SummarizePageProps) {
  const { editor } = useEditor();
  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center">
          <div className="w-full md:w-1/2 flex justify-center">
            <SummaryChat pageId={params.pageId} />
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full h-full">
              <NotesEditor pageId={params.pageId} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
