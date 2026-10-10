import type { AIProvider, MissionGenerationContext, EvidenceVerification } from '../provider';
import type { AIGeneratedMission, AIAnalysisResult, Evidence, Mission, Discovery, AIMode } from '../../types';
import { PROMPTS } from '../prompts';
import { AIAnalysisSchema, AIMissionSchema, parseAIResponse } from '../validation';

export class CloudAIProvider implements AIProvider {
  name = 'Gemini Flash (Cloud)';
  mode: AIMode = 'cloud';
  
  private apiKey: string;
  private endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY ?? '';
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  private async generate(prompt: string, imageBase64?: string): Promise<string> {
    const contents: any[] = [{
      role: 'user',
      parts: []
    }];

    if (imageBase64) {
      const b64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
      contents[0].parts.push({
        inline_data: {
          mime_type: mimeType,
          data: b64Data
        }
      });
    }

    contents[0].parts.push({ text: prompt });

    const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }

  async analyzeOutdoorImage(imageBase64: string): Promise<AIAnalysisResult> {
    const start = Date.now();
    try {
      const raw = await this.generate(PROMPTS.analyzeOutdoorImage, imageBase64);
      const parsed = parseAIResponse(AIAnalysisSchema, raw);
      
      const uncertain = parsed.confidence < 0.5;
      return {
        ...parsed,
        uncertain,
        label: uncertain ? 'Uncertain — try a clearer photo' : parsed.label,
        model: 'gemini-1.5-flash',
        processingTime: Date.now() - start,
        missionRelevance: parsed.missionRelevance,
      };
    } catch (error) {
      return this.getUncertainResult(Date.now() - start);
    }
  }

  async identifyDiscovery(imageBase64: string): Promise<AIAnalysisResult> {
    return this.analyzeOutdoorImage(imageBase64);
  }

  async generateMission(context: MissionGenerationContext): Promise<AIGeneratedMission> {
    const contextStr = JSON.stringify({
      type: context.missionType,
      difficulty: context.difficulty,
      availableMinutes: context.availableTime,
      weather: context.weather?.condition ?? 'unknown',
      location: context.location?.city ?? 'outdoor area',
    });
    
    const raw = await this.generate(PROMPTS.generateMission(contextStr));
    const parsed = parseAIResponse(AIMissionSchema, raw);
    return {
      ...parsed,
      objectives: parsed.objectives.map(obj => ({
        ...obj,
        target: obj.target ?? obj.type,
      })),
    };
  }

  async verifyMissionEvidence(evidence: Evidence, mission: Mission): Promise<EvidenceVerification> {
    if (!evidence.dataUrl) {
      return { valid: false, reason: 'No image provided', confidence: 0 };
    }
    const analysis = await this.analyzeOutdoorImage(evidence.dataUrl);
    return {
      valid: !analysis.uncertain && analysis.missionRelevance,
      reason: analysis.uncertain 
        ? 'Could not identify — try a clearer photo' 
        : `Identified: ${analysis.label} (${Math.round(analysis.confidence * 100)}% confidence)`,
      confidence: analysis.confidence,
    };
  }

  async generateExplanation(discovery: Discovery): Promise<string> {
    const raw = await this.generate(PROMPTS.generateExplanation(discovery.label, discovery.category));
    return raw.trim();
  }

  private getUncertainResult(processingTime: number): AIAnalysisResult {
    return {
      label: 'Uncertain — try a clearer photo',
      confidence: 0,
      category: 'other',
      description: 'The AI could not confidently identify what is in this image. Try taking a clearer, closer photo.',
      missionRelevance: false,
      uncertain: true,
      model: 'gemini-1.5-flash',
      processingTime,
    };
  }
}
