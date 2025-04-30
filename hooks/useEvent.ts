import { useLocation } from '@/contexts/LocationContext';
import { useState, useEffect } from 'react';
import { Event } from '@/interfaces/event';
import { fetchEventsForTonight, fetchEventsForThisWeek, fetchEventsByCategory, getFiveUpcomingEvents } from '../services/eventService';

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
                    data = await fetchEventsForTonight(city);
                } else if (category === 'week') {
                    data = await fetchEventsForThisWeek(city);
                } else if (category === 'upcoming') {
                    data = await getFiveUpcomingEvents(city);
                } else {
                    data = await fetchEventsByCategory(city, category);
                }
                setEvents(data);
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
