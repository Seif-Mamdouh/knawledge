'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      pageSnapshotId: '2796c2c7-06b2-4d5f-bcf4-19b4e3d17fd4'
    }
  });

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input 
          name="prompt" 
          value={input} 
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}