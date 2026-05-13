import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return Response.json({ error: 'Lead not found' }, { status: 404 });

    return Response.json({ lead: data });
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error);
    return Response.json({ error: 'Failed to fetch lead.' }, { status: 500 });
  }
}
