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
    await getLocation({
      onCityDetected: (detectedCity) => {
        updateLocation(detectedCity);
      }
    });
  };

  const toggleInput = () => {
    setShowInput(prevState => !prevState);
  };

  return {
    city,
    manualCity,
    showInput,
    handleManualCityChange,
    handleUseLocation,
    handleNext: async (user: any, router: any) => {
      if (!city) {
        alert("Vous devez entrer une ville ou utiliser la géolocalisation avant de continuer.");
        return;
      }
  
      try {
        if (user) {
          await updateUserOnboardingProgress(user.uid, { city });
        }
        
        router.replace("/connectmusic");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la ville :", error);
        alert("Impossible d'enregistrer votre ville.");
      }
    },
    toggleInput,
  };
};
