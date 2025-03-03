import { RegisterDTO, LoginDTO } from '@/dtos/AuthDto';
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

interface AuthResponse {
  user: User;
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
    router.replace('/home')
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserInfo = async (userId: string, updatedData: Partial<RegisterDTO>): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, updatedData, { merge: true });
  } catch (error: any) {
    console.error("Error updating user info:", error);
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
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);

    const user = auth.currentUser;
    if (user) {
      await reauthenticateUser(user, password);
      await deleteUser(user);
      router.replace('/home')
    }
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    throw new Error(error.message);
  }
};

export const reauthenticateUser = async (user: User, password: string) => {
  const credential = EmailAuthProvider.credential(user.email!, password);
  await reauthenticateWithCredential(user, credential);
};



