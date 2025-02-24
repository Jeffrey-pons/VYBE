import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { Button } from "react-native-elements";
import { router } from "expo-router";

const TermsOfServiceScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Conditions Générales d'Utilisation (CGU)
      </ThemedText>

      <ThemedText type="text" style={styles.sectionTitle}>1. Introduction</ThemedText>
      <ThemedText type="text">
        En utilisant notre application, vous acceptez nos conditions générales d'utilisation. 
        Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
      </ThemedText>

      <ThemedText type="text" style={styles.sectionTitle}>2. Accès et utilisation des services</ThemedText>
      <ThemedText type="text">
        Vous devez être âgé d'au moins 16 ans pour utiliser notre application. Vous êtes responsable 
        de l'exactitude des informations que vous fournissez.
      </ThemedText>

      <ThemedText type="text" style={styles.sectionTitle}>3. Données personnelles</ThemedText>
      <ThemedText type="text">
        Nous collectons certaines informations personnelles pour améliorer votre expérience. 
        Consultez notre politique de confidentialité pour en savoir plus.
      </ThemedText>

      <ThemedText type="text" style={styles.sectionTitle}>4. Responsabilité</ThemedText>
      <ThemedText type="text">
        Nous nous efforçons de garantir un service fiable mais nous ne sommes pas responsables des 
        interruptions ou erreurs indépendantes de notre volonté.
      </ThemedText>

      <ThemedText type="text" style={styles.sectionTitle}>5. Modification des CGU</ThemedText>
      <ThemedText type="text">
        Nous nous réservons le droit de modifier ces CGU à tout moment. Les mises à jour seront publiées 
        dans cette section.
      </ThemedText>

      <View style={styles.buttonContainer}>
        <Button title="Retour" buttonStyle={styles.button} onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 15,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default TermsOfServiceScreen;
