"use client";

import { useState } from "react";
import { LinkInput } from "./LinkInput";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export function LinkManager() {
  const [links, setLinks] = useState<string[]>([]);

  const addLink = (url: string) => {
    if (!links.includes(url)) {
      setLinks([...links, url]);
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
      <LinkInput onAddLink={addLink} />
      
      {links.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-200">Added URLs:</h3>
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm truncate mr-2"
                >
                  {link}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(index)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 