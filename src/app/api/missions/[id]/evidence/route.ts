import { NextRequest, NextResponse } from 'next/server';
import type { APIResponse, Evidence, AIAnalysisResult } from '@/lib/types';
import { getAIProvider } from '@/lib/ai';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const objectiveId = formData.get('objectiveId') as string;
    const sessionId = formData.get('sessionId') as string;
    const { id } = await params;

    if (!image || !objectiveId || !sessionId) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ai = await getAIProvider();
    
    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${image.type};base64,${base64}`;

    const analysis = await ai.analyzeOutdoorImage(dataUrl);

    if (analysis.confidence < 0.5) {
      analysis.uncertain = true;
      analysis.label = 'Unknown — try a clearer photo';
    }

    const evidence: Evidence = {
      id: crypto.randomUUID(),
      missionId: id,
      objectiveId,
      type: 'photo',
      aiAnalysis: analysis,
      verified: analysis.missionRelevance,
      capturedAt: new Date(),
    };

    if (process.env.SUPABASE_URL && sessionId) {
      try {
        const supabase = createServerSupabaseClient();
        await supabase.from('evidence').insert({
          id: evidence.id,
          mission_id: id,
          objective_id: objectiveId,
          type: 'photo',
          ai_label: analysis.label,
          ai_confidence: analysis.confidence,
          ai_category: analysis.category,
          ai_description: analysis.description,
          ai_model: analysis.model,
          verified: evidence.verified,
        });

        if (evidence.verified) {
          const { data: obj } = await supabase.from('mission_objectives').select('completed').eq('id', objectiveId).single();
          if (obj) {
            await supabase.from('mission_objectives').update({ completed: obj.completed + 1 }).eq('id', objectiveId);
          }
        }
      } catch (dbError) {
        console.warn('[Mission Evidence] DB save failed:', dbError);
      }
    }

    return NextResponse.json<APIResponse<{ evidence: Evidence; analysis: AIAnalysisResult }>>({
      success: true,
      data: { evidence, analysis }
    });
  } catch (error) {
    console.error('[Mission Evidence]', error);
    return NextResponse.json<APIResponse<never>>(
      { success: false, error: 'Failed to process evidence' },
      { status: 500 }
    );
  }
}
