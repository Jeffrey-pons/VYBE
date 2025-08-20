import {
  deleteUserAccount,
  getUserInfo,
  getUserProgress,
  loginUser,
  logoutUser,
  registerUser,
  updateUserInfo,
  updateUserOnboardingProgress,
} from '@/services/authService';

import type { RegisterDTO } from '@/dtos/AuthDto';
import * as validators from '@/utils/registerUtils';

import {
  reauthenticateWithCredential,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateEmail,
} from 'firebase/auth';

import { getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/config/firebaseConfig';

// --------- helpers / casts ----------
const mockedAuth = jest.mocked(auth, true);
const getDocMock = getDoc as unknown as jest.MockedFunction<typeof getDoc>;
const signInMock = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
const createMock = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>;
const updateEmailMock = updateEmail as jest.MockedFunction<typeof updateEmail>;

// Accès direct au mock du store login (défini dans setupTests.ts)
const { __resetLoginMock } = jest.requireMock('@/stores/useLoginStore') as {
  __resetLoginMock: jest.Mock;
};

// Pour manipuler currentUser (module mocké dans setupTests.ts)
const firebaseCfg: { auth: { currentUser: any }; db: {} } = require('@/config/firebaseConfig');

// ======================================================================
// deleteUserAccount
// ======================================================================
describe('deleteUserAccount', () => {
  const originalUser = { ...mockedAuth.currentUser };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.currentUser = { ...originalUser, uid: 'uid_current', email: 'john@doe.tld' };
  });

  it('jette si pas de currentUser', async () => {
    mockedAuth.currentUser = null;
    await expect(deleteUserAccount('uid_current', 'pwd')).rejects.toBeInstanceOf(Error);
  });

  it('reauth OK → supprime doc + user + redirige + alert succès', async () => {
    await deleteUserAccount('uid_current', 'Secret123!');
    expect(reauthenticateWithCredential).toHaveBeenCalled();
    expect(deleteDoc).toHaveBeenCalled();
    expect(deleteUser).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Succès', 'Compte supprimé avec succès');
    expect(router.replace).toHaveBeenCalledWith('/home');
  });

  it('reauth KO → alert explicite et erreur propagée', async () => {
    (reauthenticateWithCredential as jest.Mock).mockRejectedValueOnce({ code: 'auth/wrong-password' });

    await expect(deleteUserAccount('uid_current', 'bad')).rejects.toBeInstanceOf(Error);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Erreur d'authentification",
      'Veuillez vérifier votre mot de passe avant de supprimer votre compte.',
    );
  });

  it('autre erreur → alert générique et throw', async () => {
    (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error('firestore down'));
    await expect(deleteUserAccount('uid_current', 'Secret123!')).rejects.toThrow('firestore down');
    expect(Alert.alert).toHaveBeenCalled();
  });
});

// ======================================================================
// getUserInfo
// ======================================================================
describe('getUserInfo', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne un User si le doc existe', async () => {
    const user = await getUserInfo('uid_1');
    expect(user).toEqual(expect.objectContaining({ name: 'John', lastname: 'Doe' }));
  });

  it("jette AuthServiceError si l'utilisateur n'existe pas", async () => {
    getDocMock.mockResolvedValueOnce({
      exists: () => false,
      data: () => ({}),
    } as unknown as Awaited<ReturnType<typeof getDoc>>);

    await expect(getUserInfo('uid_missing')).rejects.toThrow('Utilisateur non trouvé.');
  });

  it('mappe une erreur via handleAuthError si getDoc rejette', async () => {
    getDocMock.mockRejectedValueOnce({ code: 'firestore/permission-denied' });
    await expect(getUserInfo('uid_err')).rejects.toBeInstanceOf(Error);
  });
});

// ======================================================================
// getUserProgress
// ======================================================================
describe('getUserProgress', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retourne les données si le doc existe', async () => {
    const res = await getUserProgress('uid_1');
    expect(res).toEqual(expect.objectContaining({ name: 'John', lastname: 'Doe' }));
  });

  it("retourne null si le doc n'existe pas", async () => {
    getDocMock.mockResolvedValueOnce({
      exists: () => false,
      data: () => ({}),
    } as unknown as Awaited<ReturnType<typeof getDoc>>);

    const res = await getUserProgress('uid_2');
    expect(res).toBeNull();
  });

  it('propage une erreur si getDoc rejette', async () => {
    getDocMock.mockRejectedValueOnce(new Error('boom'));
    await expect(getUserProgress('uid_3')).rejects.toThrow('boom');
  });
});

// ======================================================================
// loginUser
// ======================================================================
describe('loginUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('connecte un utilisateur (happy path)', async () => {
    const res = await loginUser('john@doe.tld', 'Secret123!');
    expect(signInMock).toHaveBeenCalledWith(expect.anything(), 'john@doe.tld', 'Secret123!');
    expect(res.user).toBeTruthy();
    expect(res.user.uid).toBe('uid_login');
  });

  it('retourne une erreur si Firebase échoue', async () => {
    signInMock.mockRejectedValueOnce({ code: 'auth/wrong-password' });
    await expect(loginUser('john@doe.tld', 'bad')).rejects.toBeInstanceOf(Error);
  });
});

