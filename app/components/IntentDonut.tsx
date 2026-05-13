'use client';

import { Lead } from '@/lib/types';

interface IntentDonutProps {
  leads: Lead[];
}

export default function IntentDonut({ leads: allLeads }: IntentDonutProps) {
  const completed = allLeads.filter(l => l.status === 'completed');
  const selfUse = completed.filter(l => l.intent === 'self_use').length;
  const investment = completed.filter(l => l.intent === 'investment').length;
  const unclear = completed.filter(l => l.intent === 'unclear' || l.intent == null).length;
  const tot = completed.length || 1;

  const data = [
    { label: 'Self Use',   value: Math.round((selfUse / tot) * 100),   color: '#D4A853' },
    { label: 'Investment', value: Math.round((investment / tot) * 100), color: '#8FA8C7' },
    { label: 'Unclear',    value: Math.round((unclear / tot) * 100),    color: '#46556B' },
  ];

  const R = 54;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="wow-card wow-intent">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">INTENT MIX</div>
          <h3>What buyers want</h3>
        </div>
      </div>
      <div className="wow-intent-body">
        <svg viewBox="0 0 140 140" className="wow-donut">
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
          {data.map((d, i) => {
            const len = (d.value / 100) * C;
            const el = (
              <circle
                key={i} cx="70" cy="70" r={R} fill="none"
                stroke={d.color} strokeWidth="16"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 70 70)"
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
          <text x="70" y="68" textAnchor="middle" className="wow-donut-num">
            {data[0].value}<tspan className="wow-donut-pct">%</tspan>
          </text>
          <text x="70" y="84" textAnchor="middle" className="wow-donut-lbl">Self use</text>
        </svg>
        <div className="wow-legend">
          {data.map((d, i) => (
            <div key={i} className="wow-legend-row">
              <span className="wow-legend-sw" style={{ background: d.color }}></span>
              <span className="wow-legend-lbl">{d.label}</span>
              <span className="wow-legend-val">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
