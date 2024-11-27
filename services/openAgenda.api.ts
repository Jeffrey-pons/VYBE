export const fetchEventsByCategory = async (city: string, category: string) => {
  const apiUrl = `https://api.openagenda.com/v2/events?city=${city}&key=8fc8cd8bdee941d8826c8bfa9bd5c47d&lang=fr&search=${category}&relative[]=upcoming`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.events) {
      return data.events;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error('Erreur lors de la récupération des événements');
  }
};

export const fetchEventsTonight = async (city: string) => {
  const now = new Date();
  const startOfEvening = new Date(now.setHours(18, 0, 0, 0)); // Ce soir à 18h00
  const endOfEvening = new Date(now.setHours(23, 59, 59, 999)); // Ce soir jusqu'à 23h59

  const apiUrl = `https://api.openagenda.com/v2/events?city=${city}&key=8fc8cd8bdee941d8826c8bfa9bd5c47d&lang=fr&timings[gte]=${startOfEvening.toISOString()}&timings[lte]=${endOfEvening.toISOString()}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.events) {
      console.log("Fetched events:", data.events)
      return data.events;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error('Erreur lors de la récupération des événements de ce soir');
  }
};


export const fetchEventsThisWeek = async (city: string) => {
  const today = new Date();
  
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Dimanche passé
  const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay()))); // Samedi prochain
  
  startOfWeek.setHours(0, 0, 0, 0);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const apiUrl = `https://api.openagenda.com/v2/events?city=${city}&key=8fc8cd8bdee941d8826c8bfa9bd5c47d&lang=fr&timings[gte]=${startOfWeek.toISOString()}&timings[lte]=${endOfWeek.toISOString()}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.events) {
      return data.events;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error('Erreur lors de la récupération des événements de cette semaine');
  }
};