// ======================================================================
// logoutUser
// ======================================================================
describe('logoutUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('déconnecte, reset le store et redirige', async () => {
    await logoutUser();

    expect(signOut).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Succès', 'Déconnexion reussie');
    expect(__resetLoginMock).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/home');
  });

  it('propage une erreur si signOut échoue', async () => {
    (signOut as jest.Mock).mockRejectedValueOnce(new Error('boom'));
    await expect(logoutUser()).rejects.toThrow('boom');
  });
});

// ======================================================================
// registerUser
// ======================================================================
describe('registerUser', () => {
  const validData: RegisterDTO = {
    name: 'John',
    lastname: 'Doe',
    email: 'john@doe.tld',
    phoneNumber: '0600000000',
    password: 'Secret123!',
  };

  const isValidName = validators.isValidName as jest.MockedFunction<typeof validators.isValidName>;
  const isValidEmail = validators.isValidEmail as jest.MockedFunction<typeof validators.isValidEmail>;
  const isValidPhone = validators.isValidPhone as jest.MockedFunction<typeof validators.isValidPhone>;
  const isValidPassword = validators.isValidPassword as jest.MockedFunction<typeof validators.isValidPassword>;

  beforeEach(() => {
    jest.clearAllMocks();
    isValidName.mockReturnValue(true);
    isValidEmail.mockReturnValue(true);
    isValidPhone.mockReturnValue(true);
    isValidPassword.mockReturnValue(true);
  });

  it('inscrit un utilisateur quand les validations passent', async () => {
    const res = await registerUser(validData);

    expect(createMock).toHaveBeenCalledWith(expect.anything(), validData.email, validData.password);
    expect(setDoc).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalled();
    expect(res.user).toBeTruthy();
  });

  it("lève une ValidationError si le prénom est invalide", async () => {
    isValidName.mockReturnValue(false);
    await expect(registerUser(validData)).rejects.toThrow('Le prénom est invalide.');
  });

  it("lève une ValidationError si l'email est invalide", async () => {
    isValidEmail.mockReturnValue(false);
    await expect(registerUser(validData)).rejects.toThrow("L'email est invalide.");
  });

  it("lève une ValidationError si le numéro de téléphone est invalide", async () => {
    isValidPhone.mockReturnValue(false);
    await expect(registerUser({ ...validData, phoneNumber: 'xxx' })).rejects.toThrow(
      'Le numéro de téléphone est invalide.',
    );
  });

  it("lève une ValidationError si le mot de passe est invalide", async () => {
    isValidPassword.mockReturnValue(false);
    await expect(registerUser({ ...validData, password: '123' })).rejects.toThrow('Le mot de passe est invalide.');
  });

  it('écrit les bons champs dans Firestore (payload attendu)', async () => {
    await registerUser(validData);

    expect(setDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        name: 'John',
        lastname: 'Doe',
        mail: 'john@doe.tld',
        phoneNumber: '0600000000',
        createdAt: expect.any(Date),
      }),
    );
  });

  it('relaye une erreur Firebase si la création échoue', async () => {
    createMock.mockRejectedValueOnce({ code: 'auth/email-already-in-use', message: 'Email in use' });
    await expect(registerUser(validData)).rejects.toBeInstanceOf(Error);
  });
});

// ======================================================================
// updateUserInfo
// ======================================================================
describe('updateUserInfo', () => {
  const originalUser = { ...firebaseCfg.auth.currentUser };

  beforeEach(() => {
    jest.clearAllMocks();
    firebaseCfg.auth.currentUser = { ...originalUser, uid: 'uid_current', email: 'john@doe.tld' };
  });

  it('jette si aucun utilisateur connecté', async () => {
    firebaseCfg.auth.currentUser = null;
    await expect(updateUserInfo('uid_current', { name: 'Jane', email: 'jane@doe.tld' })).rejects.toThrow(
      'Aucun utilisateur connecté.',
    );
  });

  it("jette si l'id ne correspond pas au currentUser", async () => {
    firebaseCfg.auth.currentUser = { ...originalUser, uid: 'autre' };
    await expect(updateUserInfo('uid_current', { name: 'Jane', email: 'jane@doe.tld' })).rejects.toThrow(
      "L'ID utilisateur ne correspond pas à l'utilisateur connecté.",
    );
  });

  it("appelle updateEmail si l'email change puis setDoc en merge", async () => {
    await updateUserInfo('uid_current', { email: 'new@doe.tld' });
    expect(updateEmailMock).toHaveBeenCalledWith(expect.any(Object), 'new@doe.tld');
    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), { email: 'new@doe.tld' }, { merge: true });
  });

  it('propage une erreur si updateEmail (Firebase) rejette', async () => {
    updateEmailMock.mockRejectedValueOnce({ code: 'auth/invalid-email' });
    await expect(updateUserInfo('uid_current', { email: 'bad' })).rejects.toBeInstanceOf(Error);
  });

  it("n'appelle pas updateEmail si l'email ne change pas, mais setDoc est bien appelé en merge", async () => {
    await updateUserInfo('uid_current', { name: 'Jane' });
    expect(updateEmailMock).not.toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), { name: 'Jane' }, { merge: true });
  });
});

// ======================================================================
// updateUserOnboardingProgress
// ======================================================================
describe('updateUserOnboardingProgress', () => {
  beforeEach(() => jest.clearAllMocks());

  it('merge les données de progression', async () => {
    await updateUserOnboardingProgress('uid_1', { city: 'Paris', hasConnectedMusic: true });
    expect(setDoc).toHaveBeenCalledWith(
      expect.any(Object),
      { city: 'Paris', hasConnectedMusic: true },
      { merge: true },
    );
  });
});
