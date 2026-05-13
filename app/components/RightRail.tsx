'use client';

import { Lead } from '@/lib/types';
import Icon from './Icon';

function formatDur(s: number | null) {
  if (s == null) return '—:—';
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

interface LiveCallInfo {
  leadName: string;
  phone: string;
  startedAt: number;
  elapsed: number;
}

interface RightRailProps {
  leads: Lead[];
  live: boolean;
  liveCallInfo: LiveCallInfo | null;
}

export default function RightRail({ leads, live, liveCallInfo }: RightRailProps) {
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);

  const activity = recentLeads.map(l => {
    if (l.status === 'calling') return { kind: 'started', text: `Outbound call started — ${l.name}`, t: timeAgo(l.updated_at) };
    if (l.qualified) return { kind: 'qualified', text: `${l.name} qualified — ${l.cta_outcome?.replace(/_/g, ' ') ?? 'High intent'}`, t: timeAgo(l.updated_at) };
    if (l.cta_outcome === 'brochure_sent') return { kind: 'sent', text: `Brochure sent — ${l.name}`, t: timeAgo(l.updated_at) };
    if (l.cta_outcome === 'declined') return { kind: 'objection', text: `${l.name}: call completed`, t: timeAgo(l.updated_at) };
    if (l.status === 'no_answer' || l.status === 'failed') return { kind: 'queue', text: `No answer — ${l.name}`, t: timeAgo(l.updated_at) };
    return { kind: 'queue', text: `${l.name} — ${l.status}`, t: timeAgo(l.updated_at) };
  });

  const qualifiedCount = leads.filter(l => l.qualified).length;

  return (
    <aside className="wow-rightrail">
      {/* Live now */}
      <div className="wow-card wow-rl-live">
        <div className="wow-rl-head">
          <div className="wow-card-eyebrow">
            <span className={`wow-live-dot ${live ? 'is-live' : ''}`}></span>
            {live ? 'LIVE NOW' : 'STANDBY'}
          </div>
          {liveCallInfo && <span className="wow-rl-timer">{formatDur(liveCallInfo.elapsed)}</span>}
        </div>
        {liveCallInfo ? (
          <>
            <div className="wow-rl-name">{liveCallInfo.leadName}</div>
            <div className="wow-rl-meta">{liveCallInfo.phone}</div>
            <div className="wow-rl-sentiment">
              <div className="wow-rl-sub">
                Sentiment <span className="wow-rl-pos">Monitoring…</span>
              </div>
              <div className="wow-sent-bar">
                <div className="wow-sent-fill" style={{ width: '60%' }} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="wow-rl-name">Meera</div>
            <div className="wow-rl-meta">Ready for next call</div>
          </>
        )}
      </div>

      {/* Activity */}
      <div className="wow-card wow-rl-activity">
        <div className="wow-card-eyebrow">ACTIVITY · TODAY</div>
        {activity.length === 0 ? (
          <div style={{ padding: '16px 0', color: 'var(--wow-text-3)', fontSize: '12px' }}>
            No activity yet
          </div>
        ) : (
          <div className="wow-act-list">
            {activity.map((a, i) => (
              <div key={i} className={`wow-act wow-act-${a.kind}`}>
                <span className="wow-act-dot"></span>
                <div className="wow-act-body">
                  <div className="wow-act-text">{a.text}</div>
                  <div className="wow-act-time">{a.t}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insight */}
      <div className="wow-card wow-rl-insight">
        <div className="wow-card-eyebrow">INSIGHT</div>
        <div className="wow-rl-insight-title">
          {qualifiedCount > 0 ? `${qualifiedCount} leads qualified` : 'Start calling leads'}
        </div>
        <div className="wow-rl-insight-body">
          {qualifiedCount > 0
            ? <>Pipeline value estimated at <b className="wow-gold">₹{qualifiedCount * 4} Cr</b> based on qualified leads × ₹4 Cr avg villa price.</>
            : 'Use the orb console above to place your first outbound call and begin qualifying leads.'}
        </div>
        <button className="wow-cta-ghost">
          View pipeline <Icon name="chev" size={11} />
        </button>
      </div>
    </aside>
  );
}
