export type CacheEntry<T> = { ts: number; ttlMs: number; data: T };

const memory = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export function memGet<T>(key: string): { data?: T; fresh: boolean } {
  const entry = memory.get(key) as CacheEntry<T> | undefined;
  if (!entry) return { data: undefined, fresh: false };
  const fresh = Date.now() - entry.ts < entry.ttlMs;
  return { data: entry.data, fresh };
}

export function memSet<T>(key: string, data: T, ttlMs: number): void {
  memory.set(key, { ts: Date.now(), ttlMs, data });
}

// Empêche les appels réseau doublons simultanés pour une même clé
export function dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p as Promise<unknown>);
  return p;
}

// (optionnel pour tests)
export function memClear(): void {
  memory.clear();
  inflight.clear();
}
