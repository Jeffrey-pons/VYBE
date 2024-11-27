import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useNavigation } from 'expo-router';
import globalStyles from '@/styles/globalStyles';

const MusicScreen = () => {
  const navigation = useNavigation();

  const handleSkip = () => {
    navigation.navigate('notification'); 
  };

  return (
    <View style={styles.container}>
      <ProgressBar step={2} totalSteps={3} />
      <Image
        style={globalStyles.tinyLogoTwo}
        source={require('../assets/images/logos/logo-gif.gif')}
      />
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <Text style={globalStyles.headerText}>Connecte ta musique</Text>
      <Text style={styles.subtitle}>
        Connectez votre compte Spotify ou Apple Music pour améliorer l'expérience.
        On te recommandera des évènements qui correspondent à tes goûts
      </Text>

      <Button 
        title="  Spotify" 
        onPress={() => alert('Spotify connecté')} 
        icon={<Entypo name="spotify" size={24} color="black" />} 
        buttonStyle={globalStyles.buttonStyle}
        titleStyle={globalStyles.titleStyle}
      />

      <Button 
        title="  Apple Music" 
        onPress={() => alert('Apple Music connecté')} 
        icon={<Fontisto name="applemusic" size={24} color="black" />} 
        buttonStyle={globalStyles.buttonStyle}
        titleStyle={globalStyles.titleStyle}
      />

      <Button 
        title="Suivant" 
        onPress={() => navigation.navigate('notification')} 
        buttonStyle={styles.buttonStyle} 
        titleStyle={styles.titleStyle} 
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
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
      fontFamily: "FunnelSans-Regular"
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
  appleButton: {
    backgroundColor: '#FF5722', 
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    padding: 10,
    backgroundColor: 'transparent',
  },
  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MusicScreen;
