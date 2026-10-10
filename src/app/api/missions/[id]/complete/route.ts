import { NextRequest, NextResponse } from 'next/server';
import type { APIResponse, Discovery, ProfileStats } from '@/lib/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { sessionId } = body as { sessionId: string };
    const { id } = await params;

    if (process.env.SUPABASE_URL && sessionId) {
      const supabase = createServerSupabaseClient();
      const { data: userId } = await supabase.rpc('get_or_create_user', { p_session_id: sessionId });

      // Get mission details for XP
      const { data: mission } = await supabase.from('missions').select('xp_reward').eq('id', id).single();
      const xpEarned = mission?.xp_reward || 100;

      // Update mission
      await supabase
        .from('missions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId);

      // End outdoor session
      await supabase
        .from('outdoor_sessions')
        .update({ ended_at: new Date().toISOString(), outdoor_minutes: 30 }) // hardcoded minutes for now
        .eq('mission_id', id)
        .is('ended_at', null);

      // Create discoveries from verified evidence
      const { data: evidences } = await supabase
        .from('evidence')
        .select('*')
        .eq('mission_id', id)
        .eq('verified', true);

      const discoveries: Discovery[] = [];
      if (evidences) {
        for (const ev of evidences) {
          const discoveryId = crypto.randomUUID();
          await supabase.from('discoveries').insert({
            id: discoveryId,
            user_id: userId,
            mission_id: id,
            label: ev.ai_label || 'Unknown',
            category: ev.ai_category || 'Other',
            description: ev.ai_description,
            confidence: ev.ai_confidence,
          });
          discoveries.push({
            id: discoveryId,
            label: ev.ai_label,
            category: ev.ai_category,
            description: ev.ai_description,
            confidence: ev.ai_confidence,
            discoveredAt: new Date(),
            missionId: id,
          });
        }
      }

      // Update user stats
      const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
      if (user) {
        await supabase.from('users').update({
          xp: user.xp + xpEarned,
          missions_completed: user.missions_completed + 1,
          last_active_at: new Date().toISOString()
        }).eq('id', userId);
      }

      return NextResponse.json<APIResponse<{ xpEarned: number; discoveries: Discovery[]; stats: any }>>({
        success: true,
        data: {
          xpEarned,
          discoveries,
          stats: {
            xp: (user?.xp || 0) + xpEarned,
            level: Math.floor(((user?.xp || 0) + xpEarned) / 1000) + 1,
            streak: user?.streak || 0,
            outdoorMinutes: user?.outdoor_minutes || 0,
            missionsCompleted: (user?.missions_completed || 0) + 1,
            discoveriesCount: discoveries.length,
            achievements: []
          }
        }
      });
    }

    // Mock response
    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: {
        xpEarned: 100,
        discoveries: [],
        stats: {
          xp: 100,
          level: 1,
          streak: 1,
          outdoorMinutes: 30,
          missionsCompleted: 1,
          discoveriesCount: 0,
          achievements: []
        }
      }
    });
  } catch (error) {
    console.error('[Mission Complete]', error);
    return NextResponse.json<APIResponse<never>>(
      { success: false, error: 'Failed to complete mission' },
      { status: 500 }
    );
  }
}
