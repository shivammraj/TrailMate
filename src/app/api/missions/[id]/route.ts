import { NextRequest, NextResponse } from 'next/server';
import type { APIResponse, Mission, MissionType, MissionDifficulty, MissionObjective } from '@/lib/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  const { id } = await params;
  
  try {
    if (process.env.SUPABASE_URL && sessionId) {
      const supabase = createServerSupabaseClient();
      
      const { data: mission, error } = await supabase
        .from('missions')
        .select('*, mission_objectives(*)')
        .eq('id', id)
        .single();
      
      if (!error && mission) {
        return NextResponse.json<APIResponse<Mission>>({ success: true, data: mapMission(mission) });
      }
    }
    
    return NextResponse.json<APIResponse<Mission>>({ success: true, data: getMockMission(id) });
  } catch {
    return NextResponse.json<APIResponse<Mission>>({ success: true, data: getMockMission(id) });
  }
}

function getMockMission(id: string): Mission {
  return {
    id,
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
  };
}

function mapMission(m: Record<string, any>): Mission {
  return {
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
  };
}
