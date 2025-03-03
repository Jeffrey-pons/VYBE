import React, { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { useLoading } from "./LoadingContext";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedFirstLogin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasCompletedFirstLogin, setHasCompletedFirstLogin] = useState<boolean>(false);

  const { setLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);

        if (!hasCompletedFirstLogin) {
          handleFirstLoginRedirect();
        } else {
          router.replace("/");
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        router.replace("/home");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, hasCompletedFirstLogin]);

  const handleFirstLoginRedirect = () => {
    router.replace("/findlocation");
    setHasCompletedFirstLogin(true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      hasCompletedFirstLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
