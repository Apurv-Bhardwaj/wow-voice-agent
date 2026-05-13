'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Icon from './Icon';

function formatDur(s: number | null) {
  if (s == null) return '—:—';
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

interface LiveCall {
  leadName: string;
  phone: string;
  startedAt: number;
}

interface OrbConsoleProps {
  live: boolean;
  dialing: boolean;
  liveCall: LiveCall | null;
  onStart: (opts: { name: string; phone: string }) => Promise<void>;
  onStop: () => void;
}

export default function OrbConsole({ live, dialing, liveCall, onStart, onStop }: OrbConsoleProps) {
  const [showStart, setShowStart] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (!live || !liveCall) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.floor((Date.now() - liveCall.startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [live, liveCall]);

  const [waveSeed, setWaveSeed] = useState(0);
  useEffect(() => {
    if (!live) return;
    const i = setInterval(() => setWaveSeed(s => s + 1), 100);
    return () => clearInterval(i);
  }, [live]);

  const bars = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const t = waveSeed / 6 + i * 0.4;
      const v = 0.35 + (Math.sin(t) * 0.4 + Math.sin(t * 1.7) * 0.25 + Math.cos(t * 0.6) * 0.2);
      return Math.max(0.08, Math.min(1, (v + 1) / 2));
    });
  }, [waveSeed]);

  const checkpoints = [
    { key: 'intent',    label: 'Intent',     state: live ? 'active' : 'pending', detail: live ? 'Probing use case…' : '' },
    { key: 'geo',       label: 'Geography',  state: 'pending', detail: '' },
    { key: 'budget',    label: 'Budget',     state: 'pending', detail: '' },
    { key: 'timeline',  label: 'Timeline',   state: 'pending', detail: '' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCallError(null);
    try {
      await onStart({ name, phone });
      setShowStart(false);
      setPhone('');
      setName('');
    } catch (err) {
      setCallError(err instanceof Error ? err.message : 'Failed to initiate call');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wow-card wow-orb-console">
      <div className="wow-orb-wrap">
        <div className="wow-orb-rings">
          <div className="wow-ring r1"></div>
          <div className="wow-ring r2"></div>
          <div className="wow-ring r3"></div>
        </div>
        <video
          ref={videoRef}
          className="wow-orb-video"
          src="/wowball.mp4"
          loop
          muted
          autoPlay
          playsInline
        />
        <div className="wow-orb-glow"></div>
      </div>

      <div className="wow-orb-side">
        <div className="wow-orb-head">
          <div>
            <div className="wow-orb-eyebrow">
              <span className={`wow-live-dot ${live ? 'is-live' : ''}`}></span>
              {live ? 'Live conversation' : dialing ? 'Dialing…' : 'Standing by'}
            </div>
            <div className="wow-orb-title">
              {live && liveCall ? liveCall.leadName : 'Meera is ready'}
            </div>
            <div className="wow-orb-sub">
              {live && liveCall
                ? `${liveCall.phone}`
                : 'Voice agent for Whispers of the Wind · en-IN · warm female'}
            </div>
          </div>
          <div className="wow-orb-timer">
            <div className="wow-timer-label">DURATION</div>
            <div className="wow-timer-val">{live ? formatDur(elapsed) : '—:—'}</div>
          </div>
        </div>

        <div className="wow-wave">
          {bars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${(live ? h : 0.12) * 100}%` }}
              className={live ? '' : 'is-idle'}
            />
          ))}
        </div>

        <div className="wow-checkpoints">
          {checkpoints.map(cp => (
            <div key={cp.key} className={`wow-cp wow-cp-${cp.state}`}>
              <div className="wow-cp-head">
                <span className="wow-cp-label">{cp.label}</span>
                <span className="wow-cp-pill">{cp.state}</span>
              </div>
              <div className="wow-cp-detail">{cp.detail || '—'}</div>
            </div>
          ))}
        </div>

        <div className="wow-orb-actions">
          {!live && !dialing && !showStart && (
            <button className="wow-cta wow-cta-lg" onClick={() => setShowStart(true)}>
              <Icon name="phone" size={15} />
              Start outbound call
            </button>
          )}
          {!live && !dialing && showStart && (
            <form className="wow-start-form" onSubmit={handleSubmit}>
              <input
                className="wow-input"
                placeholder="Lead name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <div className="wow-input wow-input-phone">
                <span>+91</span>
                <input
                  placeholder="98xxxxxxxx"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
              {callError && (
                <div className="wow-error-msg">{callError}</div>
              )}
              <button className="wow-cta" type="submit" disabled={loading}>
                <Icon name="phone" size={14} />
                {loading ? 'Dialing…' : 'Dial'}
              </button>
              <button type="button" className="wow-ghost" onClick={() => { setShowStart(false); setCallError(null); }}>
                Cancel
              </button>
            </form>
          )}
          {(live || dialing) && (
            <div className="wow-live-actions">
              <button className="wow-ghost"><Icon name="mic" size={14} />Listen in</button>
              <button className="wow-ghost"><Icon name="doc" size={14} />Open transcript</button>
              <button className="wow-danger" onClick={onStop}>
                <Icon name="x" size={14} />End call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
