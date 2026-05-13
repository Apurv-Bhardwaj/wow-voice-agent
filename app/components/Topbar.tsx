'use client';

import Icon from './Icon';

interface TopbarProps {
  onNewOutbound: () => void;
}

export default function Topbar({ onNewOutbound }: TopbarProps) {
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
        <span className="wow-kbd"><Icon name="cmd" size={11} />K</span>
      </div>

      <div className="wow-top-actions">
        <div className="wow-env">
          <span className="wow-env-dot"></span>
          <span>Production</span>
          <Icon name="chev" size={11} />
        </div>
        <button className="wow-icon-btn">
          <Icon name="bell" size={16} />
          <span className="wow-bell-dot"></span>
        </button>
        <button className="wow-cta" onClick={onNewOutbound}>
          <Icon name="plus" size={14} />
          New Outbound
        </button>
      </div>
    </header>
  );
}
