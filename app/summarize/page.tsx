"use client";
import { LinkInput } from "@/components/Links/LinkInput";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SummarizePage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    router.push("/auth/signin");
  }
  
  const handleAddLink = (url: string, pageId: string) => {
    console.log("Added URL:", url, "with pageId:", pageId);
    router.push(`/summarize/${pageId}`);
  };
  
  console.log("Current user:", session?.user?.id);
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <LinkInput 
        pageId="" 
        onAddLink={handleAddLink}
      />
    </main>
  );
}
