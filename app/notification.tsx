import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Image, TouchableOpacity } from 'react-native';
import ProgressBar from '@/components/ProgressBar';
import { useNavigation, router } from 'expo-router';
import globalStyles from '@/styles/globalStyles';
import { Button } from 'react-native-elements';
import * as Notifications from "expo-notifications"
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationToken, setNotificationToken] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const requestNotificationPermission = async () => {
      // Demander la permission pour les notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission de notification non accordée');
        return;
      }

      // Récupérer le token de notification
      const token = await Notifications.getExpoPushTokenAsync();
      setNotificationToken(token.data);
      console.log('Expo Push Token:', token.data); // Affiche le token dans la console
      await AsyncStorage.setItem('notificationToken', token.data);
    };

    requestNotificationPermission();
  }, []);

  // Gérer l'activation/désactivation des notifications
  const handleNotificationToggle = () => {
    setNotificationsEnabled(prevState => !prevState);
  };
  const handleSkip = () => {
    router.replace('/(tabs)'); 
  };

  const handleFinish = () => {
    // Enregistrer l'état des notifications (à adapter si tu veux stocker dans AsyncStorage ou un autre endroit)
    console.log('Notifications activées:', notificationsEnabled);

    // Si les notifications sont activées, planifier une notification locale
    if (notificationsEnabled) {
      scheduleLocalNotification();
    }

    router.replace('/(tabs)');
  };

  const scheduleLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nouvelle notification",
        body: "C'est le moment d'agir!",
        data: { someData: 'Voici un exemple de notification' },
      },
      trigger: { seconds: 10 }, 
    });

    console.log("Notification planifiée !");
  };


  return (
    <View style={styles.container}>
      <ProgressBar step={3} totalSteps={3} />
      <Image
        style={globalStyles.tinyLogoTwo}
        source={require('../assets/images/logos/VYBE_logo7.png')}
      />
       <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>
      <Text style={globalStyles.headerText}>Choisis tes notifications</Text>
      <Text style={styles.subtitle}>
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
        onPress={handleFinish}
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
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
      fontFamily: "FunnelSans-Regular"
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
});

export default NotificationScreen;
