import { NextRequest, NextResponse } from 'next/server';
import type { APIResponse, Mission, MissionType, MissionDifficulty, MissionObjective } from '@/lib/types';
import { getAIProvider } from '@/lib/ai';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  
  try {
    if (process.env.SUPABASE_URL && sessionId) {
      const supabase = createServerSupabaseClient();
      const { data: userId } = await supabase.rpc('get_or_create_user', { p_session_id: sessionId });
      
      const { data: missions, error } = await supabase
        .from('missions')
        .select('*, mission_objectives(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (!error && missions) {
        return NextResponse.json<APIResponse<Mission[]>>({ success: true, data: mapMissions(missions) });
      }
    }
    
    return NextResponse.json<APIResponse<Mission[]>>({ success: true, data: getMockMissions() });
  } catch {
    return NextResponse.json<APIResponse<Mission[]>>({ success: true, data: getMockMissions() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, difficulty, availableTime, sessionId, location, weather } = body as {
      type: MissionType;
      difficulty: MissionDifficulty;
      availableTime: number;
      sessionId: string;
      location?: unknown;
      weather?: unknown;
    };

    const ai = await getAIProvider();
    const generated = await ai.generateMission({
      missionType: type,
      difficulty,
      availableTime: availableTime ?? 30,
      location: location as never,
      weather: weather as never,
    });

    const missionId = crypto.randomUUID();
    const mission: Mission = {
      id: missionId,
      type,
      title: generated.title,
      description: generated.description,
      difficulty,
      status: 'available',
      xpReward: calculateXP(difficulty),
      estimatedDuration: generated.estimatedDuration,
      estimatedDistance: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 4,
      objectives: generated.objectives.map((obj) => ({
        id: crypto.randomUUID(),
        description: obj.description,
        type: obj.type as MissionObjective['type'],
        target: obj.target,
        count: obj.count,
        completed: 0,
        evidence: [],
      })),
      createdAt: new Date(),
    };

    if (process.env.SUPABASE_URL && sessionId) {
      try {
        const supabase = createServerSupabaseClient();
        const { data: userId } = await supabase.rpc('get_or_create_user', { p_session_id: sessionId });
        await supabase.from('missions').insert({
          id: missionId,
          user_id: userId,
          type,
          title: mission.title,
          description: mission.description,
          difficulty,
          xp_reward: mission.xpReward,
          estimated_duration: mission.estimatedDuration,
          ai_tips: generated.tips,
        });
        for (const obj of mission.objectives) {
          await supabase.from('mission_objectives').insert({
            id: obj.id,
            mission_id: missionId,
            description: obj.description,
            type: obj.type,
            target: obj.target,
            count: obj.count,
          });
        }
      } catch (dbError) {
        console.warn('[Missions POST] DB save failed:', dbError);
      }
    }

    return NextResponse.json<APIResponse<Mission>>({ success: true, data: mission });
  } catch (error) {
    console.error('[Missions POST]', error);
    return NextResponse.json<APIResponse<never>>(
      { success: false, error: 'Failed to create mission' },
      { status: 500 }
    );
  }
}

function calculateXP(difficulty: MissionDifficulty): number {
  const base = { easy: 100, medium: 200, hard: 350 };
  return base[difficulty];
}

function getMockMissions(): Mission[] {
  return [
    {
      id: 'mock-1',
      type: 'nature',
      title: 'Nature Walk Explorer',
      description: 'Explore your surroundings and document natural elements.',
      difficulty: 'easy',
      status: 'available',
      xpReward: 100,
      estimatedDuration: 30,
      estimatedDistance: 1,
      objectives: [
        { id: 'obj-1', description: 'Find a tree', type: 'photograph', target: 'tree', count: 1, completed: 0, evidence: [] },
        { id: 'obj-2', description: 'Spot a bird', type: 'identify', target: 'bird', count: 1, completed: 0, evidence: [] },
      ],
      createdAt: new Date(),
    },
  ];
}

function mapMissions(dbMissions: Record<string, any>[]): Mission[] {
  return dbMissions.map(m => ({
    id: m.id as string,
    type: m.type as MissionType,
    title: m.title as string,
    description: m.description as string,
    difficulty: m.difficulty as MissionDifficulty,
    status: m.status as Mission['status'],
    xpReward: m.xp_reward as number,
    estimatedDuration: m.estimated_duration as number,
    estimatedDistance: m.estimated_distance as number,
    objectives: (m.mission_objectives || []).map((obj: Record<string, any>) => ({
      id: obj.id as string,
      description: obj.description as string,
      type: obj.type as MissionObjective['type'],
      target: obj.target as string,
      count: obj.count as number,
      completed: obj.completed as number,
      evidence: [],
    })),
    createdAt: new Date(m.created_at as string),
    startedAt: m.started_at ? new Date(m.started_at as string) : undefined,
    completedAt: m.completed_at ? new Date(m.completed_at as string) : undefined,
  }));
}
