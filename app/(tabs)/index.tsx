import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LocationComponent from '@/components/Location'; 
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const App = () => {
  return (
      <ThemedView>
        <Image 
          source={require('../../assets/images/logos/VYBE_logo2.png')}  
          resizeMode="contain" 
        />
        <ThemedText style={styles.container}>Bienvenue sur l'application VYBE</ThemedText>  
        <LocationComponent />  
      </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  whiteText: {
    color: 'white',
  }
});

export default App;
