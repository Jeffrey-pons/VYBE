// jest/setupTests.ts
import '@testing-library/jest-native/extend-expect';
import { Alert } from 'react-native';

// Silence alerts & logs during tests
jest.spyOn(Alert, 'alert').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// Router Expo
jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

// ---------- Zustand stores (expose stable mocks) ----------
// IMPORTANT: names start with "mock" so jest allows them in factory scope.
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

// ---------- Validators ----------
jest.mock('@/utils/registerUtils', () => ({
  isValidEmail: jest.fn(() => true),
  isValidName: jest.fn(() => true),
  isValidPhone: jest.fn(() => true),
  isValidPassword: jest.fn(() => true),
}));

// ---------- Errors utils ----------
jest.mock('@/utils/errorsUtils', () => ({
  extractErrorMessage: (e: unknown) =>
    e instanceof Error
      ? e.message
      : (typeof e === 'object' &&
         e !== null &&
         'message' in (e as Record<string, unknown>) &&
         typeof (e as { message?: unknown }).message === 'string'
        )
      ? (e as { message?: string }).message
      : 'Unknown',
}));

// ---------- Auth error handler ----------
// Mappe explicitement certaines erreurs pour matcher tes assertions, sans `any`.
jest.mock('@/services/errorHandlerService', () => {
  const getCode = (err: unknown): string | undefined =>
    typeof err === 'object' &&
    err !== null &&
    'code' in (err as Record<string, unknown>) &&
    typeof (err as { code?: unknown }).code === 'string'
      ? (err as { code: string }).code
      : undefined;

  const getMessage = (err: unknown): string | undefined =>
    err instanceof Error
      ? err.message
      : typeof err === 'object' &&
        err !== null &&
        'message' in (err as Record<string, unknown>) &&
        typeof (err as { message?: unknown }).message === 'string'
      ? (err as { message?: string }).message
      : undefined;

  const handleAuthError = (err: unknown, fallback: string) => {
    if (getCode(err) === 'firestore/not-found') {
      return new Error('Utilisateur non trouvé.');
    }
    return new Error(getCode(err) ?? getMessage(err) ?? fallback);
  };

  return { handleAuthError };
});

// ---------- Firebase app ----------
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

// ---------- Firebase auth ----------
jest.mock('firebase/auth', () => {
  const createUserWithEmailAndPassword = jest.fn(
    async (_auth: unknown, email: string) => ({
      user: { uid: 'uid_new', email, phoneNumber: null, emailVerified: true },
    }),
  );

  const signInWithEmailAndPassword = jest.fn(
    async (_auth: unknown, email: string) => ({
      user: { uid: 'uid_login', email, emailVerified: true },
    }),
  );

  const signOut = jest.fn(async () => {});
  const deleteUser = jest.fn(async () => {});
  const updateEmail = jest.fn(async () => {});
  const sendEmailVerification = jest.fn(async () => {});

  // Utilise réellement le paramètre `pwd` pour éviter le warning no-unused-vars
  const EmailAuthProvider = {
    credential: jest.fn((email: string, pwd?: string) => ({
      email,
      password: pwd,
    })),
  };

  const reauthenticateWithCredential = jest.fn(async () => {});

  // Ne pas appeler le callback pour éviter des effets de bord, mais marquer les args comme utilisés
  const onAuthStateChanged = jest.fn(
    (authArg: unknown, cb: (user: unknown) => void) => {
      void authArg; // marque le paramètre comme utilisé
      void cb;      // idem
      return jest.fn(); // unsubscribe
    },
  );

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

// ---------- Firebase firestore ----------
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

// ---------- Firebase config ----------
jest.mock('@/config/firebaseConfig', () => ({
  auth: { currentUser: { uid: 'uid_current', email: 'john@doe.tld', emailVerified: true } },
  db: {},
}));
