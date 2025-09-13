import { useLoading } from './../contexts/LoadingContext';
import { useState, useEffect } from 'react';
import { Event } from '@/interfaces/event';
import { getFiveUpcomingEvents } from '@/services/eventService';
import { Filters } from '@/interfaces/Filters';

const makeDayBoundsISO = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
  const end = new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999);
  return { gte: start.toISOString(), lte: end.toISOString() }; // ✅ attendu par service
};

export const useFilteredEvents = ({ city, date, keyword }: Filters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      setError(null);
      setLoading(true);
      setLoadingLocal(true);

      const timings = date && date.length === 10 ? makeDayBoundsISO(date) : undefined;

      try {
        const upcomingEvents = await getFiveUpcomingEvents({
          city,
          timings,
          keyword: keyword || '',
        });
        setEvents(upcomingEvents);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Erreur lors du chargement des événements.');
      } finally {
        setLoading(false);
        setLoadingLocal(false);
      }
    };

    fetchFilteredEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, date, keyword]);

  return { events, loading: loadingLocal, error };
};
