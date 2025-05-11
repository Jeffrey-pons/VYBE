import { FirebaseError } from "firebase/app";
import { AuthServiceError } from "@/types/errors";

export const handleAuthError = (
  error: unknown,
  defaultMessage = "Une erreur est survenue",
  // options = { showAlert: true }
): AuthServiceError => {
  if (error instanceof FirebaseError) {
    const code = error.code;

    let message = defaultMessage;

    switch (code) {
      case "auth/email-already-in-use":
        message = "Cet email est déjà utilisé.";
        break;
      case "auth/invalid-email":
        message = "L'email fourni est invalide.";
        break;
      case "auth/weak-password":
        message = "Le mot de passe est trop faible.";
        break;
      case "auth/user-not-found":
        message = "Aucun compte trouvé avec cet email.";
        break;
      case "auth/wrong-password":
        message = "Mot de passe incorrect.";
        break;
      default:
        console.warn("Unhandled Firebase error code:", code);
        break;
    }
  console.log("[AUTH ERROR]", {
    message,
    code,
    rawError: error,
  });


    return new AuthServiceError(message, code);
  }

  return new AuthServiceError(defaultMessage, "auth/unknown");
};
