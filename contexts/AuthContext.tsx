import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/config/firebaseConfig';
import { useRouter } from 'expo-router';
import { useLoading } from './LoadingContext';
import { getDoc, doc } from 'firebase/firestore';
import { useLocation } from './LocationContext';

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCheckedFirestore, setHasCheckedFirestore] = useState<boolean>(false);

  const { setLoading } = useLoading();
  const { updateLocation } = useLocation();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        if (!hasCheckedFirestore) {
          setHasCheckedFirestore(true);

          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();

            if (data.city) {
              updateLocation(data.city);
            }

            if (data.city && data?.hasActiveNotification && data?.hasConnectedMusic) {
              router.replace('/(tabs)');
            } else {
              router.replace('/findlocation');
            }
          } else {
            router.replace('/home');
          }
        }
      } else {
        setUser(null);
        setHasCheckedFirestore(false);
        router.replace('/home');
      }
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, hasCheckedFirestore]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
