'use client';
import type { Mission, MissionType, MissionDifficulty, APIResponse, Evidence, AIAnalysisResult, Discovery } from '@/lib/types';

export const missionService = {
  async getMissions(): Promise<Mission[]> {
    try {
      const response = await fetch('/api/missions');
      const data: APIResponse<Mission[]> = await response.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getMission(id: string): Promise<Mission | null> {
    try {
      const response = await fetch(`/api/missions/${id}`);
      const data: APIResponse<Mission> = await response.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  async createMission(type: MissionType, difficulty: MissionDifficulty, availableTime: number): Promise<Mission | null> {
    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, difficulty, availableTime })
      });
      const data: APIResponse<Mission> = await response.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  async startMission(id: string): Promise<Mission | null> {
    try {
      const response = await fetch(`/api/missions/${id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data: APIResponse<Mission> = await response.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  async submitEvidence(missionId: string, objectiveId: string, imageFile: File): Promise<{ evidence: Evidence; analysis: AIAnalysisResult } | null> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('objectiveId', objectiveId);

      const response = await fetch(`/api/missions/${missionId}/evidence`, {
        method: 'POST',
        body: formData
      });
      const data: APIResponse<{ evidence: Evidence; analysis: AIAnalysisResult }> = await response.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  async completeMission(id: string): Promise<{ xpEarned: number; discoveries: Discovery[] } | null> {
    try {
      const response = await fetch(`/api/missions/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data: APIResponse<{ xpEarned: number; discoveries: Discovery[] }> = await response.json();
      return data.data || null;
    } catch {
      return null;
    }
  },
};
