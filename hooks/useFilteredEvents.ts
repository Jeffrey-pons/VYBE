import { useState, useEffect } from 'react';
import { Event } from '@/interfaces/event';
import { getFiveUpcomingEventsByOpenAgenda } from '@/services/eventService';

interface Filters {
  city: string;
  date: string;
  keyword: string;
}

export const useFilteredEvents = ({ city, date, keyword }: Filters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      setLoading(true);
      setError(null);

      const filters = {
        city,
        timings: date ? { gte: `${date}T00:00:00Z`, lte: `${date}T23:59:59Z` } : undefined,
        keyword: keyword || '',
      };

      try {
        const upcomingEvents = await getFiveUpcomingEventsByOpenAgenda(filters);
        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Erreur lors du chargement des événements:", err);
        setError('Erreur lors du chargement des événements.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [city, date, keyword]);

  return { events, loading, error };
};
