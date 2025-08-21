import {
  fetchEventsForTonight,
  fetchEventsForThisWeek,
  fetchEventsByCategory,
  getFiveUpcomingEvents,
  getEventDetails,
  fetchPopularEvents,
  fetchLastPostedEventsByCity,
} from '@/services/eventService';

import * as api from '@/api/openAgenda';

jest.mock('@/api/openAgenda', () => ({
  getEventsForTonightOpenAgenda: jest.fn(),
  getEventsThisWeekOpenAgenda: jest.fn(),
  getEventsByCategoryOpenAgenda: jest.fn(),
  getUpcomingEventsOpenAgenda: jest.fn(),
  getEventByIdOpenAgenda: jest.fn(),
  getUpcomingPopularEventsInCity: jest.fn(),
  getLastPostedEventsByCity: jest.fn(),
}));

const mockedApi = jest.mocked(api, true);

const mockErr = <T extends (...args: unknown[]) => unknown>(
  fn: jest.MockedFunction<T>,
  message = 'boom',
) => fn.mockRejectedValueOnce(new Error(message));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as unknown as jest.Mock).mockRestore?.();
});

describe('fetchEventsForTonight', () => {
  it('jette si city manquante', async () => {
    await expect(fetchEventsForTonight('')).rejects.toThrow(
      "La ville n'est pas définie. Impossible de récupérer les événements.",
    );
    expect(mockedApi.getEventsForTonightOpenAgenda).not.toHaveBeenCalled();
  });

  it('retourne les événements et appelle l’API avec city', async () => {
    mockedApi.getEventsForTonightOpenAgenda.mockResolvedValueOnce([{ id: 1 }]);
    const res = await fetchEventsForTonight('Paris');
    expect(res).toEqual([{ id: 1 }]);
    expect(mockedApi.getEventsForTonightOpenAgenda).toHaveBeenCalledWith('Paris');
  });

  it('mappe les erreurs avec le message service', async () => {
    mockErr(mockedApi.getEventsForTonightOpenAgenda, 'netdown');
    await expect(fetchEventsForTonight('Paris')).rejects.toThrow(
      'Erreur lors de la récupération des événements pour ce soir',
    );
  });
});

describe('fetchEventsForThisWeek', () => {
  it('jette si city manquante', async () => {
    await expect(fetchEventsForThisWeek('')).rejects.toThrow(
      "La ville n'est pas définie. Impossible de récupérer les événements.",
    );
    expect(mockedApi.getEventsThisWeekOpenAgenda).not.toHaveBeenCalled();
  });

  it('ok', async () => {
    mockedApi.getEventsThisWeekOpenAgenda.mockResolvedValueOnce([{ id: 'w1' }]);
    const res = await fetchEventsForThisWeek('Lyon');
    expect(res).toEqual([{ id: 'w1' }]);
    expect(mockedApi.getEventsThisWeekOpenAgenda).toHaveBeenCalledWith('Lyon');
  });

  it('erreur', async () => {
    mockErr(mockedApi.getEventsThisWeekOpenAgenda);
    await expect(fetchEventsForThisWeek('Lyon')).rejects.toThrow(
      'Erreur lors de la récupération des événements pour cette semaine',
    );
  });
});

describe('fetchEventsByCategory', () => {
  it('jette si city manquante', async () => {
    await expect(fetchEventsByCategory('', 'music')).rejects.toThrow(
      "La ville n'est pas définie. Impossible de récupérer les événements.",
    );
    expect(mockedApi.getEventsByCategoryOpenAgenda).not.toHaveBeenCalled();
  });

  it('passe city + category à l’API et retourne le résultat', async () => {
    mockedApi.getEventsByCategoryOpenAgenda.mockResolvedValueOnce([{ id: 'c1' }]);
    const res = await fetchEventsByCategory('Marseille', 'music');
    expect(res).toEqual([{ id: 'c1' }]);
    expect(mockedApi.getEventsByCategoryOpenAgenda).toHaveBeenCalledWith({
      city: 'Marseille',
      category: 'music',
    });
  });

  it('erreur', async () => {
    mockErr(mockedApi.getEventsByCategoryOpenAgenda);
    await expect(fetchEventsByCategory('Nice', 'expo')).rejects.toThrow(
      'Erreur lors de la récupération des événements par catégorie',
    );
  });
});

