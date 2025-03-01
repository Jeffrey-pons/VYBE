import React, { useState} from 'react';
import { View, Switch, Image } from 'react-native';
import ProgressBar from '@/components/ProgressBar';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import { Button } from 'react-native-elements';
import SkipButton from '@/components/SkipButton';
import { ThemedText } from '@/components/ThemedText';
// import * as Notifications from "expo-notifications"

const NotificationScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationsEnabled(prevState => !prevState);
  };
  const handleSkip = () => {
    router.replace('/(tabs)'); 
  };
  return (
    <View style={globalStyles.container}>
      <ProgressBar step={3} totalSteps={3} />
      <Image
        style={globalStyles.logoAuthStyle}
        source={require('../assets/images/icons/icon_notification.png')}
        accessibilityLabel="Icône de notification"
      />
      <SkipButton onPress={handleSkip} />
      <ThemedText type="authTitle">Choisis tes notifications</ThemedText>
      <ThemedText type="authSubtitle">Voulez-vous activer les notifications pour être{'\n'}alerté lorsque les places d’un événement est{'\n'}disponible à l’achat ?</ThemedText>
      <Switch
        value={notificationsEnabled}
        onValueChange={handleNotificationToggle}
        trackColor={{ false: '#767577', true: '#b36dff' }} 
        thumbColor={notificationsEnabled ? 'white' : 'white'}
      />
      <Button
        title="Terminer"
        onPress={() => router.replace('/(tabs)')} 
        buttonStyle={globalStyles.buttonSecondStyle} 
        titleStyle={globalStyles.titleSecondStyle} 
      />
    </View>
  );
};

export default NotificationScreen;