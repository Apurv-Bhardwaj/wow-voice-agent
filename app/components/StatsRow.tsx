'use client';

import Icon from './Icon';

function formatDur(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function Sparkline({ series, w = 80, h = 22 }: { series: number[]; w?: number; h?: number }) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const last = series[series.length - 1];
  const lx = w;
  const ly = h - ((last - min) / range) * h;
  const gradId = `sg${series.slice(0, 3).join('')}`;
  return (
    <svg width={w} height={h} className="wow-spark">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#D4A853" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#D4A853" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke="#D4A853" strokeWidth="1.4" />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gradId})`} opacity="0.5" />
      <circle cx={lx} cy={ly} r="2.2" fill="#E8B96B" />
    </svg>
  );
}

interface StatsRowProps {
  totalCalls: number;
  qualified: number;
  avgDuration: number;
  conversionRate: number;
}

export default function StatsRow({ totalCalls, qualified, avgDuration, conversionRate }: StatsRowProps) {
  const cards = [
    {
      k: 'CALLS · TODAY',
      v: totalCalls.toString(),
      suffix: '',
      d: 0,
      series: Array.from({ length: 14 }, (_, i) => Math.max(1, totalCalls - (13 - i) * 2 + Math.random() * 4)),
    },
    {
      k: 'QUALIFIED',
      v: qualified.toString(),
      suffix: '',
      d: 0,
      series: Array.from({ length: 14 }, (_, i) => Math.max(0, qualified - (13 - i) + Math.random() * 2)),
    },
    {
      k: 'AVG DURATION',
      v: totalCalls > 0 ? formatDur(avgDuration) : '—',
      suffix: '',
      d: 0,
      series: Array.from({ length: 14 }, () => Math.max(60, avgDuration + (Math.random() - 0.5) * 60)),
    },
    {
      k: 'CONVERSION',
      v: totalCalls > 0 ? conversionRate.toFixed(0) : '—',
      suffix: totalCalls > 0 ? '%' : '',
      d: 0,
      series: Array.from({ length: 14 }, () => Math.max(0, conversionRate + (Math.random() - 0.5) * 10)),
    },
    {
      k: 'PIPELINE VALUE',
      v: qualified > 0 ? `₹${(qualified * 4).toFixed(0)} Cr` : '—',
      suffix: '',
      d: 0,
      series: Array.from({ length: 14 }, (_, i) => Math.max(0, qualified * 4 - (13 - i) * 8 + Math.random() * 16)),
    },
  ];

  return (
    <div className="wow-stats-row">
      {cards.map((c, i) => (
        <div key={i} className="wow-card wow-stat">
          <div className="wow-stat-k">{c.k}</div>
          <div className="wow-stat-v">
            {c.v}<span className="wow-stat-suffix">{c.suffix}</span>
          </div>
          <div className="wow-stat-foot">
            <span className={`wow-delta ${c.d >= 0 ? 'pos' : 'neg'}`}>
              <Icon name={c.d >= 0 ? 'arrowUp' : 'arrowDn'} size={11} />
              {Math.abs(c.d)}%
            </span>
            <Sparkline series={c.series} />
          </div>
        </div>
      ))}
    </div>
  );
}
