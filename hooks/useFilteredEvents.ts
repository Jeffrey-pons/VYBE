import { useLoading } from './../contexts/LoadingContext';
import { useState, useEffect } from 'react';
import { Event } from '@/interfaces/event';
import { getFiveUpcomingEvents } from '@/services/eventService';
import { Filters } from '@/interfaces/Filters';

export const useFilteredEvents = ({ city, date, keyword }: Filters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();

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
        const upcomingEvents = await getFiveUpcomingEvents(filters);
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

  return { events, error };
};
