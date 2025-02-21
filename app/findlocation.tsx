import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
// import * as Location from 'expo-location';
import { router } from "expo-router";
import globalStyles from '@/styles/global.style'; 

const LocationScreen = () => {
//   const [city, setCity] = useState('');

//   const handleUseLocation = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission refusée pour accéder à la géolocalisation.');
//         return;
//       }

//       let loc = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = loc.coords;
//       const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

//       const response = await fetch(url);
//       const data = await response.json();

//       if (data && data.address) {
//         const cityName =
//           data.address.city || data.address.town || data.address.village || 'Ville non trouvée';
//         setCity(cityName);
//       } else {
//         alert('Ville non trouvée.');
//       }
//     } catch (error) {
//       alert('Erreur lors de la récupération de la position.');
//     }
//   };


  return (
    <View style={styles.container}>
      <ProgressBar step={1} totalSteps={3} />
      <Image
        style={globalStyles.logoAuthStyle}
        source={require('../assets/images/icons/icon_location.png')}
      />
      <Text style={globalStyles.headerTextStyle}>Voir ce qu'il se passe{'\n'}près de chez toi</Text>
      <Text style={globalStyles.subtitleAuthStyle}>Découvre ce qui se passe dans ta ville !</Text>

      <Button
        title="Utiliser ma position"
        buttonStyle={globalStyles.buttonStyle}
        titleStyle={globalStyles.titleStyle}
        // onPress={handleUseLocation}
      />
       <Text style={styles.cityText}>Choisir ma position</Text>
  <View>
      {/* {city && */}
       <Text style={styles.cityChoice}>Ville sélectionnée : </Text>
      </View>
      <Button
        title="Suivant"
        buttonStyle={globalStyles.buttonSecondStyle}
        titleStyle={globalStyles.titleSecondStyle}
        onPress={() => router.replace('/connectmusic')}
        // disabled={!city}
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
  cityText: {
    fontSize: 18,
    color: '#B36DFF',
    textDecorationLine: 'underline',
    marginTop: 20,
    textAlign: 'center',
  },
  cityChoice: {
    fontSize: 18,
    color: 'white',
    paddingTop: 30,
  }
});

export default LocationScreen;