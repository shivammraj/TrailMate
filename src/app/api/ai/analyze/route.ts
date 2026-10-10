import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';
import type { APIResponse, AIAnalysisResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    
    if (!imageFile) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: 'No image provided' }, 
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: 'Image must be under 10MB' },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    const ai = await getAIProvider();
    const result = await ai.analyzeOutdoorImage(dataUrl);

    return NextResponse.json<APIResponse<AIAnalysisResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[AI Analyze]', error);
    return NextResponse.json<APIResponse<never>>(
      { success: false, error: 'AI analysis failed' },
      { status: 500 }
    );
  }
}
