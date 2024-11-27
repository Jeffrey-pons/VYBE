import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const LocationComponent = ({ onCityDetected }) => {
  const [location, setLocation] = useState(null); 
  const [errorMsg, setErrorMsg] = useState(null); 
  const [city, setCity] = useState(null); 
  const [ manualCity, setManualCity ] = useState('');

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

  const handleCityInput = (text) => {
    setManualCity(text);
    setCity(text);  // Update both local city and manual city state
    onCityDetected(text);  // Propagate the change to the parent
  };

  return (
    <View style={styles.container}>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      <Text style={styles.subtitle}>Ou entrez une ville :</Text>
      <TextInput
        style={styles.input}
        placeholder="Saisir une ville"
        value={city}
        onChangeText={handleCityInput}
      />
      {/* <Button title="Utiliser ma position" onPress={fetchLocation} /> */}
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
