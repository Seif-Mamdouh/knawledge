import { useState } from 'react';

export function ChatInput({ onSubmit }: { onSubmit: (message: string, pageSnapshotId: string) => void }) {
  const [message, setMessage] = useState('');
  const [pageSnapshotId, setPageSnapshotId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(message, pageSnapshotId);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={pageSnapshotId}
          onChange={(e) => setPageSnapshotId(e.target.value)}
          placeholder="Enter Page Snapshot ID"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
} 