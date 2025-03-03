import { RegisterDTO } from '@/dtos/AuthDto';
import { auth, db } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
  } catch (error: any) {
    throw new Error(error.message);
  }
};
