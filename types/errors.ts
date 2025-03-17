import { FirebaseError } from 'firebase/app';
import { AuthError } from 'firebase/auth';
import { FirestoreError } from 'firebase/firestore';

export class AuthServiceError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'unknown') {
    super(message);
    this.name = 'AuthServiceError';
    this.code = code;
  }
}

// Type d'union pour les erreurs Firebase
export type FirebaseErrorType = FirebaseError | AuthError | FirestoreError;

export interface ErrorTranslations {
  [key: string]: string;
}

export interface ErrorHandlingOptions {
  showAlert?: boolean;
  redirectOnError?: string;
}