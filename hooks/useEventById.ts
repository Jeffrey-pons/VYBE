import { useEffect, useState } from 'react';
import { getEventDetails } from '@/services/eventService';
import { Event } from '@/interfaces/event';

export const useEventById = (agendaId?: string | string[], eventId?: string | string[]) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agendaId || !eventId) {
      setError('Paramètres manquants');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const fetchedEvent = await getEventDetails(String(agendaId), String(eventId));
        if (!fetchedEvent) {
          setError('Événement introuvable');
        } else {
          setEvent(fetchedEvent);
        }
      } catch (error: unknown) {
        setError('Impossible de charger les événements');
        console.error('Erreur lors de la récupération des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [agendaId, eventId]);

  return { event, loading, error };
};
