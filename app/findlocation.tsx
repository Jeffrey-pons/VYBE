import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
import globalStyles from '@/styles/globalStyle'; 
import { ThemedText } from '@/components/ThemedText';
import { locationIcon } from '@/utils/imagesUtils';
import { auth } from "@/config/firebaseConfig";
import { router } from "expo-router";
import { useLocationHandler } from '@/hooks/useLocationHandler';

const LocationScreen = () => {
  const { 
    city, 
    manualCity, 
    showInput, 
    handleManualCityChange, 
    handleUseLocation, 
    handleCityNext, 
    toggleInput 
  } = useLocationHandler();


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
        <TouchableOpacity onPress={toggleInput}>
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
              onPress={() => handleManualCityChange(manualCity || '')}
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
          onPress={() => {
            handleCityNext(auth.currentUser, router);
            router.replace('/connectmusic');
          }}
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