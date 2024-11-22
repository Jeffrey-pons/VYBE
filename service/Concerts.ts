const fetchEvents = async (latitude, longitude) => {
    const apiKey = 'Gu9FFAagOGrg2iWg6sMtWb35o13sGVZu'; 
    const radius = 20;  
    const unit = 'km'; 
  
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${latitude},${longitude}&radius=${radius}&unit=${unit}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data._embedded && data._embedded.events) {
        console.log(data._embedded.events); // Afficher les événements récupérés
        return data._embedded.events;
      } else {
        console.log('Aucun événement trouvé.');
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      return [];
    }
  };
  