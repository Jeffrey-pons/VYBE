import { isValidEmail, isValidName, isValidPhone, isValidPassword } from '@/utils/registerUtils';
import { RegisterDTO } from '@/dtos/AuthDto';
import { auth, db } from '@/config/firebaseConfig';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { AuthServiceError, ValidationError } from '@/types/errors';
import { handleAuthError } from './errorHandlerService';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  updateEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { useLoginStore } from '@/stores/useLoginStore';
import { extractErrorMessage } from '@/utils/errorsUtils';
import { useRegisterStore } from '@/stores/useRegisterStore';

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
    if (!isValidName(data.name)) throw new ValidationError('Le prénom est invalide.');
    if (!isValidName(data.lastname)) throw new ValidationError('Le nom est invalide.');
    if (!isValidEmail(data.email)) throw new ValidationError("L'email est invalide.");
    if (!isValidPhone(data.phoneNumber))
      throw new ValidationError('Le numéro de téléphone est invalide.');
    if (!isValidPassword(data.password)) throw new ValidationError('Le mot de passe est invalide.');
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      name: data.name,
      lastname: data.lastname,
      mail: data.email,
      phoneNumber: userCredential.user.phoneNumber ?? data.phoneNumber,
      createdAt: new Date(),
    });
    Alert.alert('Succès', 'Inscription reussie');
    await signOut(auth);
    useRegisterStore.getState().resetRegister();
    return { user: userCredential.user };
  } catch (error: unknown) {
    Alert.alert('Erreur', extractErrorMessage(error));
    if (error instanceof ValidationError) throw error;
    if (error instanceof FirebaseError) throw handleAuthError(error, 'Erreur Firebase');
    throw new AuthServiceError("Erreur lors de l'inscription", 'auth/unknown');
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: unknown) {
    throw handleAuthError(error, 'Une erreur est survenue', { showAlert: true });
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    Alert.alert('Succès', 'Déconnexion reussie');
    useLoginStore.getState().resetLogin(); // Reset login state in zustand store
    router.replace('/home');
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateUserInfo = async (
  userId: string,
  updatedData: Partial<RegisterDTO>,
): Promise<void> => {
  try {
    const user = auth.currentUser;

    if (!user) throw new Error('Aucun utilisateur connecté.');
    if (userId !== user.uid)
      throw new Error("L'ID utilisateur ne correspond pas à l'utilisateur connecté.");

    if (updatedData.email && updatedData.email !== user.email) {
      try {
        await updateEmail(user, updatedData.email);
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          throw handleAuthError(error, "Erreur de mise à jour de l'email", { showAlert: false });
        } else {
          console.error('Error:', error);
          throw new Error("Erreur inconnue pendant la mise à jour de l'email.");
        }
      }
    }
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, updatedData, { merge: true });
  } catch (error: unknown) {
    Alert.alert('Erreur', extractErrorMessage(error));
    console.error('Error updating user info:', error);
    throw new Error(extractErrorMessage(error));
  }
};

export const updateUserOnboardingProgress = async (userId: string, data: Partial<UserProgress>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true });
  } catch (error: unknown) {
    Alert.alert('Erreur', extractErrorMessage(error));
    throw new Error(extractErrorMessage(error));
  }
};

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProgress;
    }
    return null;
  } catch (error: unknown) {
    Alert.alert('Erreur', extractErrorMessage(error));
    throw new Error(extractErrorMessage(error));
  }
};

export const getUserInfo = async (userId: string): Promise<User> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as User;
      return {
        ...data,
      };
    } else {
      throw new AuthServiceError('Utilisateur non trouvé.', 'firestore/not-found');
    }
  } catch (error: unknown) {
    throw handleAuthError(error, "Erreur lors de la récupération de l'utilisateur");
  }
};

export const deleteUserAccount = async (userId: string, password: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new AuthServiceError('Aucun utilisateur connecté.', 'auth/no-user');

    try {
      await reauthenticateUser(user, password);
    } catch (error: unknown) {
      Alert.alert(
        "Erreur d'authentification",
        'Veuillez vérifier votre mot de passe avant de supprimer votre compte.',
      );
      throw handleAuthError(error, "Erreur d'authentification", { showAlert: false });
    }

    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    await deleteUser(user);
    Alert.alert('Succès', 'Compte supprimé avec succès');
    router.replace('/home');
  } catch (error: unknown) {
    Alert.alert('Erreur', extractErrorMessage(error));
    throw new Error(extractErrorMessage(error));
  }
};

export const reauthenticateUser = async (user: User, password: string) => {
  try {
    if (!user.email) {
      throw new AuthServiceError('Aucune adresse email associée à ce compte.', 'auth/no-email');
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error: unknown) {
    Alert.alert('Erreur', extractErrorMessage(error));
    throw handleAuthError(error, 'Erreur');
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Utilisateur connecté :', user);
  } else {
    console.log('Aucun utilisateur connecté.');
  }
});

export const handleUpdateEmail = async (newEmail: string) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new AuthServiceError('Aucun utilisateur connecté.', 'auth/no-user');
    }

    // Vérifier si l'email de l'utilisateur est déjà vérifié
    if (!user.emailVerified) {
      try {
        // Si l'email n'est pas vérifié, envoyez un email de vérification
        await sendEmailVerification(user);
        Alert.alert(
          'Vérification requise',
          'Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception avant de changer votre email.',
        );
        return;
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          throw handleAuthError(error, 'Erreur de vérification');
        } else {
          console.error('Error:', error);
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
      console.error("Erreur lors de l'envoi de l'email de vérification", error);
      alert("Une erreur est survenue lors de l'envoi de l'email de vérification.");
    }
  } catch (error: unknown) {
    throw handleAuthError(error, 'Erreur');
  }
};
