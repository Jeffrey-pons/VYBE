import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { vybeLogoHeader } from '@/utils/imagesUtils';

const Logo = () => {
  const handleLogoPress = () => {
        router.replace('/(tabs)'); 
  }
  return (
    <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.7}>
      <Image 
        source={vybeLogoHeader}
        resizeMode="contain"
        style={styles.logo}
        alt="Logo Vybe Header"
        accessible={true}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150, 
    height: 100,
    marginTop: 20,
  },
});

export default Logo;