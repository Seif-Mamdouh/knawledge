"use client";
import { LinkInput } from "@/components/Links/LinkInput";

interface SummarizePageProps {
  params: {
    pageId: string;
  };
}

export default function SummarizePage({ params }: SummarizePageProps) {
  const handleAddLink = (url: string) => {
    // You can add additional client-side handling here if needed
    console.log("Link added:", url);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">URL Manager</h1>
      <div className="max-w-md mx-auto">
        <LinkInput 
          pageId={params.pageId} 
          onAddLink={handleAddLink}
        />
      </div>
    </div>
  );
} 