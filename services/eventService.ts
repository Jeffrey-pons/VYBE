import { getEventsOpenAgendaTonight, getEventsOpenAgendaByCategory, getEventsOpenAgendaThisWeek, getFiveUpcomingEventsOpenAgenda } from '@/api/openAgenda';
// import { getEventBriteEvents } from '@/api/eventBrite';
// import { getEventsTmdb } from '@/api/tmdb';

export const getEvents = async (city: string) => {
    if (!city) {
        throw new Error("La ville n'est pas définie. Impossible de récupérer les événements.");
      }
    try {
        const openAgendaEventsTonight = await getEventsOpenAgendaTonight(city);
        const openAgendaEventsThisWeek = await getEventsOpenAgendaThisWeek(city);
        const openAgendaEventsByCategory = await getEventsOpenAgendaByCategory(city);
        const openAgendaEventsUpComing = await getFiveUpcomingEventsOpenAgenda({ city });


        // const eventBriteEvents = await getEventBriteEvents(`https://www.eventbriteapi.com/v3/events/search/?location.address=${city}`);
        // const tmdbEvents = await getEventsTmdb(48.8566, 2.3522);

        return {
            openAgendaEventsTonight,
            openAgendaEventsThisWeek,
            openAgendaEventsByCategory,
            openAgendaEventsUpComing,
            // eventBriteEvents,
            // tmdbEvents,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des événements combinés:', error);
        throw new Error('Erreur lors de la récupération des événements combinés');
    }
};
