import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';
import globalStyles from '@/styles/global.style';
import SkipButton from '@/components/SkipButton';

const MusicScreen = () => {
  const handleSkip = () => {
    router.replace('/activenotification'); 
  };

  return (
    <View style={styles.container}>
      <ProgressBar step={2} totalSteps={3} />
      <Image
        style={globalStyles.logoAuthStyle}
        source={require('../assets/images/icons/icon_connect_your_music.gif')}
      />
      <SkipButton onPress={handleSkip} />

      <Text style={globalStyles.headerTextStyle}>Connecte ta musique</Text>
      <Text style={globalStyles.subtitleAuthStyle}>
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
        onPress={() => router.replace('/activenotification')} 
        buttonStyle={globalStyles.buttonSecondStyle} 
        titleStyle={globalStyles.titleSecondStyle} 
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
});

export default MusicScreen;