import { useState, useEffect } from 'react';
import { auth } from '@/config/firebaseConfig';
import { updateCurrentUser } from 'firebase/auth';
import { getUserInfo, updateUserInfo, deleteUserAccount } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/interfaces/User';
import { mapFirebaseUserToUser } from '@/interfaces/User';

export const useUserInfo = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
    const {
    name,
    setName,
    lastname,
    setLastname,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    isModalDeletedAccountVisible,
    setIsModalDeletedAccountVisible,
    isModalUpdatedAccountVisible,
    setIsModalUpdatedAccountVisible,
  } = useUserStore();

  const fetchUserInfo = async (userId: string) => {
    try {
      const firebaseUser = await getUserInfo(userId);  
      const userInfo = mapFirebaseUserToUser(firebaseUser); 
      setUserData(userInfo);
      
      setName(userInfo?.name || '');
      setLastname(userInfo?.lastname || '');
      setEmail(userInfo?.mail || '');
      setPhoneNumber(userInfo?.number || '');
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleUpdateUserInfo = async () => {
    if (!userId) {
      alert("Utilisateur non identifié !");
      return;
    }

    try {
      // Mise à jour de l'email dans Firebase
      const user = auth.currentUser;
      if (user) {
        if (email !== user.email) {
          await updateCurrentUser(user, { email }); 
        }
      }

      // Mise à jour des informations de l'utilisateur dans la base de données
      await updateUserInfo(userId, { name, lastname, email, phoneNumber });
      setUserData((prevData) =>
        prevData
          ? { ...prevData, name, lastname, email, phoneNumber }
          : null
      );
      alert("Informations mises à jour avec succès.");
      setIsModalUpdatedAccountVisible(false);  // Fermer la modal après la mise à jour
    } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erreur lors de la mise à jour des informations :", error.message);
          alert("Une erreur est survenue lors de la mise à jour des informations.");
        } else {
          console.error("Erreur inconnue lors de la mise à jour.");
          alert("Une erreur est survenue lors de la mise à jour des informations.");
        }
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      alert("Utilisateur non identifié !");
      return;
    }

    const confirmDelete = window.confirm("Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.");
    if (!confirmDelete) return;

    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUserAccount(userId, password);
        alert("Compte supprimé avec succès.");
      } else {
        alert("Aucun utilisateur connecté.");
      }
    } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erreur lors de la suppression du compte:", error.message);
          alert("Une erreur est survenue lors de la suppression du compte.");
        } else {
          console.error("Erreur inconnue lors de la suppression.");
          alert("Une erreur est survenue lors de la suppression du compte.");
        }
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      fetchUserInfo(currentUser.uid);
      getUserInfo(currentUser.uid)
              .then((data) => {
                setUserData(data);
              })
              .catch((error) => {
                console.error("Erreur lors de la récupération des informations de l'utilisateur", error);
              });
          }
  }, []);

  return {
    userId,
    userData,
    name,
    setName,
    lastname,
    setLastname,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    isModalDeletedAccountVisible,
    setIsModalDeletedAccountVisible,
    isModalUpdatedAccountVisible,
    setIsModalUpdatedAccountVisible,
    handleUpdateUserInfo,
    handleDeleteAccount,
    fetchUserInfo,
  };
};
