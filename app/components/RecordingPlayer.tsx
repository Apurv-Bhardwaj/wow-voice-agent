'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface RecordingPlayerProps {
  url: string;
}

export default function RecordingPlayer({ url }: RecordingPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-bg-card border border-border rounded-lg p-4">
      <p className="text-xs text-slate-400 font-body uppercase tracking-wider mb-3">
        Call Recording
      </p>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center shrink-0">
          {playing ? (
            <Pause size={12} className="text-accent-gold" />
          ) : (
            <Play size={12} className="text-accent-gold" />
          )}
        </div>
        <audio
          controls
          src={url}
          className="flex-1 h-8"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      </div>
    </div>
  );
}
