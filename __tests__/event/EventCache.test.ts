import { memGet, memSet, memClear, dedupe } from '@/utils/cache';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useRefreshable } from '@/hooks/useRefreshable';

describe('utils/cache (memory)', () => {
  beforeEach(() => {
    memClear();
    jest.useRealTimers();
  });

  it('memSet + memGet → retourne les données et fresh=true si TTL > 0', () => {
    memSet<string>('k1', 'hello', 60_000);
    const { data, fresh } = memGet<string>('k1');
    expect(data).toBe('hello');
    expect(fresh).toBe(true);
  });

  it('memGet → fresh=false si TTL=0 (immédiatement périmé)', () => {
    memSet<string>('k2', 'old', 0);
    const { data, fresh } = memGet<string>('k2');
    expect(data).toBe('old');
    expect(fresh).toBe(false);
  });

  it('dedupe → ne lance la promesse qu’une fois pour les appels concurrents', async () => {
    jest.useFakeTimers();
    let calls = 0;

    const fn = (): Promise<number> =>
      new Promise((resolve) => {
        setTimeout(() => {
          calls += 1;
          resolve(42);
        }, 20);
      });

    const p1 = dedupe<number>('same-key', fn);
    const p2 = dedupe<number>('same-key', fn);

    // même Promise pour les deux appels
    expect(p1).toBe(p2);

    // on laisse "le réseau" répondre
    jest.advanceTimersByTime(25);

    await expect(p1).resolves.toBe(42);
    await expect(p2).resolves.toBe(42);

    expect(calls).toBe(1);
  });
});

describe('useRefreshable + memory cache', () => {
  beforeEach(() => {
    memClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('si preferCache=false, ignore la valeur cache et attend le réseau', async () => {
    const key = 'events:Lyon:week';
    memSet<string[]>(key, ['cached-lyon'], 60_000);

    const fetcher = jest.fn<() => Promise<string[]>>(() =>
      new Promise((resolve) => setTimeout(() => resolve(['net-lyon']), 20))
    );

    const { result } = renderHook(() =>
      useRefreshable<string[]>(fetcher, {
        cacheKey: key,
        initial: undefined,
        preferCache: false,
      })
    );

    // Pas de valeur cache servie d’abord
    expect(result.current.data).toBeUndefined();

    // Quand le "réseau" répond
    jest.advanceTimersByTime(25);

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(['net-lyon']);
    });
  });

  it('sans cacheKey → comportement simple: prend la valeur réseau', async () => {
    const fetcher = jest.fn<() => Promise<number>>(
      () => new Promise((resolve) => setTimeout(() => resolve(7), 10))
    );

    const { result } = renderHook(() =>
      useRefreshable<number>(fetcher, { initial: undefined })
    );

    // au départ pas de data
    expect(result.current.data).toBeUndefined();

    jest.advanceTimersByTime(15);

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result.current.data).toBe(7);
    });
  });
});
