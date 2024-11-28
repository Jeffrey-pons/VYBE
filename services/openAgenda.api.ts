const generateApiUrl = (params: { city?: string, category?: string, timings?: { start: string, end: string }, keyword?: string}) => {
  const baseUrl = 'https://api.openagenda.com/v2/events';
  const apiKey = '8fc8cd8bdee941d8826c8bfa9bd5c47d'; 
  const lang = 'fr'; 
  const relative = 'upcoming'; 

  let url = `${baseUrl}?key=${apiKey}&lang=${lang}&relative[]=${relative}`;

  if (params.city) url += `&city=${params.city}`;
  if (params.category) url += `&search=${params.category}`;
  if (params.timings) url += `&timings[gte]=${params.timings.start}&timings[lte]=${params.timings.end}`;
  if (params.keyword) url += `&keyword[]=${params.keyword}`;

  return url;
};

const fetchEvents = async (url: string) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.events) {
      return data.events;
    }
    return [];
  } catch (error) {
    throw new Error('Erreur lors de la récupération des événements');
  }
};

export const fetchEventsByCategory = async (params: { city?: string, category?: string }) => {
  const apiUrl = generateApiUrl(params);
  return fetchEvents(apiUrl);
};

export const fetchEventsTonight = async (city: string) => {
  const now = new Date();
  const startOfEvening = new Date(now.setHours(18, 0, 0, 0)); // Ce soir à 18h00
  const endOfEvening = new Date(now.setHours(23, 59, 59, 999)); // Ce soir jusqu'à 23h59

  const apiUrl = generateApiUrl({
    city,
    timings: { start: startOfEvening.toISOString(), end: endOfEvening.toISOString() },
  });
  return fetchEvents(apiUrl);
};

export const fetchEventsThisWeek = async (city: string) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Dimanche passé
  const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay()))); // Samedi prochain
  
  startOfWeek.setHours(0, 0, 0, 0);
  endOfWeek.setHours(23, 59, 59, 999);

  const apiUrl = generateApiUrl({
    city,
    timings: { start: startOfWeek.toISOString(), end: endOfWeek.toISOString() },
  });
  return fetchEvents(apiUrl);
};

export const fetchFiveUpcomingEvents = async (filters = {}) => {
  const apiUrl = generateApiUrl(filters);  

  try {
    const response = await fetch(apiUrl);  
    const data = await response.json();  
    if (data && data.events) {
      return data.events.slice(0, 50);
    }
    return [];  
   
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw new Error('Erreur lors de la récupération des événements');
  }
};

