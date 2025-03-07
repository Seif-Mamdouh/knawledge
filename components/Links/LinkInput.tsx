"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addLinkToPage } from "@/app/actions/links";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LinkInputProps {
  pageId: string;
  onAddLink: (url: string) => void;
}

export function LinkInput({ pageId, onAddLink }: LinkInputProps) {
  const [url, setUrl] = useState<string>("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      const result = await addLinkToPage(url, pageId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      onAddLink(url);
      setUrl("");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['pages', pageId] });
    },
    onError: (error) => {
      console.error("Failed to add link:", error);
      // You could add toast notification here
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }

  const handleClick = () => {
    mutation.mutate(url);
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
          disabled={mutation.isPending}
        />
        <Button 
          variant="outline"
          className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
          onClick={handleClick}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
} 