import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from 'react-native-elements';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import Logo from '@/components/LogoHeader';

const PrivacyScreen = () => {
  return (
    <ScrollView>
      <Logo />
      <View style={globalStyles.containerX}>
        <ThemedText type="title">Politique de Confidentialité</ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>
          1. Introduction
        </ThemedText>
        <ThemedText type="text">
          Bienvenue sur Vybe. Nous accordons une importance primordiale à la protection de vos
          données personnelles et à votre vie privée. Nous nous engageons à protéger votre vie
          privée et à garantir la sécurité de vos données personnelles.
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>
          2. Collecte des données
        </ThemedText>
        <ThemedText type="text">
          Nous collectons des informations nécessaires pour améliorer votre expérience utilisateur,
          notamment votre nom, adresse e-mail et préférences. Nous collectons également vos données
          de localisation pour personnaliser votre expérience et proposer des événements proches de
          vous, ainsi que votre historique d'utilisation (evènements consultés, interactions,
          etc...)
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>
          3. Utilisation des données
        </ThemedText>
        <ThemedText type="text">
          Vos données sont utilisées uniquement dans le cadre de l'application pour personnaliser
          votre expérience et vous envoyer des notifications pertinentes ainsi que des mails
          informatifs.
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>
          4. Partage des informations
        </ThemedText>
        <ThemedText type="text">
          Nous ne vendons ni ne partageons vos informations avec des tiers sans votre consentement,
          sauf en cas d'obligation légale.
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>
          5. Sécurité des données
        </ThemedText>
        <ThemedText type="text">
          Nous mettons en œuvre des mesures de sécurité pour protéger vos informations contre tout
          accès non autorisé. Vos données sont conservées tant que votre compte est actif. Vous
          pouvez demander leur suppression à tout moment par mail.
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>
          6. Vos droits
        </ThemedText>
        <ThemedText type="text">
          Vous avez le droit d'accéder, de modifier ou de supprimer vos informations personnelles à
          tout moment.
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>
          7. Contact
        </ThemedText>
        <ThemedText type="text">
          Pour toute question concernant notre politique de confidentialité, contactez-nous à :
          support@vybe.com
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Button
            title="Retour"
            buttonStyle={globalStyles.buttonStyle}
            titleStyle={globalStyles.TextButtonStyle}
            onPress={() => router.back()}
            accessibilityLabel="Bouton pour revenir en arrière"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 35,
  },
  buttonContainer: {
    marginTop: 35,
    alignItems: 'center',
  },
});

export default PrivacyScreen;
