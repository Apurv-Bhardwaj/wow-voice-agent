export type LeadStatus = 'pending' | 'calling' | 'completed' | 'failed' | 'no_answer';
export type IntentType = 'self_use' | 'investment' | 'unclear';
export type CtaOutcome = 'follow_up_booked' | 'brochure_sent' | 'declined' | 'unclear';

export interface TranscriptMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  call_id: string | null;
  intent: IntentType | null;
  geography_fit: boolean;
  budget_fit: boolean;
  timeline_fit: boolean;
  qualification_score: number;
  qualified: boolean;
  transcript: TranscriptMessage[] | null;
  recording_url: string | null;
  call_duration: number | null;
  summary: string | null;
  notes: string | null;
  cta_outcome: CtaOutcome | null;
  created_at: string;
  updated_at: string;
}

export interface CallLog {
  id: string;
  lead_id: string;
  call_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export interface QualificationResult {
  intent: IntentType;
  geography_fit: boolean;
  budget_fit: boolean;
  timeline_fit: boolean;
  score: number;
  qualified: boolean;
}

export interface BlandTranscript {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface BlandWebhookPayload {
  call_id: string;
  status: string;
  transcripts: BlandTranscript[];
  recording_url: string;
  call_length: number;
  metadata: { lead_id: string };
  summary: string;
  answered_by: string;
}

export interface BlandCallOptions {
  phone_number: string;
  lead_name: string;
  lead_id: string;
  webhook_url: string;
  system_prompt: string;
}

export interface BlandCallResponse {
  call_id: string;
  status: string;
}
