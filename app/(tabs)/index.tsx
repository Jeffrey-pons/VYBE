import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Button } from 'react-native';
import LocationComponent from '@/components/Location'; 
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "expo-router";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false); 
        navigation.navigate("login")
      }
      setLoading(false);
    };

    checkUserToken();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
 
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
    fontFamily: "Fugaz-One",
  },
  whiteText: {
    color: 'white',
  }
});

export default App;
