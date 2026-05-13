import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createBlandCall } from '@/lib/bland';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { isValidIndianPhone } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone_number, lead_name } = body as {
      phone_number?: string;
      lead_name?: string;
    };

    if (!phone_number || !lead_name) {
      return Response.json(
        { error: 'phone_number and lead_name are required' },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(phone_number)) {
      return Response.json(
        { error: 'Invalid phone number. Use +91 followed by 10 digits (starting with 6-9).' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({ name: lead_name, phone: phone_number, status: 'calling' })
      .select()
      .single();

    if (insertError) throw insertError;

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/bland/webhook`;

    const blandResponse = await createBlandCall({
      phone_number,
      lead_name,
      lead_id: lead.id,
      webhook_url: webhookUrl,
      system_prompt: SYSTEM_PROMPT,
    });

    await supabase
      .from('leads')
      .update({ call_id: blandResponse.call_id })
      .eq('id', lead.id);

    return Response.json({ call_id: blandResponse.call_id, lead_id: lead.id });
  } catch (error) {
    console.error('POST /api/bland/create-call error:', error);
    return Response.json(
      { error: 'Failed to initiate call. Please try again.' },
      { status: 500 }
    );
  }
}
