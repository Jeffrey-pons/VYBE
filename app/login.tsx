import React, { useState } from "react";
import { TextInput, View, Text, Image, Alert, ScrollView} from "react-native";
import { Button } from "react-native-elements";
import { router } from "expo-router";
import globalStyles from "@/styles/globalStyle"; 
import { loginUser } from "@/services/authService";
import { ThemedText } from "@/components/ThemedText";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      if (response) {
        Alert.alert("Succès", "Connexion reussie");
        router.replace("/findlocation");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      } else {
        Alert.alert("Erreur", "Une erreur inconnue s'est produite");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <Image
          style={globalStyles.logoAuthStyle}
          source={require('../assets/images/icons/icon_login.png')}
          alt="Icône de connexion"
        />
        <ThemedText type="authTitle">Connecte toi !</ThemedText>
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
          placeholder="Mot de passe"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button 
          buttonStyle={globalStyles.buttonStyle} 
          title="Se connecter"
          titleStyle={globalStyles.titleStyle} 
          onPress={handleLogin}
        />
        <Text style={globalStyles.footerAuthTextStyle}>Vous n'avez pas de compte ?</Text>
        <Text style={globalStyles.footerAuthLinkStyle} onPress={() => router.replace("/register")}>Inscrivez-vous ici</Text>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;