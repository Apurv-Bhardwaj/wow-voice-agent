'use client';

import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Lead } from '@/lib/types';

interface QualificationCardProps {
  lead: Lead;
}

export default function QualificationCard({ lead }: QualificationCardProps) {
  const checkpoints = [
    {
      label: 'Intent',
      passed: lead.intent !== null && lead.intent !== 'unclear',
      unclear: lead.intent === null,
      detail:
        lead.intent === 'investment'
          ? 'Investment'
          : lead.intent === 'self_use'
          ? 'Self-use'
          : 'Unclear',
    },
    {
      label: 'Geography',
      passed: lead.geography_fit,
      unclear: false,
      detail: lead.geography_fit ? 'Comfortable' : 'Concern raised',
    },
    {
      label: 'Budget',
      passed: lead.budget_fit,
      unclear: false,
      detail: lead.budget_fit ? 'Fits range' : 'Concern raised',
    },
    {
      label: 'Timeline',
      passed: lead.timeline_fit,
      unclear: false,
      detail: lead.timeline_fit ? '2029 OK' : 'Concern raised',
    },
  ];

  const scoreColor =
    lead.qualification_score >= 75
      ? 'bg-green-400'
      : lead.qualification_score >= 50
      ? 'bg-yellow-400'
      : lead.qualification_score >= 25
      ? 'bg-orange-400'
      : 'bg-red-400';

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {checkpoints.map((cp) => (
          <div
            key={cp.label}
            className="bg-bg-primary rounded-lg p-3 flex items-center gap-2"
          >
            {cp.unclear ? (
              <HelpCircle size={16} className="text-slate-500 shrink-0" />
            ) : cp.passed ? (
              <CheckCircle size={16} className="text-green-400 shrink-0" />
            ) : (
              <XCircle size={16} className="text-red-400 shrink-0" />
            )}
            <div>
              <p className="text-xs text-slate-400 font-body">{cp.label}</p>
              <p className="text-xs text-slate-200 font-body">{cp.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400 font-body">
            Qualification Score
          </span>
          <span className="text-xs text-accent-gold font-body font-semibold">
            {lead.qualification_score}/100
          </span>
        </div>
        <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden border border-border">
          <div
            className={`h-full rounded-full transition-all duration-500 ${scoreColor}`}
            style={{ width: `${lead.qualification_score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
