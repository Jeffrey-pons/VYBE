import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Logo = () => {
  return (
      <Image
        source={require('../assets/images/logos/VYBE_logo2.png')}
        resizeMode="contain"
        style={styles.logo}
      />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain',
  },
});

export default Logo;
