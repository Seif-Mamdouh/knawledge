"use client";

import Editor from "@/components/NovelEditor/editor";

import { useEditor } from "novel";

export default function Page() {
  const { editor } = useEditor();

  return (
    <div>
      <Editor initialValue={editor?.getJSON()} onChange={() => {}} />
    </div>
  );
}