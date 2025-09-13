import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
import globalStyles from '@/styles/globalStyle';
import { ThemedText } from '@/components/ThemedText';
import { locationIcon } from '@/utils/imagesUtils';
import { auth } from '@/config/firebaseConfig';
import { router } from 'expo-router';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import RNPickerSelect from 'react-native-picker-select';

const LocationScreen = () => {
  const {
    city,
    cities,
    showCitySelector,
    handleCitySelect,
    handleUseLocation,
    handleCityNext,
    toggleCitySelector,
  } = useLocationHandler();

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={styles.container}>
        <ProgressBar step={1} totalSteps={3} />
        <Image
          style={globalStyles.logoAuthStyle}
          source={locationIcon}
          alt="Icône de Localisation"
          accessibilityLabel="Icône de Localisation"
        />
        <ThemedText type="authTitle">Voir ce qu'il se passe près de chez toi</ThemedText>
        <ThemedText type="authSubtitle">Découvre ce qui se passe dans ta ville !</ThemedText>

        <Button
          title="Utiliser ma position"
          buttonStyle={globalStyles.buttonStyle}
          titleStyle={globalStyles.titleStyle}
          onPress={handleUseLocation}
          accessibilityLabel="Bouton pour utiliser la position actuelle"
        />
        <TouchableOpacity onPress={toggleCitySelector}>
          <Text style={styles.cityText}>Choisir ma ville</Text>
        </TouchableOpacity>

        {showCitySelector && (
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => handleCitySelect(value)}
              items={cities}
              value={city ?? null}
              placeholder={{ label: 'Sélectionner une ville', value: null }}
              useNativeAndroidPickerStyle={false}
              doneText="Valider"
              style={{
                inputIOS: styles.pickerIOS,
                inputAndroid: styles.pickerStyle,
                inputIOSContainer: styles.inputIOSContainer,
              }}
              pickerProps={{
                itemStyle: { color: '#000', fontSize: 18, fontWeight: 'bold' },
              }}
            />
          </View>
        )}
        <View>
          {/* {city && */}
          <Text style={styles.cityChoice}>Ville sélectionnée : {city} </Text>
        </View>
        <Button
          title="Suivant"
          buttonStyle={globalStyles.buttonSecondStyle}
          titleStyle={globalStyles.titleSecondStyle}
          accessibilityLabel="Bouton pour passer à l'étape suivante"
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 70,
  },
  pickerContainer: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#ffffffff',
    borderRadius: 8,
    backgroundColor: 'black',
  },
  pickerStyle: {
    fontSize: 26,
    paddingHorizontal: 200,
    color: 'black',
    paddingRight: 0,
  },
  cityText: {
    fontSize: 18,
    color: '#B36DFF',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  cityChoice: {
    fontSize: 18,
    color: 'white',
    paddingTop: 30,
  },
  pickerIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
  },
  inputIOSContainer: {
    zIndex: 1000,
  },
});

export default LocationScreen;
