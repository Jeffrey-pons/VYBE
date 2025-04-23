import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface SpotCardProps {
  title: string;
  image: any; // require('./image.png') ou URI
  uid: string;
}

export const SpotCard: React.FC<SpotCardProps> = ({ title, image, uid }) => {
  const router = useRouter();

  const handlePress = () => {
    // router.push(`/place/${uid}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardWrapper}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>En savoir plus</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: 220,
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SpotCard;
