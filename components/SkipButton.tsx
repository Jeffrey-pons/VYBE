import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SkipButtonProps {
  onPress: () => void;
}

const SkipButton: React.FC<SkipButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.skipButton} accessibilityLabel="Passer cette étape">
      <Text style={styles.skipText}>Passer</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 10,
    padding: 10,
    backgroundColor: 'transparent',
  },
  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SkipButton;
