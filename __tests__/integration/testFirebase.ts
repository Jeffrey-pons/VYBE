import { initializeApp, deleteApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signOut } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

let app: FirebaseApp;

export function initTestApp() {
  app = initializeApp({
    apiKey: 'fake-api-key',
    authDomain: 'localhost',
    projectId: 'demo-test',
  });
  const auth = getAuth(app);
  const db = getFirestore(app);

  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);

  return { app, auth, db };
}

export async function cleanupTestApp() {
  try {
    await signOut(getAuth(app));
  } catch {
    // ignore sign out errors
  }
  await deleteApp(app);
}

describe('firebase test utils placeholder', () => {
  it('loads helpers', () => {
    expect(typeof initTestApp).toBe('function');
    expect(typeof cleanupTestApp).toBe('function');
  });
});
