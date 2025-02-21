import React , { useState, useEffect } from "react";
import { Dimensions, TextInput, View, Text, StyleSheet, Image, Alert } from "react-native";
import { Button } from "react-native-elements";
import { router } from "expo-router";
import globalStyles from "@/styles/global.style";
import { registerUser } from "@/services/auth.service";

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSignUp = async () => {
    try {
      await registerUser(email, password);
      if (isMounted) {
        Alert.alert("Succès", "Compte créé avec succès !");
        router.replace("/login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      } else {
        Alert.alert("Erreur", "Une erreur inconnue s'est produite.");
      }
    } 
  };

  return (
    <View style={styles.container}>
      <Image
        style={globalStyles.logoAuthStyle}
        source={require('../assets/images/icons/icon_register.png')}
      />
      <Text style={globalStyles.headerTextStyle}>Inscris-toi !</Text>

      <View style={styles.rowContainer}>
        <TextInput
          style={[globalStyles.input, styles.halfInput]}
          placeholder="Prénom"
          placeholderTextColor="#bbb"
          // value={name}
        // onChangeText={setName}
        />
        <TextInput
          style={[globalStyles.input, styles.halfInput]}
          placeholder="Nom"
          placeholderTextColor="#bbb"
             // value={lastname}
        // onChangeText={setLastname}
        />
      </View>

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Téléphone"
        placeholderTextColor="#bbb"
        // value={phone}
        // onChangeText={setPhone}
      />

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

      <Text style={globalStyles.footerAuthTextStyle}>Vous avez déjà un compte ?</Text>
      <Text style={globalStyles.footerAuthLinkStyle} onPress={() => router.replace("/login")}>
        Connectez-vous ici
      </Text>
    </View>
  );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width > 500 ? "50%" : "90%", 
  },
  halfInput: {
    width: "48%",
  },
});

export default RegisterScreen;