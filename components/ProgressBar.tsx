import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${progress}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: '30%',
    right: '30%',
    height: 10,
    width: 'auto',
    backgroundColor: 'grey',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: 'white',
  },
});

export default ProgressBar;
