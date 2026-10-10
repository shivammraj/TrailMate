import { NextRequest, NextResponse } from 'next/server';
import type { APIResponse, Discovery } from '@/lib/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  
  try {
    if (process.env.SUPABASE_URL && sessionId) {
      const supabase = createServerSupabaseClient();
      const { data: userId } = await supabase.rpc('get_or_create_user', { p_session_id: sessionId });
      
      const { data: discoveries, error } = await supabase
        .from('discoveries')
        .select('*')
        .eq('user_id', userId)
        .order('discovered_at', { ascending: false });
      
      if (!error && discoveries) {
        const mapped = discoveries.map((d: any) => ({
          id: d.id,
          label: d.label,
          category: d.category,
          description: d.description,
          confidence: d.confidence,
          location: { lat: d.coarse_lat, lng: d.coarse_lng, city: d.city, accuracy: 5000 },
          discoveredAt: new Date(d.discovered_at),
          missionId: d.mission_id
        }));
        return NextResponse.json<APIResponse<Discovery[]>>({ success: true, data: mapped });
      }
    }
    
    return NextResponse.json<APIResponse<Discovery[]>>({ success: true, data: [] });
  } catch (error) {
    console.error('[Discoveries GET]', error);
    return NextResponse.json<APIResponse<never>>(
      { success: false, error: 'Failed to get discoveries' },
      { status: 500 }
    );
  }
}
