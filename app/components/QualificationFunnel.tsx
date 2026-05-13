'use client';

import { Lead } from '@/lib/types';
import Icon from './Icon';

interface QualificationFunnelProps {
  leads: Lead[];
}

export default function QualificationFunnel({ leads }: QualificationFunnelProps) {
  const total = leads.length;
  const connected = leads.filter(l => l.status !== 'failed' && l.status !== 'no_answer').length;
  const engaged = leads.filter(l => l.status === 'completed' || l.status === 'calling').length;
  const intentClear = leads.filter(l => l.intent != null).length;
  const qualified = leads.filter(l => l.qualified).length;
  const siteVisit = leads.filter(l => l.cta_outcome === 'follow_up_booked').length;

  const stages = [
    { stage: 'Dialed',            count: total,      color: 'slate' },
    { stage: 'Connected',         count: connected,  color: 'slate' },
    { stage: 'Engaged',           count: engaged,    color: 'amber' },
    { stage: 'Intent Clear',      count: intentClear, color: 'amber' },
    { stage: 'Qualified',         count: qualified,  color: 'gold' },
    { stage: 'Site Visit Booked', count: siteVisit,  color: 'gold' },
  ];

  const max = stages[0].count || 1;

  return (
    <div className="wow-card wow-funnel">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">QUALIFICATION FUNNEL</div>
          <h3>Lead journey · all time</h3>
        </div>
        <button className="wow-ghost-sm">
          All time <Icon name="chev" size={11} />
        </button>
      </div>
      <div className="wow-funnel-list">
        {stages.map((f, i) => {
          const pct = max > 0 ? (f.count / max) * 100 : 0;
          return (
            <div key={i} className="wow-funnel-row">
              <div className="wow-funnel-label">{f.stage}</div>
              <div className="wow-funnel-bar">
                <div
                  className={`wow-funnel-fill wow-fill-${f.color}`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                >
                  <span>{f.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="wow-funnel-pct">{Math.round(pct)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
