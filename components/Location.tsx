import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Text, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface LocationComponentProps {
  onCityDetected: (city: string) => void;
}

const LocationComponent: React.FC<LocationComponentProps>  = ({ onCityDetected }) => {
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
        }
      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la ville');
      }

    };
    fetchLocation();
  }, []); 


  return (
    <View >
      {errorMsg && <Text>{errorMsg}</Text>}
    </View>
  );
};

export default LocationComponent;
