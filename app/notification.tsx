import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Image, TouchableOpacity } from 'react-native';
import ProgressBar from '@/components/ProgressBar';
import { useNavigation } from 'expo-router';
import globalStyles from '@/styles/globalStyles';
import { Button } from 'react-native-elements';

const NotificationScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation();

  const handleSkip = () => {
    navigation.navigate('(tabs)'); 
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
        onValueChange={setNotificationsEnabled}
        trackColor={{ false: '#767577', true: '#b36dff' }} 
        thumbColor={notificationsEnabled ? 'white' : 'white'}
      />

      <Button
        title="Terminer"
        onPress={() => navigation.navigate('(tabs)')} 
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
