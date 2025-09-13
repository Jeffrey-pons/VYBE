import { useAuthStore } from '@/stores/useAuthStore';
import { loginUser } from '@/services/authService';
import { Alert } from 'react-native';
import { useLoginStore } from '@/stores/useLoginStore';
import { AuthServiceError } from '@/types/errors';
import { useUserStore } from '@/stores/userStore';

export const useLogin = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response) {
        Alert.alert('Succès', 'Connexion réussie');
        useLoginStore.getState().resetLogin();
          const userStore = useUserStore.getState();
          userStore.setPassword('');
          userStore.setIsModalDeletedAccountVisible(false);
          userStore.setIsModalUpdatedAccountVisible(false);
      }
    } catch (error: unknown) {
      if (error instanceof AuthServiceError) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Erreur', "Une erreur inconnue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};
