/* global React, WOW_DATA, Icon */
const { useState, useEffect, useRef, useMemo } = React;

// ============ ICONS ============
const Icon = ({ name, size = 18, className = '' }) => {
  const s = size;
  const stroke = 'currentColor';
  const sw = 1.6;
  const p = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', className };
  switch (name) {
    case 'home':    return <svg {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case 'wave':    return <svg {...p}><path d="M3 12h2M19 12h2M7 8v8M11 5v14M15 8v8"/></svg>;
    case 'users':   return <svg {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.7-3.4 3.2-5 6-5s5.3 1.6 6 5"/><circle cx="17" cy="8" r="2.5"/><path d="M16 14c2.5.2 4.4 1.8 5 6"/></svg>;
    case 'speech':  return <svg {...p}><path d="M21 12c0 4-4 7-9 7-1.3 0-2.6-.2-3.7-.6L3 20l1.4-4.2C3.5 14.6 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/></svg>;
    case 'target':  return <svg {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>;
    case 'spark':   return <svg {...p}><path d="M12 3l1.8 5.6L19 10l-5.2 1.4L12 17l-1.8-5.6L5 10l5.2-1.4L12 3z"/></svg>;
    case 'orb':     return <svg {...p}><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="9" opacity=".4"/></svg>;
    case 'phone':   return <svg {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/></svg>;
    case 'plug':    return <svg {...p}><path d="M9 7V3M15 7V3M7 7h10v5a5 5 0 11-10 0V7zM12 17v4"/></svg>;
    case 'search':  return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'bell':    return <svg {...p}><path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 004 0"/></svg>;
    case 'chev':    return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'check':   return <svg {...p}><path d="M5 12l5 5L20 7"/></svg>;
    case 'dot':     return <svg {...p}><circle cx="12" cy="12" r="3"/></svg>;
    case 'phoneIn': return <svg {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/></svg>;
    case 'mic':     return <svg {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>;
    case 'play':    return <svg {...p}><path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/></svg>;
    case 'pause':   return <svg {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
    case 'arrowUp': return <svg {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrowDn': return <svg {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
    case 'plus':    return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'cmd':     return <svg {...p}><path d="M9 6a3 3 0 100 6h6a3 3 0 100-6 3 3 0 00-3 3v6a3 3 0 11-3 3 3 3 0 013-3"/></svg>;
    case 'globe':   return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
    case 'doc':     return <svg {...p}><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/></svg>;
    case 'flame':   return <svg {...p}><path d="M12 3s5 4 5 9a5 5 0 01-10 0c0-2 1-3 2-4-.5 2 1 3 2 3 0-3 1-5 1-8z"/></svg>;
    case 'x':       return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    default: return null;
  }
};
window.Icon = Icon;

// ============ SIDEBAR ============
function Sidebar({ active, setActive }) {
  return (
    <aside className="wow-sidebar">
      <div className="wow-brand">
        <div className="wow-brand-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 5l3 14 6-9 6 9 3-14" stroke="#D4A853" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="wow-brand-text">
          <div className="wow-brand-name">WOW</div>
          <div className="wow-brand-sub">Voice Agent</div>
        </div>
      </div>

      <nav className="wow-nav">
        {WOW_DATA.nav.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`wow-nav-item ${active === item.id ? 'is-active' : ''}`}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
            {item.badge && <span className="wow-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="wow-sidebar-foot">
        <div className="wow-agent-card">
          <div className="wow-agent-avatar">
            <span>M</span>
            <span className="wow-agent-pulse"></span>
          </div>
          <div className="wow-agent-info">
            <div className="wow-agent-name">Meera</div>
            <div className="wow-agent-status">● Live · Ready</div>
          </div>
        </div>
        <div className="wow-property-card">
          <div className="wow-property-label">Property</div>
          <div className="wow-property-name">Whispers of the Wind</div>
          <div className="wow-property-meta">Nandi Hills · Divyasree</div>
        </div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;

// ============ TOPBAR ============
function Topbar({ onNewOutbound }) {
  return (
    <header className="wow-topbar">
      <div className="wow-breadcrumb">
        <span className="wow-crumb-muted">Divyasree</span>
        <Icon name="chev" size={12} className="wow-crumb-sep" />
        <span className="wow-crumb-muted">Whispers of the Wind</span>
        <Icon name="chev" size={12} className="wow-crumb-sep" />
        <span className="wow-crumb">Overview</span>
      </div>

      <div className="wow-search">
        <Icon name="search" size={15} />
        <input placeholder="Search leads, calls, transcripts…" />
        <span className="wow-kbd"><Icon name="cmd" size={11}/>K</span>
      </div>

      <div className="wow-top-actions">
        <div className="wow-env">
          <span className="wow-env-dot"></span>
          <span>Production</span>
          <Icon name="chev" size={11}/>
        </div>
        <button className="wow-icon-btn"><Icon name="bell" size={16}/><span className="wow-bell-dot"></span></button>
        <button className="wow-cta" onClick={onNewOutbound}>
          <Icon name="plus" size={14}/>
          New Outbound
        </button>
      </div>
    </header>
  );
}
window.Topbar = Topbar;

// ============ ORB CONSOLE ============
function OrbConsole({ orbSrc, live, dialing, callStatus, onStart, onStop }) {
  const [showStart, setShowStart] = useState(false);
  const [phone, setPhone] = useState('8779694344');
  const [name, setName] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [orbSrc]);

  // animated waveform
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

  const cp = WOW_DATA.live_call.checkpoints;
  const cpEntries = [
    ['intent',   'Intent',    cp.intent],
    ['geo',      'Geography', cp.geography],
    ['budget',   'Budget',    cp.budget],
    ['timeline', 'Timeline',  cp.timeline],
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ name, phone: '+91' + phone });
    setShowStart(false);
    setName('');
  };

  return (
    <div className="wow-card wow-orb-console">
      <div className="wow-orb-wrap">
        <div className="wow-orb-rings">
          <div className="wow-ring r1"></div>
          <div className="wow-ring r2"></div>
          <div className="wow-ring r3"></div>
        </div>
        <video ref={videoRef} className="wow-orb-video" src={orbSrc} loop muted autoPlay playsInline></video>
        <div className="wow-orb-glow"></div>
      </div>

      <div className="wow-orb-side">
        <div className="wow-orb-head">
          <div>
            <div className="wow-orb-eyebrow">
              <span className={`wow-live-dot ${live ? 'is-live' : ''}`}></span>
              {live ? 'Live conversation' : (dialing ? 'Connecting…' : 'Standing by')}
            </div>
            <div className="wow-orb-title">
              {live ? WOW_DATA.live_call.lead_name : 'Meera is ready'}
            </div>
            <div className="wow-orb-sub">
              {live
                ? `${WOW_DATA.live_call.lead_phone} · ${WOW_DATA.live_call.location}`
                : 'Voice agent for Whispers of the Wind · en-IN · warm female'}
            </div>
          </div>
          <div className="wow-orb-timer">
            <div className="wow-timer-label">DURATION</div>
            <div className="wow-timer-val">{live ? formatDur(WOW_DATA.live_call.duration_sec) : '—:—'}</div>
          </div>
        </div>

        <div className="wow-wave">
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${(live ? h : 0.12) * 100}%` }} className={live ? '' : 'is-idle'}></span>
          ))}
        </div>

        <div className="wow-checkpoints">
          {cpEntries.map(([key, label, c]) => (
            <div key={key} className={`wow-cp wow-cp-${c.state}`}>
              <div className="wow-cp-head">
                <span className="wow-cp-label">{label}</span>
                <span className="wow-cp-pill">{c.state}</span>
              </div>
              <div className="wow-cp-detail">{c.detail || '—'}</div>
            </div>
          ))}
        </div>

        {/* Status / toast */}
        {callStatus && (
          <div className={`wow-call-status wow-call-status-${callStatus.type}`}>
            {callStatus.message}
          </div>
        )}

        <div className="wow-orb-actions">
          {!live && !showStart && (
            <button className="wow-cta wow-cta-lg" onClick={() => setShowStart(true)}>
              <Icon name="phone" size={15}/>
              Start outbound call
            </button>
          )}
          {!live && showStart && (
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
                  placeholder="8779694344"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                  required
                />
              </div>
              <button className="wow-cta" type="submit" disabled={dialing}>
                <Icon name="phone" size={14}/>
                {dialing ? 'Connecting…' : 'Dial'}
              </button>
              <button type="button" className="wow-ghost" onClick={() => setShowStart(false)}>Cancel</button>
            </form>
          )}
          {live && (
            <div className="wow-live-actions">
              <button className="wow-ghost"><Icon name="doc" size={14}/>Open transcript</button>
              <button className="wow-danger" onClick={onStop}><Icon name="x" size={14}/>End call</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
window.OrbConsole = OrbConsole;

function formatDur(s) {
  if (s == null) return '—';
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2,'0')}`;
}
window.formatDur = formatDur;

Object.assign(window, { Icon, Sidebar, Topbar, OrbConsole, formatDur });
