import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const supabase = createServerClient();
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      if (status === 'qualified') {
        query = query.eq('qualified', true);
      } else {
        query = query.eq('status', status);
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    return Response.json({ leads: data ?? [] });
  } catch (error) {
    console.error('GET /api/leads error:', error);
    return Response.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}
