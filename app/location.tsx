import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
import * as Location from 'expo-location';
import { useNavigation } from "expo-router";
import globalStyles from '@/styles/globalStyles'; 

const LocationScreen = () => {
  const [city, setCity] = useState('');
  const navigation = useNavigation();

  const handleUseLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission refusée pour accéder à la géolocalisation.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.address) {
        const cityName =
          data.address.city || data.address.town || data.address.village || 'Ville non trouvée';
        setCity(cityName);
      } else {
        alert('Ville non trouvée.');
      }
    } catch (error) {
      alert('Erreur lors de la récupération de la position.');
    }
  };


  return (
    <View style={styles.container}>
      <ProgressBar step={1} totalSteps={3} />
      <Image
        style={globalStyles.tinyLogoTwo}
        source={require('../assets/images/logos/VYBE_logo6.png')}
      />
      <Text style={globalStyles.headerText}>Voir ce qu'il se passe{'\n'}près de chez toi</Text>
      <Text style={styles.subtitle}>Découvre ce qui se passe dans ta ville !</Text>

      <Button
        title="Utiliser ma position"
        buttonStyle={globalStyles.buttonStyle}
        titleStyle={globalStyles.titleStyle}
        onPress={handleUseLocation}
      />

      {city && <Text style={styles.cityText}>Ville sélectionnée : {city}</Text>}

      <Button
        title="Suivant"
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.titleStyle}
        onPress={() => navigation.navigate('connectmusic')}
        disabled={!city}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
     fontFamily: "FunnelSans-Regular"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    color: 'black',
  },
  buttonStyle: {
    backgroundColor: '#b36dff',
    borderRadius: 100,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 20,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cityText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LocationScreen;
