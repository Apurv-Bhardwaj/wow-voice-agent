import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Phone } from 'lucide-react';
import { createServerClient } from '@/lib/supabase';
import QualificationCard from '@/app/components/QualificationCard';
import TranscriptViewer from '@/app/components/TranscriptViewer';
import CtaBadge from '@/app/components/CtaBadge';
import RecordingPlayer from '@/app/components/RecordingPlayer';
import { CtaOutcome, LeadStatus } from '@/lib/types';

const STATUS_LABEL: Record<LeadStatus, string> = {
  pending: 'Pending',
  calling: 'Calling',
  completed: 'Completed',
  failed: 'Failed',
  no_answer: 'No Answer',
};

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !lead) notFound();

  const callDate = new Date(lead.created_at).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent-gold transition-colors font-body"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-accent-gold">
                {lead.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-slate-400 font-body">
                  <Phone size={12} />
                  {lead.phone}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-400 font-body">
                  <Clock size={12} />
                  {callDate}
                </span>
                {lead.call_duration && (
                  <span className="text-sm text-slate-400 font-body">
                    {Math.floor(lead.call_duration / 60)}m{' '}
                    {Math.round(lead.call_duration % 60)}s
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {lead.cta_outcome && (
                <CtaBadge outcome={lead.cta_outcome as CtaOutcome} />
              )}
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border font-body ${
                  lead.qualified
                    ? 'text-green-400 bg-green-900/30 border-green-800/60'
                    : 'text-slate-400 bg-slate-800/60 border-slate-700/60'
                }`}
              >
                {lead.qualified ? 'Qualified' : 'Not Qualified'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full border font-body text-slate-400 bg-slate-800/60 border-slate-700/60">
                {STATUS_LABEL[lead.status as LeadStatus]}
              </span>
            </div>
          </div>
        </div>

        {/* Recording */}
        {lead.recording_url && <RecordingPlayer url={lead.recording_url} />}

        {/* Qualification breakdown */}
        <div className="bg-bg-card border border-border rounded-lg p-6">
          <h2 className="text-base font-display text-slate-200 mb-4">
            Qualification Breakdown
          </h2>
          <QualificationCard lead={lead} />
        </div>

        {/* Call summary */}
        {lead.summary && (
          <div className="bg-bg-card border border-border rounded-lg p-6">
            <h2 className="text-base font-display text-slate-200 mb-2">
              Call Summary
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              {lead.summary}
            </p>
          </div>
        )}

        {/* Transcript */}
        {Array.isArray(lead.transcript) && lead.transcript.length > 0 && (
          <div className="bg-bg-card border border-border rounded-lg p-6">
            <h2 className="text-base font-display text-slate-200 mb-4">
              Full Transcript
            </h2>
            <TranscriptViewer messages={lead.transcript} />
          </div>
        )}

      </div>
    </main>
  );
}
