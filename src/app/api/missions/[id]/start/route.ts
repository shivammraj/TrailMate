import { NextRequest, NextResponse } from 'next/server';
import type { APIResponse, Mission } from '@/lib/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { sessionId } = body as { sessionId: string };
    const { id } = await params;

    if (process.env.SUPABASE_URL && sessionId) {
      const supabase = createServerSupabaseClient();
      const { data: userId } = await supabase.rpc('get_or_create_user', { p_session_id: sessionId });

      await supabase
        .from('missions')
        .update({ status: 'active', started_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId);

      await supabase.from('outdoor_sessions').insert({
        user_id: userId,
        mission_id: id,
        started_at: new Date().toISOString(),
      });

      return NextResponse.json<APIResponse<null>>({ success: true, data: null });
    }

    return NextResponse.json<APIResponse<null>>({ success: true, data: null });
  } catch (error) {
    console.error('[Mission Start]', error);
    return NextResponse.json<APIResponse<never>>(
      { success: false, error: 'Failed to start mission' },
      { status: 500 }
    );
  }
}
