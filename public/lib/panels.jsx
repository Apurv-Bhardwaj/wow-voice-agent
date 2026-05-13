/* global React, WOW_DATA, Icon, formatDur, mapApiLead, loadLeads, timeAgo */
const { useState, useEffect, useMemo, useRef } = React;

// =============== STATS ROW ===============
function StatsRow() {
  const s = WOW_DATA.stats;
  const cards = [
    { k: 'CALLS · 24H',    v: s.calls_total.value,    d: s.calls_total.delta,    series: s.calls_total.series,    suffix: '' },
    { k: 'QUALIFIED',      v: s.qualified.value,      d: s.qualified.delta,      series: s.qualified.series,      suffix: '' },
    { k: 'AVG DURATION',   v: s.avg_duration.value,   d: s.avg_duration.delta,   series: s.avg_duration.series,   suffix: '' },
    { k: 'CONVERSION',     v: s.conversion.value,     d: s.conversion.delta,     series: s.conversion.series,     suffix: '%' },
    { k: 'PIPELINE VALUE', v: s.pipeline_value.value, d: s.pipeline_value.delta, series: s.pipeline_value.series, suffix: '' },
  ];
  return (
    <div className="wow-stats-row">
      {cards.map((c, i) => (
        <div key={i} className="wow-card wow-stat">
          <div className="wow-stat-k">{c.k}</div>
          <div className="wow-stat-v">{c.v}<span className="wow-stat-suffix">{c.suffix}</span></div>
          <div className="wow-stat-foot">
            <span className={`wow-delta ${c.d >= 0 ? 'pos' : 'neg'}`}>
              <Icon name={c.d >= 0 ? 'arrowUp' : 'arrowDn'} size={11}/>
              {Math.abs(c.d)}%
            </span>
            <Sparkline series={c.series}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ series, w = 80, h = 22 }) {
  const min = Math.min(...series), max = Math.max(...series);
  const range = max - min || 1;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const last = series[series.length - 1];
  const lx = w;
  const ly = h - ((last - min) / range) * h;
  const gid = `sg${series.join('-').slice(0,6)}`;
  return (
    <svg width={w} height={h} className="wow-spark">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#D4A853" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#D4A853" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke="#D4A853" strokeWidth="1.4"/>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gid})`} opacity="0.5"/>
      <circle cx={lx} cy={ly} r="2.2" fill="#E8B96B"/>
    </svg>
  );
}

// =============== FUNNEL ===============
function Funnel() {
  const max = WOW_DATA.funnel[0].count;
  return (
    <div className="wow-card wow-funnel">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">QUALIFICATION FUNNEL</div>
          <h3>Lead journey · last 30 days</h3>
        </div>
      </div>
      <div className="wow-funnel-list">
        {WOW_DATA.funnel.map((f, i) => {
          const pct = (f.count / max) * 100;
          return (
            <div key={i} className="wow-funnel-row">
              <div className="wow-funnel-label">{f.stage}</div>
              <div className="wow-funnel-bar">
                <div className={`wow-funnel-fill wow-fill-${f.color}`} style={{ width: `${pct}%` }}>
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

// =============== INTENT DONUT ===============
function IntentDonut() {
  const data = WOW_DATA.intent_split;
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 54, C = 2 * Math.PI * R;
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
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16"/>
          {data.map((d, i) => {
            const len = (d.value / total) * C;
            const el = (
              <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={d.color} strokeWidth="16"
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset}
                transform="rotate(-90 70 70)" strokeLinecap="butt"/>
            );
            offset += len;
            return el;
          })}
          <text x="70" y="68" textAnchor="middle" className="wow-donut-num">{data[0].value}<tspan className="wow-donut-pct">%</tspan></text>
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

// =============== HEATMAP ===============
function Heatmap() {
  const data = WOW_DATA.heatmap;
  const max = Math.max(...data.flat());
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const hours = ['9a','10','11','12p','1','2','3','4','5','6','7','8'];
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
            <span key={i} className="wow-heatmap-cell" style={{ background: `rgba(212, 168, 83, ${o})` }}></span>
          ))}
          <span>high</span>
        </div>
      </div>
      <div className="wow-heatmap-grid">
        <div></div>
        {hours.map(h => <div key={h} className="wow-heatmap-hour">{h}</div>)}
        {data.map((row, r) => (
          <React.Fragment key={r}>
            <div className="wow-heatmap-day">{days[r]}</div>
            {row.map((v, c) => {
              const o = Math.max(0.05, v / max);
              return <div key={c} className="wow-heatmap-cell" style={{ background: `rgba(212, 168, 83, ${o})` }} title={`${days[r]} ${hours[c]} · ${v} pickups`}></div>;
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// =============== OBJECTIONS ===============
function Objections() {
  const max = Math.max(...WOW_DATA.objections.map(o => o.count));
  return (
    <div className="wow-card wow-obj">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">TOP OBJECTIONS</div>
          <h3>What's blocking deals</h3>
        </div>
      </div>
      <div className="wow-obj-list">
        {WOW_DATA.objections.map((o, i) => (
          <div key={i} className="wow-obj-row">
            <div className="wow-obj-head">
              <span className="wow-obj-rank">{String(i+1).padStart(2,'0')}</span>
              <span className="wow-obj-label">{o.label}</span>
              <span className="wow-obj-count">{o.count}</span>
              <span className={`wow-delta ${o.trend >= 0 ? 'pos' : 'neg'}`}>
                <Icon name={o.trend >= 0 ? 'arrowUp' : 'arrowDn'} size={10}/>
                {Math.abs(o.trend)}
              </span>
            </div>
            <div className="wow-obj-bar">
              <div className="wow-obj-fill" style={{ width: `${(o.count / max) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============== LEAD PIPELINE TABLE ===============
function LeadPipeline({ onSelect, selectedId }) {
  const [filter, setFilter] = useState('all');
  const [leads, setLeads] = useState(WOW_DATA.leads);

  // Listen for live updates from data.jsx loader
  useEffect(() => {
    const onUpdate = () => setLeads([...WOW_DATA.leads]);
    window.addEventListener('wow:leads-updated', onUpdate);
    return () => window.removeEventListener('wow:leads-updated', onUpdate);
  }, []);

  // Refresh every 15 seconds to pick up new calls
  useEffect(() => {
    const id = setInterval(async () => {
      await loadLeads();
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'qualified') return leads.filter(l => l.score >= 75);
    if (filter === 'live')      return leads.filter(l => l.status === 'calling');
    if (filter === 'today')     return leads.filter(l => l.when.includes('m ago') || l.when === 'just now' || l.when.includes('h'));
    return leads;
  }, [filter, leads]);

  const liveCount = leads.filter(l => l.status === 'calling').length;

  return (
    <div className="wow-card wow-pipeline">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">LEAD PIPELINE</div>
          <h3>Recent conversations <span style={{color:'var(--wow-accent)',fontSize:'0.75rem',fontFamily:'var(--font-mono)',fontWeight:400,marginLeft:'8px'}}>{leads.length} total</span></h3>
        </div>
        <div className="wow-tabs">
          {[['all','All'],['live',`Live${liveCount ? ` (${liveCount})` : ''}`],['qualified','Qualified'],['today','Today']].map(([k,v]) => (
            <button key={k} onClick={() => setFilter(k)} className={`wow-tab ${filter===k?'is-active':''}`}>{v}</button>
          ))}
        </div>
      </div>

      <div className="wow-table-wrap">
        <table className="wow-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Intent</th>
              <th className="ctr">Geo</th>
              <th className="ctr">Budget</th>
              <th className="ctr">Timeline</th>
              <th>Score</th>
              <th>Outcome</th>
              <th>When</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{textAlign:'center',padding:'2rem',opacity:0.4}}>No leads yet — start a call above</td></tr>
            )}
            {filtered.map(l => (
              <tr key={l.id}
                className={`${selectedId === l.id ? 'is-selected' : ''} ${l.status==='calling' ? 'is-live' : ''}`}
                onClick={() => onSelect(l)}
              >
                <td>
                  <div className="wow-lead-cell">
                    <div className={`wow-lead-avatar wow-av-${l.score>=75?'gold':(l.score>=50?'amber':'slate')}`}>
                      {l.name.split(' ').map(p=>p[0]).slice(0,2).join('')}
                    </div>
                    <div>
                      <div className="wow-lead-name">{l.name}</div>
                      <div className="wow-lead-phone">{l.phone}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`wow-pill wow-pill-${l.intent || 'muted'}`}>{(l.intent || '—').replace('_',' ')}</span></td>
                <td className="ctr">{checkCell(l.geo)}</td>
                <td className="ctr">{checkCell(l.bud)}</td>
                <td className="ctr">{checkCell(l.tim)}</td>
                <td><ScoreBar score={l.score}/></td>
                <td>
                  {l.cta
                    ? <span className={`wow-cta-pill wow-cta-${l.cta}`}>{l.cta.replace(/_/g,' ')}</span>
                    : <span className="wow-muted">{l.status === 'calling' ? '…' : '—'}</span>}
                </td>
                <td className="wow-muted-cell">{l.when}</td>
                <td><Icon name="chev" size={13} className="wow-row-chev"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function checkCell(v) {
  if (v === true)  return <span className="wow-check wow-check-on"><Icon name="check" size={11}/></span>;
  if (v === false) return <span className="wow-check wow-check-off"><Icon name="x" size={11}/></span>;
  return <span className="wow-check wow-check-na">—</span>;
}

function ScoreBar({ score }) {
  const tone = score >= 75 ? 'gold' : score >= 50 ? 'amber' : score >= 25 ? 'orange' : 'slate';
  return (
    <div className="wow-score">
      <div className="wow-score-bar"><div className={`wow-score-fill wow-score-${tone}`} style={{ width: `${score}%` }}></div></div>
      <span className={`wow-score-num wow-score-${tone}-text`}>{score}</span>
    </div>
  );
}

// =============== RIGHT RAIL ===============
function RightRail({ live }) {
  const lc = WOW_DATA.live_call;
  return (
    <aside className="wow-rightrail">
      <div className="wow-card wow-rl-live">
        <div className="wow-rl-head">
          <div className="wow-card-eyebrow">
            <span className={`wow-live-dot ${live ? 'is-live' : ''}`}></span>
            {live ? 'LIVE NOW' : 'STANDBY'}
          </div>
          <span className="wow-rl-timer">{live ? formatDur(lc.duration_sec) : '—:—'}</span>
        </div>
        <div className="wow-rl-name">{lc.lead_name}</div>
        <div className="wow-rl-meta">{lc.lead_phone} · {lc.location}</div>

        <div className="wow-rl-sentiment">
          <div className="wow-rl-sub">Sentiment <span className="wow-rl-pos">+{Math.round(lc.sentiment * 100)}</span></div>
          <div className="wow-sent-bar"><div className="wow-sent-fill" style={{ width: `${lc.sentiment * 100}%` }}></div></div>
        </div>

        <div className="wow-rl-transcript">
          {lc.transcript.slice(-4).map((t, i) => (
            <div key={i} className={`wow-tline wow-tline-${t.role}`}>
              <div className="wow-tline-meta">
                <span className="wow-tline-who">{t.role === 'assistant' ? 'Meera' : lc.lead_name.split(' ')[0]}</span>
                <span className="wow-tline-t">{t.t}</span>
              </div>
              <div className="wow-tline-body">{t.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wow-card wow-rl-activity">
        <div className="wow-card-eyebrow">ACTIVITY · TODAY</div>
        <div className="wow-act-list">
          {WOW_DATA.activity.map((a, i) => (
            <div key={i} className={`wow-act wow-act-${a.kind}`}>
              <span className="wow-act-dot"></span>
              <div className="wow-act-body">
                <div className="wow-act-text">{a.text}</div>
                <div className="wow-act-time">{a.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wow-card wow-rl-insight">
        <div className="wow-card-eyebrow">INSIGHT</div>
        <div className="wow-rl-insight-title">Pick-up rate peaks at 2pm</div>
        <div className="wow-rl-insight-body">
          Move 38 untouched leads from the morning queue into the 2–4pm slot to lift connection rate by an estimated <b className="wow-gold">+11%</b>.
        </div>
      </div>
    </aside>
  );
}

// =============== LEAD DETAIL OVERLAY ===============
function LeadDetail({ lead, onClose }) {
  if (!lead) return null;
  return (
    <div className="wow-detail" onClick={onClose}>
      <div className="wow-detail-panel" onClick={e=>e.stopPropagation()}>
        <button className="wow-detail-close" onClick={onClose}><Icon name="x" size={16}/></button>
        <div className="wow-detail-head">
          <div className={`wow-lead-avatar lg wow-av-${lead.score>=75?'gold':(lead.score>=50?'amber':'slate')}`}>
            {lead.name.split(' ').map(p=>p[0]).slice(0,2).join('')}
          </div>
          <div>
            <div className="wow-detail-name">{lead.name}</div>
            <div className="wow-detail-meta">{lead.phone} · {lead.when}</div>
          </div>
          <div className="wow-detail-score">
            <div className="wow-detail-score-num">{lead.score}</div>
            <div className="wow-detail-score-lbl">QUALIFICATION SCORE</div>
          </div>
        </div>

        <div className="wow-detail-cps">
          {[['Intent',    lead.intent ? lead.intent.replace('_',' ') : '—',  lead.intent && lead.intent !== 'unclear'],
            ['Geography', lead.geo ? 'Open to Nandi Hills' : 'Prefers city',  lead.geo],
            ['Budget',    lead.bud ? 'Fits range'          : 'Below entry',   lead.bud],
            ['Timeline',  lead.tim === true ? '2029 OK' : lead.tim === false ? 'Wants sooner' : 'Not discussed', lead.tim]
          ].map(([l, d, ok], i) => (
            <div key={i} className={`wow-detail-cp ${ok===true?'pass':(ok===false?'fail':'na')}`}>
              <div className="wow-detail-cp-l">{l}</div>
              <div className="wow-detail-cp-d">{d}</div>
            </div>
          ))}
        </div>

        {lead.summary && (
          <div className="wow-detail-summary">
            <div className="wow-card-eyebrow">CALL SUMMARY</div>
            <p>{lead.summary}</p>
          </div>
        )}

        {/* Transcript from real calls */}
        {Array.isArray(lead.transcript) && lead.transcript.length > 0 && (
          <div className="wow-detail-summary" style={{marginTop:'1rem'}}>
            <div className="wow-card-eyebrow" style={{marginBottom:'0.5rem'}}>TRANSCRIPT</div>
            <div style={{maxHeight:'240px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'8px'}}>
              {lead.transcript.map((msg, i) => (
                <div key={i} style={{display:'flex',flexDirection:'column',alignItems:msg.role==='assistant'?'flex-start':'flex-end'}}>
                  <div style={{
                    maxWidth:'80%',padding:'6px 10px',borderRadius:'10px',fontSize:'12px',lineHeight:'1.5',
                    background:msg.role==='assistant'?'rgba(212,168,83,0.1)':'rgba(255,255,255,0.06)',
                    border:msg.role==='assistant'?'1px solid rgba(212,168,83,0.2)':'1px solid rgba(255,255,255,0.08)',
                    color:msg.role==='assistant'?'#E8B96B':'#CBD5E1'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lead.recording_url && (
          <div className="wow-detail-summary" style={{marginTop:'1rem'}}>
            <div className="wow-card-eyebrow" style={{marginBottom:'0.5rem'}}>RECORDING</div>
            <audio controls src={lead.recording_url} style={{width:'100%',height:'32px'}}/>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { StatsRow, Funnel, IntentDonut, Heatmap, Objections, LeadPipeline, RightRail, LeadDetail });
