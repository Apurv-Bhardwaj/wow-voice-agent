interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 18, className = '' }: IconProps) {
  const s = size;
  const p = {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className,
  };
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
    case 'mic':     return <svg {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>;
    case 'play':    return <svg {...p} fill="currentColor" stroke="none"><path d="M6 4l14 8-14 8z"/></svg>;
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
}
