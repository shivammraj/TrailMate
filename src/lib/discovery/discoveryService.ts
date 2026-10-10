'use client';

import type { Discovery, APIResponse } from '@/lib/types';

export const discoveryService = {
  async getDiscoveries(): Promise<Discovery[]> {
    try {
      const response = await fetch('/api/discoveries');
      const data: APIResponse<Discovery[]> = await response.json();
      return data.data || [];
    } catch {
      return [];
    }
  },
};
