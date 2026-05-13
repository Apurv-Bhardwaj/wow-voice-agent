CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'calling', 'completed', 'failed', 'no_answer')),
  call_id TEXT,
  intent TEXT CHECK (intent IN ('self_use', 'investment', 'unclear')),
  geography_fit BOOLEAN DEFAULT FALSE,
  budget_fit BOOLEAN DEFAULT FALSE,
  timeline_fit BOOLEAN DEFAULT FALSE,
  qualification_score INTEGER DEFAULT 0,
  qualified BOOLEAN DEFAULT FALSE,
  transcript JSONB,
  recording_url TEXT,
  call_duration REAL,
  summary TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  call_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE leads;

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_qualified ON leads(qualified);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
