import { getEventsForTonightOpenAgenda, getEventsThisWeekOpenAgenda, getEventsByCategoryOpenAgenda, getUpcomingEventsOpenAgenda } from '@/api/openAgenda';
// import { getEventBriteEvents } from '@/api/eventBrite';
// import { getEventsTmdb } from '@/api/tmdb';

// OpenAgenda API
export const fetchEventsForTonightByOpenAgenda = async (city: string) => {
    if (!city) {
        throw new Error("La ville n'est pas définie. Impossible de récupérer les événements.");
    }
    try {
        const openAgendaEventsTonight = await getEventsForTonightOpenAgenda(city);
        return openAgendaEventsTonight;
    } catch (error) {
        console.error('Erreur lors de la récupération des événements pour ce soir:', error);
        throw new Error('Erreur lors de la récupération des événements pour ce soir');
    }
};

export const fetchEventsForThisWeekByOpenAgenda = async (city: string) => {
    if (!city) {
        throw new Error("La ville n'est pas définie. Impossible de récupérer les événements.");
    }
    try {
        const openAgendaEventsThisWeek = await getEventsThisWeekOpenAgenda(city);
        return openAgendaEventsThisWeek;
    } catch (error) {
        console.error('Erreur lors de la récupération des événements pour cette semaine:', error);
        throw new Error('Erreur lors de la récupération des événements pour cette semaine');
    }
};

export const fetchEventsByCategoryByOpenAgenda = async (city: string, category: string) => {
    if (!city) {
        throw new Error("La ville n'est pas définie. Impossible de récupérer les événements.");
    }
    try {
        const openAgendaEventsByCategory = await getEventsByCategoryOpenAgenda({ city, category });
        return openAgendaEventsByCategory;
    } catch (error) {
        console.error('Erreur lors de la récupération des événements par catégorie:', error);
        throw new Error('Erreur lors de la récupération des événements par catégorie');
    }
};

export const getFiveUpcomingEventsByOpenAgenda = async (filters: { 
    city: string, 
    timings?: { gte: string, lte: string }, 
    keyword?: string 
  }) => {
    try {
        const openAgendaEventsUpComing = await getUpcomingEventsOpenAgenda(filters); 
        return openAgendaEventsUpComing;
    } catch (error) {
        console.error('Erreur lors de la récupération des cinq prochains événements:', error);
        throw new Error('Erreur lors de la récupération des cinq prochains événements');
    }
  };
  