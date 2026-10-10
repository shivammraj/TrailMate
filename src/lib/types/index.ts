// User session (anonymous)
export interface UserSession {
  id: string;
  createdAt: Date;
  xp: number;
  streak: number;
  outdoorMinutes: number;
  missionsCompleted: number;
}

// Mission
export type MissionType = 'nature' | 'birds' | 'plants' | 'photography' | 'running' | 'custom';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type MissionStatus = 'available' | 'active' | 'completed' | 'failed';

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  objectives: MissionObjective[];
  difficulty: MissionDifficulty;
  estimatedDuration: number; // minutes
  estimatedDistance: number; // km
  xpReward: number;
  weatherRequirement?: WeatherRequirement;
  location?: LocationContext;
  status: MissionStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface MissionObjective {
  id: string;
  description: string;
  type: 'find' | 'photograph' | 'identify' | 'walk';
  target?: string; // e.g., "plant", "bird", "texture"
  count: number;
  completed: number;
  evidence: Evidence[];
}

// Evidence
export type EvidenceType = 'photo' | 'audio' | 'text';

export interface Evidence {
  id: string;
  missionId: string;
  objectiveId: string;
  type: EvidenceType;
  dataUrl?: string; // base64 for photos
  aiAnalysis?: AIAnalysisResult;
  verified: boolean;
  capturedAt: Date;
}

// AI
export type AIConfidence = number; // 0-1
export type AIMode = 'local' | 'cloud' | 'mock';

export interface AIAnalysisResult {
  label: string;
  confidence: AIConfidence;
  category: string;
  description: string;
  missionRelevance: boolean;
  uncertain: boolean;
  model: string;
  processingTime: number;
}

export interface AIGeneratedMission {
  title: string;
  description: string;
  objectives: Omit<MissionObjective, 'id' | 'completed' | 'evidence'>[];
  tips: string[];
  difficulty: MissionDifficulty;
  estimatedDuration: number;
}

// Discovery
export interface Discovery {
  id: string;
  label: string;
  category: string;
  description: string;
  confidence: number;
  imageUrl?: string;
  location?: CoarseLocation;
  discoveredAt: Date;
  missionId: string;
}

// Location (coarse — privacy first)
export interface CoarseLocation {
  lat: number;
  lng: number;
  accuracy: number;
  city?: string;
}

export interface LocationContext {
  available: boolean;
  coarseLocation?: CoarseLocation;
  nearbyParks?: NearbyPark[];
}

export interface NearbyPark {
  id: string;
  name: string;
  type: string;
  distance: number; // km
}

// Weather
export interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  isGoodForOutdoors: boolean;
  description: string;
}

// Weather requirement
export interface WeatherRequirement {
  minTemp?: number;
  maxWindSpeed?: number;
  noRain?: boolean;
}

// Profile stats
export interface ProfileStats {
  xp: number;
  level: number;
  streak: number;
  outdoorMinutes: number;
  missionsCompleted: number;
  discoveriesCount: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// API response wrappers
export interface APIResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
