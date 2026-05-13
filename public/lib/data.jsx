// WOW Voice Agent — data layer
// Static analytics use curated demo values.
// Lead pipeline fetches live from /api/leads.

const NOW = Date.now();
const m = (n) => new Date(NOW - n * 60 * 1000).toISOString();

const DEMO_PHONE = '+91 8779694344';

window.WOW_DATA = {
  agent: {
    name: 'Meera',
    role: 'Senior Sales Associate · Whispers of the Wind',
    voice: 'en-IN · Warm Female',
    status: 'live',
    uptime: '14d 06h',
    calls_today: 142,
    calls_concurrent: 7,
  },

  stats: {
    calls_total:    { value: 1842, delta: +12.4, series: [22,28,31,26,34,40,38,45,49,44,52,58,63,69] },
    qualified:      { value: 412,  delta: +18.1, series: [4,5,7,6,8,9,11,10,13,12,15,18,20,22] },
    avg_duration:   { value: '3:48', delta: -4.2, series: [4.1,3.9,4.2,4.0,3.8,3.7,3.6,3.8,3.9,3.8,3.7,3.8,3.7,3.8] },
    conversion:     { value: 22.4, delta: +2.8, series: [16,17,18,18,19,20,21,20,22,21,22,23,22,22] },
    pipeline_value: { value: '₹284 Cr', delta: +9.6, series: [120,140,160,170,190,210,230,240,250,260,265,275,280,284] },
  },

  funnel: [
    { stage: 'Dialed',           count: 1842, color: 'slate' },
    { stage: 'Connected',        count: 1281, color: 'slate' },
    { stage: 'Engaged',          count: 894,  color: 'amber' },
    { stage: 'Intent Clear',     count: 612,  color: 'amber' },
    { stage: 'Qualified',        count: 412,  color: 'gold'  },
    { stage: 'Site Visit Booked',count: 187,  color: 'gold'  },
  ],

  intent_split: [
    { label: 'Self Use',   value: 58, color: '#D4A853' },
    { label: 'Investment', value: 31, color: '#8FA8C7' },
    { label: 'Unclear',    value: 11, color: '#46556B' },
  ],

  heatmap: [
    [0,1,2,3,5,8,9,7,6,4,3,1],
    [1,2,4,6,9,12,11,9,7,5,3,2],
    [1,3,5,8,11,14,13,10,8,6,4,2],
    [2,4,7,10,13,16,15,12,10,7,5,3],
    [2,5,8,11,14,17,16,13,11,8,5,3],
    [3,6,9,12,15,18,17,14,12,9,6,3],
    [1,2,4,6,8,10,11,9,7,5,3,1],
  ],

  objections: [
    { label: 'Price above budget',       count: 184, trend: +4 },
    { label: 'Timeline too long (2029)', count: 121, trend: -2 },
    { label: 'Wants ready-to-move',      count: 96,  trend: +1 },
    { label: 'Distance from city',       count: 73,  trend: -6 },
    { label: 'Investment ROI unclear',   count: 58,  trend: +3 },
  ],

  live_call: {
    id: 'CALL-9217',
    lead_name: 'Apurv Bhardwaj',
    lead_phone: DEMO_PHONE,
    location: 'Mumbai',
    started_at: m(0.07),
    duration_sec: 218,
    sentiment: 0.74,
    stage: 'budget',
    checkpoints: {
      intent:    { state: 'pass',    detail: 'Self use · Family of 4' },
      geography: { state: 'pass',    detail: 'Open to Nandi Hills' },
      budget:    { state: 'active',  detail: 'Probing ₹3.5–4.5 Cr range' },
      timeline:  { state: 'pending', detail: '' },
    },
    transcript: [
      { role: 'assistant', t: '00:02', text: 'Hello, this is Meera from Divyasree Developers. Is this a good time to talk for two minutes about Whispers of the Wind?' },
      { role: 'user',      t: '00:09', text: 'Yes go ahead, I have a few minutes.' },
      { role: 'assistant', t: '00:14', text: 'Wonderful. Are you exploring this for your own family, or more from an investment angle?' },
      { role: 'user',      t: '00:21', text: 'For us — we are a family of four, looking for something quieter than central Bangalore.' },
      { role: 'assistant', t: '00:30', text: 'That fits beautifully — Nandi Hills is right there, about 20 minutes from the airport. Would the drive work for you on weekdays?' },
      { role: 'user',      t: '00:41', text: 'I work hybrid, so two days a week. That could work.' },
      { role: 'assistant', t: '00:49', text: 'Lovely. To recommend the right plot, may I ask the budget range you are working with?' },
      { role: 'user',      t: '00:58', text: 'We were looking between three and a half to four, four and a half max.' },
      { role: 'assistant', t: '01:08', text: 'Got it. Our plots start at ₹92 lakhs and go up to ₹2.5 Cr. That fits you well.' },
    ],
  },

  // Seed leads — replaced at runtime by /api/leads
  leads: [
    { id: 'L-1208', name: 'Apurv Bhardwaj',   phone: DEMO_PHONE, intent: 'self_use',   geo: true,  bud: true,  tim: null,  score: 75,  status: 'calling',   cta: null,               duration: 218, when: 'now',         summary: '' },
    { id: 'L-1207', name: 'Priya Iyer',        phone: DEMO_PHONE, intent: 'self_use',   geo: true,  bud: true,  tim: true,  score: 100, status: 'completed', cta: 'follow_up_booked', duration: 287, when: '12m ago',     summary: 'Booked site visit. Budget ₹4 Cr, family of 3, prefers east-facing plot.' },
    { id: 'L-1206', name: 'Rohan Kapoor',      phone: DEMO_PHONE, intent: 'investment', geo: true,  bud: true,  tim: false, score: 75,  status: 'completed', cta: 'brochure_sent',    duration: 198, when: '34m ago',     summary: 'NRI investor, wants rental yield projections before committing.' },
    { id: 'L-1205', name: 'Vivek Reddy',       phone: DEMO_PHONE, intent: 'self_use',   geo: false, bud: true,  tim: true,  score: 50,  status: 'completed', cta: 'declined',         duration: 156, when: '58m ago',     summary: 'Prefers city — Indiranagar / Koramangala. Politely declined.' },
    { id: 'L-1204', name: 'Sneha Banerjee',    phone: DEMO_PHONE, intent: 'self_use',   geo: true,  bud: true,  tim: true,  score: 100, status: 'completed', cta: 'follow_up_booked', duration: 312, when: '1h 12m ago',  summary: 'Very warm. Schedule confirmed for next weekend with husband.' },
    { id: 'L-1203', name: 'Karthik Subbiah',   phone: DEMO_PHONE, intent: 'unclear',    geo: true,  bud: false, tim: null,  score: 25,  status: 'completed', cta: 'unclear',          duration: 92,  when: '1h 41m ago',  summary: 'Short call, evasive on budget. Re-queue in 30 days.' },
    { id: 'L-1202', name: 'Anita Sharma',      phone: DEMO_PHONE, intent: 'investment', geo: true,  bud: true,  tim: true,  score: 100, status: 'completed', cta: 'brochure_sent',    duration: 264, when: '2h 03m ago',  summary: 'Second property for capital appreciation.' },
    { id: 'L-1201', name: 'Faisal Khan',       phone: DEMO_PHONE, intent: null,         geo: false, bud: false, tim: null,  score: 0,   status: 'no_answer', cta: null,               duration: null,when: '2h 18m ago',  summary: '' },
    { id: 'L-1200', name: 'Meenakshi Rao',     phone: DEMO_PHONE, intent: 'self_use',   geo: true,  bud: true,  tim: true,  score: 100, status: 'completed', cta: 'follow_up_booked', duration: 341, when: '2h 47m ago',  summary: 'Retired couple, downsizing from Sadashivnagar.' },
    { id: 'L-1199', name: 'Devansh Patel',     phone: DEMO_PHONE, intent: 'investment', geo: false, bud: true,  tim: false, score: 50,  status: 'completed', cta: 'declined',         duration: 124, when: '3h 02m ago',  summary: 'Looking only at Hyderabad inventory.' },
    { id: 'L-1198', name: 'Lakshmi Pillai',    phone: DEMO_PHONE, intent: 'self_use',   geo: true,  bud: false, tim: true,  score: 50,  status: 'completed', cta: 'brochure_sent',    duration: 211, when: '3h 24m ago',  summary: 'Budget ₹2.5Cr — below entry. Sent brochure.' },
    { id: 'L-1197', name: 'Tanmay Joshi',      phone: DEMO_PHONE, intent: null,         geo: false, bud: false, tim: null,  score: 0,   status: 'failed',    cta: null,               duration: null,when: '3h 58m ago',  summary: '' },
  ],

  activity: [
    { t: '08:42', kind: 'qualified', text: 'Priya Iyer qualified — Site visit booked' },
    { t: '08:38', kind: 'objection', text: 'Vivek Reddy: location objection — city preferred' },
    { t: '08:33', kind: 'started',   text: 'Outbound call started — Apurv Bhardwaj' },
    { t: '08:21', kind: 'qualified', text: 'Sneha Banerjee qualified — High intent' },
    { t: '08:14', kind: 'sent',      text: 'Brochure sent — Rohan Kapoor (Investment, NRI)' },
    { t: '08:02', kind: 'queue',     text: '24 new leads imported from "April Newsletter"' },
    { t: '07:51', kind: 'objection', text: 'Karthik Subbiah: evasive on budget' },
    { t: '07:40', kind: 'qualified', text: 'Anita Sharma qualified — Investor profile' },
  ],

  // Only the views we've actually built
  nav: [
    { id: 'overview', label: 'Overview',      icon: 'home',  badge: null },
    { id: 'leads',    label: 'Leads',         icon: 'users', badge: null },
    { id: 'agent',    label: 'Agent · Meera', icon: 'orb',   badge: null },
  ],
};

// ── helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
window.timeAgo = timeAgo;

function mapApiLead(l) {
  return {
    id:       l.id,
    name:     l.name,
    phone:    l.phone,
    intent:   l.intent,
    geo:      l.geography_fit,
    bud:      l.budget_fit,
    tim:      l.timeline_fit === false ? false : (l.timeline_fit === true ? true : null),
    score:    l.qualification_score,
    status:   l.status,
    cta:      l.cta_outcome,
    duration: l.call_duration,
    when:     timeAgo(l.created_at),
    summary:  l.summary || '',
    transcript: l.transcript,
    recording_url: l.recording_url,
  };
}
window.mapApiLead = mapApiLead;

// Fetch real leads once on load; keep demo seed as fallback
async function loadLeads() {
  try {
    const res = await fetch('/api/leads');
    if (!res.ok) return;
    const { leads } = await res.json();
    if (leads && leads.length > 0) {
      WOW_DATA.leads = leads.map(mapApiLead);
      window.dispatchEvent(new CustomEvent('wow:leads-updated'));
    }
  } catch (_) {}
}
window.loadLeads = loadLeads;
loadLeads();
