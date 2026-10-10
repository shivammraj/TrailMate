import { z } from 'zod';

export const AIAnalysisSchema = z.object({
  label: z.string().min(1),
  confidence: z.number().min(0).max(1),
  category: z.enum(['plant', 'bird', 'insect', 'fungus', 'rock', 'landscape', 'animal', 'texture', 'other']),
  description: z.string().min(10),
  missionRelevance: z.boolean(),
  facts: z.array(z.string()).optional().default([]),
});

export const AIMissionSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  objectives: z.array(z.object({
    description: z.string(),
    type: z.enum(['find', 'photograph', 'identify', 'walk']),
    target: z.string().optional(),
    count: z.number().int().min(1).max(10),
  })).min(1).max(5),
  tips: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedDuration: z.number().min(10).max(180),
});

// Helper to parse and validate AI JSON responses safely
export function parseAIResponse<T>(schema: z.ZodSchema<T>, text: string): T {
  // Strip markdown code blocks if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const json = JSON.parse(cleaned);
  return schema.parse(json);
}
