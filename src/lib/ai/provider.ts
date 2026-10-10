import type { AIMode, AIGeneratedMission, AIAnalysisResult, Evidence, Mission, MissionType, MissionDifficulty, CoarseLocation, WeatherData, Discovery } from '../types';

export interface MissionGenerationContext {
  location?: CoarseLocation;
  weather?: WeatherData;
  missionType: MissionType;
  difficulty: MissionDifficulty;
  availableTime: number; // minutes
}

export interface EvidenceVerification {
  valid: boolean;
  reason: string;
  confidence: number;
}

export interface AIProvider {
  name: string;
  mode: AIMode;
  isAvailable(): Promise<boolean>;
  generateMission(context: MissionGenerationContext): Promise<AIGeneratedMission>;
  analyzeOutdoorImage(imageBase64: string): Promise<AIAnalysisResult>;
  identifyDiscovery(imageBase64: string): Promise<AIAnalysisResult>;
  verifyMissionEvidence(evidence: Evidence, mission: Mission): Promise<EvidenceVerification>;
  generateExplanation(discovery: Discovery): Promise<string>;
}
