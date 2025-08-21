import * as api from '@/api/openAgenda';

const originalFetch = (globalThis as unknown as { fetch?: unknown }).fetch;

type Filters = {
  city?: string;
  category?: string;
  timings?: { start: string; end: string };
  keyword?: string;
};

beforeEach(() => {
  process.env.EXPO_PUBLIC_OPEN_AGENDA_API_URL = 'https://api.openagenda.com';
  process.env.EXPO_PUBLIC_OPEN_AGENDA_API_KEY = 'KEY123';
  (globalThis as unknown as { fetch: jest.Mock }).fetch = jest
    .fn()
    .mockResolvedValue(new Response(JSON.stringify({ events: [] }), { status: 200 }));
});

afterEach(() => {
  jest.clearAllMocks();
  (globalThis as unknown as { fetch: unknown }).fetch = originalFetch as unknown;
});

describe('URL générée via fonctions publiques', () => {
  it("construit l'URL avec city/category/keyword/timings (vérifiée via l'URL passée à fetch)", async () => {
    const start = new Date('2025-08-21T16:00:00Z').toISOString();
    const end = new Date('2025-08-21T22:59:59.999Z').toISOString();

    const filters: Filters = {
      city: 'Saint-Étienne',
      category: 'théâtre',
      timings: { start, end },
      keyword: 'rock',
    };

    await api.getUpcomingEventsOpenAgenda(filters, 1);

    expect((globalThis as unknown as { fetch: jest.Mock }).fetch).toHaveBeenCalledTimes(1);
    const calledUrl = ((globalThis as unknown as { fetch: jest.Mock }).fetch as jest.Mock).mock
      .calls[0][0] as string;

    expect(calledUrl).toContain(
      'https://api.openagenda.com/events/?key=KEY123&lang=fr&relative[]=upcoming',
    );
    expect(calledUrl).toContain('city=Saint-Étienne');
    expect(calledUrl).toContain('search=théâtre');
    expect(calledUrl).toContain(`timings[gte]=${start}`);
    expect(calledUrl).toContain(`timings[lte]=${end}`);
    expect(calledUrl).toContain('keyword[]=rock');
  });

  it('respecte le limit (slice) de getUpcomingEventsOpenAgenda', async () => {
    const payload = { events: Array.from({ length: 50 }, (_, i) => ({ id: i })) };
    ((globalThis as unknown as { fetch: jest.Mock }).fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const res = await api.getUpcomingEventsOpenAgenda({ city: 'Paris' }, 7);
    expect(res).toHaveLength(7);
  });

  it("n'ajoute pas de paramètres inutiles quand absents", async () => {
    await api.getUpcomingEventsOpenAgenda({ city: 'Paris' }, 3);

    const calledUrl = ((globalThis as unknown as { fetch: jest.Mock }).fetch as jest.Mock).mock
      .calls[0][0] as string;
    expect(calledUrl).toContain('city=Paris');
    expect(calledUrl).not.toContain('search=');
    expect(calledUrl).not.toContain('keyword[]=');
    expect(calledUrl).not.toContain('timings[');
  });
});
