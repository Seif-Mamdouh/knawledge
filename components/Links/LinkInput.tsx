"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addPage } from "@/app/actions/addPage";

interface LinkInputProps {
  pageId: string;
  onAddLink: (url: string) => void;
}

export function LinkInput({ pageId, onAddLink }: LinkInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = async () => {
    try {
      const result = await addPage(url);
      if (result.success) {
        setUrl(""); // Clear input on success
        onAddLink(url); // Notify parent component
      }
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-black rounded-lg border border-gray-800">
      <h3 className="text-center text-white text-sm font-medium">Add URL</h3>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 bg-transparent text-white border-gray-700"
        />
        <Button 
          onClick={handleSubmit}
          variant="outline"
          className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
        >
          Add
        </Button>
      </div>
    </div>
  );
} 