import { useState } from 'react';
import { auth } from '@/config/firebaseConfig';
import { updateUserOnboardingProgress } from '@/services/authService';
import { Alert } from 'react-native';

const useOnboardingProgress = () => {
  const [loading, setLoading] = useState(false);

  const updateProgress = async (stepData: any) => {
    try {
      const user = auth.currentUser;
      if (user) {
        setLoading(true);
        await updateUserOnboardingProgress(user.uid, stepData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Erreur de mise à jour de la progression :", error);
      Alert.alert("Erreur", "Impossible de sauvegarder.");
    }
  };

  return { updateProgress, loading };
};

export default useOnboardingProgress;
