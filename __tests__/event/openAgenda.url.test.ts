import * as api from '@/api/openAgenda';

const originalFetch = (globalThis as unknown as { fetch?: unknown }).fetch;

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
