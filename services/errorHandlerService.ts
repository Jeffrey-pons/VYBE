import { FirebaseError } from 'firebase/app';
import { AuthServiceError } from '@/types/errors';

export const handleAuthError = (
  error: unknown,
  defaultMessage = 'Une erreur est survenue',
): AuthServiceError => {
  let message = defaultMessage;
  let code = 'auth/unknown';

  if (error instanceof FirebaseError) {
    code = error.code;

     const CREDENTIAL_ERRORS = new Set([
      'auth/user-not-found',
      'auth/wrong-password',
      'auth/invalid-credential',          
      'auth/invalid-login-credentials',   
    ]);
  if (CREDENTIAL_ERRORS.has(code)) {
      message = 'Adresse e-mail ou mot de passe incorrect.';
    } else {
    switch (code) {
      case 'auth/email-already-in-use':
        message = 'Cet email est déjà utilisé.';
        break;
      case 'auth/invalid-email':
        message = "L'email fourni est invalide.";
        break;
      case 'auth/weak-password':
        message = 'Le mot de passe est trop faible.';
        break;
      case 'auth/user-not-found':
        message = 'Aucun compte trouvé avec cet email.';
        break;
      case 'auth/invalid-credential':  
        message = "Mot de passe incorrect.";
        break;
      case 'auth/missing-password':
        message = 'Le mot de passe est requis.';
        break;
      default:
        console.warn('Unhandled Firebase error code:', code);
        break;
        }
      }
    }
  return new AuthServiceError(message, code);
};