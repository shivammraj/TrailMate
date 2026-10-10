import type { AIProvider, MissionGenerationContext, EvidenceVerification } from '../provider';
import type { AIGeneratedMission, AIAnalysisResult, Evidence, Mission, Discovery } from '../../types';

export class MockAIProvider implements AIProvider {
  name = 'MockAI';
  mode = 'mock' as const;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async generateMission(context: MissionGenerationContext): Promise<AIGeneratedMission> {
    return {
      title: "Nature Walk Explorer",
      description: "Explore the nearby park and document local flora.",
      objectives: [
        {
          description: "Find an Oak Tree",
          type: "photograph",
          target: "plant",
          count: 1
        }
      ],
      tips: ["Look for distinctive lobed leaves.", "Oak trees often have acorns nearby."],
      difficulty: "easy",
      estimatedDuration: 30
    };
  }

  async analyzeOutdoorImage(imageBase64: string): Promise<AIAnalysisResult> {
    return {
      label: "Oak Tree",
      confidence: 0.85,
      category: "plant",
      description: "A large deciduous tree known for its strong wood and lobed leaves.",
      missionRelevance: true,
      uncertain: false,
      model: "mock-vision-v1",
      processingTime: 120
    };
  }

  async identifyDiscovery(imageBase64: string): Promise<AIAnalysisResult> {
    return {
      label: "Blue Jay",
      confidence: 0.92,
      category: "bird",
      description: "A passerine bird in the family Corvidae, native to North America.",
      missionRelevance: true,
      uncertain: false,
      model: "mock-vision-v1",
      processingTime: 150
    };
  }

  async verifyMissionEvidence(evidence: Evidence, mission: Mission): Promise<EvidenceVerification> {
    return {
      valid: true,
      reason: "Plant identified successfully in the image.",
      confidence: 0.85
    };
  }

  async generateExplanation(discovery: Discovery): Promise<string> {
    return "Oak trees are majestic trees that produce acorns and can live for hundreds of years. They provide crucial habitats for many bird and insect species.";
  }
}
