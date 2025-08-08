import { useAuthStore } from "@/stores/useAuthStore";
import { loginUser } from "@/services/authService"; 
import { Alert } from "react-native";
import { useLoginStore } from "@/stores/useLoginStore";

export const useLogin = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response) {
        Alert.alert("Succès", "Connexion réussie");
        useLoginStore.getState().resetLogin();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message); 
      } else {
        Alert.alert("Erreur", "Une erreur inconnue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading }; 
};
