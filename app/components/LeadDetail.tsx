'use client';

import { Lead } from '@/lib/types';
import Icon from './Icon';

function formatDur(s: number | null) {
  if (!s) return null;
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('');
}

interface LeadDetailProps {
  lead: Lead | null;
  onClose: () => void;
}

export default function LeadDetail({ lead, onClose }: LeadDetailProps) {
  if (!lead) return null;

  const score = lead.qualification_score ?? 0;
  const tone = score >= 75 ? 'gold' : score >= 50 ? 'amber' : 'slate';

  const checkpoints = [
    {
      label: 'Intent',
      detail: lead.intent ? lead.intent.replace('_', ' ') : '—',
      ok: lead.intent != null && lead.intent !== 'unclear',
    },
    {
      label: 'Geography',
      detail: lead.geography_fit ? 'Open to Nandi Hills' : 'Prefers city',
      ok: lead.geography_fit,
    },
    {
      label: 'Budget',
      detail: lead.budget_fit ? 'Fits 4BHK Skyline' : 'Below entry price',
      ok: lead.budget_fit,
    },
    {
      label: 'Timeline',
      detail: lead.timeline_fit === true ? '2026–2027 OK' : lead.timeline_fit === false ? 'Wants ready-to-move' : 'Not asked',
      ok: lead.timeline_fit,
    },
  ];

  return (
    <div className="wow-detail" onClick={onClose}>
      <div className="wow-detail-panel" onClick={e => e.stopPropagation()}>
        <button className="wow-detail-close" onClick={onClose}>
          <Icon name="x" size={16} />
        </button>

        <div className="wow-detail-head">
          <div className={`wow-lead-avatar lg wow-av-${tone}`}>{initials(lead.name)}</div>
          <div>
            <div className="wow-detail-name">{lead.name}</div>
            <div className="wow-detail-meta">{lead.phone}</div>
          </div>
          <div className="wow-detail-score">
            <div className="wow-detail-score-num">{score}</div>
            <div className="wow-detail-score-lbl">QUALIFICATION SCORE</div>
          </div>
        </div>

        <div className="wow-detail-cps">
          {checkpoints.map((cp, i) => (
            <div
              key={i}
              className={`wow-detail-cp ${cp.ok === true ? 'pass' : cp.ok === false ? 'fail' : 'na'}`}
            >
              <div className="wow-detail-cp-l">{cp.label}</div>
              <div className="wow-detail-cp-d">{cp.detail}</div>
            </div>
          ))}
        </div>

        {lead.summary && (
          <div className="wow-detail-summary">
            <div className="wow-card-eyebrow">CALL SUMMARY</div>
            <p>{lead.summary}</p>
          </div>
        )}

        {lead.call_duration && (
          <div className="wow-detail-dur">
            Duration: {formatDur(lead.call_duration)} · Status: {lead.status}
            {lead.cta_outcome && ` · ${lead.cta_outcome.replace(/_/g, ' ')}`}
          </div>
        )}
      </div>
    </div>
  );
}
