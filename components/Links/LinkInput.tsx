"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface LinkInputProps {
  onAddLink: (url: string) => void;
}


export function LinkInput({ onAddLink }: LinkInputProps) {

  const [url, setUrl] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }

  const handleClick = () => {
    onAddLink(url);
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
        />
        <Button 
          variant="outline"
          className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
          onClick={handleClick}
        >
          Add
        </Button>
      </div>
    </div>
  );
} 