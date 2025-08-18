import * as Location from 'expo-location';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/config/firebaseConfig';

export const getLocation = async ({
  onCityDetected,
}: {
  onCityDetected: (city: string) => void;
}) => {
  try {
    // Demander la permission d'accéder à la géolocalisation
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission refusée pour accéder à la géolocalisation.');
    }

    // Obtenir la localisation actuelle
    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    // Utiliser OpenStreetMap pour récupérer la ville à partir des coordonnées
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      const cityName =
        data.address.city || data.address.town || data.address.village || 'Ville non trouvée';
      onCityDetected(cityName); // Appeler la fonction callback pour passer la ville détectée
    } else {
      throw new Error('Ville non trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la ville:', error);
  }
};

export const updateUserCity = async (city: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Utilisateur non connecté');

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, { city });
};
