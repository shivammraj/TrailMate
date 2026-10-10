import type { AIProvider, MissionGenerationContext, EvidenceVerification } from '../provider';
import type { AIGeneratedMission, AIAnalysisResult, Evidence, Mission, Discovery, AIMode } from '../../types';
import { PROMPTS } from '../prompts';
import { AIAnalysisSchema, AIMissionSchema, parseAIResponse } from '../validation';

export class LocalAIProvider implements AIProvider {
  name = 'Ollama (LLaVA)';
  mode: AIMode = 'local';
  
  private baseUrl: string;
  private model: string;
  private visionModel: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL ?? 'llava';
    this.visionModel = process.env.OLLAMA_VISION_MODEL ?? this.model;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) return false;
      const data = await response.json();
      // Check if our vision model is available
      return data.models?.some((m: { name: string }) => 
        m.name.startsWith(this.visionModel.split(':')[0])
      ) ?? false;
    } catch {
      return false;
    }
  }

  private async ollamaGenerate(prompt: string, imageBase64?: string): Promise<string> {
    const body: Record<string, unknown> = {
      model: imageBase64 ? this.visionModel : this.model,
      prompt,
      stream: false,
      options: {
        temperature: 0.3, // Lower temperature for more consistent structured output
        top_p: 0.9,
      }
    };
    
    if (imageBase64) {
      body.images = [imageBase64.replace(/^data:image\/\w+;base64,/, '')];
    }

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30s timeout for local inference
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response as string;
  }

  async analyzeOutdoorImage(imageBase64: string): Promise<AIAnalysisResult> {
    const start = Date.now();
    try {
      const raw = await this.ollamaGenerate(PROMPTS.analyzeOutdoorImage, imageBase64);
      const parsed = parseAIResponse(AIAnalysisSchema, raw);
      
      const uncertain = parsed.confidence < 0.5;
      return {
        ...parsed,
        uncertain,
        label: uncertain ? 'Uncertain — try a clearer photo' : parsed.label,
        model: `ollama/${this.visionModel}`,
        processingTime: Date.now() - start,
        missionRelevance: parsed.missionRelevance,
      };
    } catch (error) {
      // Return uncertain result on parse/network error
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
    
    const raw = await this.ollamaGenerate(PROMPTS.generateMission(contextStr));
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
    const raw = await this.ollamaGenerate(
      PROMPTS.generateExplanation(discovery.label, discovery.category)
    );
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
      model: `ollama/${this.visionModel}`,
      processingTime,
    };
  }
}
