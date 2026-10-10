import { NextRequest, NextResponse } from 'next/server';
import type { APIResponse, ProfileStats } from '@/lib/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  
  try {
    if (process.env.SUPABASE_URL && sessionId) {
      const supabase = createServerSupabaseClient();
      const { data: userId } = await supabase.rpc('get_or_create_user', { p_session_id: sessionId });
      
      const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
      const { count: discoveriesCount } = await supabase.from('discoveries').select('*', { count: 'exact', head: true }).eq('user_id', userId);
      const { data: achievementsData } = await supabase.from('achievements').select('*').eq('user_id', userId);
      
      if (user) {
        const stats: ProfileStats = {
          xp: user.xp,
          level: Math.floor(user.xp / 1000) + 1,
          streak: user.streak,
          outdoorMinutes: user.outdoor_minutes,
          missionsCompleted: user.missions_completed,
          discoveriesCount: discoveriesCount || 0,
          achievements: (achievementsData || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            icon: a.icon || '🏆',
            unlockedAt: new Date(a.unlocked_at)
          }))
        };
        return NextResponse.json<APIResponse<ProfileStats>>({ success: true, data: stats });
      }
    }
    
    // Mock
    return NextResponse.json<APIResponse<ProfileStats>>({
      success: true,
      data: {
        xp: 0,
        level: 1,
        streak: 0,
        outdoorMinutes: 0,
        missionsCompleted: 0,
        discoveriesCount: 0,
        achievements: []
      }
    });
  } catch (error) {
    console.error('[Profile GET]', error);
    return NextResponse.json<APIResponse<never>>(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}
