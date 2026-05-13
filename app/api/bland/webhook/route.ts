import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { scoreTranscript } from '@/lib/scoring';
import { detectCtaOutcome } from '@/lib/cta';
import { BlandWebhookPayload, TranscriptMessage, LeadStatus } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as BlandWebhookPayload;
    const { call_id, status, transcripts, recording_url, call_length, metadata, summary } =
      payload;

    const lead_id = metadata?.lead_id;
    if (!lead_id) {
      return Response.json({ ok: true });
    }

    const supabase = createServerClient();

    const messages: TranscriptMessage[] = (transcripts ?? []).map((t) => ({
      role: t.role === 'assistant' ? 'assistant' : 'user',
      content: t.content,
      timestamp: t.created_at,
    }));

    const qualification = scoreTranscript(transcripts ?? []);
    const cta_outcome = detectCtaOutcome(transcripts ?? []);

    const leadStatus: LeadStatus =
      status === 'no-answer'
        ? 'no_answer'
        : status === 'failed'
        ? 'failed'
        : 'completed';

    await supabase
      .from('leads')
      .update({
        status: leadStatus,
        transcript: messages,
        recording_url: recording_url ?? null,
        call_duration: call_length ?? null,
        summary: summary ?? null,
        intent: qualification.intent,
        geography_fit: qualification.geography_fit,
        budget_fit: qualification.budget_fit,
        timeline_fit: qualification.timeline_fit,
        qualification_score: qualification.score,
        qualified: qualification.qualified,
        cta_outcome,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead_id);

    await supabase.from('call_logs').insert({
      lead_id,
      call_id,
      event_type: 'call_completed',
      event_data: payload as unknown as Record<string, unknown>,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('POST /api/bland/webhook error:', error);
    return Response.json({ ok: true }); // Always 200 to Bland
  }
}
