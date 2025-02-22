import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Image, TouchableOpacity } from 'react-native';
import ProgressBar from '@/components/ProgressBar';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import { Button } from 'react-native-elements';
import SkipButton from '@/components/SkipButton';
// import * as Notifications from "expo-notifications"

const NotificationScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
//   const [notificationToken, setNotificationToken] = useState<string | null>(null);

//   useEffect(() => {
//     const requestNotificationPermission = async () => {
//       // Demander la permission pour les notifications
//       const { status } = await Notifications.requestPermissionsAsync();
//       if (status !== 'granted') {
//         return;
//       }

//       // Récupérer le token de notification
//       const token = await Notifications.getExpoPushTokenAsync();
//       setNotificationToken(token.data);
//       await AsyncStorage.setItem('notificationToken', token.data);
//     };

//     requestNotificationPermission();
//   }, []);

  // Gérer l'activation/désactivation des notifications
  const handleNotificationToggle = () => {
    setNotificationsEnabled(prevState => !prevState);
  };
  const handleSkip = () => {
    router.replace('/(tabs)'); 
  };

//   const handleFinish = () => {
//     // Enregistrer l'état des notifications (à adapter si tu veux stocker dans AsyncStorage ou un autre endroit)
//     // Si les notifications sont activées, planifier une notification locale
//     if (notificationsEnabled) {
//       scheduleLocalNotification();
//     }

//     router.replace('/(tabs)');
//   };

//   const scheduleLocalNotification = async () => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Nouvelle notification",
//         body: "C'est le moment d'agir!",
//         data: { someData: 'Voici un exemple de notification' },
//       },
//       trigger: { seconds: 10 }, 
//     });
//   };


  return (
    <View style={styles.container}>
      <ProgressBar step={3} totalSteps={3} />
      <Image
        style={globalStyles.logoAuthStyle}
        source={require('../assets/images/icons/icon_notification.png')}
      />
         <SkipButton onPress={handleSkip} />
      <Text style={globalStyles.headerTextStyle}>Choisis tes notifications</Text>
      <Text style={globalStyles.subtitleAuthStyle}>
        Voulez-vous activer les notifications pour recevoir des mises à jour sur les évènements ou des changement de dernières minutes ?
      </Text>

      <Switch
        value={notificationsEnabled}
        onValueChange={handleNotificationToggle}
        trackColor={{ false: '#767577', true: '#b36dff' }} 
        thumbColor={notificationsEnabled ? 'white' : 'white'}
      />
      <Button
        title="Terminer"
        // onPress={handleFinish}
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

export default NotificationScreen;