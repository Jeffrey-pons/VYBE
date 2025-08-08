import { useLocation } from '@/contexts/LocationContext';
import { useState, useEffect } from 'react';
import { Event } from '@/interfaces/event';
import {
  fetchEventsForTonight,
  fetchEventsForThisWeek,
  fetchEventsByCategory,
  getFiveUpcomingEvents,
  fetchPopularEvents,
  fetchLastPostedEventsByCity,
} from '../services/eventService';

export const useEvents = (category: string) => {
  const { city } = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!city) {
        setError("La ville n'est pas définie. Impossible de récupérer les événements.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setEvents([]);

      try {
        let data = [];
        switch (category) {
          case 'tonight':
            data = await fetchEventsForTonight(city);
            break;
          case 'week':
            data = await fetchEventsForThisWeek(city);
            break;
          case 'upcoming':
            data = await getFiveUpcomingEvents({ city });
            break;
          case 'featured':
            data = await fetchPopularEvents(city);
            break;
          case 'recent':
            data = await fetchLastPostedEventsByCity(city, 15);
            break;
          default:
            data = await fetchEventsByCategory(city, category);
            break;
        }
        setEvents(data);
      } catch (error: unknown) {
        setError('Impossible de charger les événements');
        console.error('Erreur lors de la récupération des événements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [city, category]);
  return { events, loading, error };
};
