import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
import { router } from "expo-router";
import { useLocation } from '@/contexts/LocationContext';
import globalStyles from '@/styles/globalStyle'; 
import { ThemedText } from '@/components/ThemedText';
import { getLocation } from '@/services/locationService';

const LocationScreen = () => {
  const { city, updateLocation } = useLocation(); 
  const [manualCity, setManualCity] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  const handleManualCityChange = (text: string) => {
    setManualCity(text);
    updateLocation(text); 
  };

  const handleUseLocation = async () => {
    await getLocation({
      onCityDetected: (city) => {
        updateLocation(city);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <ProgressBar step={1} totalSteps={3} />
        <Image
          style={globalStyles.logoAuthStyle}
          source={require('../assets/images/icons/icon_location.png')}
          alt="Icône de Localisation"
        />
        <ThemedText type="authTitle">Voir ce qu'il se passe près de chez toi</ThemedText>
        <ThemedText type="authSubtitle">Découvre ce qui se passe dans ta ville !</ThemedText>

        <Button
          title="Utiliser ma position"
          buttonStyle={globalStyles.buttonStyle}
          titleStyle={globalStyles.titleStyle}
          onPress={handleUseLocation}
        />
        <TouchableOpacity onPress={() => setShowInput(!showInput)}>
          <Text style={styles.cityText}>Choisir ma position</Text>
        </TouchableOpacity>

        {showInput && (
          <>
            <TextInput
              style={styles.input}
              value={manualCity || ''}
              onChangeText={handleManualCityChange}
              placeholder="Entrez votre ville"
            />
            <Button
              title="Valider"
              onPress={() => updateLocation(manualCity || '')}
            />
          </>
        )}
        <View>
        {/* {city && */}
        <Text style={styles.cityChoice}>Ville sélectionnée : { city} </Text>
        </View>
        <Button
          title="Suivant"
          buttonStyle={globalStyles.buttonSecondStyle}
          titleStyle={globalStyles.titleSecondStyle}
          onPress={() => router.replace('/connectmusic')}
          // disabled={!city}
        />
      </View>
    </ScrollView>
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