import React from 'react';
import { View, Switch, Image, ScrollView } from 'react-native';
import ProgressBar from '@/components/ProgressBar';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import { Button } from 'react-native-elements';
import SkipButton from '@/components/SkipButton';
import { ThemedText } from '@/components/ThemedText';
// import * as Notifications from "expo-notifications"
import { notificationIcon } from '@/utils/imagesUtils';
import useOnboardingProgress from '@/hooks/useOnboardingProgress';
import { useNotificationStore } from '@/stores/useNotificationStore';

const NotificationScreen = () => {
  const { updateProgress, loading } = useOnboardingProgress();
  const { notificationsEnabled, toggleNotifications } = useNotificationStore();

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleFinish = async () => {
    await updateProgress({ hasActiveNotification: notificationsEnabled });
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <ProgressBar step={3} totalSteps={3} />
        <Image
          style={globalStyles.logoAuthStyle}
          source={notificationIcon}
          alt="Icône de notification"
          accessibilityLabel='Icône de notification'
        />
        <SkipButton onPress={handleSkip} />
        <ThemedText type="authTitle">Choisis tes notifications</ThemedText>
        <ThemedText type="authSubtitle">
          Voulez-vous activer les notifications pour être alerté lorsque les places d’un événement
          est disponible à l’achat ?
        </ThemedText>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: '#b36dff' }}
          thumbColor={notificationsEnabled ? 'white' : 'white'}
        />
        <Button
          title="Terminer"
          onPress={handleFinish}
          buttonStyle={globalStyles.buttonSecondStyle}
          titleStyle={globalStyles.titleSecondStyle}
          loading={loading}
          accessibilityLabel="Bouton pour terminer l'inscription"
        />
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;
