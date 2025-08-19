import { updateUserInfo } from '@/services/authService';
import type { RegisterDTO } from '@/dtos/AuthDto';
import { updateEmail } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

// on accède au mock de la config pour manipuler currentUser
// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebaseCfg: { auth: { currentUser: any }; db: {} } = require('@/config/firebaseConfig');

describe('updateUserInfo', () => {
  const originalUser = { ...firebaseCfg.auth.currentUser };

  const baseUpdate: Partial<RegisterDTO> = {
    name: 'Jane',
    email: 'jane@doe.tld',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    firebaseCfg.auth.currentUser = { ...originalUser, uid: 'uid_current', email: 'john@doe.tld' };
  });

  it('jette si aucun utilisateur connecté', async () => {
    firebaseCfg.auth.currentUser = null;
    await expect(updateUserInfo('uid_current', baseUpdate)).rejects.toThrow('Aucun utilisateur connecté.');
  });

  it("jette si l'id ne correspond pas au currentUser", async () => {
    firebaseCfg.auth.currentUser = { ...originalUser, uid: 'autre' };
    await expect(updateUserInfo('uid_current', baseUpdate)).rejects.toThrow(
      "L'ID utilisateur ne correspond pas à l'utilisateur connecté.",
    );
  });

  it("appelle updateEmail si l'email change puis setDoc en merge", async () => {
    await updateUserInfo('uid_current', { email: 'new@doe.tld' });
    expect(updateEmail).toHaveBeenCalledWith(expect.any(Object), 'new@doe.tld');
    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), { email: 'new@doe.tld' }, { merge: true });
  });

  it('propage une erreur si updateEmail (Firebase) rejette', async () => {
    (updateEmail as jest.MockedFunction<typeof updateEmail>).mockRejectedValueOnce({ code: 'auth/invalid-email' });
    await expect(updateUserInfo('uid_current', { email: 'bad' })).rejects.toBeInstanceOf(Error);
  });

  it("n'appelle pas updateEmail si l'email ne change pas, mais setDoc est bien appelé en merge", async () => {
    await updateUserInfo('uid_current', { name: 'Jane' });
    expect(updateEmail).not.toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), { name: 'Jane' }, { merge: true });
  });
});
