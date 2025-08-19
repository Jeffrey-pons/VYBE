import { logoutUser } from '@/services/authService';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const { __resetLoginMock } = jest.requireMock('@/stores/useLoginStore') as {
  __resetLoginMock: jest.Mock;
};

describe('logoutUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
