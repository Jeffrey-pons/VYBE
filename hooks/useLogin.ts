import { useState } from "react";
import { loginUser } from "@/services/authService"; 
import { Alert } from "react-native";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response) {
        Alert.alert("Succès", "Connexion réussie");
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
