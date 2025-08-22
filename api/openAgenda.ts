import { Event } from '../interfaces/event';

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    // Petit plus: on remonte le statut pour débug
    const body = await response.text().catch(() => '');
    throw new Error(`Erreur HTTP: ${response.status}${body ? ` – ${body}` : ''}`);
  }
  const data = await response.json();
  return data?.events ?? [];
};

const fetchOpenAgenda = async (urlOpenAgenda: string) => {
  try {
    const response = await fetch(urlOpenAgenda);
    return await handleApiResponse(response);
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la récupération des événements');
  }
};

/**
 * Construit l’URL OpenAgenda en encodant correctement tous les paramètres.
 * `timings` utilise maintenant { gte, lte }
 */
const generateOpenAgendaUrl = (params: {
  city?: string;
  category?: string;
  timings?: { gte: string; lte: string };
  keyword?: string;
  relative?: string; // par défaut: 'upcoming'
}) => {
  const baseUrl = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_URL!;
  const apiKey = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_KEY!;
  const lang = 'fr';
  const relative = params.relative ?? 'upcoming';

  const url = new URL(`${baseUrl}/events/`);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('lang', lang);
  url.searchParams.append('relative[]', relative);

  if (params.city) url.searchParams.set('city', params.city);
  if (params.category) url.searchParams.set('search', params.category);
  if (params.timings) {
    url.searchParams.set('timings[gte]', params.timings.gte);
    url.searchParams.set('timings[lte]', params.timings.lte);
  }
  if (params.keyword) url.searchParams.append('keyword[]', params.keyword);

  return url.toString();
};

export const getUpcomingEventsOpenAgenda = async (
  filters: { city?: string; timings?: { gte: string; lte: string }; keyword?: string } = { keyword: '' },
  limit = 15
) => {
  try {
    const urlOpenAgenda = generateOpenAgendaUrl(filters);
    const events = await fetchOpenAgenda(urlOpenAgenda);
    return events.slice(0, limit);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw new Error('Erreur lors de la récupération des événements');
  }
};

export const getEventsByCategoryOpenAgenda = async (params: {
  city?: string;
  category?: string;
  timings?: { gte: string; lte: string };
  keyword?: string;
}) => {
  try {
    const urlOpenAgenda = generateOpenAgendaUrl(params);
    return fetchOpenAgenda(urlOpenAgenda);
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la récupération des événements');
  }
};

export const getEventsForTonightOpenAgenda = async (city: string) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const urlOpenAgenda = generateOpenAgendaUrl({
      city,
      timings: { gte: start.toISOString(), lte: end.toISOString() },
    });
    return fetchOpenAgenda(urlOpenAgenda);
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la récupération des événements');
  }
};

export const getEventsThisWeekOpenAgenda = async (city: string) => {
  try {
    const today = new Date();
    const day = today.getDay(); // 0..6 (Dimanche=0)
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const urlOpenAgenda = generateOpenAgendaUrl({
      city,
      timings: { gte: monday.toISOString(), lte: sunday.toISOString() },
    });
    return fetchOpenAgenda(urlOpenAgenda);
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la récupération des événements');
  }
};

export const getUpcomingPopularEventsInCity = async (city: string, category?: string) => {
  try {
    const base = generateOpenAgendaUrl({ city, category });
    const urlWithFeatured = `${base}&featured=1`;
    const events = await fetchOpenAgenda(urlWithFeatured);
    return events.slice(0, 15);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des événements populaires à venir dans la ville:',
      error
    );
    throw new Error('Erreur lors de la récupération des événements populaires à venir');
  }
};

export const getLastPostedEventsByCity = async (city: string, limit = 15) => {
  try {
    const base = generateOpenAgendaUrl({ city });
    const url = `${base}&sort=updatedAt.desc&size=${limit}`;
    return fetchOpenAgenda(url);
  } catch (error) {
    console.error('Erreur lors de la récupération des derniers événements postés:', error);
    throw new Error('Erreur lors de la récupération des événements récents');
  }
};

export const getEventByIdOpenAgenda = async (
  agendaId: string,
  eventId: string
): Promise<Event | null> => {
  try {
    const baseUrl = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_URL!;
    const apiKey = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_KEY!;
    const lang = 'fr';

    const urlEventId = `${baseUrl}/agendas/${agendaId}/events/${eventId}?key=${apiKey}&lang=${lang}`;
    const response = await fetch(urlEventId);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data?.event ?? null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement par ID:", error);
    throw new Error("Erreur lors de la récupération de l'événement");
  }
};
