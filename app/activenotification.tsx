import React, { useState} from 'react';
import { View, Switch, Image, ScrollView, Alert } from 'react-native';
import ProgressBar from '@/components/ProgressBar';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import { Button } from 'react-native-elements';
import SkipButton from '@/components/SkipButton';
import { ThemedText } from '@/components/ThemedText';
// import * as Notifications from "expo-notifications"
import { auth } from '@/config/firebaseConfig';
import { updateUserOnboardingProgress } from '@/services/authService';

const NotificationScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationsEnabled(prevState => !prevState);
  };
  const handleSkip = () => {
    router.replace('/(tabs)'); 
  };

  const handleFinish = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateUserOnboardingProgress(user.uid, { hasActiveNotification: true });
      }
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert("Erreur", "Impossible de sauvegarder.");
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <ProgressBar step={3} totalSteps={3} />
        <Image
          style={globalStyles.logoAuthStyle}
          source={require('../assets/images/icons/icon_notification.png')}
          alt="Icône de notification"
        />
        <SkipButton onPress={handleSkip} />
        <ThemedText type="authTitle">Choisis tes notifications</ThemedText>
        <ThemedText type="authSubtitle">Voulez-vous activer les notifications pour être alerté lorsque les places d’un événement est disponible à l’achat ?</ThemedText>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationToggle}
          trackColor={{ false: '#767577', true: '#b36dff' }} 
          thumbColor={notificationsEnabled ? 'white' : 'white'}
        />
        <Button
          title="Terminer"
          onPress={handleFinish} 
          buttonStyle={globalStyles.buttonSecondStyle} 
          titleStyle={globalStyles.titleSecondStyle} 
        />
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;