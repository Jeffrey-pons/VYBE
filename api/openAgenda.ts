import { Event } from "../interfaces/event";

export const getEvent = async (): Promise<Event[]> => {
    return [];
}

const generateOpenAgendaUrl = (params: { city?: string, category?: string, timings?: { start: string, end: string }, keyword?: string}) => {
    const baseUrl = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_URL;
    const apiKey = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_KEY; 
    const lang = 'fr'; 
    const relative = 'upcoming'; 
  
    let urlOpenAgenda = `${baseUrl}/events/?key=${apiKey}&lang=${lang}&relative[]=${relative}`;
  
    if (params.city) urlOpenAgenda += `&city=${params.city}`;
    if (params.category) urlOpenAgenda += `&search=${params.category}`;
    if (params.timings) urlOpenAgenda += `&timings[gte]=${params.timings.start}&timings[lte]=${params.timings.end}`;
    if (params.keyword) urlOpenAgenda += `&keyword[]=${params.keyword}`;
  
    return urlOpenAgenda;
  };

export const getEventsOpenAgenda = async (urlOpenAgenda: string) => {
    try {
        const response = await fetch(urlOpenAgenda);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (data?.events) {
            return data.events;
        }
        return [];
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des événements');
    }
}

export const getEventsByCategoryOpenAgenda = async (params: { city?: string, category?: string }) => {
    try {
        const urlOpenAgenda = generateOpenAgendaUrl(params);
        return getEventsOpenAgenda(urlOpenAgenda);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des événements');
    }
}

export const getEventsForTonightOpenAgenda = async (city: string) => {
    try {
        const now = new Date();
        const startOfEvening = new Date(now.setHours(18, 0, 0, 0)); // Ce soir à 18h00
        const endOfEvening = new Date(now.setHours(23, 59, 59, 999)); // Ce soir jusqu'à 23h59
      
        const urlOpenAgenda = generateOpenAgendaUrl({
          city,
          timings: { start: startOfEvening.toISOString(), end: endOfEvening.toISOString() },
        });
        return getEventsOpenAgenda(urlOpenAgenda);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des événements');
    }
};

export const getEventsThisWeekOpenAgenda = async (city: string) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());  
        
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); 
        
        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);
      
        const urlOpenAgenda = generateOpenAgendaUrl({
          city,
          timings: { start: startOfWeek.toISOString(), end: endOfWeek.toISOString() },
        });
        return getEventsOpenAgenda(urlOpenAgenda);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des événements');
    }
  };

  export const getUpcomingEventsOpenAgenda = async (filters = { keyword: ''}) => {
    try {
        const urlOpenAgenda = generateOpenAgendaUrl(filters);  
        const response = await fetch(urlOpenAgenda);  
        const data = await response.json();  
        if (data && data.events) {
            return data.events.slice(0, 10);
        }
        return [];  
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        throw new Error('Erreur lors de la récupération des événements');
    }
  };

  export const getEventByIdOpenAgenda = async (agendaId: string, eventId: string): Promise<Event | null> => {
    try {
      const baseUrl = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_URL; 
      const apiKey = process.env.EXPO_PUBLIC_OPEN_AGENDA_API_KEY;  
      const lang = 'fr';  
      
      // Générer l'URL pour récupérer un événement spécifique par son ID
      const urlEventId = `${baseUrl}/agendas/${agendaId}/events/${eventId}?key=${apiKey}&lang=${lang}`;
      
      const response = await fetch(urlEventId);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      if (data?.event) {
        return data.event;
      }
      return null; 
    } catch (error) {
      console.error("Erreur lors de la récupération de l'événement par ID:", error);
      throw new Error('Erreur lors de la récupération de l\'événement');
    }
  };