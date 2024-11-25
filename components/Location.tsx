import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { fetchEventsByCity } from '@/services/api';

const LocationComponent = () => {
  const [location, setLocation] = useState(null); 
  const [errorMsg, setErrorMsg] = useState(null); 
  const [city, setCity] = useState(null); 

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
        } else {
          setCity('Ville non trouvée');
        }
      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la ville');
      }

    };
    fetchLocation();
  }, []); 

  const renderLocation = () => {
    if (errorMsg) {
      return <Text>{errorMsg}</Text>;
    }

    if (location) {
      const { latitude, longitude } = location.coords;
      return (
        <ThemedView >
          <ThemedText style={styles.container}>Latitude: {latitude}</ThemedText>
          <Text style={styles.container}>Longitude: {longitude}</Text>
          {city ? (
            <ThemedText style={styles.container}>Ville: {city}</ThemedText>
          ) : (
            <Text style={styles.container}>Ville non disponible</Text>
          )}
        </ThemedView>
      );
    } else {
      return <Text style={{ color: 'white' }}>Chargement de la localisation...</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.container}>Votre localisation actuelle :</Text>
      {renderLocation()}
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      color: 'white',
    },

  });

export default LocationComponent;
