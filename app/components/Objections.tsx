'use client';

import Icon from './Icon';

const OBJECTIONS = [
  { label: 'Price above budget',       count: 184, trend: +4 },
  { label: 'Timeline too long (2027)', count: 121, trend: -2 },
  { label: 'Wants ready-to-move',      count: 96,  trend: +1 },
  { label: 'Distance from city',       count: 73,  trend: -6 },
  { label: 'Investment ROI unclear',   count: 58,  trend: +3 },
];

const MAX = Math.max(...OBJECTIONS.map(o => o.count));

export default function Objections() {
  return (
    <div className="wow-card wow-obj">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">TOP OBJECTIONS</div>
          <h3>What&apos;s blocking deals</h3>
        </div>
      </div>
      <div className="wow-obj-list">
        {OBJECTIONS.map((o, i) => (
          <div key={i} className="wow-obj-row">
            <div className="wow-obj-head">
              <span className="wow-obj-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="wow-obj-label">{o.label}</span>
              <span className="wow-obj-count">{o.count}</span>
              <span className={`wow-delta ${o.trend >= 0 ? 'pos' : 'neg'}`}>
                <Icon name={o.trend >= 0 ? 'arrowUp' : 'arrowDn'} size={10} />
                {Math.abs(o.trend)}
              </span>
            </div>
            <div className="wow-obj-bar">
              <div className="wow-obj-fill" style={{ width: `${(o.count / MAX) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
