import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Logo = () => {
  const handleLogoPress = () => {
        router.replace('/(tabs)'); 
  }
  return (
    <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.7}>
      <Image 
        source={require('../assets/images/logos/VYBE_logo_white_transparent.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 250, 
    height: 150
  },
});

export default Logo;