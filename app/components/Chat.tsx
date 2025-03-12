import { useChat } from 'ai/react';
import { ChatInput } from './ChatInput';

export function Chat() {
  const { messages, append } = useChat({
    api: '/api/chat',
  });

  const handleSubmit = async (message: string, pageSnapshotId: string) => {
    await append({
      content: message,
      role: 'user',
    }, {
      body: {
        pageSnapshotId,
      },
    });
  };

  return (
    <div>
      {/* Display messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      {/* Chat input */}
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
} 