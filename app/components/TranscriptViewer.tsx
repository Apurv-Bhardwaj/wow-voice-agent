'use client';

import { TranscriptMessage } from '@/lib/types';

interface TranscriptViewerProps {
  messages: TranscriptMessage[];
}

export default function TranscriptViewer({ messages }: TranscriptViewerProps) {
  if (!messages.length) {
    return (
      <p className="text-slate-500 text-sm font-body italic py-2">
        No transcript available.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[80%] rounded-xl px-3 py-2 text-sm font-body ${
              msg.role === 'assistant'
                ? 'bg-accent-gold/10 border border-accent-gold/20 text-accent-warm'
                : 'bg-bg-primary border border-border text-slate-200'
            }`}
          >
            {msg.timestamp && (
              <p className="text-[10px] text-slate-500 mb-0.5">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            )}
            <p>{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
