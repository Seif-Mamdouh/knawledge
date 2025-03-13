"use client";

import { useEditor } from "novel";
import Editor from "@/components/noveleditor/editor";

export default function Page() {
  return (
      <NovelEditor />
  );
}

function NovelEditor() {
  const { editor } = useEditor();
  
  return (
    <div className="p-4">
      <Editor initialValue={editor?.getJSON()} onChange={() => {}} />
    </div>
  );
}