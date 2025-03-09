"use client";
import { LinkInput } from "@/components/Links/LinkInput";

export default function SummarizePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <LinkInput 
        pageId="" 
        onAddLink={(url) => console.log("Added URL:", url)}
      />
    </main>
  );
}
