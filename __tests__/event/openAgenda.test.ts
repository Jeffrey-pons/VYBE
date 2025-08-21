import {
  getUpcomingEventsOpenAgenda,
  getEventsByCategoryOpenAgenda,
  getEventsForTonightOpenAgenda,
  getEventsThisWeekOpenAgenda,
  getUpcomingPopularEventsInCity,
  getLastPostedEventsByCity,
  getEventByIdOpenAgenda,
} from '@/api/openAgenda';
import { Event } from '@/interfaces/event';

type FetchOkBody = { events?: Event[]; event?: Event };

const originalEnv = { ...process.env };

const setFetch = (impl: jest.Mock) => {
  (globalThis as unknown as { fetch: jest.Mock }).fetch = impl;
};
const getFetchMock = () => (globalThis as unknown as { fetch: jest.Mock }).fetch;

const mockFetchOk = (body: FetchOkBody = { events: [] }) =>
  setFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => body }));

const mockFetchFailStatus = (status = 500) =>
  setFetch(
    jest.fn().mockResolvedValue({
      ok: false,
      status,
      json: async () => ({}),
    }),
  );

const mockFetchReject = (err = new Error('network down')) =>
  setFetch(jest.fn().mockRejectedValue(err));

const lastCalledUrl = (): string => getFetchMock().mock.calls[0][0] as string;

beforeAll(() => {
  process.env.EXPO_PUBLIC_OPEN_AGENDA_API_URL = 'https://api.openagenda.test/v2';
  process.env.EXPO_PUBLIC_OPEN_AGENDA_API_KEY = 'TEST_KEY';
});

afterAll(() => {
  process.env = originalEnv;
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as unknown as jest.Mock).mockRestore?.();
});

describe('getUpcomingEventsOpenAgenda', () => {
  it('construit la bonne URL (city + keyword) et limite à 15 par défaut', async () => {
    const events: Event[] = Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) } as Event));
    mockFetchOk({ events });

    const res = await getUpcomingEventsOpenAgenda({ city: 'Paris', keyword: 'concert' });
    expect(res).toHaveLength(15);

    const url = new URL(lastCalledUrl());
    expect(url.origin + url.pathname).toBe('https://api.openagenda.test/v2/events/');
    expect(url.searchParams.get('key')).toBe('TEST_KEY');
    expect(url.searchParams.get('lang')).toBe('fr');
    expect(url.searchParams.get('relative[]')).toBe('upcoming');
    expect(url.searchParams.get('city')).toBe('Paris');
    expect(url.searchParams.get('keyword[]')).toBe('concert');
  });

  it('respecte un limit personnalisé', async () => {
    const events: Event[] = Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) } as Event));
    mockFetchOk({ events });

    const res = await getUpcomingEventsOpenAgenda({ city: 'Lyon' }, 5);
    expect(res).toHaveLength(5);
  });

  it('jette une erreur si fetch rejette', async () => {
    mockFetchReject(new Error('boom'));
    await expect(getUpcomingEventsOpenAgenda({ city: 'Paris' })).rejects.toThrow(
      'Erreur lors de la récupération des événements',
    );
  });

  it('jette une erreur si status HTTP non ok', async () => {
    mockFetchFailStatus(502);
    await expect(getUpcomingEventsOpenAgenda({ city: 'Paris' })).rejects.toThrow(
      'Erreur lors de la récupération des événements',
    );
  });
});

describe('getEventsByCategoryOpenAgenda', () => {
  it('ajoute search=category', async () => {
    const sample: Event[] = [{ id: '1' } as Event];
    mockFetchOk({ events: sample });

    const res = await getEventsByCategoryOpenAgenda({ city: 'Marseille', category: 'music' });
    expect(res).toEqual(sample);

    const url = new URL(lastCalledUrl());
    expect(url.searchParams.get('city')).toBe('Marseille');
    expect(url.searchParams.get('search')).toBe('music');
  });

  it('propage une erreur générique quand fetch rejette', async () => {
    mockFetchReject();
    await expect(getEventsByCategoryOpenAgenda({ city: 'Nice', category: 'expo' })).rejects.toThrow(
      'Erreur lors de la récupération des événements',
    );
  });
});

