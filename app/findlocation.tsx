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
        <TouchableOpacity onPress={toggleCitySelector}>
          <Text style={styles.cityText}>Choisir ma ville</Text>
        </TouchableOpacity>

        {showCitySelector && (
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => handleCitySelect(value)}
              items={cities}
              style={{
                inputIOS: styles.pickerStyle,
                inputAndroid: styles.pickerStyle,
              }}
              placeholder={{ label: 'Sélectionner une ville', value: null }}
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
  // input: {
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 5,
  //   padding: 10,
  //   marginTop: 20,
  //   marginBottom: 20,
  //   backgroundColor: 'white',
  //   color: 'black',
  // },
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
  },
});

export default LocationScreen;
