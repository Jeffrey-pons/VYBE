// import { linkWithCredential, AuthError } from 'firebase/auth';
// import { PhoneAuthProvider } from 'firebase/auth';
// import { auth } from '@/config/firebaseConfig';
// import { useRef, useState } from 'react';
// import { Alert } from 'react-native';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// export const usePhoneVerification = () => {
//   const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal | null>(null);
//   const [verificationId, setVerificationId] = useState<string | null>(null);

//   const sendVerificationCode = async (phoneNumber: string) => {
//     try {
//       const provider = new PhoneAuthProvider(auth);
//       const id = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current!);
//       setVerificationId(id);
//       Alert.alert('Code envoyé', 'Un code de vérification a été envoyé.');
//     } catch (error) {
//       const err = error as AuthError;
//       console.error(err.code, err.message);
//       Alert.alert('Erreur', "Échec de l'envoi du code SMS.");
//     }
//   };

//   const confirmCode = async (code: string) => {
//     try {
//       if (!verificationId) throw new Error('Aucun ID de vérification');
//       const credential = PhoneAuthProvider.credential(verificationId, code);

//       if (!auth.currentUser) throw new Error('Aucun utilisateur connecté pour liaison');

//       const linkedUser = await linkWithCredential(auth.currentUser, credential);
//       return linkedUser.user.phoneNumber;
//     } catch (error) {
//       const err = error as AuthError;
//       console.error(err.code, err.message);
//       Alert.alert('Erreur', 'Code invalide ou déjà utilisé.');
//     }
//   };

//   return {
//     recaptchaVerifier,
//     sendVerificationCode,
//     confirmCode,
//   };
// };