describe('getEventsForTonightOpenAgenda', () => {
  it('ajoute timings pour ce soir (18:00 -> 23:59:59.999) et city', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-05-15T10:00:00.000Z'));
    mockFetchOk({ events: [{ id: 'A' } as Event] });

    await getEventsForTonightOpenAgenda('Paris');

    const now = new Date();
    const start = new Date(now.setHours(18, 0, 0, 0)).toISOString();
    const end = new Date(now.setHours(23, 59, 59, 999)).toISOString();

    const url = new URL(lastCalledUrl());
    expect(url.searchParams.get('city')).toBe('Paris');
    expect(url.searchParams.get('timings[gte]')).toBe(start);
    expect(url.searchParams.get('timings[lte]')).toBe(end);
  });
});

describe('getEventsThisWeekOpenAgenda', () => {
  it('ajoute timings de la semaine (Dimanche -> Samedi selon implémentation)', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-05-14T09:15:00.000Z'));

    mockFetchOk({ events: [{ id: '1' } as Event] });
    await getEventsThisWeekOpenAgenda('Lyon');

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);

    const url = new URL(lastCalledUrl());
    expect(url.searchParams.get('city')).toBe('Lyon');
    expect(url.searchParams.get('timings[gte]')).toBe(startOfWeek.toISOString());
    expect(url.searchParams.get('timings[lte]')).toBe(endOfWeek.toISOString());
  });
});

describe('getUpcomingPopularEventsInCity', () => {
  it('ajoute featured=1 et limite à 15', async () => {
    const events: Event[] = Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1) } as Event));
    mockFetchOk({ events });

    const res = await getUpcomingPopularEventsInCity('Bordeaux');
    expect(res).toHaveLength(15);

    const url = new URL(lastCalledUrl());
    expect(url.searchParams.get('city')).toBe('Bordeaux');
    expect(url.searchParams.get('featured')).toBe('1');
  });

  it('propage une erreur générique quand fetch rejette', async () => {
    mockFetchReject();
    await expect(getUpcomingPopularEventsInCity('Toulouse')).rejects.toThrow(
      'Erreur lors de la récupération des événements populaires à venir',
    );
  });
});

describe('getLastPostedEventsByCity', () => {
  it('ajoute sort=updatedAt.desc et size=limit', async () => {
    const events: Event[] = [{ id: '11' } as Event, { id: '22' } as Event];
    mockFetchOk({ events });

    const res = await getLastPostedEventsByCity('Paris', 12);
    expect(res).toEqual(events);

    const url = new URL(lastCalledUrl());
    expect(url.searchParams.get('city')).toBe('Paris');
    expect(url.searchParams.get('sort')).toBe('updatedAt.desc');
    expect(url.searchParams.get('size')).toBe('12');
  });

  it('jette une erreur générique si status non ok', async () => {
    mockFetchFailStatus(503);
    await expect(getLastPostedEventsByCity('Paris', 5)).rejects.toThrow(
      'Erreur lors de la récupération des événements récents',
    );
  });
});

describe('getEventByIdOpenAgenda', () => {
  it('retourne un event quand ok', async () => {
    const event: Event = { id: 'ev123' } as Event;
    mockFetchOk({ event });

    const res = await getEventByIdOpenAgenda('ag987', 'ev123');
    expect(res).toEqual(event);

    const called = lastCalledUrl();
    expect(called).toContain('/agendas/ag987/events/ev123');
    const url = new URL(called);
    expect(url.searchParams.get('key')).toBe('TEST_KEY');
    expect(url.searchParams.get('lang')).toBe('fr');
  });

  it('retourne null quand ok mais pas de data.event', async () => {
    mockFetchOk({});
    const res = await getEventByIdOpenAgenda('ag1', 'ev2');
    expect(res).toBeNull();
  });

  it('jette une erreur spécifique quand status non ok', async () => {
    mockFetchFailStatus(404);
    await expect(getEventByIdOpenAgenda('ag1', 'missing')).rejects.toThrow(
      "Erreur lors de la récupération de l'événement",
    );
  });

  it('jette une erreur spécifique quand fetch rejette', async () => {
    mockFetchReject();
    await expect(getEventByIdOpenAgenda('ag1', 'boom')).rejects.toThrow(
      "Erreur lors de la récupération de l'événement",
    );
  });
});
