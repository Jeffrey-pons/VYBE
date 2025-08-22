import { useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Event } from '@/interfaces/event';
import {
  fetchEventsForTonight,
  fetchEventsForThisWeek,
  fetchEventsByCategory,
  getFiveUpcomingEvents,
  fetchPopularEvents,
  fetchLastPostedEventsByCity,
} from '@/services/eventService';
import { useRefreshable } from './useRefreshable';

export const useEvents = (category: string) => {
  const { city } = useLocation();

  const fetcher = useCallback(async (): Promise<Event[]> => {
    if (!city) {
      throw new Error("La ville n'est pas définie. Impossible de récupérer les événements.");
    }
    switch (category) {
      case 'tonight':
        return fetchEventsForTonight(city);
      case 'week':
        return fetchEventsForThisWeek(city);
      case 'upcoming':
        return getFiveUpcomingEvents({ city });
      case 'featured':
        return fetchPopularEvents(city);
      case 'recent':
        return fetchLastPostedEventsByCity(city, 15);
      default:
        return fetchEventsByCategory(city, category);
    }
  }, [city, category]);

  const { data, loading, error, refetch } = useRefreshable<Event[]>(fetcher, [fetcher], {
    initial: [],
  });

  return { events: data ?? [], loading, error, refetch };
};
