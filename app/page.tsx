'use client';

import { FormEvent, useState } from 'react';
import { ChatCompletionStream } from 'together-ai/lib/ChatCompletionStream.mjs';

export default function Home() {
  const [question, setQuestion] = useState('why is the sky blue?');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    setAnswer('');

    const res = await fetch('/api/get-completion', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });

    if (!res.body) return;

    ChatCompletionStream.fromReadableStream(res.body)
      .on('content', (delta) => setAnswer((text) => text + delta))
      .on('end', () => setIsLoading(false));
  }

  return (
    <div className="m-8">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me a question"
            className="border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mt-2">
          <button
            className="bg-blue-500 text-sm font-medium text-white rounded px-3 py-2"
            disabled={isLoading}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p>{answer}</p>
      </div>
    </div>
  );
}
