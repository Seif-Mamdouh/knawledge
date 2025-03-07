import { LinkManager } from "@/components/LinkManager";

export default function SummarizePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">URL Manager</h1>
      <div className="max-w-md mx-auto">
        <LinkManager />
      </div>
    </div>
  );
}
