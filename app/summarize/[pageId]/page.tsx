"use client";
import { SummaryChat } from "@/components/Chat/SummaryChat";
import Editor from "@/components/noveleditor/editor";
import { useEditor } from "novel";

interface SummarizePageProps {
  params: {
    pageId: string;
  };
}

export default function SummarizePage({ params }: SummarizePageProps) {
  const { editor } = useEditor();
  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900 flex flex-col items-center p-4">
      <div className="w-full max-w-7xl">
        <SummaryChat pageId={params.pageId} />
        <Editor initialValue={editor?.getJSON()} onChange={() => {}} />
      </div>
    </main>
  );
}
