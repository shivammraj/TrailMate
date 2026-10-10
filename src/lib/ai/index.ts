import type { AIProvider } from './provider';
import { MockAIProvider } from './mock';

// Lazy imports to avoid importing model SDKs in all environments
async function getLocalProvider(): Promise<AIProvider> {
  const { LocalAIProvider } = await import('./local');
  return new LocalAIProvider();
}

async function getCloudProvider(): Promise<AIProvider> {
  const { CloudAIProvider } = await import('./cloud');
  return new CloudAIProvider();
}

export async function getAIProvider(): Promise<AIProvider> {
  const mode = (process.env.AI_MODE ?? 'mock') as 'local' | 'cloud' | 'mock';
  
  switch (mode) {
    case 'local': {
      const provider = await getLocalProvider();
      const available = await provider.isAvailable();
      if (available) return provider;
      console.warn('[TrailMate AI] Local AI unavailable, falling back to mock');
      return new MockAIProvider();
    }
    case 'cloud': {
      if (!process.env.GEMINI_API_KEY) {
        console.warn('[TrailMate AI] GEMINI_API_KEY not set, falling back to mock');
        return new MockAIProvider();
      }
      return await getCloudProvider();
    }
    default:
      return new MockAIProvider();
  }
}

// Synchronous version for cases where async isn't possible
export function getAIProviderSync(): AIProvider {
  return new MockAIProvider();
}
