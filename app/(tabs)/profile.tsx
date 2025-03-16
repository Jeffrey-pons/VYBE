import React, { useState, useEffect } from 'react';
import { ScrollView, View, Switch, StyleSheet, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; 
import { Button } from 'react-native-elements';
import { Collapsible } from '@/components/Collapsible';
import { Theme } from '@/constants/Theme';
import Logo from '@/components/LogoHeader';
import globalStyles from '@/styles/globalStyle';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Link } from 'expo-router';
import { logoutUser, deleteUserAccount, getUserInfo, updateUserInfo } from '@/services/authService';
import { auth } from '@/config/firebaseConfig';
import { updateCurrentUser } from 'firebase/auth';

const ProfileScreen: React.FC = () => {
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(true);
  const [isEmailEnabled, setIsEmailEnabled] = useState<boolean>(true);
  const [isLastTicketsEnabled, setIsLastTicketsEnabled] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [password, setPassword] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [name, setName] = useState(userData?.name || '');
  const [lastname, setLastname] = useState(userData?.lastname || '');
  const [email, setEmail] = useState(userData?.mail || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [isModalVisibleTwo, setIsModalVisibleTwo] = useState<boolean>(false);



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
  

useEffect(() => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    setUserId(currentUser.uid);
    fetchUserInfo(currentUser.uid)
    getUserInfo(currentUser.uid)
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des informations de l'utilisateur", error);
      });
  }
}, []);

  return (
    <ScrollView>
      <Logo />
      <View style={globalStyles.containerX}>
        <View style={styles.centeredContainer}>
          <View style={styles.avatarContainer}>
            <ThemedText type="title">
              {userData?.name?.charAt(0).toUpperCase()}{userData?.lastname?.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText type="profileInitials">{userData?.name} {userData?.lastname}</ThemedText>
        </View>

        <Collapsible title="Coordonnées">
          <View style={styles.containercoord}>
            <View style={styles.subContainerCoordonees}>
              <ThemedText type="text">Nom : {userData?.lastname}</ThemedText>
              <ThemedText type="text">Prénom : {userData?.name}</ThemedText>
            </View>
            <ThemedText type="text">Email : {userData?.mail}</ThemedText>
            <ThemedText type="text">Numéro : {userData?.phoneNumber}</ThemedText>
            <ThemedText type="text">Mot de passe : ********</ThemedText>
            <View style={styles.buttonContainer}>
              <Button title="Modifier" buttonStyle={styles.buttonUpdatedProfileStyle} titleStyle={styles.titleUpdatedProfileStyle} onPress={() => setIsModalVisibleTwo(true)}></Button>
            </View>
          </View>
        </Collapsible>

        <Modal visible={isModalVisibleTwo} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText type="title" style={styles.textModal}>Modifier tes informations</ThemedText>
              <TextInput
                placeholder="Nom"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Prénom"
                value={lastname}
                onChangeText={setLastname}
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <Button 
                  title="Annuler" 
                  buttonStyle={globalStyles.buttonDeletedeStyle} 
                  titleStyle={globalStyles.titleDeletedStyle}
                  onPress={() => setIsModalVisibleTwo(false)} 
                />
                <Button 
                  title="Confirmer" 
                  buttonStyle={globalStyles.buttonSecondStyle} 
                  titleStyle={globalStyles.titleSecondStyle} 
                  onPress={handleUpdateUserInfo} 
                />
              </View>
            </View>
          </View>
        </Modal>


        <Collapsible title="Localisation">
          <ThemedText type="text">Ville Actuelle : {'Détection en cours...'}</ThemedText>
          {/* <LocationComponent onCityDetected={handleCityDetected} /> */}
        </Collapsible>

        <Collapsible title="Connecte ta musique">
        <View>
          <ThemedText type="text">
          Connectez votre compte Spotify ou Apple Music pour améliorer l'expérience.
          On te recommandera des évènements qui correspondent à tes goûts.
        </ThemedText>
        </View>
        <View style={styles.musicButtonsContainer}>
        <Button 
          title="  Spotify" 
          onPress={() => alert('Spotify connecté')} 
          icon={<Entypo name="spotify" size={24} color="black" />} 
          buttonStyle={globalStyles.buttonStyle}
          titleStyle={globalStyles.titleStyle}
        />
        <Button 
          title="  Apple Music" 
          onPress={() => alert('Apple Music connecté')} 
          icon={<Fontisto name="applemusic" size={24} color="black" />} 
          buttonStyle={globalStyles.buttonStyle}
          titleStyle={globalStyles.titleStyle}
        />
        </View>
        </Collapsible>

        <Collapsible title="Notifications">
        <View style={styles.infoBox}>
        <ThemedText type="title" style={styles.infoTitle}>
          On te tient au courant !
        </ThemedText>
        <ThemedText type="text" style={styles.infoDescription}>
          Découvre les derniers évènements, les mises en vente de billets etc...
        </ThemedText>
        <Button title="ACTIVER LES NOTIFICATIONS" buttonStyle={styles.activateButton} titleStyle={styles.titleUpdatedProfileStyle}/>
      </View>
          <View style={styles.sectionNotification}>
          <ThemedText type="title">Modification de tes évènements</ThemedText>
          <ThemedText type="text" style={styles.sectionDescription}>
          Programmation, horaire ou lieu, on te tient au courant s'il y a du changement
        </ThemedText>
        <View style={styles.separator} />
        <View style={styles.switchRow}>
          <ThemedText type="text">Push</ThemedText>
          <Switch
            trackColor={{ false: "#767577", true: Theme.colors.violet}}
            thumbColor={isEmailEnabled ? Theme.colors.text : Theme.colors.text}
            onValueChange={() => setIsPushEnabled(!isPushEnabled)}
            value={isPushEnabled}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.switchRow}>
          <ThemedText type="text">Email</ThemedText>
          <Switch
            trackColor={{ false: "#767577", true: Theme.colors.violet}}
            thumbColor={isEmailEnabled ? Theme.colors.text : Theme.colors.text}
            onValueChange={() => setIsEmailEnabled(!isEmailEnabled)}
            value={isEmailEnabled}
          />
        </View>
        <View style={styles.separator} />
      </View>
      <View style={styles.sectionNotification}>
        <ThemedText type="title">Derniers billets disponibles à la vente</ThemedText>
        <ThemedText type="text" style={styles.sectionDescription}>
          Être au courant des disponibilités, dès que les places d'un évènement sont dispo à l'achat
        </ThemedText>
        <View style={styles.separator} />
        <View style={styles.switchRow}>
          <ThemedText type="text">Push</ThemedText>
          <Switch
            trackColor={{ false: "#767577", true: Theme.colors.violet}}
            thumbColor={isEmailEnabled ? Theme.colors.text : Theme.colors.text}
            onValueChange={() => setIsLastTicketsEnabled(!isLastTicketsEnabled)}
            value={isLastTicketsEnabled}
          />
        </View>
        <View style={styles.separator} />
      </View>
        </Collapsible>

        <Collapsible title="Lieu favoris">
          <ThemedText type="text">Aucun Lieu favoris n'a encore été ajouté.</ThemedText>
        </Collapsible>

        <Collapsible title="Politique de confidentialité">
         <View>
          <ThemedText type="text">Nous collectons certaines données personnelles pour améliorer votre expérience. 
            Vos informations ne seront jamais partagées sans votre consentement. 
          </ThemedText>
            <Link href={'/privacy'} asChild>
            <ThemedText type='link'>Lire la politique complète</ThemedText>
            </Link>
         </View>
        </Collapsible>

        <Collapsible title="CGU">
        <View>
          <ThemedText type="text">
            L'utilisation de notre application implique l'acceptation de nos conditions générales d'utilisation. 
            Nous nous engageons à garantir une expérience utilisateur fluide et sécurisée.
          </ThemedText>
            <Link href={'/terms-of-service'} asChild>
            <ThemedText type='link'>Lire la politique complète</ThemedText>
            </Link>
         </View>
        </Collapsible>

        <Collapsible title="F.A.Q">
        <View style={styles.faqBox}>
          <View style={styles.faqItem}>
            <Collapsible title="Comment fonctionne l'application ?">
              <ThemedText type="text" style={styles.faqText}>
                Notre application vous permet de découvrir et réserver des événements en fonction de vos préférences musicales et géographiques.
              </ThemedText>
            </Collapsible>
          </View>

          <View style={styles.faqItem}>
            <Collapsible title="Comment activer les notifications ?">
              <ThemedText type="text" style={styles.faqText}>
                Vous pouvez activer ou désactiver les notifications dans la section "Notifications" de votre profil.
              </ThemedText>
            </Collapsible>
          </View>

          <View style={styles.faqItem}>
            <Collapsible title="Puis-je modifier mes informations personnelles ?">
              <ThemedText type="text" style={styles.faqText}>
                Oui, rendez-vous dans la section "Coordonnées" pour mettre à jour votre nom, email et numéro de téléphone.
              </ThemedText>
            </Collapsible>
          </View>

          <View style={styles.faqItem}>
            <Collapsible title="Comment supprimer mon compte ?">
              <ThemedText type="text" style={styles.faqText}>
                Vous pouvez supprimer votre compte en cliquant sur le bouton "Supprimer mon compte" dans les paramètres du profil.
              </ThemedText>
            </Collapsible>
          </View>

          <View style={styles.faqItem}>
            <Collapsible title="L'application est-elle gratuite ?">
              <ThemedText type="text" style={styles.faqText}>
                Oui, l'application est gratuite, mais certains événements peuvent nécessiter un billet payant.
              </ThemedText>
            </Collapsible>
          </View>
        </View>
      </Collapsible>



        <View style={styles.containerButtonProfile}>
        <Button title="Se déconnecter" buttonStyle={globalStyles.buttonStyle} titleStyle={globalStyles.TextButtonStyle} onPress={logoutUser}/>
        <Button title="Supprimer mon compte" buttonStyle={globalStyles.buttonDeletedeStyle} titleStyle={globalStyles.titleDeletedStyle}   onPress={() => setIsModalVisible(true)} />
        </View>
      </View>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={styles.textModal}>Confirmer la suppression</ThemedText>
            <ThemedText type="text" style={styles.textModal}>
              Pour supprimer votre compte, veuillez entrer votre mot de passe.
            </ThemedText>
            <TextInput
              placeholder="Mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button 
                title="Annuler" 
                buttonStyle={globalStyles.buttonDeletedeStyle} 
                titleStyle={globalStyles.titleDeletedStyle}
                onPress={() => setIsModalVisible(false)} 
              />
              <Button 
                title="Confirmer" 
                buttonStyle={globalStyles.buttonSecondStyle} 
                titleStyle={globalStyles.titleSecondStyle} 
                onPress={handleDeleteAccount} 
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerButtonProfile: {
    paddingTop: 20, 
    width: "70%",
    margin: "auto"
  },
  centeredContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Theme.colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonUpdatedProfileStyle: {
    backgroundColor: "white",
    borderRadius: 100,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 16,
    marginTop: 10,
  },
  titleUpdatedProfileStyle: {
    color: "black",
    fontFamily: "FunnelSans-Regular",
  },
  buttonContainer: {
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 10, 
    display: 'flex',
  },
  subContainerCoordonees: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containercoord: {
    width: '100%', 
    marginTop: 10, 
  },
  //////
  infoBox: {
    backgroundColor: "black",
    width: '95%',
    padding: 16,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    gap: 10,
    display: 'flex',
    textAlign: 'center',
    margin: 'auto',
  },
  infoTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  infoDescription: {
    textAlign: "center",
    marginBottom: 12,
    color: Theme.colors.silver,
  },
  activateButton: {
    backgroundColor: Theme.colors.text,
    color: Theme.colors.background,
    paddingVertical: 10,
    borderRadius: 20,
    width: "80%",
    textAlign: 'center',
    margin: 'auto',
  },
  sectionNotification: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    display: 'flex',
    margin: 'auto',
  },
  sectionDescription: {
    color: Theme.colors.silver,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#444",
    width: '100%',
    marginVertical: 10, 
    display: 'flex',
    textAlign: 'center',
    margin: 'auto',
  },
  ///////////////
  faqBox: {
    width: '95%',
    display: 'flex',
    margin: 'auto',
  },
  faqItem: {
    padding: 14,
    borderRadius: 8,
    marginVertical: 8, 
    borderWidth: 1,
    borderColor: "#555",
  },
  
  faqText: {
    color: Theme.colors.violetShade1, 
    fontSize: Theme.typography.deca.fontSize,
    lineHeight: Theme.typography.deca.lineHeight,
  },
  musicButtonsContainer: {
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    width: "100%",
    paddingTop: 10,
    gap: 12, 
  },
  ////// modal mais style à revoir
   // Modal styles
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
    gap: 15,
  },
  textModal: {
    color: "black",
  }
});

export default ProfileScreen;
