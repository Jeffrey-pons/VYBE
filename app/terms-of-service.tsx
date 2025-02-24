import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { Button } from "react-native-elements";
import { router } from "expo-router";
import Logo from "@/components/LogoHeader";
import globalStyles from "@/styles/globalStyle";

const TermsOfServiceScreen = () => {
  return (
    <ScrollView>
      <Logo/>
      <View style={globalStyles.containerX}>
        <ThemedText type="title">
        Conditions Générales d'Utilisation
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>1. Introduction</ThemedText>
        <ThemedText type="text">
        En utilisant notre application, vous acceptez nos conditions générales d'utilisation. 
        Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>2. Accès au service</ThemedText>
        <ThemedText type="text">
        Vybe est accessible à toute personne majeure ou mineure avec autorisation parentale. L'utilisateur est responsable de l'utilisation de son compte.
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>3. Utilisation de l'application</ThemedText>
        <ThemedText type="text">
        L'utilisateur s'engage à :
      - Fournir des informations exactes lors de l'inscription; 
      - Respecter les autres utilisateurs et ne pas diffuser de contenu offensant;
      - Ne pas utiliser l'application à des fins illégales;
        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>4. Responsabilité</ThemedText>
        <ThemedText type="text">
        Nous nous efforçons de garantir un service fiable mais nous ne sommes pas responsables des 
        interruptions ou erreurs indépendantes de notre volonté.        </ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>5. Propriété intellectuelle</ThemedText>
        <ThemedText type="text">
        Tout le contenu de Vybe (logo, design, textes) est protégé par le droit d'auteur et ne peut être utilisé sans autorisation.</ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>6. Modification des CGU</ThemedText>
        <ThemedText type="text">
        Vybe se réserve le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des mises à jour.</ThemedText>

        <ThemedText type="text" style={styles.sectionTitle}>7. Contact</ThemedText>
        <ThemedText type="text">
        Pour toute question relative aux CGU, contactez-nous à : <b>support@vybe.com</b></ThemedText>

        <View style={styles.buttonContainer}>
          <Button title="Retour" buttonStyle={globalStyles.buttonStyle} titleStyle={globalStyles.TextButtonStyle} onPress={() => router.back()} />
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
    alignItems: "center",
  },
});

export default TermsOfServiceScreen;
