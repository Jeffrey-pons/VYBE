import { useCallback, useEffect, useState } from 'react';
import { memGet, memSet, dedupe } from '@/utils/cache';

type Opts<T> = {
  initial?: T;
  mapResult?: (raw: T) => T;
  cacheKey?: string;
  ttlMs?: number;
  preferCache?: boolean; 
};

export function useRefreshable<T>(fetcher: () => Promise<T>, opts: Opts<T> = {}) {
  const { initial, mapResult, cacheKey, ttlMs = 5 * 60_000, preferCache = true } = opts;

  const [data, setData] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState<boolean>(!initial);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = cacheKey ? await dedupe(cacheKey, fetcher) : await fetcher();
      const next = mapResult ? mapResult(raw) : raw;
      setData((prev) => (Object.is(prev, next) ? prev : next));
      if (cacheKey) memSet(cacheKey, next, ttlMs);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : (e as { message?: string })?.message ?? 'Unexpected error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fetcher, mapResult, cacheKey, ttlMs]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (cacheKey) {
        const { data: cached, fresh } = memGet<T>(cacheKey);
        if (cached && preferCache && mounted) {
          setData((prev) => (Object.is(prev, cached) ? prev : cached));
          setLoading(!fresh); // si frais: on évite un flash de spinner
        }
      }
      await refetch();
    })();
    return () => {
      mounted = false;
    };
  }, [cacheKey, preferCache, refetch]);

  return { data, loading, error, refetch, setData };
}
