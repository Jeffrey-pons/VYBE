import { loginUser } from '@/services/authService';
import { signInWithEmailAndPassword } from 'firebase/auth';

describe('loginUser', () => {
  const signInMock = signInWithEmailAndPassword as jest.MockedFunction<
    typeof signInWithEmailAndPassword
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
