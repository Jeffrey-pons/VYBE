import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Text } from 'react-native';

interface LocationComponentProps {
  onCityDetected: (city: string) => void;
  manualCity?: string;
}

const LocationComponent: React.FC<LocationComponentProps>  = ({ onCityDetected, manualCity }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null); 
  const [city, setCity] = useState<string | null>(null); 

  useEffect(() => {

    const fetchLocation = async () => {
      // Demander la permission d'accéder à la géolocalisation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission refusée pour accéder à la géolocalisation.');
        return;
      }
      // Obtenir la localisation actuelle
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc); 

      const { latitude, longitude } = loc.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.address) {
          const cityName = data.address.city || data.address.town || data.address.village || 'Ville non trouvée';
          setCity(cityName);
          onCityDetected(cityName);
        } else {
          setCity('Ville non trouvée');
          setErrorMsg('Ville non trouvée.');
        }
      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la ville');
      }

    };
    fetchLocation();
  }, [manualCity]); 

  return errorMsg ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</Text> : null;
};

export default LocationComponent;
