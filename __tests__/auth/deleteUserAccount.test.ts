import { deleteUserAccount } from '@/services/authService';
import { reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { deleteDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/config/firebaseConfig';

const mockedAuth = jest.mocked(auth, true);

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
    // Simule une erreur sur deleteDoc
    (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error('firestore down'));
    await expect(deleteUserAccount('uid_current', 'Secret123!')).rejects.toThrow('firestore down');
    expect(Alert.alert).toHaveBeenCalled();
  });
});
