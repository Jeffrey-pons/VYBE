import { useState } from "react";
import { registerUser } from "@/services/authService"; 
import { Alert } from "react-native";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false); 

  const handleSignUp = async (userData: { name: string, lastname: string, email: string, phoneNumber: string, password: string }) => {
    setIsLoading(true); 
    try {
      const response = await registerUser(userData); 
      if (response) {
        Alert.alert("Succès", "Compte créé avec succès !");
      }
      return response; 
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message); 
      } else {
        Alert.alert("Erreur", "Une erreur inconnue s'est produite.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return { handleSignUp, isLoading }; 
};
