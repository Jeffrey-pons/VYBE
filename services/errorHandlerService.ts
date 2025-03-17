import { Alert } from "react-native";
import { router } from "expo-router";
import { AuthServiceError, ErrorTranslations, ErrorHandlingOptions } from "../types/errors";
import { FirebaseError } from "firebase/app";

const AUTH_ERROR_TRANSLATIONS: ErrorTranslations = {
  'auth/email-already-in-use': "Cette adresse email est déjà utilisée par un autre compte.",
  'auth/invalid-email': "L'adresse email n'est pas valide.",
  'auth/user-disabled': "Ce compte utilisateur a été désactivé.",
  'auth/user-not-found': "Aucun utilisateur trouvé avec cette adresse email.",
  'auth/wrong-password': "Mot de passe incorrect.",
  'auth/weak-password': "Le mot de passe est trop faible. Utilisez au moins 6 caractères.",
  'auth/requires-recent-login': "Pour des raisons de sécurité, veuillez vous reconnecter avant d'effectuer cette action.",
  'auth/invalid-credential': "Les informations d'identification sont incorrectes ou ont expiré.",
  'auth/network-request-failed': "Problème de connexion réseau. Vérifiez votre connexion Internet.",
  'auth/no-user': "Aucun utilisateur connecté.",
  'auth/user-mismatch': "L'ID utilisateur ne correspond pas à l'utilisateur connecté.",
  'firestore/not-found': "Utilisateur non trouvé.",
  'auth/no-email': "Aucune adresse email associée à ce compte."
};

export const isFirebaseError = (error: unknown): error is FirebaseError => {
  return (error as FirebaseError)?.code !== undefined;
};

export const translateFirebaseError = (error: unknown): AuthServiceError => {
  if (error instanceof AuthServiceError) {
    return error;
  }
  
  if (isFirebaseError(error)) {
    const message = AUTH_ERROR_TRANSLATIONS[error.code] || error.message || "Une erreur inattendue s'est produite.";
    return new AuthServiceError(message, error.code);
  }
  
  if (error instanceof Error) {
    return new AuthServiceError(error.message, 'unknown');
  }
  
  return new AuthServiceError(
    typeof error === 'string' ? error : "Une erreur inattendue s'est produite.",
    'unknown'
  );
};

export const handleAuthError = (
  error: unknown, 
  title: string = "Erreur", 
  options: ErrorHandlingOptions = { showAlert: true, redirectOnError: '/+not-found' }
): AuthServiceError => {
  console.error(`${title}:`, error);
  
  const translatedError = translateFirebaseError(error);
  
  if (options.showAlert) {
    Alert.alert(title, translatedError.message);
  }
  
  if (options.redirectOnError) {
    router.replace(options.redirectOnError);
  }
  
  return translatedError;
};

export const handleReauthError = (error: unknown): AuthServiceError => {
  const translatedError = translateFirebaseError(error);
  
  if (isFirebaseError(error) && error.code === 'auth/requires-recent-login') {
    Alert.alert(
      "Re-authentification requise", 
      "Pour des raisons de sécurité, veuillez vous reconnecter.",
      [{ text: "OK", onPress: () => router.replace('/login') }]
    );
  } else {
    Alert.alert("Erreur d'authentification", translatedError.message);
  }
  
  return translatedError;
};