describe('getFiveUpcomingEvents', () => {
  type UpcomingFilters = Parameters<typeof getFiveUpcomingEvents>[0];

  it("appelle l'API avec keyword par défaut ('') quand absent", async () => {
    mockedApi.getUpcomingEventsOpenAgenda.mockResolvedValueOnce([{ id: 1 }]);
    const filters: UpcomingFilters = { city: 'Paris' };
    const res = await getFiveUpcomingEvents(filters);
    expect(res).toEqual([{ id: 1 }]);
    expect(mockedApi.getUpcomingEventsOpenAgenda).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'Paris', keyword: '' }),
    );
  });

  it('passe le keyword fourni', async () => {
    mockedApi.getUpcomingEventsOpenAgenda.mockResolvedValueOnce([{ id: 2 }]);
    const filters: UpcomingFilters = { city: 'Paris', keyword: 'cinema' };
    await getFiveUpcomingEvents(filters);
    expect(mockedApi.getUpcomingEventsOpenAgenda).toHaveBeenCalledWith(
      expect.objectContaining({ city: 'Paris', keyword: 'cinema' }),
    );
  });

  it('erreur', async () => {
    mockErr(mockedApi.getUpcomingEventsOpenAgenda);
    const filters: UpcomingFilters = { city: 'Paris' };
    await expect(getFiveUpcomingEvents(filters)).rejects.toThrow(
      'Erreur lors de la récupération des cinq prochains événements',
    );
  });
});

describe('getEventDetails', () => {
  it('renvoie les détails (ou null) du wrapper', async () => {
    mockedApi.getEventByIdOpenAgenda.mockResolvedValueOnce({ id: 'ev1' } as unknown as object);
    const res = await getEventDetails('ag1', 'ev1');
    expect(res).toEqual({ id: 'ev1' });
    expect(mockedApi.getEventByIdOpenAgenda).toHaveBeenCalledWith('ag1', 'ev1');
  });

  it('erreur', async () => {
    mockErr(mockedApi.getEventByIdOpenAgenda);
    await expect(getEventDetails('ag1', 'ev1')).rejects.toThrow(
      "Erreur lors de la récupération des détails de l'événement",
    );
  });
});

describe('fetchPopularEvents', () => {
  it('retourne les événements populaires', async () => {
    mockedApi.getUpcomingPopularEventsInCity.mockResolvedValueOnce([{ id: 'p1' }]);
    const res = await fetchPopularEvents('Bordeaux');
    expect(res).toEqual([{ id: 'p1' }]);
    expect(mockedApi.getUpcomingPopularEventsInCity).toHaveBeenCalledWith('Bordeaux');
  });

  it('erreur', async () => {
    mockErr(mockedApi.getUpcomingPopularEventsInCity);
    await expect(fetchPopularEvents('Bordeaux')).rejects.toThrow(
      'Erreur lors de la récupération des événements populaires',
    );
  });
});

describe('fetchLastPostedEventsByCity (alias)', () => {
  it('délègue à getLastPostedEventsByCity avec les mêmes args', async () => {
    mockedApi.getLastPostedEventsByCity.mockResolvedValueOnce([{ id: 9 }]);
    const res = await fetchLastPostedEventsByCity('Toulouse', 12);
    expect(res).toEqual([{ id: 9 }]);
    expect(mockedApi.getLastPostedEventsByCity).toHaveBeenCalledWith('Toulouse', 12);
  });
});
