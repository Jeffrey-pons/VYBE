import { getEventsOpenAgenda } from '@/api/openAgenda';
// import { getEventBriteEvents } from '@/api/eventBrite';
import { getEventsTmdb } from '@/api/tmdb';

export const getEvents = async (city: string) => {
    try {
        const openAgendaEvents = await getEventsOpenAgenda(`https://api.openagenda.com/v1/events?city=${city}`);
        // const eventBriteEvents = await getEventBriteEvents(`https://www.eventbriteapi.com/v3/events/search/?location.address=${city}`);
        const tmdbEvents = await getEventsTmdb(48.8566, 2.3522);

        return {
            openAgendaEvents,
            // eventBriteEvents,
            tmdbEvents,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des événements combinés:', error);
        throw new Error('Erreur lors de la récupération des événements combinés');
    }
};
