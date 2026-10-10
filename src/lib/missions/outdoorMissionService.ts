import type { Mission, MissionType, MissionDifficulty } from '@/lib/types';

// Pre-built mission templates for offline/mock use
export const MISSION_TEMPLATES: Record<MissionType, Partial<Mission>[]> = {
  nature: [
    {
      title: 'Nature Walk Explorer',
      description: 'Venture outside and document the natural world around you. Every leaf, bird, and stone tells a story.',
      xpReward: 150,
    }
  ],
  birds: [
    {
      title: 'Urban Birding Quest',
      description: 'Cities are full of birds most people never notice. Today, you\'re going to find them.',
      xpReward: 200,
    }
  ],
  plants: [
    {
      title: 'Plant Detective',
      description: 'From weeds to wildflowers, plants are everywhere. Your mission: find and identify them.',
      xpReward: 175,
    }
  ],
  photography: [
    {
      title: 'Natural Textures Hunt',
      description: 'The world is full of incredible textures. Find 5 natural textures that tell a visual story.',
      xpReward: 125,
    }
  ],
  running: [
    {
      title: 'Mindful Run',
      description: 'A run with a purpose — observe your surroundings and complete discovery checkpoints along the way.',
      xpReward: 250,
    }
  ],
  custom: [
    {
      title: 'Open Exploration',
      description: 'No specific objective. Just go outside and see what the world offers today.',
      xpReward: 100,
    }
  ],
};
