'use client';

import { useState, useMemo } from 'react';
import { Lead } from '@/lib/types';
import Icon from './Icon';

function checkCell(v: boolean | null) {
  if (v === true) return <span className="wow-check wow-check-on"><Icon name="check" size={11} /></span>;
  if (v === false) return <span className="wow-check wow-check-off"><Icon name="x" size={11} /></span>;
  return <span className="wow-check wow-check-na">—</span>;
}

function ScoreBar({ score }: { score: number }) {
  const tone = score >= 75 ? 'gold' : score >= 50 ? 'amber' : score >= 25 ? 'orange' : 'slate';
  return (
    <div className="wow-score">
      <div className="wow-score-bar">
        <div className={`wow-score-fill wow-score-${tone}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`wow-score-num wow-score-${tone}-text`}>{score}</span>
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('');
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface LeadPipelineProps {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (lead: Lead) => void;
}

export default function LeadPipeline({ leads, selectedId, onSelect }: LeadPipelineProps) {
  const [filter, setFilter] = useState<'all' | 'live' | 'qualified' | 'today'>('all');

  const filtered = useMemo(() => {
    if (filter === 'live') return leads.filter(l => l.status === 'calling');
    if (filter === 'qualified') return leads.filter(l => l.qualified);
    if (filter === 'today') {
      const today = new Date().toDateString();
      return leads.filter(l => new Date(l.created_at).toDateString() === today);
    }
    return leads;
  }, [leads, filter]);

  return (
    <div className="wow-card wow-pipeline">
      <div className="wow-card-head">
        <div>
          <div className="wow-card-eyebrow">LEAD PIPELINE</div>
          <h3>Recent conversations</h3>
        </div>
        <div className="wow-tabs">
          {([['all', 'All'], ['live', 'Live'], ['qualified', 'Qualified'], ['today', 'Today']] as const).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`wow-tab ${filter === k ? 'is-active' : ''}`}
            >
              {v}
            </button>
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
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--wow-text-3)' }}>
                  No leads yet
                </td>
              </tr>
            )}
            {filtered.map(l => {
              const score = l.qualification_score ?? 0;
              const tone = score >= 75 ? 'gold' : score >= 50 ? 'amber' : 'slate';
              return (
                <tr
                  key={l.id}
                  className={`${selectedId === l.id ? 'is-selected' : ''} ${l.status === 'calling' ? 'is-live' : ''}`}
                  onClick={() => onSelect(l)}
                >
                  <td>
                    <div className="wow-lead-cell">
                      <div className={`wow-lead-avatar wow-av-${tone}`}>{initials(l.name)}</div>
                      <div>
                        <div className="wow-lead-name">{l.name}</div>
                        <div className="wow-lead-phone">{l.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`wow-pill wow-pill-${l.intent ?? 'muted'}`}>
                      {(l.intent ?? '—').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="ctr">{checkCell(l.geography_fit)}</td>
                  <td className="ctr">{checkCell(l.budget_fit)}</td>
                  <td className="ctr">{checkCell(l.timeline_fit)}</td>
                  <td><ScoreBar score={score} /></td>
                  <td>
                    {l.cta_outcome
                      ? <span className={`wow-cta-pill wow-cta-${l.cta_outcome}`}>{l.cta_outcome.replace(/_/g, ' ')}</span>
                      : <span className="wow-muted">—</span>}
                  </td>
                  <td className="wow-muted-cell">{timeAgo(l.updated_at)}</td>
                  <td><Icon name="chev" size={13} className="wow-row-chev" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
