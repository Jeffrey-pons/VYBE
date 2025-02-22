import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => {
  return (
      <Image
        source={require('../assets/images/logos/VYBE_logo_white_transparent.png')}
        resizeMode="contain"
        style={styles.logo}
      />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 250, 
    height: 150
  },
});

export default Logo;