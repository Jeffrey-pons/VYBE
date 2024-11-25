

export const fetchEventsByCity = async (city: string) => {
    const apiUrl = `https://api.openagenda.com/v2/agendas/83549053/events?key=8fc8cd8bdee941d8826c8bfa9bd5c47d&lang=fr&location=${city}`;
  
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
  