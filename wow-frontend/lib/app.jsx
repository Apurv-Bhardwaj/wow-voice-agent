/* global React, ReactDOM, WOW_DATA, Sidebar, Topbar, OrbConsole, StatsRow, Funnel, IntentDonut, Heatmap, Objections, LeadPipeline, RightRail, LeadDetail, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakColor, TweakToggle */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "orb": "wowball",
  "accent": "#D4A853",
  "glass": 14,
  "density": "comfortable",
  "live": true,
  "bg": "ink"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = useState('overview');
  const [selectedLead, setSelectedLead] = useState(null);
  const [dialing, setDialing] = useState(false);

  // apply theme vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--wow-accent', t.accent);
    r.style.setProperty('--wow-glass-blur', `${t.glass}px`);
    r.dataset.density = t.density;
    r.dataset.bg = t.bg;
  }, [t.accent, t.glass, t.density, t.bg]);

  const orbSrc = t.orb === 'woworb2' ? 'assets/woworb2.mp4' : 'assets/wowball.mp4';

  const handleStart = ({ name, phone }) => {
    setDialing(true);
    setTimeout(() => { setDialing(false); setTweak('live', true); }, 1800);
  };
  const handleStop = () => setTweak('live', false);

  return (
    <div className="wow-app">
      <div className="wow-bg-grad"></div>
      <div className="wow-bg-noise"></div>
      <div className="wow-bg-orb wow-bg-orb-1"></div>
      <div className="wow-bg-orb wow-bg-orb-2"></div>

      <Sidebar active={active} setActive={setActive}/>

      <div className="wow-main">
        <Topbar/>

        <div className="wow-content">
          <div className="wow-content-center">
            <OrbConsole orbSrc={orbSrc} live={t.live} dialing={dialing} onStart={handleStart} onStop={handleStop}/>
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
