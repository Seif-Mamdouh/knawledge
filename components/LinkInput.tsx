"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface LinkInputProps {
  onAddLink: (url: string) => void;
}

export function LinkInput({ onAddLink }: LinkInputProps) {
  const [url, setUrl] = useState<string>("");

  const handleAddLink = () => {
    if (!url.trim()) return;
    
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    onAddLink(formattedUrl);
    setUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddLink();
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
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className="flex-1 bg-transparent text-white border-gray-700"
        />
        <Button 
          onClick={handleAddLink}
          variant="outline"
          className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
        >
          Add
        </Button>
      </div>
    </div>
  );
} 