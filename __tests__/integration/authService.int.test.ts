import {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
  updateUserOnboardingProgress,
  getUserProgress,
  deleteUserAccount,
} from '@/services/authService';
import type { RegisterDTO } from '@/dtos/AuthDto';
import { auth, db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

const uniq = () => Math.random().toString(36).slice(2);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('INT: AuthService + Emulators (Auth/Firestore)', () => {
  const email = `john.${uniq()}@doe.tld`;
  const pwd = 'Secret123!';
  let uid: string | null = null;

  it('registerUser -> crée user + doc Firestore (uid via login)', async () => {
    const payload: RegisterDTO = {
      name: 'John',
      lastname: 'Doe',
      email,
      phoneNumber: '0600000000',
      password: pwd,
    };

    await registerUser(payload);
    const loginRes = await loginUser(email, pwd);
    expect(loginRes.user).toBeTruthy();
    uid = loginRes.user.uid;

    const snap = await getDoc(doc(db, 'users', uid!));
    expect(snap.exists()).toBe(true);
  });

  it('loginUser -> connecte le user', async () => {
    const res = await loginUser(email, pwd);
    expect(res.user.uid).toBe(uid);
    expect(auth.currentUser?.uid).toBe(res.user.uid);
  });

  it('getUserInfo + updateUserOnboardingProgress + getUserProgress', async () => {
    const u = await getUserInfo(uid!);
    expect(u).toBeTruthy();

    await updateUserOnboardingProgress(uid!, { city: 'Paris', hasConnectedMusic: true });
    await sleep(50);

    const snap = await getDoc(doc(db, 'users', uid!));
    expect(snap.exists()).toBe(true);
    const data = snap.data() as any;
    expect(data.city).toBe('Paris');
    expect(data.hasConnectedMusic).toBe(true);

    const progress = await getUserProgress(uid!);
    expect(progress?.city).toBe('Paris');
    expect(progress?.hasConnectedMusic).toBe(true);
  });

  it('deleteUserAccount -> réauth + supprime doc + compte', async () => {
    await deleteUserAccount(uid!, pwd);
    await sleep(50);

    const snap = await getDoc(doc(db, 'users', uid!));
    expect(snap.exists()).toBe(false);

    expect(auth.currentUser).toBeNull();
  });

  it('logoutUser -> ne jette pas même si déjà déconnecté', async () => {
    await expect(logoutUser()).resolves.not.toThrow();
    expect(Alert.alert).toHaveBeenCalled(); // "Déconnexion reussie"
  });
});
