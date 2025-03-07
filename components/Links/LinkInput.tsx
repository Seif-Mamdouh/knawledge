"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addLinkToPage } from "@/app/actions/links";

interface LinkInputProps {
  pageId: string;
  onAddLink: (url: string) => void;
}

export function LinkInput({ pageId, onAddLink }: LinkInputProps) {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await addLinkToPage(url, pageId);
      
      if (result.success) {
        onAddLink(url);
        setUrl("");
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4 bg-black rounded-lg border border-gray-800">
      <h3 className="text-center text-white text-sm font-medium">Add URL</h3>
      <div className="flex space-x-2">
        <Input
          value={url}
          onChange={handleChange}
          type="text"
          placeholder="https://example.com"
          className="flex-1 bg-transparent text-white border-gray-700"
          disabled={isLoading}
        />
        <Button 
          variant="outline"
          className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
} 