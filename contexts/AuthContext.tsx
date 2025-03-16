import React, { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { useLoading } from "./LoadingContext";
import { getDoc, doc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCheckedFirestore, setHasCheckedFirestore] = useState<boolean>(false);
  
  const { setLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        if (!hasCheckedFirestore) {
          setHasCheckedFirestore(true);

          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.hasCompletedFindLocation && data.hasConnectedMusic && data.hasActiveNotification) {
              router.replace("/"); // Connexion normale
            } else {
              router.replace("/findlocation"); // Première connexion
            }
          } else {
            router.replace("/home"); // Si l'utilisateur n'a pas encore de données dans Firestore
          }
        }
      } else {
        setUser(null);
        setHasCheckedFirestore(false); // Réinitialiser pour la prochaine connexion
        router.replace("/home");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, hasCheckedFirestore]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
