import React, { useState } from 'react';
import { ScrollView, View, Switch, StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from 'react-native-elements';
import { Collapsible } from '@/components/Collapsible';
import { Theme } from '@/constants/Theme';
import Logo from '@/components/LogoHeader';
import globalStyles from '@/styles/globalStyle';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useRouter } from 'expo-router';
import { logoutUser } from '@/services/authService';
import { useLocation } from '@/contexts/LocationContext';
import { useUserInfo } from '@/hooks/useUserInfo';
import { UserModal } from '@/components/modal/UserModal';
import { useNotificationStore } from '@/stores/notificationStore';

const ProfileScreen: React.FC = () => {
  const { city } = useLocation();
  const router = useRouter();
  const {
    isPushEnabled,
    isEmailEnabled,
    isLastTicketsEnabled,
    setIsPushEnabled,
    setIsEmailEnabled,
    setIsLastTicketsEnabled,
  } = useNotificationStore();
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
    userData,
    handleUpdateUserInfo,
    handleDeleteAccount,
  } = useUserInfo();

  const [isModalLogoutAccountVisible, setIsModalLogoutAccountVisible] = useState(false);

  return (
    <ScrollView>
      <Logo />
      <View style={globalStyles.containerX}>
        <View style={styles.centeredContainer}>
          <View style={styles.avatarContainer}>
            <ThemedText type="profileInitials">
              {userData?.name?.charAt(0).toUpperCase()}
              {userData?.lastname?.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText type="profileName">
            {userData?.name} {userData?.lastname}
          </ThemedText>
        </View>

        <Collapsible title="Coordonnées">
          <View style={styles.containercoord}>
            <View style={styles.subContainerCoordonees}>
              <ThemedText type="informationsProfile">Nom : {userData?.lastname}</ThemedText>
              <ThemedText type="informationsProfile">Prénom : {userData?.name}</ThemedText>
            </View>
            <ThemedText type="informationsProfile">Email : {userData?.mail}</ThemedText>
            <ThemedText type="informationsProfile">Numéro : {userData?.phoneNumber}</ThemedText>
            <ThemedText type="informationsProfile">Mot de passe : ********</ThemedText>
            <View style={styles.buttonContainer}>
              <Button
                title="Modifier"
                buttonStyle={styles.buttonUpdatedProfileStyle}
                titleStyle={styles.titleUpdatedProfileStyle}
                onPress={() => {
                  setIsModalUpdatedAccountVisible(true);
                }}
                accessibilityLabel="Bouton pour modifier les informations du profil"
              ></Button>
            </View>
          </View>
        </Collapsible>
        <UserModal
          visible={isModalUpdatedAccountVisible}
          onClose={() => setIsModalUpdatedAccountVisible(false)}
          title="Modifie tes informations !"
          confirmText="Confirmer"
          cancelText="Annuler"
          onConfirm={handleUpdateUserInfo}
          modalType="update"
        >
          <View style={styles.inputContainer}>
            <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} accessibilityLabel='Nom'/>
            <TextInput
              placeholder="Prénom"
              value={lastname}
              onChangeText={setLastname}
              style={styles.input}
              accessibilityLabel='Prénom'
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              accessibilityLabel='Email'
            />
            <TextInput
              placeholder="Numéro de téléphone"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.input}
              accessibilityLabel='Numéro de téléphone'
            />
          </View>
        </UserModal>

        <Collapsible title="Localisation">
          <ThemedText type="text">Ville Actuelle : {city}</ThemedText>
        </Collapsible>

        <Collapsible title="Connecte ta musique">
          <View>
            <ThemedText type="text">
              Connectez votre compte Spotify ou Apple Music pour améliorer l'expérience. On te
              recommandera des évènements qui correspondent à tes goûts.
            </ThemedText>
          </View>
          <View style={styles.musicButtonsContainer}>
            <Button
              title="  Spotify"
              onPress={() => alert('Spotify connecté')}
              icon={<Entypo name="spotify" size={24} color="black" />}
              buttonStyle={globalStyles.buttonStyle}
              titleStyle={globalStyles.titleStyle}
              accessibilityLabel="Bouton pour connecter Spotify"
            />
            <Button
              title="  Apple Music"
              onPress={() => alert('Apple Music connecté')}
              icon={<Fontisto name="applemusic" size={24} color="black" />}
              buttonStyle={globalStyles.buttonStyle}
              titleStyle={globalStyles.titleStyle}
              accessibilityLabel="Bouton pour connecter Apple Music"
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
            <Button
              title="ACTIVER LES NOTIFICATIONS"
              buttonStyle={styles.activateButton}
              titleStyle={styles.titleUpdatedProfileStyle}
              accessibilityLabel='Bouton pour activer les notifications'
            />
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
                trackColor={{ false: '#767577', true: Theme.colors.violet }}
                thumbColor={isEmailEnabled ? Theme.colors.text : Theme.colors.text}
                onValueChange={() => setIsPushEnabled(!isPushEnabled)}
                value={isPushEnabled}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.switchRow}>
              <ThemedText type="text">Email</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: Theme.colors.violet }}
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
              Être au courant des disponibilités, dès que les places d'un évènement sont dispo à
              l'achat
            </ThemedText>
            <View style={styles.separator} />
            <View style={styles.switchRow}>
              <ThemedText type="text">Push</ThemedText>
              <Switch
                trackColor={{ false: '#767577', true: Theme.colors.violet }}
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
            <ThemedText type="text">
              Nous collectons certaines données personnelles pour améliorer votre expérience. Vos
              informations ne seront jamais partagées sans votre consentement.
            </ThemedText>
            <Pressable onPress={() => router.push('/privacy')}>
              <ThemedText type="link">Lire la politique complète</ThemedText>
            </Pressable>
          </View>
        </Collapsible>

        <Collapsible title="CGU">
          <View>
            <ThemedText type="text">
              L'utilisation de notre application implique l'acceptation de nos conditions générales
              d'utilisation. Nous nous engageons à garantir une expérience utilisateur fluide et
              sécurisée.
            </ThemedText>
            <Pressable onPress={() => router.push('/terms-of-service')}>
              <ThemedText type="link">Lire la politique complète</ThemedText>
            </Pressable>
          </View>
        </Collapsible>

        <Collapsible title="F.A.Q">
          <View>
            <View style={styles.faqItem}>
              <Collapsible subtitle="Comment fonctionne l'application ?">
                <ThemedText type="text" style={styles.faqText}>
                  Notre application vous permet de découvrir et réserver des événements en fonction
                  de vos préférences musicales et géographiques.
                </ThemedText>
              </Collapsible>
            </View>

            <View style={styles.faqItem}>
              <Collapsible subtitle="Comment activer les notifications ?">
                <ThemedText type="text" style={styles.faqText}>
                  Vous pouvez activer ou désactiver les notifications dans la section
                  "Notifications" de votre profil.
                </ThemedText>
              </Collapsible>
            </View>

            <View style={styles.faqItem}>
              <Collapsible subtitle="Puis-je modifier mes informations personnelles ?">
                <ThemedText type="text" style={styles.faqText}>
                  Oui, rendez-vous dans la section "Coordonnées" pour mettre à jour votre nom, email
                  et numéro de téléphone.
                </ThemedText>
              </Collapsible>
            </View>

            <View style={styles.faqItem}>
              <Collapsible subtitle="Comment supprimer mon compte ?">
                <ThemedText type="text" style={styles.faqText}>
                  Vous pouvez supprimer votre compte en cliquant sur le bouton "Supprimer mon
                  compte" dans les paramètres du profil.
                </ThemedText>
              </Collapsible>
            </View>

            <View style={styles.faqItem}>
              <Collapsible subtitle="L'application est-elle gratuite ?">
                <ThemedText type="text" style={styles.faqText}>
                  Oui, l'application est gratuite, mais certains événements peuvent nécessiter un
                  billet payant.
                </ThemedText>
              </Collapsible>
            </View>
          </View>
        </Collapsible>

        <View style={styles.containerButtonProfile}>
          <Button
            title="Se déconnecter"
            buttonStyle={globalStyles.buttonStyle}
            titleStyle={globalStyles.TextButtonStyle}
            onPress={() => setIsModalLogoutAccountVisible(true)}
            accessibilityLabel="Bouton pour se déconnecter"
          />
          <Button
            title="Supprimer mon compte"
            buttonStyle={globalStyles.buttonDeletedeStyle}
            titleStyle={globalStyles.titleDeletedStyle}
            onPress={() => setIsModalDeletedAccountVisible(true)}
            accessibilityLabel="Bouton pour supprimer le compte"
          />
        </View>
      </View>
      <UserModal
        visible={isModalLogoutAccountVisible}
        onClose={() => setIsModalLogoutAccountVisible(false)}
        title="Déconnexion"
        confirmText="Déconnexion"
        cancelText="Annuler"
        onConfirm={logoutUser}
        modalType="logout"
      >
        <ThemedText type="text" style={styles.modalText}>
          Tu es sur le point de te déconnecter, es-tu sûr de vouloir te déconnecter ?
        </ThemedText>
      </UserModal>
      <UserModal
        visible={isModalDeletedAccountVisible}
        onClose={() => setIsModalDeletedAccountVisible(false)}
        title="Confirmer la suppression de votre compte"
        confirmText="Confirmer"
        cancelText="Annuler"
        onConfirm={handleDeleteAccount}
        modalType="delete"
      >
        <View>
          <ThemedText type="text" style={styles.modalText}>
            Pour supprimer votre compte, veuillez confirmer votre mot de passe.
          </ThemedText>
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            // onBlur={() => setInputValue('')}
            style={styles.input}
            accessibilityLabel='Champ pour entrer le mot de passe'
          />
        </View>
      </UserModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerButtonProfile: {
    paddingTop: 20,
    width: '70%',
    margin: 'auto',
  },
  modalText: {
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
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
    backgroundColor: 'white',
    borderRadius: 100,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 16,
    marginTop: 10,
  },
  titleUpdatedProfileStyle: {
    color: 'black',
    fontFamily: 'FunnelSans-Regular',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    display: 'flex',
  },
  subContainerCoordonees: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containercoord: {
    width: '100%',
    marginTop: 10,
  },
  //////
  infoBox: {
    backgroundColor: 'black',
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
    textAlign: 'center',
    marginBottom: 8,
  },
  infoDescription: {
    textAlign: 'center',
    marginBottom: 12,
    color: Theme.colors.silver,
  },
  activateButton: {
    backgroundColor: Theme.colors.text,
    color: Theme.colors.background,
    paddingVertical: 10,
    borderRadius: 20,
    width: '80%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#444',
    width: '100%',
    marginVertical: 10,
    display: 'flex',
    textAlign: 'center',
    margin: 'auto',
  },
  ///////////////
  faqItem: {
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#555',
  },

  faqText: {
    color: Theme.colors.violetShade1,
    fontSize: Theme.typography.base.fontSize,
    padding: 14,
  },
  musicButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 10,
    gap: 12,
  },
  input: {
    width: '100%',
    padding: 10,
    color: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  inputContainer: {
    display: 'flex',
    gap: 20,
  },
});

export default ProfileScreen;
