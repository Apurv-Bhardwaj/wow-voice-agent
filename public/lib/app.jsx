/* global React, ReactDOM, WOW_DATA, Sidebar, Topbar, OrbConsole, StatsRow, Funnel, IntentDonut, Heatmap, Objections, LeadPipeline, RightRail, LeadDetail, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakColor, TweakToggle, loadLeads */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = {
  orb:     'wowball',
  accent:  '#D4A853',
  glass:   14,
  density: 'comfortable',
  live:    false,
  bg:      'ink',
};

function App() {
  const [t, setTweak]          = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive]    = useState('overview');
  const [selectedLead, setSelectedLead] = useState(null);
  const [dialing, setDialing]  = useState(false);
  const [callStatus, setCallStatus] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--wow-accent', t.accent);
    r.style.setProperty('--wow-glass-blur', `${t.glass}px`);
    r.dataset.density = t.density;
    r.dataset.bg = t.bg;
  }, [t.accent, t.glass, t.density, t.bg]);

  const orbSrc = t.orb === 'woworb2' ? '/assets/woworb2.mp4' : '/assets/wowball.mp4';

  const showStatus = (type, message) => {
    setCallStatus({ type, message });
    setTimeout(() => setCallStatus(null), 5000);
  };

  const handleStart = async ({ name, phone }) => {
    setDialing(true);
    try {
      const res = await fetch('/api/bland/create-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, lead_name: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Call failed');

      showStatus('success', `✓ Call initiated to ${name} — Meera is dialing`);
      setTweak('live', true);

      // Refresh lead list to show new call
      setTimeout(() => loadLeads(), 1500);
    } catch (err) {
      showStatus('error', `✗ ${err.message}`);
    } finally {
      setDialing(false);
    }
  };

  const handleStop = () => setTweak('live', false);

  const handleNewOutbound = () => {
    // Scroll to orb console and trigger start form
    document.querySelector('.wow-orb-console')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="wow-app">
      <div className="wow-bg-grad"></div>
      <div className="wow-bg-noise"></div>
      <div className="wow-bg-orb wow-bg-orb-1"></div>
      <div className="wow-bg-orb wow-bg-orb-2"></div>

      <Sidebar active={active} setActive={setActive}/>

      <div className="wow-main">
        <Topbar onNewOutbound={handleNewOutbound}/>

        <div className="wow-content">
          <div className="wow-content-center">
            <OrbConsole
              orbSrc={orbSrc}
              live={t.live}
              dialing={dialing}
              callStatus={callStatus}
              onStart={handleStart}
              onStop={handleStop}
            />
            <StatsRow/>
            <div className="wow-grid-2">
              <Funnel/>
              <IntentDonut/>
            </div>
            <div className="wow-grid-2">
              <Heatmap/>
              <Objections/>
            </div>
            <LeadPipeline onSelect={setSelectedLead} selectedId={selectedLead?.id}/>
          </div>

          <RightRail live={t.live}/>
        </div>
      </div>

      <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Orb">
          <TweakRadio label="Source" value={t.orb} options={['wowball','woworb2']} onChange={v=>setTweak('orb',v)}/>
          <TweakToggle label="Call in progress" value={t.live} onChange={v=>setTweak('live',v)}/>
        </TweakSection>
        <TweakSection title="Aesthetic">
          <TweakColor label="Accent" value={t.accent}
            options={['#D4A853','#E8B96B','#9FB4FF','#F08A6B','#7DD3A8']}
            onChange={v=>setTweak('accent',v)}/>
          <TweakRadio label="Background" value={t.bg} options={['ink','obsidian','aurora']} onChange={v=>setTweak('bg',v)}/>
          <TweakSlider label="Glass blur" min={0} max={28} step={2} value={t.glass} onChange={v=>setTweak('glass',v)}/>
          <TweakRadio label="Density" value={t.density} options={['cozy','comfortable']} onChange={v=>setTweak('density',v)}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
