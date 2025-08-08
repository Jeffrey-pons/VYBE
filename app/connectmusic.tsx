import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { musicIcon } from '@/utils/imagesUtils';
import { Button } from 'react-native-elements';
import ProgressBar from '@/components/ProgressBar';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import SkipButton from '@/components/SkipButton';
import { ThemedText } from '@/components/ThemedText';
import useOnboardingProgress from '@/hooks/useOnboardingProgress';

const MusicScreen = () => {
  const { updateProgress, loading } = useOnboardingProgress();

  const handleSkip = () => {
    router.replace('/activenotification');
  };

  const handleNext = async () => {
    await updateProgress({ hasConnectedMusic: true });
    router.replace('/activenotification');
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <ProgressBar step={2} totalSteps={3} />
        <Image style={globalStyles.logoAuthStyle} source={musicIcon} alt="Icône de musique" />
        <SkipButton onPress={handleSkip} />
        <ThemedText type="authTitle">Connecte ta musique</ThemedText>
        <ThemedText type="authSubtitle">
          Connectez votre compte Spotify ou Apple Music pour améliorer l'expérience. On te
          recommandera des évènements qui correspondent à tes goûts.
        </ThemedText>
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
          onPress={handleNext}
          buttonStyle={globalStyles.buttonSecondStyle}
          titleStyle={globalStyles.titleSecondStyle}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

export default MusicScreen;
