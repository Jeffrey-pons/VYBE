import { useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { getLocation } from '@/services/locationService';
import { updateUserOnboardingProgress } from '@/services/authService';

export const useLocationHandler = () => {
  const { city, updateLocation } = useLocation();
  const [manualCity, setManualCity] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  const handleManualCityChange = (text: string) => {
    setManualCity(text);
    updateLocation(text); 
  };

  const handleUseLocation = async () => {
    try {
      await getLocation({
        onCityDetected: (detectedCity) => {
          updateLocation(detectedCity);
        }
      });
    } catch (error) {
      console.error("Erreur de géolocalisation", error);
      alert("Impossible de détecter votre ville.");
    }
  };

  const toggleInput = () => {
    setShowInput(prevState => !prevState);
  };

  const handleCityNext = async (user: { uid: string } | null, router: any) => {
    if (!city) {
      alert("Vous devez entrer une ville ou utiliser la géolocalisation avant de continuer.");
      return;
    }

    try {
      if (user) {
        await updateUserOnboardingProgress(user.uid, { city });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la ville :", error);
      alert("Impossible d'enregistrer votre ville.");
    }
  };

  return {
    city,
    manualCity,
    showInput,
    handleManualCityChange,
    handleUseLocation,
    handleCityNext,
    toggleInput,
  };
};
