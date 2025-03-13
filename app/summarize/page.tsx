"use client";
import { LinkInput } from "@/components/Links/LinkInput";
import { useRouter } from "next/navigation";

export default function SummarizePage() {
  const router = useRouter();
  
  const handleAddLink = (url: string, pageId: string) => {
    console.log("Added URL:", url, "with pageId:", pageId);
    router.push(`/summarize/${pageId}`);
  };
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <LinkInput 
        pageId="" 
        onAddLink={handleAddLink}
      />
    </main>
  );
}
