import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { auth } from "@/config/firebaseConfig";
import ProgressBar from '@/components/ProgressBar';
import { router } from "expo-router";
import { useLocation } from '@/contexts/LocationContext';
import globalStyles from '@/styles/globalStyle'; 
import { ThemedText } from '@/components/ThemedText';
import { getLocation } from '@/services/locationService';
import { updateUserOnboardingProgress } from '@/services/authService';
import locationIcon from '../assets/images/icons/icon_location.png';

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

  const handleNext = async () => {
    if (!city) {
      Alert.alert("Erreur", "Vous devez entrer une ville ou utiliser la géolocalisation avant de continuer.");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (user) {
        await updateUserOnboardingProgress(user.uid, { city });
      }
      
      router.replace("/connectmusic"); 
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la ville :", error);
      Alert.alert("Erreur", "Impossible d'enregistrer votre ville.");
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <ProgressBar step={1} totalSteps={3} />
        <Image
          style={globalStyles.logoAuthStyle}
          source={locationIcon}
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
          onPress={handleNext}
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