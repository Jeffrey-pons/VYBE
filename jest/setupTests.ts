// jest/setupTests.ts
import '@testing-library/jest-native/extend-expect';
import { Alert } from 'react-native';

// -------- Console & Alert silencieux --------
jest.spyOn(Alert, 'alert').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// -------- Router Expo --------
jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

// -------- Zustand stores (mocks stables) --------
const mockResetRegister = jest.fn();
jest.mock('@/stores/useRegisterStore', () => ({
  useRegisterStore: { getState: () => ({ resetRegister: mockResetRegister }) },
  __resetRegisterMock: mockResetRegister,
}));

const mockResetLogin = jest.fn();
jest.mock('@/stores/useLoginStore', () => ({
  useLoginStore: { getState: () => ({ resetLogin: mockResetLogin }) },
  __resetLoginMock: mockResetLogin,
}));

// -------- Validators --------
jest.mock('@/utils/registerUtils', () => ({
  isValidEmail: jest.fn(() => true),
  isValidName: jest.fn(() => true),
  isValidPhone: jest.fn(() => true),
  isValidPassword: jest.fn(() => true),
}));

// -------- Errors utils --------
jest.mock('@/utils/errorsUtils', () => ({
  extractErrorMessage: (e: unknown) =>
    e instanceof Error ? e.message : ((e as { message?: string })?.message ?? 'Unknown'),
}));

// -------- Auth error handler --------
jest.mock('@/services/errorHandlerService', () => ({
  handleAuthError: (err: unknown, fallback: string) => {
    const e = err as { code?: string; message?: string } | undefined;
    if (e?.code === 'firestore/not-found') {
      return new Error('Utilisateur non trouvé.');
    }
    return new Error(e?.code ?? e?.message ?? fallback);
  },
}));

// -------- Firebase app (min) --------
jest.mock('firebase/app', () => {
  class FirebaseError extends Error {
    code: string;
    constructor(code: string, message?: string) {
      super(message);
      this.code = code;
      this.name = 'FirebaseError';
    }
  }
  return { FirebaseError };
});

// -------- Firebase auth (mocks purs) --------
jest.mock('firebase/auth', () => {
  const createUserWithEmailAndPassword = jest.fn(async (_auth: unknown, email: string) => ({
    user: { uid: 'uid_new', email, phoneNumber: null, emailVerified: true },
  }));
  const signInWithEmailAndPassword = jest.fn(async (_auth: unknown, email: string) => ({
    user: { uid: 'uid_login', email, emailVerified: true },
  }));
  const signOut = jest.fn(async () => {});
  const deleteUser = jest.fn(async () => {});
  const updateEmail = jest.fn(async () => {});
  const sendEmailVerification = jest.fn(async () => {});
  const EmailAuthProvider = { credential: jest.fn((email: string) => ({ email })) };
  const reauthenticateWithCredential = jest.fn(async () => {});

  const onAuthStateChanged = jest.fn(() => {
    return jest.fn();
  });

  const getAuth = jest.fn(() => ({}));

  return {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    deleteUser,
    updateEmail,
    sendEmailVerification,
    EmailAuthProvider,
    reauthenticateWithCredential,
    onAuthStateChanged,
    getAuth,
    User: class {},
  };
});

// -------- Firebase firestore (mocks purs) --------
jest.mock('firebase/firestore', () => {
  const doc = jest.fn((_db: unknown, _col: string, id: string) => ({ id }));
  const setDoc = jest.fn(async () => {});
  const getDoc = jest.fn(async (ref: { id: string }) => ({
    exists: () => true,
    data: () => ({
      uid: ref.id,
      name: 'John',
      lastname: 'Doe',
      mail: 'john@doe.tld',
      number: '0600000000',
    }),
  }));
  const deleteDoc = jest.fn(async () => {});
  return { doc, setDoc, getDoc, deleteDoc };
});

// -------- Firebase config (mock simple) --------
jest.mock('@/config/firebaseConfig', () => ({
  auth: { currentUser: { uid: 'uid_current', email: 'john@doe.tld', emailVerified: true } },
  db: {},
}));

// Forcer le module à être ES (évite certaines bizarreries TS)
export {};
