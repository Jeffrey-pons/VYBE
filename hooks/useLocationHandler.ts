import { useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { getLocation } from '@/services/locationService';
import { updateUserOnboardingProgress } from '@/services/authService';
import { cities } from '@/utils/citiesUtils';
import { updateUserCity } from '@/services/locationService';

export const useLocationHandler = () => {
  const { city, updateLocation } = useLocation();
  const [showCitySelector, setShowCitySelector] = useState(false);
  let lastLocationRequest = 0;

  const updateCity = async (newCity: string) => {
    try {
      updateLocation(newCity);
      await updateUserCity(newCity);
    } catch (error) {
      console.error('Erreur mise à jour ville :', error);
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    updateCity(selectedCity);
  };

  const handleUseLocation = async () => {
    //cooldown
    const now = Date.now();
    if (now - lastLocationRequest < 5000) {
      // 5s de délai
      alert('Veuillez patienter quelques secondes avant de réessayer.');
      return;
    }
    lastLocationRequest = now;
    try {
      await getLocation({
        onCityDetected: (detectedCity) => {
          updateCity(detectedCity);
        },
      });
    } catch (error) {
      console.error('Erreur de géolocalisation', error);
      alert('Impossible de détecter votre ville.');
    }
  };

  const toggleCitySelector = () => {
    setShowCitySelector((prevState) => !prevState);
  };

  const handleCityNext = async (user: { uid: string } | null) => {
    if (!city) {
      alert('Vous devez entrer une ville ou utiliser la géolocalisation avant de continuer.');
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
    cities,
    showCitySelector,
    handleCitySelect,
    handleUseLocation,
    handleCityNext,
    toggleCitySelector,
  };
};
