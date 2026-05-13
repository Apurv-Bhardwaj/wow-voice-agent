'use client';

import Icon from './Icon';

const NAV = [
  { id: 'overview',      label: 'Overview',       icon: 'home',   badge: null },
  { id: 'live',          label: 'Live Calls',      icon: 'wave',   badge: null },
  { id: 'leads',         label: 'Leads',           icon: 'users',  badge: null },
  { id: 'conversations', label: 'Conversations',   icon: 'speech', badge: null },
  { id: 'campaigns',     label: 'Campaigns',       icon: 'target', badge: null },
  { id: 'insights',      label: 'Insights',        icon: 'spark',  badge: null },
  { id: 'agent',         label: 'Agent · Meera',   icon: 'orb',    badge: null },
  { id: 'numbers',       label: 'Phone Numbers',   icon: 'phone',  badge: null },
  { id: 'integrations',  label: 'Integrations',    icon: 'plug',   badge: null },
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  liveCount: number;
}

export default function Sidebar({ active, setActive, liveCount }: SidebarProps) {
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
        {NAV.map(item => {
          const badge = item.id === 'live' && liveCount > 0 ? String(liveCount) : item.badge;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`wow-nav-item ${active === item.id ? 'is-active' : ''}`}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {badge && <span className="wow-nav-badge">{badge}</span>}
            </button>
          );
        })}
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
