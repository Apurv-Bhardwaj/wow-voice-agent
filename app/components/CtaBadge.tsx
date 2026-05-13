'use client';

import { CtaOutcome } from '@/lib/types';

interface CtaBadgeProps {
  outcome: CtaOutcome;
}

const STYLES: Record<CtaOutcome, { label: string; className: string }> = {
  follow_up_booked: {
    label: '📞 Follow-up Booked',
    className: 'text-green-400 bg-green-900/30 border-green-800/60',
  },
  brochure_sent: {
    label: '📄 Brochure Sent',
    className: 'text-blue-400 bg-blue-900/30 border-blue-800/60',
  },
  declined: {
    label: '✗ Declined',
    className: 'text-red-400 bg-red-900/30 border-red-800/60',
  },
  unclear: {
    label: '— Unclear',
    className: 'text-slate-400 bg-slate-800/60 border-slate-700/60',
  },
};

export default function CtaBadge({ outcome }: CtaBadgeProps) {
  const { label, className } = STYLES[outcome];
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full border font-body whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
