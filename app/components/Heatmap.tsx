'use client';

import { Fragment } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['9a', '10', '11', '12p', '1', '2', '3', '4', '5', '6', '7', '8'];

const DATA = [
  [0,1,2,3,5,8,9,7,6,4,3,1],
  [1,2,4,6,9,12,11,9,7,5,3,2],
  [1,3,5,8,11,14,13,10,8,6,4,2],
  [2,4,7,10,13,16,15,12,10,7,5,3],
  [2,5,8,11,14,17,16,13,11,8,5,3],
  [3,6,9,12,15,18,17,14,12,9,6,3],
  [1,2,4,6,8,10,11,9,7,5,3,1],
];

const MAX = Math.max(...DATA.flat());

export default function Heatmap() {
  return (
    <div className="wow-card wow-heatmap">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">PICK-UP HEATMAP</div>
          <h3>When buyers answer</h3>
        </div>
        <div className="wow-heatmap-scale">
          <span>low</span>
          {[0.15, 0.3, 0.5, 0.75, 1].map((o, i) => (
            <span key={i} className="wow-heatmap-cell" style={{ background: `rgba(212, 168, 83, ${o})` }} />
          ))}
          <span>high</span>
        </div>
      </div>
      <div className="wow-heatmap-grid">
        <div></div>
        {HOURS.map(h => <div key={h} className="wow-heatmap-hour">{h}</div>)}
        {DATA.map((row, r) => (
          <Fragment key={r}>
            <div className="wow-heatmap-day">{DAYS[r]}</div>
            {row.map((v, c) => {
              const o = Math.max(0.05, v / MAX);
              return (
                <div
                  key={c}
                  className="wow-heatmap-cell"
                  style={{ background: `rgba(212, 168, 83, ${o})` }}
                  title={`${DAYS[r]} ${HOURS[c]} · ${v} pickups`}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
