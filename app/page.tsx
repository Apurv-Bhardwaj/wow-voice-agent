'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Lead } from '@/lib/types';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import OrbConsole from '@/app/components/OrbConsole';
import StatsRow from '@/app/components/StatsRow';
import QualificationFunnel from '@/app/components/QualificationFunnel';
import IntentDonut from '@/app/components/IntentDonut';
import Heatmap from '@/app/components/Heatmap';
import Objections from '@/app/components/Objections';
import LeadPipeline from '@/app/components/LeadPipeline';
import RightRail from '@/app/components/RightRail';
import LeadDetail from '@/app/components/LeadDetail';

interface LiveCall {
  leadName: string;
  phone: string;
  startedAt: number;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeNav, setActiveNav] = useState('overview');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [live, setLive] = useState(false);
  const [dialing, setDialing] = useState(false);
  const [liveCall, setLiveCall] = useState<LiveCall | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLeads = useCallback(async () => {
    const res = await fetch('/api/leads');
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads ?? []);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchLeads)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeads]);

  useEffect(() => {
    if (!live || !liveCall) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.floor((Date.now() - liveCall.startedAt) / 1000));
    tick();
    elapsedRef.current = setInterval(tick, 1000);
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current); };
  }, [live, liveCall]);

  const handleStart = async ({ name, phone }: { name: string; phone: string }) => {
    setDialing(true);
    try {
      const fullPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      const res = await fetch('/api/bland/create-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: fullPhone, lead_name: name }),
      });
      if (res.ok) {
        setLiveCall({ leadName: name, phone: fullPhone, startedAt: Date.now() });
        setLive(true);
        fetchLeads();
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Failed to initiate call');
      }
    } finally {
      setDialing(false);
    }
  };

  const handleStop = () => {
    setLive(false);
    setLiveCall(null);
    setElapsed(0);
  };

  const completedLeads = leads.filter(l => l.status === 'completed');
  const qualifiedLeads = leads.filter(l => l.qualified);
  const avgDuration = completedLeads.length > 0
    ? completedLeads.reduce((s, l) => s + (l.call_duration ?? 0), 0) / completedLeads.length
    : 0;
  const conversionRate = completedLeads.length > 0
    ? (qualifiedLeads.length / completedLeads.length) * 100
    : 0;

  const liveCount = leads.filter(l => l.status === 'calling').length + (live ? 1 : 0);

  return (
    <div className="wow-app">
      <div className="wow-bg-grad" />
      <div className="wow-bg-noise" />
      <div className="wow-bg-orb wow-bg-orb-1" />
      <div className="wow-bg-orb wow-bg-orb-2" />

      <Sidebar active={activeNav} setActive={setActiveNav} liveCount={liveCount} />

      <div className="wow-main">
        <Topbar onNewOutbound={() => setActiveNav('overview')} />

        <div className="wow-content">
          <div className="wow-content-center">
            <OrbConsole
              live={live}
              dialing={dialing}
              liveCall={liveCall}
              onStart={handleStart}
              onStop={handleStop}
            />

            <StatsRow
              totalCalls={leads.length}
              qualified={qualifiedLeads.length}
              avgDuration={avgDuration}
              conversionRate={conversionRate}
            />

            <div className="wow-grid-2">
              <QualificationFunnel leads={leads} />
              <IntentDonut leads={leads} />
            </div>

            <div className="wow-grid-2">
              <Heatmap />
              <Objections />
            </div>

            <LeadPipeline
              leads={leads}
              selectedId={selectedLead?.id ?? null}
              onSelect={setSelectedLead}
            />
          </div>

          <RightRail
            leads={leads}
            live={live}
            liveCallInfo={liveCall ? { ...liveCall, elapsed } : null}
          />
        </div>
      </div>

      <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
