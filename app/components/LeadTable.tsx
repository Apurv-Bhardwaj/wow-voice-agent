'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Play, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Lead, LeadStatus } from '@/lib/types';
import QualificationCard from './QualificationCard';
import TranscriptViewer from './TranscriptViewer';
import CtaBadge from './CtaBadge';

interface LeadTableProps {
  leads: Lead[];
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  pending: 'text-slate-400 bg-slate-800/60',
  calling: 'text-blue-400 bg-blue-900/30 animate-pulse',
  completed: 'text-green-400 bg-green-900/30',
  failed: 'text-red-400 bg-red-900/30',
  no_answer: 'text-yellow-400 bg-yellow-900/30',
};

function rowAccent(lead: Lead): string {
  if (lead.qualified) return 'border-l-green-500/60';
  if (lead.qualification_score >= 25) return 'border-l-yellow-500/60';
  if (lead.status === 'completed') return 'border-l-red-500/60';
  return 'border-l-border';
}

export default function LeadTable({ leads }: LeadTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  if (!leads.length) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-slate-500 font-body text-sm">
          No leads yet. Start a call above to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border text-slate-400 text-left text-xs uppercase tracking-wider">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Intent</th>
              <th className="px-4 py-3 text-center">Geo</th>
              <th className="px-4 py-3 text-center">Budget</th>
              <th className="px-4 py-3 text-center">Timeline</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3">CTA</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <>
                <tr
                  key={lead.id}
                  onClick={() => toggle(lead.id)}
                  className={`border-b border-border border-l-2 cursor-pointer hover:bg-bg-secondary transition-colors ${rowAccent(lead)}`}
                >
                  <td className="px-4 py-3 text-slate-100 font-medium">
                    {lead.name}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{lead.phone}</td>
                  <td className="px-4 py-3 text-slate-300 capitalize">
                    {lead.intent?.replace('_', '-') ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lead.geography_fit ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lead.budget_fit ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lead.timeline_fit ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-semibold ${
                        lead.qualification_score >= 75
                          ? 'text-green-400'
                          : lead.qualification_score >= 50
                          ? 'text-yellow-400'
                          : lead.qualification_score >= 25
                          ? 'text-orange-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {lead.qualification_score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {lead.cta_outcome ? (
                      <CtaBadge outcome={lead.cta_outcome} />
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[lead.status]}`}
                    >
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {lead.recording_url && (
                        <a
                          href={lead.recording_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-accent-gold hover:text-accent-warm transition-colors"
                          title="Play recording"
                        >
                          <Play size={14} />
                        </a>
                      )}
                      <Link
                        href={`/calls/${lead.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-accent-gold transition-colors"
                        title="View call details"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      {expandedId === lead.id ? (
                        <ChevronUp size={14} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={14} className="text-slate-400" />
                      )}
                    </div>
                  </td>
                </tr>

                {expandedId === lead.id && (
                  <tr key={`${lead.id}-expanded`} className="bg-bg-secondary">
                    <td
                      colSpan={10}
                      className="px-6 py-5 border-b border-border"
                    >
                      <QualificationCard lead={lead} />

                      {Array.isArray(lead.transcript) &&
                        lead.transcript.length > 0 && (
                          <div className="mt-5">
                            <h4 className="text-xs text-slate-400 font-body uppercase tracking-wider mb-2">
                              Transcript
                            </h4>
                            <TranscriptViewer messages={lead.transcript} />
                          </div>
                        )}

                      {lead.summary && (
                        <div className="mt-4">
                          <h4 className="text-xs text-slate-400 font-body uppercase tracking-wider mb-1">
                            Call Summary
                          </h4>
                          <p className="text-sm text-slate-300 font-body leading-relaxed">
                            {lead.summary}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
