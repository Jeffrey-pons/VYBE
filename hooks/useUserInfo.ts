import { useState, useEffect } from 'react';
import { auth } from '@/config/firebaseConfig';
import { updateCurrentUser } from 'firebase/auth';
import { getUserInfo, updateUserInfo, deleteUserAccount } from '@/services/authService';

export const useUserInfo = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalVisibleTwo, setIsModalVisibleTwo] = useState<boolean>(false);

  const fetchUserInfo = async (userId: string) => {
    try {
      const userInfo = await getUserInfo(userId);
      setUserData(userInfo);
      setName(userInfo?.name || '');
      setLastname(userInfo?.lastname || '');
      setEmail(userInfo?.mail || '');
      setPhoneNumber(userInfo?.phoneNumber || '');
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
          await updateCurrentUser(user, { email }); // Mettre à jour l'email dans Firebase
        }
      }

      // Mise à jour des informations de l'utilisateur dans la base de données
      await updateUserInfo(userId, { name, lastname, email, phoneNumber });
      alert("Informations mises à jour avec succès.");
      setIsModalVisibleTwo(false);  // Fermer la modal après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations :", error);
      alert("Une erreur est survenue lors de la mise à jour des informations.");
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
    } catch (error: any) {
      console.error("Erreur lors de la suppression du compte:", error);
      alert("Une erreur est survenue lors de la suppression du compte.");
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
    isModalVisible,
    setIsModalVisible,
    isModalVisibleTwo,
    setIsModalVisibleTwo,
    handleUpdateUserInfo,
    handleDeleteAccount,
    fetchUserInfo,
  };
};
