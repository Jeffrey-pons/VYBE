import { useLocation } from '@/contexts/LocationContext';
import { useState, useEffect } from 'react';
import { getEvents } from '../services/eventService';
import { Event } from '@/interfaces/Event';

export const useEvents = () => {
    const { city } = useLocation();
    const [events, setEvents] = useState({
        tonight: [],
        thisWeek: [],
        byCategory: [],
        upcoming: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!city) {
                setError("La ville n'est pas définie. Impossible de récupérer les événements.");
                setLoading(false);
                return;
            }
            try {
                const data = await getEvents(city);
                setEvents({
                    tonight: data.openAgendaEventsTonight,
                    thisWeek: data.openAgendaEventsThisWeek,
                    byCategory: data.openAgendaEventsByCategory,
                    upcoming: data.openAgendaEventsUpComing
                });
            } catch (error: any) {
                setError('Impossible de charger les événements');
                console.error('Erreur lors de la récupération des événements:', error);
                throw new Error('Erreur lors de la récupération des événements');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [city]);
    
    return { events, loading, error };
};
