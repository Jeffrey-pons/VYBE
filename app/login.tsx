import React, { useState, useEffect } from "react";
import { TextInput, View, Text, StyleSheet, Image} from "react-native";
import { Button } from "react-native-elements";
import { router } from "expo-router";
import globalStyles from "@/styles/global.style"; 

const LoginScreen = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // Vérification si un utilisateur est déjà connecté en vérifiant le token
//   useEffect(() => {
//     const checkUserToken = async () => {
//       const userToken = await AsyncStorage.getItem('userToken');
//       if (userToken) {
//         setIsLoggedIn(true); 
//         router.replace("/(tabs)");
//       } else {
//         setIsLoggedIn(false); 
//       }
//       setLoading(false);
//     };

//     checkUserToken();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   // Fonction pour la connexion
//   const handleLogin = async () => {
//     try {
//       const response = await loginUser(email, password);
//       if (response.token && response.user) {
//         // await AsyncStorage.setItem('userToken', response.token); 
//         // await AsyncStorage.setItem('userId', response.user.id); 
//         Alert.alert("Succès", response.message);
//         setIsLoggedIn(true); 
//         router.replace("/findlocation");
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         Alert.alert("Erreur", error.message);
//       } else {
//         Alert.alert("Erreur", "Une erreur inconnue s'est produite.");
//       }
//     } finally {
//       setEmail("");
//       setPassword("");
//     }
//   };

  
  return (
    <View style={styles.container}>
      <Image
        style={globalStyles.logoAuthStyle}
        source={require('../assets/images/icons/icon_login.png')}
      />
      <Text style={globalStyles.headerTextStyle}>Connecte toi !</Text>


          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            placeholderTextColor="#bbb" 
            // value={email}
            // onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#bbb"
            secureTextEntry
            // value={password}
            // onChangeText={setPassword}
          />

          <Button 
            buttonStyle={globalStyles.buttonStyle} 
            title="Se connecter"
            titleStyle={globalStyles.titleStyle} 
            // onPress={handleLogin}
          />


      <Text style={globalStyles.footerAuthTextStyle}>Vous n'avez pas de compte ?</Text>
      <Text style={globalStyles.footerAuthLinkStyle} onPress={() => router.replace("/register")}>
        Inscrivez-vous ici
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

export default LoginScreen;