import { isValidEmail, isValidName, isValidPhone, isValidPassword } from '@/utils/registerUtils';
import { RegisterDTO } from '@/dtos/AuthDto';
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { router } from "expo-router";
import { Alert } from "react-native";
import { AuthServiceError, ValidationError } from '@/types/errors';
import { handleAuthError  } from './errorHandlerService';
import { FirebaseError } from 'firebase/app';
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
    if (!isValidName(data.name)) throw new ValidationError("Le prénom est invalide."),  console.log("Prénom invalide");
    if (!isValidName(data.lastname)) throw new ValidationError("Le nom est invalide.") , console.log("Nom invalide");
    if (!isValidEmail(data.email)) throw new ValidationError("L'email est invalide.") , console.log("Email invalide");
    if (!isValidPhone(data.phoneNumber)) throw new ValidationError("Le numéro de téléphone est invalide.") , console.log("Numéro de téléphone invalide");
    if (!isValidPassword(data.password)) throw new ValidationError("Le mot de passe est invalide.") , console.log("Mot de passe invalide");
  // if (!isVerified) {
  //   Alert.alert("Erreur", "Veuillez vérifier votre numéro de téléphone.");
  //   console.log("Numéro de téléphone non vérifié");
  //   return;
  // }
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      name: data.name,
      lastname: data.lastname,
      mail: data.email,
      phoneNumber: userCredential.user.phoneNumber ?? data.phoneNumber,
      createdAt: new Date(),
    });
    Alert.alert("Succès", "Inscription reussie");
    await signOut(auth);
    return { user: userCredential.user };
  } catch (error) {
      if (error instanceof ValidationError) throw error;
      if (error instanceof FirebaseError) throw handleAuthError(error, "Erreur Firebase");
      throw new AuthServiceError("Erreur lors de l'inscription", "auth/unknown");
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    Alert.alert("Succès", "Connexion reussie");
    return { user: userCredential.user };
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
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
      try {
        await updateEmail(user, updatedData.email);
      } catch (error: any) {
        if (error instanceof FirebaseError) {
          throw handleAuthError(error, "Erreur de mise à jour de l'email", { showAlert: false });
        } else {
          console.error("Error:", error);
          throw new Error("Erreur inconnue pendant la mise à jour de l'email.");
        }
    }
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
      throw new AuthServiceError("Utilisateur non trouvé.", "firestore/not-found");
    }
  } catch (error: any) {
    console.error("Error retrieving user info:", error);
    throw new Error(error.message);
  }
};

export const deleteUserAccount = async (userId: string, password: string): Promise<void> => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new AuthServiceError("Aucun utilisateur connecté.", "auth/no-user");
    }
    
    try {
      await reauthenticateUser(user, password);
    } catch (error: unknown) {
      Alert.alert("Erreur d'authentification", 
        "Pour des raisons de sécurité, veuillez vérifier votre mot de passe avant de supprimer votre compte.");
      throw handleAuthError(error, "Erreur d'authentification", { showAlert: false });
    }

    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      
      await deleteUser(user);
      Alert.alert("Succès", "Compte supprimé avec succès");
      router.replace('/home');
    } catch (error: any) {
      console.error("Error deleting user account:", error);
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    throw new Error(error.message);
  }
};

export const reauthenticateUser = async (user: User, password: string) => {
  try {
    if (!user.email) {
      throw new AuthServiceError("Aucune adresse email associée à ce compte.", "auth/no-email");
    }
    
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error: any) {
    console.error("Erreur", error);
    throw new Error(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Utilisateur connecté :", user);
  } else {
    console.log("Aucun utilisateur connecté.");
  }
});

export const handleUpdateEmail = async (newEmail: string) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new AuthServiceError("Aucun utilisateur connecté.", "auth/no-user");
    }

    // Vérifier si l'email de l'utilisateur est déjà vérifié
    if (!user.emailVerified) {
      try {
        // Si l'email n'est pas vérifié, envoyez un email de vérification
        await sendEmailVerification(user);
        Alert.alert(
          "Vérification requise", 
          "Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception avant de changer votre email."
        );
        return;
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          throw handleAuthError(error, "Erreur de vérification");
        } else {
          console.error("Error:", error);
          throw new Error("Erreur inconnue pendant l'envoi de l'email de vérification.");
        }
      }
    }

    // Si l'email est déjà vérifié, mettre à jour l'email dans Firebase Auth
    try {
      // Mise à jour de l'email dans Firebase Auth
      await updateEmail(user, newEmail);
      console.log('Email mis à jour avec succès dans Firebase Auth');

      // Après la mise à jour de l'email, mettez à jour les informations dans Firestore
      await updateUserInfo(user.uid, { email: newEmail });
      Alert.alert('Succès', 'Email mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification', error);
      alert('Une erreur est survenue lors de l\'envoi de l\'email de vérification.');
    }
  } catch (error: unknown) {
    throw handleAuthError(error, "Erreur");
  }
};