// Loader.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLoading } from '@/contexts/LoadingContext';

const Loader = () => {
  const { isLoading } = useLoading(); 

  if (!isLoading) return null;

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="white" />
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 18,
  },
});

export default Loader;
