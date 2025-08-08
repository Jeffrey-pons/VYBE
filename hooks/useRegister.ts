import { registerUser } from "@/services/authService"; 
import { Alert } from "react-native";
import { AuthServiceError, ValidationError } from "@/types/errors";
import { useAuthStore } from "@/stores/useAuthStore";

export const useRegister = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const handleSignUp = async (userData: { name: string, lastname: string, email: string, phoneNumber: string, password: string }) => {
    setIsLoading(true); 
    try {
      const response = await registerUser(userData); 
      if (response) {
        Alert.alert("Succès", "Compte créé avec succès !");
      }
      return response; 
    } catch (error) {
      if (error instanceof ValidationError || error instanceof AuthServiceError) {
      Alert.alert("Erreur", error.message);
    } else {
      Alert.alert("Erreur", "Une erreur inconnue est survenue.");
    }
    } finally {
      setIsLoading(false); 
    }
  };

  return { handleSignUp, isLoading }; 
};
