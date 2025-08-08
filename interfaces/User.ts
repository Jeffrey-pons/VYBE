import { User as FirebaseUser } from 'firebase/auth';

export function mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.name || '',
    lastname: firebaseUser.lastname || '',       
    mail: firebaseUser.email || '',
    number: firebaseUser.phoneNumber || '',        
    privacy: '',      
    notifications: false, 
    favorites: [],      
  };
}

export interface User {
    id: string, 
    name: string;
    lastname: string;
    number: string;
    mail: string;
    privacy: string;
    notifications: boolean;
    favorites: string[];
  }