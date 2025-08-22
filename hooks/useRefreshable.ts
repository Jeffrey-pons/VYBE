import { useCallback, useEffect, useMemo, useState } from 'react';

type UseRefreshableOpts<T> = {
  // Optional seed value while the first fetch resolves
  initial?: T;
  // Map/normalize raw result if needed
  mapResult?: (raw: T) => T;
};

export function useRefreshable<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  opts: UseRefreshableOpts<T> = {}
) {
  const { initial, mapResult } = opts;

  const [data, setData] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState<boolean>(!initial);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _fetcher = useMemo(() => fetcher, deps);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await _fetcher();
      setData(mapResult ? mapResult(raw) : raw);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : (e as { message?: string })?.message ?? 'Unexpected error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [_fetcher, mapResult]);

  useEffect(() => {
    // first run + whenever deps change
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}
