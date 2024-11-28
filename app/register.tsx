import React, { useState } from "react";
import { ScrollView, TextInput, View, Text, StyleSheet, Alert, Image } from "react-native";
import { registerUser } from "@/services/backEnd.api";
import { Button } from "react-native-elements";
import { useNavigation, router } from "expo-router";
import globalStyles from "@/styles/globalStyles";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      const response = await registerUser(name, lastname, email, password);
      Alert.alert("Succès", response.message);
      router.replace("/login"); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      } else {
        Alert.alert("Erreur", "Une erreur inconnue s'est produite.");
      }
    } finally {
      setName("");
      setLastname("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={globalStyles.tinyLogoTwo}
        source={require('../assets/images/logos/VYBE_logo5.png')}
      />
      <Text style={globalStyles.headerText}>Inscris-toi !</Text>

      {/* First Name Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Prénom"
         placeholderTextColor="#bbb"
        value={name}
        onChangeText={setName}
      />

      {/* Last Name Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Nom"
         placeholderTextColor="#bbb"
        value={lastname}
        onChangeText={setLastname}
      />

      {/* Email Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#bbb"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button 
        buttonStyle={globalStyles.buttonStyle} 
        title="S'inscrire"
        titleStyle={globalStyles.titleStyle} 
        onPress={handleSignUp} 
      />

      <Text style={globalStyles.footerText}>Vous avez déjà un compte ?</Text>
      <Text style={globalStyles.footerLink} onPress={() => router.replace("/login")}>
        Connectez-vous ici
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default RegisterScreen;
