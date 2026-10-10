export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('trailmate_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('trailmate_session', id);
  }
  return id;
}

export function getLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

export function getLevelProgress(xp: number): { level: number; current: number; max: number; percent: number } {
  const level = getLevel(xp);
  const currentLevelXP = getXPForNextLevel(level - 1);
  const nextLevelXP = getXPForNextLevel(level);
  
  const current = xp - currentLevelXP;
  const max = nextLevelXP - currentLevelXP;
  const percent = Math.min(100, Math.max(0, (current / max) * 100));
  
  return { level, current, max, percent };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`;
  return `${km.toFixed(1)} km`;
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}
