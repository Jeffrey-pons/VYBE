import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
// import * as Location from 'expo-location';
import { router } from "expo-router";
import globalStyles from '@/styles/globalStyle'; 
import { ThemedText } from '@/components/ThemedText';

const LocationScreen = () => {
  return (
    <View style={globalStyles.container}>
      <ProgressBar step={1} totalSteps={3} />
      <Image
        style={globalStyles.logoAuthStyle}
        source={require('../assets/images/icons/icon_location.png')}
      />
      <ThemedText type="authTitle">Voir ce qu'il se passe{'\n'}près de chez toi</ThemedText>
      <ThemedText type="authSubtitle">Découvre ce qui se passe dans ta ville !</ThemedText>
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