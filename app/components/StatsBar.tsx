'use client';

interface StatsBarProps {
  totalCalls: number;
  qualifiedLeads: number;
  avgDuration: number;
  qualificationRate: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function StatsBar({
  totalCalls,
  qualifiedLeads,
  avgDuration,
  qualificationRate,
}: StatsBarProps) {
  const stats = [
    { label: 'Total Calls', value: totalCalls.toString() },
    { label: 'Qualified Leads', value: qualifiedLeads.toString() },
    {
      label: 'Avg Duration',
      value: totalCalls > 0 ? formatDuration(avgDuration) : '—',
    },
    {
      label: 'Qualification Rate',
      value: totalCalls > 0 ? `${qualificationRate.toFixed(0)}%` : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-bg-card border border-border rounded-lg p-5"
        >
          <p className="text-xs text-slate-400 font-body uppercase tracking-wider">
            {stat.label}
          </p>
          <p className="text-3xl font-display text-accent-gold mt-2">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
