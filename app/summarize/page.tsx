"use client";
import { LinkInput } from "@/components/Links/LinkInput";

export default function SummarizePage() {

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">URL Manager</h1>
      <div className="max-w-md mx-auto">
        <LinkInput 
          pageId="" 
          onAddLink={(url) => console.log("Added URL:", url)}
        />
      </div>
    </div>
  );
} 