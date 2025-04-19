import { useLocation } from '@/contexts/LocationContext';
import { useState, useEffect } from 'react';
import { Event } from '@/interfaces/event';
import { fetchEventsForTonightByOpenAgenda, fetchEventsForThisWeekByOpenAgenda, fetchEventsByCategoryByOpenAgenda, getFiveUpcomingEventsByOpenAgenda } from '../services/eventService';

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
                if (category === 'tonight') {
                    data = await fetchEventsForTonightByOpenAgenda(city);
                } else if (category === 'week') {
                    data = await fetchEventsForThisWeekByOpenAgenda(city);
                } else if (category === 'upcoming') {
                    data = await getFiveUpcomingEventsByOpenAgenda(city);
                } else {
                    data = await fetchEventsByCategoryByOpenAgenda(city, category);
                }

                setEvents(data);
                console.log(`Events loaded for ${category}:`, data);
            } catch (error: any) {
                setError('Impossible de charger les événements');
                console.error('Erreur lors de la récupération des événements:', error);
                throw new Error('Erreur lors de la récupération des événements');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [city, category]);
    
    return { events, loading, error };
};
