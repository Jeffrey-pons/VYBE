import { RegisterDTO, LoginDTO } from '@/dtos/AuthDto';
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { router } from "expo-router";
import { Alert } from "react-native";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, deleteUser, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged, updateEmail, sendEmailVerification } from "firebase/auth";

interface AuthResponse {
  user: User;
}

export interface UserProgress {
  city?: string;
  hasConnectedMusic?: boolean;
  hasActiveNotification?: boolean;
}

export const registerUser = async (data: RegisterDTO): Promise<AuthResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      name: data.name,
      lastname: data.lastname,
      mail: data.email,
      phoneNumber: data.phoneNumber,
      createdAt: new Date(),
    });
    await signOut(auth);
    return { user: userCredential.user };
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    throw new Error(error.message);
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    Alert.alert("Succès", "Déconnexion reussie");
    router.replace('/home')
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserInfo = async (userId: string, updatedData: Partial<RegisterDTO>): Promise<void> => {
  try {
    const user = auth.currentUser;

    if (!user) throw new Error("Aucun utilisateur connecté.");
    if (userId !== user.uid) throw new Error("L'ID utilisateur ne correspond pas à l'utilisateur connecté.");
    
    if (updatedData.email && updatedData.email !== user.email) {
      await updateEmail(user, updatedData.email);
      console.log("Email mis à jour dans Firebase Auth");
    }

    const userRef = doc(db, "users", userId);
    await setDoc(userRef, updatedData, { merge: true });
  } catch (error: any) {
    console.error("Error updating user info:", error);
    throw new Error(error.message);
  }
};

export const updateUserOnboardingProgress = async (userId: string, data: Partial<UserProgress>) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge: true });
  } catch (error: any) {
    console.error("Erreur mise à jour progression :", error);
    throw new Error(error.message);
  }
};

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProgress;
    }
    return null;
  } catch (error: any) {
    console.error("Erreur récupération données utilisateur :", error);
    throw new Error(error.message);
  }
};

export const getUserInfo = async (userId: string): Promise<any> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error("No such user!");
    }
  } catch (error: any) {
    console.error("Error retrieving user info:", error);
    throw new Error(error.message);
  }
};

export const deleteUserAccount = async (userId: string, password: string): Promise<void> => {
  try {

    const user = auth.currentUser;

    if (!user) throw new Error("Aucun utilisateur connecté.");
    
    await reauthenticateUser(user, password);

    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);

      await deleteUser(user);
      Alert.alert("Succès", "Compte supprimé avec succès");
      router.replace('/home')
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    throw new Error(error.message);
  }
};

export const reauthenticateUser = async (user: User, password: string) => {
  const credential = EmailAuthProvider.credential(user.email!, password);
  await reauthenticateWithCredential(user, credential);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Utilisateur connecté :", user);
  } else {
    console.log("Aucun utilisateur connecté.");
  }
});

const handleUpdateEmail = async (newEmail: string) => {
  const user = auth.currentUser;

  if (!user) {
    alert('Aucun utilisateur connecté.');
    return;
  }

  // Vérifier si l'email de l'utilisateur est déjà vérifié
  if (!user.emailVerified) {
    try {
      // Si l'email n'est pas vérifié, envoyez un email de vérification
      await sendEmailVerification(user);
      alert('Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.');

      // Vous pouvez aussi informer l'utilisateur que l'email ne sera mis à jour qu'après la vérification
      console.log('L\'email n\'est pas vérifié, veuillez vérifier votre boîte de réception avant de changer l\'email.');

      // Ne pas mettre à jour l'email immédiatement tant que l'utilisateur n'a pas vérifié son email
      return;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification', error);
      alert('Une erreur est survenue lors de l\'envoi de l\'email de vérification.');
    }
  }

  // Si l'email est déjà vérifié, mettre à jour l'email dans Firebase Auth
  try {
    // Mise à jour de l'email dans Firebase Auth
    await updateEmail(user, newEmail);
    console.log('Email mis à jour avec succès dans Firebase Auth');

    // Après la mise à jour de l'email, mettez à jour les informations dans Firestore
    await updateUserInfo(user.uid, { email: newEmail });
    alert('Email mis à jour avec succès dans Firebase Auth et Firestore');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'email', error);
    alert('Une erreur est survenue lors de la mise à jour de l\'email.');
  }
};
