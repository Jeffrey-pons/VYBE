import { FirebaseError } from 'firebase/app';
import { AuthServiceError } from '@/types/errors';

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) return error.message;
  if (error instanceof AuthServiceError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Une erreur inconnue est survenue.';
};

export const isFirebaseError = (error: unknown): error is FirebaseError => {
  return typeof error === 'object' && error !== null && 'code' in error;
};
