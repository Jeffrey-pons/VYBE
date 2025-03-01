import { useState, useEffect } from 'react';
// import { getEvents } from '../services/eventService';
import { Event } from '@/interfaces/Event';

export const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // const data = await getEvents();
                // setEvents(data);
            } catch (err) {
                setError('Impossible de charger les événements');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { events, loading, error };
};
